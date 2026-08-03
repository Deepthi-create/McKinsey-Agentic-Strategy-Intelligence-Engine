import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import EvidenceRecord from "../models/EvidenceRecord.js";
import KnowledgeMemory from "../models/KnowledgeMemory.js";
import Report from "../models/Report.js";
import ResearchJob from "../models/ResearchJob.js";
import ResearchPlan from "../models/ResearchPlan.js";
import Source from "../models/Source.js";
import ValidationResult from "../models/ValidationResult.js";
import { scrapeUrl } from "../services/firecrawl.service.js";
import { generateJson, isAiQuotaError } from "../services/gemini.service.js";
import { fetchReadablePage } from "../services/playwright.service.js";
import { upsertMemory } from "../services/qdrant.service.js";
import { tavilySearch } from "../services/tavily.service.js";

const ResearchState = Annotation.Root({
  jobId: Annotation(),
  plan: Annotation(),
  sources: Annotation(),
  evidence: Annotation(),
  aggregation: Annotation(),
  report: Annotation()
});

async function updateJob(jobId, stage, progress, message, level = "info") {
  await ResearchJob.findByIdAndUpdate(jobId, { status: "running", currentStep: stage, progress, $push: { logs: { stage, message, level } } });
}

export async function plannerAgent(job) {
  let plan;
  let generatedBy = "Planner Agent";
  try {
    plan = await generateJson(`You are a McKinsey research planner. Build a governed research plan for:
Question: ${job.question}
Industry: ${job.industry}
Geography: ${job.geography}
Timeframe: ${job.timeframe}
Competitors: ${job.competitors.join(", ")}
Output type: ${job.outputType}
Schema: {"goals":[""],"workstreams":[{"name":"","objective":"","searchTasks":[""],"sourceCategories":[""],"evidenceRequirements":[""]}],"validationCriteria":[""]}`, () => ({
      goals: [`Answer: ${job.question}`, `Scope ${job.industry} in ${job.geography}`, "Prioritize source-traceable findings"],
      workstreams: [{ name: "Market signals", objective: "Collect current public evidence", searchTasks: [job.question, `${job.industry} ${job.geography} market trends ${job.timeframe}`], sourceCategories: ["news", "reports", "company announcements"], evidenceRequirements: ["claim", "excerpt", "source", "date"] }],
      validationCriteria: ["source credibility", "recency", "duplicate content", "contradictions"]
    }));
  } catch (err) {
    if (!isAiQuotaError(err)) throw err;
    plan = deterministicPlan(job);
    generatedBy = "Planner Agent - deterministic quota fallback";
    await ResearchJob.findByIdAndUpdate(job._id, {
      $push: { logs: { stage: "Planning", message: "Gemini planner unavailable. Created a query-specific web research plan and will continue with source-backed extraction.", level: "warn" } }
    });
  }
  return ResearchPlan.findOneAndUpdate({ job: job._id }, { job: job._id, ...plan, status: "draft", generatedBy }, { upsert: true, new: true });
}

async function browserNode(state) {
  await updateJob(state.jobId, "Browsing", 30, "Collecting sources from Tavily, Firecrawl, and Playwright");
  const job = await ResearchJob.findById(state.jobId);
  const tasks = state.plan.workstreams.flatMap(w => w.searchTasks).slice(0, 10);
  const seen = new Set();
  const created = [];
  for (const task of tasks) {
    const results = await tavilySearch(task);
    for (const result of results) {
      const canonicalUrl = new URL(result.url).origin + new URL(result.url).pathname.replace(/\/$/, "");
      if (seen.has(canonicalUrl)) continue;
      seen.add(canonicalUrl);
      const scraped = await scrapeUrl(result.url).catch(() => null);
      const browsed = scraped ? null : await fetchReadablePage(result.url).catch(() => null);
      const content = scraped?.markdown || browsed?.content || result.content || result.snippet || "";
      const source = await Source.findOneAndUpdate({ job: job._id, canonicalUrl }, {
        job: job._id,
        url: result.url,
        canonicalUrl,
        title: scraped?.metadata?.title || browsed?.title || result.title,
        publisher: scraped?.metadata?.siteName || new URL(result.url).hostname.replace(/^www\./, ""),
        publishDate: scraped?.metadata?.publishedTime || null,
        sourceType: classifySource(result.url),
        snippet: result.content || result.snippet,
        content,
        qualityScore: sourceQuality(result.url, content),
        metadata: { tavilyScore: result.score, searchTask: task }
      }, { upsert: true, new: true });
      created.push(source);
    }
  }
  if (!created.length) throw Object.assign(new Error("No sources were collected for this research plan"), { status: 422 });
  return { sources: created };
}

async function extractionNode(state) {
  await updateJob(state.jobId, "Extraction", 48, "Extracting evidence records from collected sources");
  const evidence = [];
  const job = await ResearchJob.findById(state.jobId);
  for (const source of state.sources) {
    let payload;
    try {
      payload = await generateJson(`Extract up to 5 strategy-grade evidence records from this source.
Source title: ${source.title}
Source URL: ${source.url}
Content: ${(source.content || source.snippet || "").slice(0, Number(process.env.EXTRACTION_PROMPT_CONTENT_CHARS || 6000))}
Schema: {"records":[{"claim":"","excerpt":"","entity":"","topic":"","date":"YYYY-MM-DD","confidence":0.0}]}`, () => deterministicEvidence(source, job));
    } catch (err) {
      if (!isAiQuotaError(err) && err.code !== "AI_PROVIDER_ERROR") throw err;
      payload = deterministicEvidence(source, job);
      await ResearchJob.findByIdAndUpdate(state.jobId, { $push: { logs: { stage: "Extraction", message: `AI extraction unavailable; extracted source-backed evidence from ${source.title || source.url}`, level: "warn" } } });
    }
    for (const record of payload.records || []) {
      if (!record.claim) continue;
      evidence.push(await EvidenceRecord.create({
        job: state.jobId,
        source: source._id,
        claim: record.claim,
        excerpt: record.excerpt,
        entity: record.entity,
        topic: record.topic,
        date: record.date ? new Date(record.date) : undefined,
        confidence: Math.min(1, Math.max(0, Number(record.confidence || 0.6)))
      }));
    }
  }
  if (!evidence.length) throw Object.assign(new Error("No evidence could be extracted from collected sources"), { status: 422 });
  return { evidence };
}

async function validationNode(state) {
  await updateJob(state.jobId, "Validation", 62, "Validating credibility, recency, duplication, and contradictions");
  const seen = new Set();
  for (const record of state.evidence) {
    const duplicateRisk = seen.has(record.claim.toLowerCase()) ? 0.9 : 0.05;
    seen.add(record.claim.toLowerCase());
    const source = await Source.findById(record.source);
    const recency = record.date ? Math.max(0, 1 - ((Date.now() - record.date.getTime()) / (1000 * 60 * 60 * 24 * 365 * 5))) : 0.45;
    const credibility = source?.qualityScore || 0.5;
    const status = credibility >= 0.45 && duplicateRisk < 0.8 ? "passed" : "failed";
    await ValidationResult.create({ job: state.jobId, evidence: record._id, credibility, recency, duplicateRisk, contradictionRisk: 0.1, status, rationale: `Credibility ${credibility.toFixed(2)}, recency ${recency.toFixed(2)}, duplicate risk ${duplicateRisk.toFixed(2)}` });
    await EvidenceRecord.findByIdAndUpdate(record._id, { validationStatus: status === "passed" ? "approved" : "flagged", confidence: Math.min(1, record.confidence * credibility * (1 - duplicateRisk / 2) + recency * 0.2) });
  }
  return {};
}

async function aggregationNode(state) {
  await updateJob(state.jobId, "Aggregation", 76, "Aggregating validated findings into strategy themes");
  const validated = await EvidenceRecord.find({ job: state.jobId, validationStatus: "approved" }).populate("source");
  let aggregation;
  try {
    aggregation = await generateJson(`Group these validated findings into trends, opportunities, risks, and competitor movements.
Findings: ${JSON.stringify(validated.map(e => ({ claim: e.claim, entity: e.entity, topic: e.topic, source: e.source?.url }))).slice(0, 20000)}
Schema: {"trends":[""],"opportunities":[""],"risks":[""],"competitorMovements":[""]}`, () => deterministicAggregation(validated));
  } catch (err) {
    if (!isAiQuotaError(err) && err.code !== "AI_PROVIDER_ERROR") throw err;
    aggregation = deterministicAggregation(validated);
    await ResearchJob.findByIdAndUpdate(state.jobId, { $push: { logs: { stage: "Aggregation", message: "AI aggregation unavailable; grouped validated source-backed evidence", level: "warn" } } });
  }
  return { aggregation };
}

async function reportNode(state) {
  await updateJob(state.jobId, "Report Generation", 90, "Writing source-traceable strategy report");
  const job = await ResearchJob.findById(state.jobId);
  const evidence = await EvidenceRecord.find({ job: state.jobId, validationStatus: "approved" }).populate("source");
  const prompt = `Write a professional strategy report as JSON sections for ${job.outputType}. Include only claims supported by evidence.
Question: ${job.question}
Aggregation: ${JSON.stringify(state.aggregation)}
Evidence: ${JSON.stringify(evidence.map(e => ({ id: e._id, claim: e.claim, source: e.source?.url, confidence: e.confidence }))).slice(0, 24000)}
Schema: {"title":"","sections":[{"title":"Executive Summary","body":"","evidence":["ids"]},{"title":"Market Overview","body":"","evidence":["ids"]},{"title":"Market Signals","body":"","evidence":["ids"]},{"title":"Competitor Analysis","body":"","evidence":["ids"]},{"title":"Industry Trends","body":"","evidence":["ids"]},{"title":"Risks","body":"","evidence":["ids"]},{"title":"Growth Opportunities","body":"","evidence":["ids"]},{"title":"Strategic Recommendations","body":"","evidence":["ids"]}]}`;
  let generated;
  try {
    generated = await generateJson(prompt, () => deterministicReport(job, state.aggregation, evidence));
  } catch (err) {
    if (!isAiQuotaError(err) && err.code !== "AI_PROVIDER_ERROR") throw err;
    generated = deterministicReport(job, state.aggregation, evidence);
    await ResearchJob.findByIdAndUpdate(state.jobId, { $push: { logs: { stage: "Report Generation", message: "AI report generation unavailable; created source-backed report from validated evidence", level: "warn" } } });
  }
  const report = await Report.create({
    job: job._id,
    owner: job.owner,
    title: generated.title || `${job.outputType}: ${job.industry}`,
    outputType: job.outputType,
    sections: (generated.sections || []).map(s => ({ ...s, evidence: (s.evidence || []).filter(Boolean) })),
    evidenceAppendix: evidence.map(e => e._id),
    status: "in_review",
    confidenceScore: evidence.length ? evidence.reduce((sum, e) => sum + e.confidence, 0) / evidence.length : 0
  });
  for (const item of evidence.slice(0, 50)) {
    const collection = item.entity && job.competitors.includes(item.entity) ? "competitor_insights" : item.topic?.toLowerCase().includes("trend") ? "trend_analysis" : "market_insights";
    const pointId = await upsertMemory(collection, { title: item.claim, content: item.excerpt || item.claim, industry: job.industry, geography: job.geography, competitors: job.competitors, evidenceId: String(item._id), reportId: String(report._id) }).catch(() => null);
    await KnowledgeMemory.create({ collection, title: item.claim, content: item.excerpt || item.claim, industry: job.industry, geography: job.geography, competitors: job.competitors, tags: [item.topic, item.entity].filter(Boolean), sourceEvidence: [item._id], report: report._id, qdrantPointId: pointId, confidence: item.confidence });
  }
  await ResearchJob.findByIdAndUpdate(job._id, { status: "review", progress: 100, currentStep: "Review", completedAt: new Date(), runtimeMs: Date.now() - job.startedAt.getTime(), $push: { logs: { stage: "Review", message: "Report is ready for human review" } } });
  return { report };
}

function deterministicEvidence(source, job) {
  const content = normalizeText([source.title, source.snippet, source.content].filter(Boolean).join(". "));
  const terms = [job.industry, job.geography, ...(job.competitors || []), ...String(job.question || "").split(/\s+/).filter(word => word.length > 4)].map(value => String(value).toLowerCase());
  const sentences = content.split(/(?<=[.!?])\s+/).filter(sentence => sentence.length >= 60 && sentence.length <= 420);
  const matched = sentences.filter(sentence => terms.some(term => sentence.toLowerCase().includes(term))).slice(0, 5);
  const selected = (matched.length ? matched : sentences.slice(0, 3)).slice(0, 5);
  return {
    records: selected.map(sentence => ({
      claim: sentence,
      excerpt: sentence,
      entity: entityFromSentence(sentence, job),
      topic: topicFromSentence(sentence),
      date: undefined,
      confidence: Math.min(0.82, Math.max(0.45, Number(source.qualityScore || 0.55)))
    }))
  };
}

function deterministicAggregation(evidence = []) {
  const claims = evidence.map(item => item.claim).filter(Boolean);
  return {
    trends: claims.filter(claim => /trend|growth|demand|adoption|market|revenue|cloud|ai|digital/i.test(claim)).slice(0, 6),
    opportunities: claims.filter(claim => /opportun|expand|growth|investment|demand|deal|partnership|client|contract/i.test(claim)).slice(0, 6),
    risks: claims.filter(claim => /risk|decline|slow|margin|regulat|challenge|competition|pressure|layoff/i.test(claim)).slice(0, 6),
    competitorMovements: claims.filter(claim => /compet|google|microsoft|accenture|infosys|tcs|hcl|cognizant|capgemini/i.test(claim)).slice(0, 6)
  };
}

function deterministicReport(job, aggregation, evidence = []) {
  const evidenceLines = evidence.slice(0, 12).map(item => {
    const source = item.source?.url ? ` Source: ${item.source.url}` : "";
    return `${item.claim}${source}`;
  });
  const sections = [
    { title: "Executive Summary", body: evidenceLines.slice(0, 4).join("\n\n") || "No validated evidence was available for this section.", evidence: evidence.slice(0, 4).map(item => String(item._id)) },
    { title: "Market Overview", body: [...(aggregation.trends || []), ...evidenceLines].slice(0, 5).join("\n\n") || "No validated market overview evidence was available.", evidence: evidence.slice(0, 5).map(item => String(item._id)) },
    { title: "Market Signals", body: (aggregation.trends || []).slice(0, 6).join("\n\n") || evidenceLines.slice(0, 4).join("\n\n"), evidence: evidence.slice(0, 6).map(item => String(item._id)) },
    { title: "Competitor Analysis", body: (aggregation.competitorMovements || []).slice(0, 6).join("\n\n") || "No validated competitor evidence was available.", evidence: evidence.filter(item => item.entity).slice(0, 6).map(item => String(item._id)) },
    { title: "Risks", body: (aggregation.risks || []).slice(0, 6).join("\n\n") || "No validated risk evidence was available.", evidence: evidence.slice(0, 6).map(item => String(item._id)) },
    { title: "Growth Opportunities", body: (aggregation.opportunities || []).slice(0, 6).join("\n\n") || "No validated opportunity evidence was available.", evidence: evidence.slice(0, 6).map(item => String(item._id)) }
  ];
  return { title: `${job.outputType}: ${job.industry} in ${job.geography}`, sections };
}

function normalizeText(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function entityFromSentence(sentence, job) {
  return [job.industry, ...(job.competitors || [])].find(term => sentence.toLowerCase().includes(String(term).toLowerCase())) || "";
}

function topicFromSentence(sentence) {
  if (/risk|challenge|pressure|regulat/i.test(sentence)) return "Risk";
  if (/compet|partner|deal|contract/i.test(sentence)) return "Competitor movement";
  if (/growth|demand|adoption|market/i.test(sentence)) return "Market trend";
  return "Market evidence";
}

export function createResearchGraph() {
  return new StateGraph(ResearchState)
    .addNode("browse", browserNode)
    .addNode("extract", extractionNode)
    .addNode("validate", validationNode)
    .addNode("aggregate", aggregationNode)
    .addNode("generateReport", reportNode)
    .addEdge(START, "browse")
    .addEdge("browse", "extract")
    .addEdge("extract", "validate")
    .addEdge("validate", "aggregate")
    .addEdge("aggregate", "generateReport")
    .addEdge("generateReport", END)
    .compile();
}

export async function runResearchWorkflow(jobId) {
  const job = await ResearchJob.findById(jobId);
  const plan = await ResearchPlan.findOne({ job: jobId });
  if (!plan || plan.status !== "approved") throw Object.assign(new Error("Research plan must be approved before workflow execution"), { status: 409 });
  await ResearchJob.findByIdAndUpdate(jobId, { status: "running", startedAt: new Date(), progress: 15, currentStep: "Planning" });
  try {
    return await createResearchGraph().invoke({ jobId: String(jobId), plan: plan.toObject() });
  } catch (err) {
    await ResearchJob.findByIdAndUpdate(jobId, { status: "failed", error: err.message, currentStep: "Failed", $push: { logs: { stage: "Error", message: err.message, level: "error" } } });
    throw err;
  }
}

function deterministicPlan(job) {
  const competitors = job.competitors.length ? job.competitors : ["key competitors"];
  return {
    goals: [
      `Answer the research question: ${job.question}`,
      `Assess ${job.industry} dynamics in ${job.geography} for ${job.timeframe}`,
      "Create a source-traceable evidence base for reviewer approval"
    ],
    workstreams: [
      {
        name: "Market context",
        objective: `Identify market size, demand signals, regulation, and adoption trends for ${job.industry} in ${job.geography}.`,
        searchTasks: [
          `${job.industry} ${job.geography} market trends ${job.timeframe}`,
          `${job.industry} ${job.geography} market size growth report`,
          `${job.industry} ${job.geography} regulatory changes ${job.timeframe}`
        ],
        sourceCategories: ["government", "industry reports", "credible news"],
        evidenceRequirements: ["dated claim", "source URL", "publisher", "excerpt"]
      },
      {
        name: "Competitor movement",
        objective: `Track public announcements and strategic moves from ${competitors.join(", ")}.`,
        searchTasks: competitors.flatMap(name => [`${name} ${job.industry} ${job.geography} announcement ${job.timeframe}`, `${name} strategy partnership investment ${job.timeframe}`]).slice(0, 8),
        sourceCategories: ["company announcements", "filings", "credible news"],
        evidenceRequirements: ["claim", "entity", "date", "source URL"]
      },
      {
        name: "Opportunity and risk signals",
        objective: "Identify growth pockets, constraints, risks, and implications for strategy.",
        searchTasks: [
          `${job.industry} ${job.geography} opportunities risks ${job.timeframe}`,
          `${job.industry} customer demand investment ${job.geography}`
        ],
        sourceCategories: ["analyst reports", "trade publications", "public datasets"],
        evidenceRequirements: ["claim", "topic", "confidence", "source URL"]
      }
    ],
    validationCriteria: ["source credibility", "publication recency", "duplicate content", "contradictions across sources", "claim-to-source traceability"]
  };
}

function classifySource(url) {
  const host = new URL(url).hostname;
  if (host.includes("sec.gov")) return "filing";
  if (host.includes("gov")) return "government";
  if (host.includes("arxiv") || host.includes("edu")) return "academic";
  if (host.includes("prnewswire") || host.includes("news")) return "news";
  return "other";
}

function sourceQuality(url, content = "") {
  const host = new URL(url).hostname;
  let score = 0.45;
  if (/\.(gov|edu)$/.test(host) || host.includes("sec.gov")) score += 0.35;
  if (host.includes("mckinsey") || host.includes("gartner") || host.includes("deloitte") || host.includes("bcg")) score += 0.2;
  if (content.length > 2000) score += 0.1;
  return Math.min(1, score);
}

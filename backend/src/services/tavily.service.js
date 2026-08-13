import axios from "axios";

export async function tavilySearch(query, options = {}) {
  if (!process.env.TAVILY_API_KEY) throw Object.assign(new Error("Tavily API key is not configured"), { status: 503 });
  const { data } = await axios.post("https://api.tavily.com/search", {
    query,
    search_depth: options.searchDepth || "advanced",
    include_answer: false,
    include_raw_content: false,
    max_results: options.maxResults || 8
  }, {
    headers: { Authorization: `Bearer ${process.env.TAVILY_API_KEY}` },
    timeout: options.timeout || Number(process.env.RESEARCH_TIMEOUT_MS || 45000)
  });
  return data.results || [];
}

export async function verifyTavilyConnection() {
  const results = await tavilySearch("api health check", { maxResults: 1, searchDepth: "basic", timeout: healthTimeout() });
  return Array.isArray(results);
}

function healthTimeout() {
  return Number(process.env.DATA_SOURCE_HEALTH_TIMEOUT_MS || 5000);
}

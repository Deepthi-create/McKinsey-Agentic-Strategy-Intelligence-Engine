import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_MODEL = "gemini-2.5-flash-lite";
const DEFAULT_FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

function modelList() {
  const configured = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const envFallbacks = (process.env.GEMINI_MODEL_FALLBACKS || "")
    .split(",")
    .map(model => model.trim())
    .filter(Boolean);
  return [...new Set([configured, ...envFallbacks, ...DEFAULT_FALLBACK_MODELS])];
}

function client(model) {
  if (!process.env.GEMINI_API_KEY) throw Object.assign(new Error("Gemini API key is not configured"), { status: 503 });
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ model });
}

export async function generateJson(prompt, fallback) {
  const result = await generateContent(`${prompt}\nReturn strict JSON only. Do not wrap it in markdown.`);
  const text = cleanJsonText(result.response.text());
  try {
    return JSON.parse(text);
  } catch {
    if (fallback) return fallback(text);
    throw Object.assign(new Error("AI response was not valid JSON"), { status: 502, details: { text } });
  }
}

function cleanJsonText(value = "") {
  let text = String(value).trim();
  text = text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const first = Math.min(...["{", "["].map(char => {
    const index = text.indexOf(char);
    return index === -1 ? Number.POSITIVE_INFINITY : index;
  }));
  const lastObject = text.lastIndexOf("}");
  const lastArray = text.lastIndexOf("]");
  const last = Math.max(lastObject, lastArray);
  if (Number.isFinite(first) && last > first) text = text.slice(first, last + 1);
  return text;
}

export async function generateText(prompt) {
  const result = await generateContent(prompt);
  return result.response.text();
}

async function generateContent(prompt) {
  const errors = [];
  const models = modelList();

  for (const model of models) {
    try {
      return await client(model).generateContent(prompt);
    } catch (err) {
      const normalized = normalizeGeminiError(err, model);
      errors.push(normalized);
      if (!isRetryableModelError(normalized)) throw normalized;
    }
  }

  throw mergeGeminiErrors(errors, models);
}

function isRetryableModelError(err) {
  return err?.code === "AI_QUOTA_EXCEEDED" || err?.code === "AI_MODEL_UNAVAILABLE" || err?.status === 429 || err?.status === 404;
}

function mergeGeminiErrors(errors, models) {
  const retryAfterSeconds = Math.max(0, ...errors.map(err => Number(err?.retryAfterSeconds || 0)));
  const originalMessages = errors.map(err => err?.details?.originalMessage || err?.message).filter(Boolean);
  return Object.assign(new Error(`Gemini is unavailable for the configured fallback models (${models.join(", ")}). Check API key access, billing/quota, or set GEMINI_MODEL_FALLBACKS to models available in your Google AI project.`), {
    status: errors.find(err => err?.status === 429)?.status || errors[0]?.status || 502,
    code: errors.some(err => err?.code === "AI_QUOTA_EXCEEDED") ? "AI_QUOTA_EXCEEDED" : "AI_PROVIDER_ERROR",
    retryAfterSeconds,
    details: {
      provider: "gemini",
      models,
      retryAfterSeconds,
      originalMessages
    }
  });
}

function normalizeGeminiError(err, model = process.env.GEMINI_MODEL || DEFAULT_MODEL) {
  const message = err?.message || "Gemini request failed";
  const retryAfterSeconds = Number(message.match(/retry in ([\d.]+)s/i)?.[1] || message.match(/retryDelay":"(\d+)s/i)?.[1] || 0);
  if (/quota|Too Many Requests|429/i.test(message)) {
    return Object.assign(new Error(`Gemini quota exceeded for ${model}. Trying fallback models if configured.`), {
      status: 429,
      code: "AI_QUOTA_EXCEEDED",
      retryAfterSeconds,
      details: {
        provider: "gemini",
        model,
        retryAfterSeconds,
        originalMessage: message
      }
    });
  }
  if (/not found|not supported|not available|404/i.test(message)) {
    return Object.assign(new Error(`Gemini model ${model} is not available for this API key/project.`), {
      status: err?.status || 404,
      code: "AI_MODEL_UNAVAILABLE",
      details: { provider: "gemini", model, originalMessage: message }
    });
  }
  return Object.assign(new Error(`Gemini request failed: ${message}`), {
    status: err?.status || 502,
    code: "AI_PROVIDER_ERROR",
    details: { provider: "gemini", model, originalMessage: message }
  });
}

export function configuredGeminiModels() {
  return modelList();
}

export function isAiQuotaError(err) {
  return err?.code === "AI_QUOTA_EXCEEDED" || err?.status === 429 || /quota|Too Many Requests|429/i.test(err?.message || "");
}

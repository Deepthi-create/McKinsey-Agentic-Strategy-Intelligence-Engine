import axios from "axios";
import mongoose from "mongoose";
import { verifyFirecrawlConnection } from "./firecrawl.service.js";
import { configuredGeminiModels } from "./gemini.service.js";
import { verifyQdrantConnection } from "./qdrant.service.js";
import { verifyTavilyConnection } from "./tavily.service.js";

const HEALTH_CACHE_TTL_MS = 60_000;
let cachedProviderHealth = null;

export async function getDataSourcesHealth({ uploadedFiles = 0, processedUploads = 0 } = {}) {
  const providers = await getProviderHealth();
  return [
    ...providers,
    { name: "Uploaded Files", configured: uploadedFiles > 0, count: uploadedFiles, processed: processedUploads }
  ];
}

async function getProviderHealth() {
  const now = Date.now();
  if (cachedProviderHealth && now - cachedProviderHealth.createdAt < HEALTH_CACHE_TTL_MS) {
    return cachedProviderHealth.sources;
  }

  const sources = await Promise.all([
    sourceHealth("Gemini", Boolean(process.env.GEMINI_API_KEY), verifyGeminiConnection),
    sourceHealth("Tavily", Boolean(process.env.TAVILY_API_KEY), verifyTavilyConnection),
    sourceHealth("Firecrawl", Boolean(process.env.FIRECRAWL_API_KEY), verifyFirecrawlConnection),
    sourceHealth("Qdrant", Boolean(process.env.QDRANT_URL && process.env.QDRANT_API_KEY), verifyQdrantConnection),
    sourceHealth("MongoDB", Boolean(process.env.MONGODB_URI || process.env.MONGO_URL), verifyMongoConnection)
  ]);

  cachedProviderHealth = { createdAt: now, sources };
  return sources;
}

async function sourceHealth(name, hasConfig, verify) {
  if (!hasConfig) return { name, configured: false };

  try {
    const ok = await verify();
    return { name, configured: ok === true };
  } catch {
    return { name, configured: false };
  }
}

async function verifyGeminiConnection() {
  const { data } = await axios.get("https://generativelanguage.googleapis.com/v1beta/models", {
    params: { key: process.env.GEMINI_API_KEY },
    timeout: healthTimeout()
  });
  const availableModels = new Set((data?.models || []).map(model => model.name));
  return configuredGeminiModels().some(model => availableModels.has(model) || availableModels.has(`models/${model}`));
}

async function verifyMongoConnection() {
  if (mongoose.connection.readyState !== 1) return false;
  await mongoose.connection.db.admin().ping();
  return true;
}

function healthTimeout() {
  return Number(process.env.DATA_SOURCE_HEALTH_TIMEOUT_MS || 5000);
}

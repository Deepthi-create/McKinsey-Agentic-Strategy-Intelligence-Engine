import { QdrantClient } from "@qdrant/js-client-rest";
import crypto from "crypto";
import { generateJson } from "./gemini.service.js";

const collections = ["market_insights", "competitor_insights", "trend_analysis", "research_reports"];

function qdrant() {
  if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) throw Object.assign(new Error("Qdrant is not configured"), { status: 503 });
  return new QdrantClient({ url: process.env.QDRANT_URL, apiKey: process.env.QDRANT_API_KEY });
}

async function embedding(text) {
  const data = await generateJson(`Create a 768 dimension numeric embedding-like semantic vector for this text by returning {"vector":[numbers]}. Text: ${text.slice(0, 4000)}`, raw => ({ vector: raw.split(/\D+/).map(Number).filter(Boolean).slice(0, 768) }));
  const vector = Array.isArray(data.vector) ? data.vector.slice(0, 768) : [];
  while (vector.length < 768) vector.push(0);
  return vector;
}

export async function ensureCollections() {
  const client = qdrant();
  for (const collection of collections) {
    const exists = await client.collectionExists(collection);
    if (!exists) await client.createCollection(collection, { vectors: { size: 768, distance: "Cosine" } });
  }
}

export async function upsertMemory(collection, payload) {
  await ensureCollections();
  const id = crypto.randomUUID();
  await qdrant().upsert(collection, {
    points: [{ id, vector: await embedding(`${payload.title}\n${payload.content}`), payload }]
  });
  return id;
}

export async function semanticSearch(collection, query, filter = {}, limit = 10) {
  await ensureCollections();
  return qdrant().search(collection, {
    vector: await embedding(query),
    limit,
    filter: Object.keys(filter).length ? { must: Object.entries(filter).map(([key, value]) => ({ key, match: { value } })) } : undefined
  });
}

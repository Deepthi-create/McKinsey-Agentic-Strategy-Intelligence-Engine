import axios from "axios";

export async function scrapeUrl(url) {
  if (!process.env.FIRECRAWL_API_KEY) return null;
  const { data } = await axios.post("https://api.firecrawl.dev/v2/scrape", {
    url,
    formats: ["markdown", "html"],
    onlyMainContent: true
  }, {
    headers: { Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}` },
    timeout: Number(process.env.RESEARCH_TIMEOUT_MS || 45000)
  });
  return data?.data || null;
}

export async function verifyFirecrawlConnection() {
  if (!process.env.FIRECRAWL_API_KEY) throw Object.assign(new Error("Firecrawl API key is not configured"), { status: 503 });
  const { data } = await axios.get("https://api.firecrawl.dev/v2/team/credit-usage", {
    headers: { Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}` },
    timeout: Number(process.env.DATA_SOURCE_HEALTH_TIMEOUT_MS || 5000)
  });
  return data?.success === true;
}

import { getDefaultApiBaseURL, resolveApiBaseURL } from "../lib/api";

test("keeps API base URLs that already include /api", () => {
  expect(resolveApiBaseURL("https://example.onrender.com/api")).toBe("https://example.onrender.com/api");
  expect(resolveApiBaseURL("https://example.onrender.com/api/")).toBe("https://example.onrender.com/api");
});

test("adds /api when a deployment origin is configured", () => {
  expect(resolveApiBaseURL("https://ai-market-strategy-engine.onrender.com")).toBe(
    "https://ai-market-strategy-engine.onrender.com/api"
  );
});

test("uses the local backend API for local browser hosts", () => {
  expect(getDefaultApiBaseURL("localhost")).toBe("http://localhost:8080/api");
  expect(getDefaultApiBaseURL("127.0.0.1")).toBe("http://localhost:8080/api");
});

test("uses the deployed backend API for hosted browser builds without an env var", () => {
  const deployedDefault = getDefaultApiBaseURL("ai-market-strategy-engine.vercel.app");
  expect(deployedDefault).toBe("https://ai-market-strategy-engine.onrender.com/api");
  expect(resolveApiBaseURL("", deployedDefault)).toBe("https://ai-market-strategy-engine.onrender.com/api");
});

test("ignores localhost API env values when running on the deployed frontend", () => {
  const deployedDefault = getDefaultApiBaseURL("ai-market-strategy-engine.vercel.app");

  expect(resolveApiBaseURL(
    "http://localhost:8080/api",
    deployedDefault,
    "ai-market-strategy-engine.vercel.app"
  )).toBe("https://ai-market-strategy-engine.onrender.com/api");
});

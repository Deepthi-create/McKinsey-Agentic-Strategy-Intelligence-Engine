import { resolveApiBaseURL } from "../lib/api";

test("keeps API base URLs that already include /api", () => {
  expect(resolveApiBaseURL("https://example.onrender.com/api")).toBe("https://example.onrender.com/api");
  expect(resolveApiBaseURL("https://example.onrender.com/api/")).toBe("https://example.onrender.com/api");
});

test("adds /api when a deployment origin is configured", () => {
  expect(resolveApiBaseURL("https://ai-market-strategy-engine.onrender.com")).toBe(
    "https://ai-market-strategy-engine.onrender.com/api"
  );
});

test("uses the local backend API by default", () => {
  expect(resolveApiBaseURL("")).toBe("http://localhost:8080/api");
});

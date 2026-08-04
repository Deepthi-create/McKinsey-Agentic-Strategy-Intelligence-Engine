import request from "supertest";
import { createApp } from "../src/app.js";

test("allows the deployed Vercel frontend origin", async () => {
  const app = createApp();

  const response = await request(app)
    .options("/api/auth/me")
    .set("Origin", "https://ai-market-strategy-engine.vercel.app")
    .set("Access-Control-Request-Method", "GET")
    .set("Access-Control-Request-Headers", "authorization");

  expect(response.status).toBe(204);
  expect(response.headers["access-control-allow-origin"]).toBe("https://ai-market-strategy-engine.vercel.app");
});

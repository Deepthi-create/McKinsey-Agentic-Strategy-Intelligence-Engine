import { jest } from "@jest/globals";
import User from "../src/models/User.js";
import { resolvePublicSignupRole } from "../src/controllers/auth.controller.js";
import { sendPasswordResetCode } from "../src/services/email.service.js";

test("user password hashing and verification", async () => {
  const user = new User({ name: "Ada Lovelace", email: "ada@example.com" });
  await user.setPassword("Password123!");
  expect(user.passwordHash).not.toBe("Password123!");
  await expect(user.verifyPassword("Password123!")).resolves.toBe(true);
  await expect(user.verifyPassword("wrong-password")).resolves.toBe(false);
});

test("user role defaults to consultant", () => {
  const user = new User({ name: "Grace Hopper", email: "grace@example.com", passwordHash: "hash" });
  expect(user.role).toBe("consultant");
});

test("public signup permits consultant and reviewer roles only", () => {
  expect(resolvePublicSignupRole()).toBe("consultant");
  expect(resolvePublicSignupRole("consultant")).toBe("consultant");
  expect(resolvePublicSignupRole("reviewer")).toBe("reviewer");
  expect(() => resolvePublicSignupRole("admin")).toThrow("Admin accounts cannot be created from public signup");
});

test("password reset email sender posts a reset code email", async () => {
  const originalFetch = global.fetch;
  const originalApiKey = process.env.RESEND_API_KEY;
  const originalFrom = process.env.RESET_EMAIL_FROM;
  const fetchMock = jest.fn().mockResolvedValue({ ok: true });

  global.fetch = fetchMock;
  process.env.RESEND_API_KEY = "test-resend-key";
  process.env.RESET_EMAIL_FROM = "Support <support@example.com>";

  await sendPasswordResetCode({
    to: "ada@example.com",
    name: "Ada",
    code: "123456"
  });

  expect(fetchMock).toHaveBeenCalledWith(
    "https://api.resend.com/emails",
    expect.objectContaining({
      method: "POST",
      headers: expect.objectContaining({
        Authorization: "Bearer test-resend-key",
        "Content-Type": "application/json"
      })
    })
  );
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(expect.objectContaining({
    from: "Support <support@example.com>",
    to: "ada@example.com",
    subject: "Your password reset code"
  }));

  global.fetch = originalFetch;
  process.env.RESEND_API_KEY = originalApiKey;
  process.env.RESET_EMAIL_FROM = originalFrom;
});

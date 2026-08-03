import User from "../src/models/User.js";

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

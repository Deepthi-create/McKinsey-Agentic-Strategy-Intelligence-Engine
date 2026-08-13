import { Router } from "express";
import { forgotPassword, login, me, refresh, signup } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/refresh", refresh);
router.get("/me", requireAuth, me);
export default router;

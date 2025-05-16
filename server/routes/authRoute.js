import express from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { registerController, loginController, logoutController, profileController } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";

const authRouter = express.Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
const authSlowDown = slowDown({ windowMs: 15 * 60 * 1000, delayAfter: 20, delayMs: () => 500 });

authRouter.post("/register", authLimiter, authSlowDown, registerController);
authRouter.post("/login", authLimiter, authSlowDown, loginController);
authRouter.post("/logout", logoutController);
authRouter.get("/profile", protect, authLimiter, authSlowDown, profileController);

export default authRouter;

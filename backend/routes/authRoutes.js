// routes/authRoutes.js

import express from "express";
import {
  sendRegisterOtp,
  verifyRegisterOtp,
  resendRegisterOtp,
  login,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
  getMe,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register/send-otp", sendRegisterOtp);
router.post("/register/verify-otp", verifyRegisterOtp);
router.post("/register/resend-otp", resendRegisterOtp);

/* ================= LOGIN ================= */
router.post("/login", login);

/* ================= LOGGED-IN USER ================= */
router.get("/me", authMiddleware, getMe);

/* ================= FORGOT PASSWORD ================= */
router.post("/forgot-password/send-otp", sendResetOtp);
router.post("/forgot-password/verify-otp", verifyResetOtp);
router.post("/forgot-password/reset", resetPassword);

export default router;

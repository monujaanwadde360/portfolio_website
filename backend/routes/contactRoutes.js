import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { sendContactMessage } from "../controllers/contactController.js";

const router = express.Router();

router.post("/send", authMiddleware, sendContactMessage);

export default router;

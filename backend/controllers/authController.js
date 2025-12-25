import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OtpToken from "../models/OtpToken.js";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";

const OTP_EXPIRY = 2 * 60 * 1000 + 10 * 1000; // ⏱ buffer added
const MAX_ATTEMPTS = 5;

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* ================= REGISTER ================= */

export const sendRegisterOtp = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    email = email?.trim().toLowerCase();

    if (!name || !email || !password)
      return res.status(400).json({ msg: "All fields required" });

    if (await User.exists({ email }))
      return res.status(400).json({ msg: "Email already registered" });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const hashedPassword = await bcrypt.hash(password, 10);

    await OtpToken.deleteMany({ email, purpose: "register" });

    await OtpToken.create({
      email,
      otp: hashedOtp,
      purpose: "register",
      expiresAt: Date.now() + OTP_EXPIRY,
      attempts: 0,
      tempData: { name, password: hashedPassword },
    });

    await sendOtpEmail(email, otp);
    console.log("✅ REGISTER OTP SENT:", email);

    res.json({ msg: "OTP sent" });
  } catch (err) {
    console.error("REGISTER OTP ERROR:", err.message);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
};

export const verifyRegisterOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    email = email?.trim().toLowerCase();

    const token = await OtpToken.findOne({ email, purpose: "register" });

    if (!token || token.expiresAt < Date.now())
      return res.status(400).json({ msg: "OTP expired" });

    if (token.attempts >= MAX_ATTEMPTS)
      return res.status(429).json({ msg: "Too many attempts" });

    const valid = await bcrypt.compare(otp, token.otp);
    if (!valid) {
      token.attempts++;
      await token.save();
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    await User.create({
      name: token.tempData.name,
      email,
      password: token.tempData.password,
    });

    await OtpToken.deleteMany({ email, purpose: "register" });

    res.json({ msg: "Registration successful" });
  } catch (err) {
    console.error("VERIFY REGISTER OTP ERROR:", err.message);
    res.status(500).json({ msg: "Registration failed" });
  }
};

export const resendRegisterOtp = async (req, res) => {
  try {
    let { email } = req.body;
    email = email?.trim().toLowerCase();

    const old = await OtpToken.findOne({ email, purpose: "register" });
    if (!old || !old.tempData)
      return res.status(400).json({ msg: "Session expired" });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await OtpToken.deleteMany({ email, purpose: "register" });

    await OtpToken.create({
      email,
      otp: hashedOtp,
      purpose: "register",
      expiresAt: Date.now() + OTP_EXPIRY,
      attempts: 0,
      tempData: old.tempData,
    });

    await sendOtpEmail(email, otp);
    console.log("🔁 REGISTER OTP RESENT:", email);

    res.json({ msg: "OTP resent" });
  } catch (err) {
    console.error("RESEND REGISTER OTP ERROR:", err.message);
    res.status(500).json({ msg: "Resend failed" });
  }
};

/* ================= LOGIN ================= */

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.trim().toLowerCase();

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ msg: "Login failed" });
  }
};

/* ================= FORGOT PASSWORD ================= */

export const sendResetOtp = async (req, res) => {
  try {
    let { email } = req.body;
    email = email?.trim().toLowerCase();

    if (!(await User.exists({ email })))
      return res.status(404).json({ msg: "User not found" });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await OtpToken.deleteMany({ email, purpose: "reset" });

    await OtpToken.create({
      email,
      otp: hashedOtp,
      purpose: "reset",
      expiresAt: Date.now() + OTP_EXPIRY,
      attempts: 0,
      verified: false,
    });

    await sendOtpEmail(email, otp);
    console.log("✅ RESET OTP SENT:", email);

    res.json({ msg: "OTP sent" });
  } catch (err) {
    console.error("RESET OTP ERROR:", err.message);
    res.status(500).json({ msg: "OTP send failed" });
  }
};

export const verifyResetOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    email = email?.trim().toLowerCase();

    const token = await OtpToken.findOne({ email, purpose: "reset" });
    if (!token || token.expiresAt < Date.now())
      return res.status(400).json({ msg: "OTP expired" });

    if (token.attempts >= MAX_ATTEMPTS)
      return res.status(429).json({ msg: "Too many attempts" });

    const valid = await bcrypt.compare(otp, token.otp);
    if (!valid) {
      token.attempts++;
      await token.save();
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    token.verified = true;
    await token.save();

    res.json({ msg: "OTP verified" });
  } catch (err) {
    console.error("VERIFY RESET OTP ERROR:", err.message);
    res.status(500).json({ msg: "OTP verify failed" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    let { email, newPassword } = req.body;
    email = email?.trim().toLowerCase();

    const token = await OtpToken.findOne({
      email,
      purpose: "reset",
      verified: true,
    });

    if (!token)
      return res.status(400).json({ msg: "OTP not verified" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashed });

    await OtpToken.deleteMany({ email, purpose: "reset" });

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err.message);
    res.status(500).json({ msg: "Reset failed" });
  }
};

/* ================= GET LOGGED-IN USER ================= */

export const getMe = async (req, res) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
  });
};

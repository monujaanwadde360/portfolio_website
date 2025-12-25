import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { login as saveLogin } from "../utils/auth";

const OTP_DURATION = 120;

/* ---------- HELPERS ---------- */
const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  return score;
};

const getRemainingTime = () => {
  const expiry = localStorage.getItem("fpOtpExpiry");
  if (!expiry) return 0;
  return Math.max(0, Math.floor((expiry - Date.now()) / 1000));
};

export default function Login() {
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  /* STATES */
  const [step, setStep] = useState("login");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(getRemainingTime());
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [shake, setShake] = useState(false);
  
  const [msg, setMsg] = useState("");
  
  const [showPass, setShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  /* ---------- EFFECTS ---------- */
  useEffect(() => {
    setMsg("");
    setOtpError("");
  }, [step]);

  useEffect(() => {
    const remain = getRemainingTime();
    if (remain > 0) {
      setStep("otp");
      setTimer(remain);
    }
  }, []);

  useEffect(() => {
    if (step !== "otp") return;

    if (timer === 0) {
      setOtp(Array(6).fill(""));
      setOtpError("OTP expired");
      return;
    }

    const i = setInterval(() => {
      setTimer(getRemainingTime());
    }, 1000);

    return () => clearInterval(i);
  }, [step, timer]);

  /* ======================================================
     HANDLERS
  ====================================================== */

  /* 1. LOGIN */
  const handleLogin = async () => {
    if (!form.email || !form.password)
      return setMsg("Email and password required");

    setLoading(true);
    try {
      const res = await api.post("/login", {
        email: form.email.toLowerCase(),
        password: form.password,
      });

      saveLogin(res.data.token);
      navigate("/portfolio", { replace: true });
    } catch {
      setMsg("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* 2. SEND OTP (UPDATED) */
  const sendOtp = async () => {
    if (!form.email) return setMsg("Enter your registered email");

    setLoading(true);
    try {
      await api.post("/forgot-password/send-otp", {
        email: form.email.toLowerCase(),
      });

      localStorage.setItem(
        "fpOtpExpiry",
        Date.now() + OTP_DURATION * 1000
      );

      setTimer(OTP_DURATION);
      setOtp(Array(6).fill(""));
      setOtpError("");
      setMsg("");
      setTimeout(() => otpRefs.current[0]?.focus(), 50);

      setStep("otp");
    } catch {
      setMsg("Email not registered");
    } finally {
      setLoading(false);
    }
  };

  /* 3. VERIFY OTP */
  const handleOtpChange = (val, i) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setOtpError("");
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpBack = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      otpRefs.current[i - 1]?.focus();
  };

  // ADDED PASTE HANDLER FOR BETTER UX
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").slice(0, 6).split("");
    if (data.every((char) => /^\d$/.test(char))) {
      const newOtp = [...otp];
      data.forEach((char, i) => (newOtp[i] = char));
      setOtp(newOtp);
      otpRefs.current[Math.min(data.length - 1, 5)]?.focus();
      setOtpError("");
    }
  };

  const otpValue = otp.join("");
  const isOtpComplete = otpValue.length === 6;
  const isOtpExpired = timer === 0;

  const verifyOtp = async () => {
    if (!isOtpComplete || isOtpExpired) return;

    setLoading(true);
    try {
      await api.post("/forgot-password/verify-otp", {
        email: form.email.toLowerCase(),
        otp: otpValue,
      });

      setStep("reset");
    } catch {
      setOtpError("Invalid OTP");
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } finally {
      setLoading(false);
    }
  };

  /* 4. RESET PASSWORD */
  const handleNewPassword = (v) => {
    setForm({ ...form, newPassword: v });

    if (!v) {
      setErrors((e) => ({ ...e, newPassword: "" }));
    } else if (getPasswordStrength(v) < 4) {
      setErrors((e) => ({
        ...e,
        newPassword:
          "Must be strong (8+, upper, lower, number & symbol)",
      }));
    } else {
      setErrors((e) => ({ ...e, newPassword: "" }));
    }
  };

  const handleConfirmPassword = (v) => {
    setForm({ ...form, confirmPassword: v });

    if (!v) {
      setErrors((e) => ({ ...e, confirmPassword: "" }));
    } else if (v !== form.newPassword) {
      setErrors((e) => ({
        ...e,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setErrors((e) => ({ ...e, confirmPassword: "" }));
    }
  };

  const resetPassword = async () => {
    if (errors.newPassword || errors.confirmPassword) return;

    setLoading(true);
    try {
      await api.post("/forgot-password/reset", {
        email: form.email.toLowerCase(),
        newPassword: form.newPassword,
      });

      localStorage.removeItem("fpOtpExpiry");
      setStep("login");
      setMsg("Password reset successful. Login now.");
      setForm({
        email: "",
        password: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      setMsg("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- HELPERS FOR UI ---------- */
  const getInputClass = (fieldName) => {
    const baseClass =
      "w-full bg-slate-800/40 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-slate-500";
    const focusClass =
      "focus:border-indigo-500 focus:bg-slate-800/60 focus:shadow-[0_0_15px_rgba(99,102,241,0.3)]";
    const errorClass = errors[fieldName]
      ? "border-rose-500/50 focus:border-rose-500 focus:shadow-[0_0_15px_rgba(244,63,94,0.3)] text-rose-100"
      : "";
    return `${baseClass} ${focusClass} ${errorClass}`;
  };

  const strengthScore = form.newPassword ? getPasswordStrength(form.newPassword) : 0;
  const strengthColor =
    strengthScore <= 2
      ? "bg-rose-500"
      : strengthScore === 3
      ? "bg-yellow-500"
      : "bg-emerald-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-950 text-white p-4">
      
      {/* --- AMBIENT BACKGROUND EFFECTS --- */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '3s' }}></div>

      <div className="w-full max-w-md rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl relative z-10 overflow-hidden">
        
        {/* --- DECORATIVE BORDER TOP --- */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
        
        {/* --- CLOSE BUTTON --- */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all duration-200 z-20"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        {/* ------------------ */}

        <div className="p-8">
          {/* HEADING */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-slate-400">
              {step === "login" && "Welcome back"}
              {step === "forgot" && "Forgot Password"}
              {step === "otp" && "Verify Email"}
              {step === "reset" && "Set New Password"}
            </h2>
            <p className="text-sm text-slate-400">
              {step === "login" && "Enter your credentials to access your account."}
              {step === "forgot" && "Enter your email to receive a reset code."}
              {step === "otp" && `We sent a code to ${form.email}`}
              {step === "reset" && "Choose a secure password."}
            </p>
          </div>

          {/* ================= LOGIN ================= */}
          {step === "login" && (
            <div className="space-y-5">
              <div className="group">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 transition-colors group-focus-within:text-indigo-400">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-800/40 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-indigo-500 focus:bg-slate-800/60 focus:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 transition-colors group-focus-within:text-indigo-400">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-slate-800/40 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-indigo-500 focus:bg-slate-800/60 focus:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors p-1 rounded-md hover:bg-white/5"
                  >
                    {showPass ? (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M1 1l22 22" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                
                <div className="flex justify-end mt-2">
                  <button 
                    type="button"
                    onClick={() => setStep("forgot")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full group relative bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Log in"
                )}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              </button>
            </div>
          )}

          {/* ================= FORGOT ================= */}
          {step === "forgot" && (
            <div className="space-y-5">
              <div className="group">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 transition-colors group-focus-within:text-indigo-400">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-800/40 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-indigo-500 focus:bg-slate-800/60 focus:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                />
              </div>

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full group relative bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Send verification code"
                )}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              </button>

              <button
                type="button"
                onClick={() => setStep("login")}
                className="mx-auto block text-xs text-slate-400 hover:text-white transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}

          {/* ================= OTP ================= */}
          {step === "otp" && (
            <div className="space-y-8">
              <div className={`flex justify-center gap-3 ${shake ? "animate-shake" : ""}`}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    value={digit}
                    maxLength={1}
                    inputMode="numeric"
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpBack(e, i)}
                    onPaste={handleOtpPaste} // Added paste handler
                    className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-slate-800/40 border border-slate-700 focus:border-indigo-500 focus:bg-indigo-900/30 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 scale-100 focus:scale-110"
                  />
                ))}
              </div>

              {otpError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  {otpError}
                </div>
              )}

              <p className="text-center text-xs text-slate-500 font-mono tracking-wider">
                {timer > 0
                  ? `EXPIRES IN ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`
                  : "CODE EXPIRED"}
              </p>

              <button
                disabled={!isOtpComplete || isOtpExpired || loading}
                onClick={verifyOtp}
                className={`w-full rounded-xl px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.98] relative overflow-hidden ${
                  isOtpComplete && !isOtpExpired
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-500/20"
                    : "bg-slate-700/50 cursor-not-allowed opacity-70 border border-white/5"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Verify code"
                )}
              </button>

              <button
                disabled={timer > 0 || loading}
                onClick={sendOtp}
                className="mx-auto block text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors disabled:text-slate-600 disabled:cursor-not-allowed"
              >
                {loading ? "Resending..." : "Resend code"}
              </button>
            </div>
          )}

          {/* ================= RESET ================= */}
          {step === "reset" && (
            <div className="space-y-5">
              {/* New Password */}
              <div className="group">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 transition-colors group-focus-within:text-indigo-400">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.newPassword}
                    onChange={(e) => handleNewPassword(e.target.value)}
                    className={getInputClass("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors p-1 rounded-md hover:bg-white/5"
                  >
                    {showNewPass ? (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M1 1l22 22" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Strength Meter */}
                {form.newPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${strengthColor}`}
                        style={{ width: `${(strengthScore / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      {strengthScore <= 2 ? "Weak" : strengthScore === 3 ? "Medium" : "Strong"}
                    </span>
                  </div>
                )}
                {errors.newPassword && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/></svg>
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="group">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 transition-colors group-focus-within:text-indigo-400">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(e) => handleConfirmPassword(e.target.value)}
                    className={getInputClass("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors p-1 rounded-md hover:bg-white/5"
                  >
                    {showConfirmPass ? (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M1 1l22 22" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/></svg>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                onClick={resetPassword}
                disabled={
                  !!errors.newPassword ||
                  !!errors.confirmPassword ||
                  !form.newPassword ||
                  !form.confirmPassword ||
                  loading
                }
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          )}

          {/* GLOBAL MESSAGE */}
          {msg && (
            <div className={`mt-6 text-center text-sm px-4 py-2 rounded-lg border animate-in fade-in ${
              msg.toLowerCase().includes("success") 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}>
              {msg}
            </div>
          )}

          {/* FOOTER LINK */}
          {step === "login" && (
            <p className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-slate-500">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-indigo-400 font-medium cursor-pointer hover:text-indigo-300 transition-colors hover:underline decoration-2 underline-offset-4"
              >
                Register
              </span>
            </p>
          )}
        </div>
      </div>

      {/* CSS Animation Definitions */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.32s ease-in-out;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        ::-webkit-scrollbar { width: 0; }
      `}</style>
    </div>
  );
}
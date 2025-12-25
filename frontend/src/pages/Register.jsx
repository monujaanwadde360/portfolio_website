import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://portfolio-website-backend-77uc.onrender.com";
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
  const expiry = localStorage.getItem("otpExpiry");
  if (!expiry) return 0;
  return Math.max(0, Math.floor((expiry - Date.now()) / 1000));
};

export default function Register() {
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  /* ---------- STATE ---------- */
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpStatus, setOtpStatus] = useState("idle"); // idle | info | expired | error | success
  const [otpText, setOtpText] = useState("");
  const [shake, setShake] = useState(false);

  const [timer, setTimer] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});
  const [formMsg, setFormMsg] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ---------- CLEANUP & RESTORE STATE ---------- */
  useEffect(() => {
    const remaining = getRemainingTime();
    const savedEmail = localStorage.getItem("registerEmail");

    if (remaining > 0 && savedEmail) {
      setStep(2);
      setTimer(remaining);
      setOtpStatus("info");
      setOtpText("Enter the OTP sent to your email");
      setForm((prev) => ({ ...prev, email: savedEmail })); // Restore email
    } else {
      localStorage.removeItem("otpExpiry");
      localStorage.removeItem("registerEmail");
    }
  }, []);

  /* ---------- FORM VALIDATION ---------- */
  useEffect(() => {
    const e = {};
    if (form.name && form.name.length < 3)
      e.name = "Name must be at least 3 characters";

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";

    if (form.password && getPasswordStrength(form.password) < 4)
      e.password =
        "Password must be strong (8+, upper, lower, number & symbol)";

    if (form.confirm && form.password !== form.confirm)
      e.confirm = "Passwords do not match";

    setErrors(e);
  }, [form]);

  /* ---------- TIMER ---------- */
  useEffect(() => {
    if (otpStatus === "success") return;

    if (timer <= 0 && step === 2) {
      setOtp(Array(6).fill(""));
      setOtpStatus("expired");
      setOtpText("OTP expired. Please resend.");
      inputsRef.current[0]?.focus();
      return;
    }

    const interval = setInterval(() => {
      setTimer(getRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, step, otpStatus]);

  /* ---------- OTP HANDLERS ---------- */
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const copy = [...otp];
    copy[index] = value;
    setOtp(copy);

    if (otpStatus !== "success") {
      setOtpStatus("idle");
      setOtpText("");
    }

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").slice(0, 6).split("");
    
    if (data.every((char) => /^\d$/.test(char))) {
      const newOtp = [...otp];
      data.forEach((char, i) => (newOtp[i] = char));
      setOtp(newOtp);
      inputsRef.current[Math.min(data.length - 1, 5)]?.focus();
      
      if (otpStatus !== "success") {
        setOtpStatus("idle");
        setOtpText("");
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const otpValue = otp.join("");
  const isOtpValid = otpValue.length === 6 && timer > 0;

  /* ---------- API CALLS ---------- */
  const sendOtp = async () => {
    setFormMsg("");

    if (!form.name || !form.email || !form.password || !form.confirm)
      return setFormMsg("All fields are required");

    if (Object.keys(errors).length > 0)
      return setFormMsg("Please fix the errors above");

    setLoading(true);
    try {
      await axios.post(`${API}/register/send-otp`, {
        ...form,
        email: form.email.toLowerCase(),
      });

      localStorage.setItem("otpExpiry", Date.now() + OTP_DURATION * 1000);
      localStorage.setItem("registerEmail", form.email.toLowerCase());

      setTimer(OTP_DURATION);
      setOtp(Array(6).fill(""));
      setOtpStatus("info");
      setOtpText("OTP sent to your email");
      setStep(2);
    } catch (err) {
      setFormMsg(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (timer > 0 || otpStatus === "success") return;

    setLoading(true);
    try {
      await axios.post(`${API}/register/resend-otp`, {
        email: form.email.toLowerCase(),
      });

      localStorage.setItem("otpExpiry", Date.now() + OTP_DURATION * 1000);

      setTimer(OTP_DURATION);
      setOtp(Array(6).fill(""));
      setOtpStatus("info");
      setOtpText("OTP resent to your email");
      inputsRef.current[0]?.focus();
    } catch {
      setOtpStatus("error");
      setOtpText("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!isOtpValid || otpStatus === "success") return;

    setLoading(true);
    try {
      await axios.post(`${API}/register/verify-otp`, {
        email: form.email.toLowerCase(),
        otp: otpValue,
      });

      localStorage.removeItem("otpExpiry");
      localStorage.removeItem("registerEmail");

      setOtpStatus("success");
      setOtpText("Registration successful 🎉");

      setTimeout(() => navigate("/login"), 1200);
    } catch {
      setOtpStatus("error");
      setOtpText("Invalid OTP");
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RENDER HELPERS ---------- */
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

  const otpStatusColor = (() => {
    switch (otpStatus) {
      case "success": return "text-emerald-400";
      case "expired":
      case "error": return "text-rose-400";
      default: return "text-blue-400";
    }
  })();

  const strengthScore = form.password ? getPasswordStrength(form.password) : 0;
  const strengthColor =
    strengthScore <= 2
      ? "bg-rose-500"
      : strengthScore === 3
      ? "bg-yellow-500"
      : "bg-emerald-500";

  /* ---------- JSX ---------- */
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
          onClick={() => {
            localStorage.removeItem("otpExpiry");
            localStorage.removeItem("registerEmail");
            navigate("/");
          }}
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

        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-slate-400">
            {step === 1 ? "Create account" : "Verify email"}
          </h2>
          <p className="text-center text-slate-400 text-sm mb-8">
            {step === 1
              ? "Enter your details and we’ll send you a verification code."
              : "We’ve sent a 6‑digit code to your email."}
          </p>

          {/* STEP 1: REGISTRATION */}
          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendOtp();
              }}
              className="space-y-5"
            >
              {/* Name */}
              <div className="group">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 transition-colors group-focus-within:text-indigo-400">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={getInputClass("name")}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/></svg>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 transition-colors group-focus-within:text-indigo-400">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={getInputClass("email")}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/></svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 transition-colors group-focus-within:text-indigo-400">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className={getInputClass("password")}
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

                {/* STRENGTH METER - ADDED LIKE LOGIN */}
                {form.password && (
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

                {errors.password && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/></svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div className="group">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 transition-colors group-focus-within:text-indigo-400">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={(e) =>
                      setForm({ ...form, confirm: e.target.value })
                    }
                    className={getInputClass("confirm")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors p-1 rounded-md hover:bg-white/5"
                  >
                    {showConfirm ? (
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
                {errors.confirm && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/></svg>
                    {errors.confirm}
                  </p>
                )}
              </div>

              {/* Form message */}
              {formMsg && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs py-2 px-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  {formMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
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
                {/* Button Shine Effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              </button>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <div className="space-y-8">
              {/* OTP inputs */}
              <div
                className={`flex justify-center gap-3 ${
                  shake ? "animate-shake" : ""
                }`}
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    value={digit}
                    maxLength={1}
                    inputMode="numeric"
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    onPaste={handleOtpPaste}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-slate-800/40 border border-slate-700 focus:border-indigo-500 focus:bg-indigo-900/30 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 scale-100 focus:scale-110"
                  />
                ))}
              </div>

              {/* Status text */}
              {otpText && (
                <p className={`text-center text-sm font-medium ${otpStatusColor} min-h-[20px] animate-in fade-in`}>
                  {otpText}
                </p>
              )}

              {/* Timer */}
              <p className="text-center text-xs text-slate-500 font-mono tracking-wider">
                {timer > 0
                  ? `EXPIRES IN ${Math.floor(timer / 60)}:${String(
                      timer % 60
                    ).padStart(2, "0")}`
                  : "CODE EXPIRED"}
              </p>

              {/* Buttons row */}
              <div className="pt-2 space-y-3">
                <button
                  disabled={!isOtpValid || loading}
                  onClick={verifyOtp}
                  className={`w-full rounded-xl px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.98] relative overflow-hidden ${
                    isOtpValid
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
                  disabled={timer > 0}
                  onClick={resendOtp}
                  className={`mx-auto block text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors disabled:text-slate-600 disabled:cursor-not-allowed`}
                >
                  {loading ? "Resending..." : "Resend code"}
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-indigo-400 font-semibold cursor-pointer hover:text-indigo-300 transition-colors hover:underline decoration-2 underline-offset-4"
              >
                Log in
              </span>
            </p>
          </div>
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

import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    otp: {
      type: String,
      required: true, // 🔐 hashed OTP
    },

    purpose: {
      type: String,
      enum: ["register", "reset"],
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      // ✅ REMOVED index: true
    },

    // 🔐 Prevent brute-force
    attempts: {
      type: Number,
      default: 0,
    },

    // 🔐 For forgot-password flow
    verified: {
      type: Boolean,
      default: false,
    },

    // 🔐 Temporary data for registration
    tempData: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("OtpToken", otpSchema);

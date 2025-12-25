import nodemailer from "nodemailer";

let transporter;

export const getEmailTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER or EMAIL_PASS not set");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // 🔐 REQUIRED
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // 🔐 GMAIL APP PASSWORD
      },
    });

    transporter.verify((err) => {
      if (err) {
        console.error("❌ EMAIL ERROR:", err.message);
      } else {
        console.log("✅ Email transporter ready");
      }
    });
  }

  return transporter;
};

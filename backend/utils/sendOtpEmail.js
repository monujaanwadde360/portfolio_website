import { getEmailTransporter } from "./emailTransporter.js";

export const sendOtpEmail = async (email, otp) => {
  const mailer = getEmailTransporter();

  await mailer.sendMail({
    from: `"Monujaan Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
      <div style="font-family:Arial">
        <h2>OTP Verification</h2>
        <p style="font-size:24px;font-weight:bold">${otp}</p>
        <p>This OTP is valid for <b>2 minutes</b>.</p>
      </div>
    `,
  });
};

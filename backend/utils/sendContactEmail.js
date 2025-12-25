// utils/sendContactEmail.js

import { getEmailTransporter } from "./emailTransporter.js";

/* ---------- SEND CONTACT MESSAGE TO YOU ---------- */
export const sendContactEmail = async ({ name, email, message }) => {
  try {
    const mailer = getEmailTransporter();

    await mailer.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, 
      replyTo: email,             
      subject: `📩 New Message from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>New Contact Message</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <hr />
          <p>${message}</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("SEND CONTACT EMAIL ERROR:", err);
    throw new Error("Failed to send contact email");
  }
};

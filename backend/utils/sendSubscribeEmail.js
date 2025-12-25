import { getEmailTransporter } from "./emailTransporter.js";

export const sendSubscribeEmails = async (subscriberEmail) => {
  const mailer = getEmailTransporter();

  /* ---------- EMAIL TO YOU ---------- */
  await mailer.sendMail({
    from: `"Portfolio Subscribe" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "📬 New Subscriber",
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>New Subscriber</h2>
        <p><b>Email:</b> ${subscriberEmail}</p>
      </div>
    `,
  });

  /* ---------- EMAIL TO SUBSCRIBER ---------- */
  await mailer.sendMail({
    from: `"Monujaan" <${process.env.EMAIL_USER}>`,
    to: subscriberEmail,
    subject: "🎉 Thanks for Subscribing!",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6">
        <h2>Welcome!</h2>
        <p>Thanks for subscribing to my updates.</p>
        <p>You’ll receive updates about projects, blogs, and tutorials.</p>
        <br/>
        <p>– Monujaan</p>
      </div>
    `,
  });
};

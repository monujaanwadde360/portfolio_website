import { sendSubscribeEmails } from "../utils/sendSubscribeEmail.js";

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email required" });
    }

    await sendSubscribeEmails(email);

    res.json({ msg: "Subscribed successfully" });
  } catch (err) {
    console.error("SUBSCRIBE ERROR:", err);
    res.status(500).json({ msg: "Subscription failed" });
  }
};

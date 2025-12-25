import { sendContactEmail } from "../utils/sendContactEmail.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.length < 5) {
      return res.status(400).json({ msg: "Message too short" });
    }

    await sendContactEmail({
      name: req.user.name,
      email: req.user.email,
      message,
    });

    res.status(200).json({ msg: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send message" });
  }
};

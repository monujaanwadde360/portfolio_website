import { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Send, MapPin, Github, Linkedin } from "lucide-react";

const API = "http://localhost:5000";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  /* ================= LOAD LOGGED-IN USER ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${API}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setForm((prev) => ({
          ...prev,
          name: res.data.name,
          email: res.data.email,
        }));
      })
      .catch(() => {
        setStatus("Please login to send a message");
      });
  }, []);

  /* ================= SUBMIT MESSAGE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("Please login to send a message");
      return;
    }

    try {
      await axios.post(
        `${API}/api/contact/send`,
        { message: form.message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm((prev) => ({ ...prev, message: "" }));
      setStatus("Message sent successfully");
      setTimeout(() => setStatus(""), 4000);
    } catch {
      setStatus("Failed to send message");
    }
  };

  return (
    <section
      id="contact"
      className="reveal py-24 px-6 bg-gradient-to-b from-slate-950 to-black text-white relative overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
          Get in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Touch
          </span>
        </h2>
        <div className="h-1 w-24 bg-indigo-500 mx-auto rounded-full mb-4" />
        <p className="text-slate-500 tracking-[0.3em] text-xs uppercase font-semibold">
          Start a Conversation
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 relative z-10">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h3 className="text-2xl font-bold mb-4">Let's Connect</h3>
            <p className="text-slate-400 leading-relaxed">
              I'm currently open for freelance work and full-time opportunities.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="text-indigo-400" />
              <p>wsonuramwadde360@gmail.com</p>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="text-indigo-400" />
              <p>Kolkata, India</p>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Github />
            <Linkedin />
          </div>
        </div>

        {/* RIGHT COLUMN: FORM */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-2xl relative">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* NAME (AUTO-FILLED, READ ONLY) */}
              <input
                type="text"
                value={form.name}
                disabled
                className="w-full rounded-xl bg-slate-800/50 border border-white/10 px-4 py-3 text-slate-300 cursor-not-allowed"
                placeholder="Your Name"
              />

              {/* EMAIL (AUTO-FILLED, READ ONLY) */}
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full rounded-xl bg-slate-800/50 border border-white/10 px-4 py-3 text-slate-300 cursor-not-allowed"
                placeholder="Your Email"
              />

              {/* MESSAGE */}
              <textarea
                rows="5"
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                required
                placeholder="Your Message"
                className="w-full rounded-xl bg-slate-950/50 border border-white/10 px-4 py-3 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
              />

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 px-8 py-4 rounded-xl 
                           bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold
                           hover:scale-[1.02] transition-all"
              >
                <span>Send Message</span>
                <Send size={18} />
              </button>
            </form>

            {status && (
              <div className="mt-6 text-center text-sm text-emerald-400">
                {status}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

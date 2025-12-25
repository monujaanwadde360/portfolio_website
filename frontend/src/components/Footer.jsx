import { FaGithub, FaLinkedin, FaEnvelope, FaArrowRight } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

const API = "http://localhost:5000";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const timeoutRef = useRef(null);

  /* ================= FETCH LOGGED-IN USER EMAIL ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.email) setEmail(data.email);
      })
      .catch(() => {
        /* silent fail – footer still renders */
      });
  }, []);

  /* ================= SUBSCRIBE HANDLER ================= */
  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    try {
      const res = await fetch(`${API}/api/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Subscribe failed");

      setSubscribed(true);

      timeoutRef.current = setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    } catch (err) {
      console.error("SUBSCRIBE ERROR:", err);
      alert("Failed to subscribe. Please try again.");
    }
  };

  return (
    <>
      {/* ================= TOP CTA BAR ================= */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white py-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Stay{" "}
            <span className="text-transparent bg-clip-text bg-white">
              Connected
            </span>
          </h2>

          <p className="text-indigo-100 mb-8 text-lg max-w-2xl">
            Join my journey and get updates on my latest projects, tech blogs,
            and tutorials directly to your inbox.
          </p>

          <form onSubmit={handleSubscribe} className="w-full max-w-lg group">
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 flex items-center focus-within:ring-2 focus-within:ring-white/30 transition-all duration-300">
              
              {/* EMAIL (AUTO-FETCHED, READ ONLY) */}
              <input
                type="email"
                value={email}
                disabled
                placeholder="Login to subscribe"
                className="flex-1 bg-transparent border-none text-white placeholder-indigo-200 px-6 py-3 focus:ring-0 cursor-not-allowed"
                required
              />

              <button
                type="submit"
                disabled={subscribed || !email}
                className={`
                  px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all duration-300
                  ${
                    subscribed
                      ? "bg-green-500 text-white"
                      : "bg-white text-indigo-600 hover:bg-indigo-50 hover:scale-105"
                  }
                `}
              >
                {subscribed ? (
                  <>
                    <span className="text-lg">✓</span>
                    <span className="hidden sm:inline">Subscribed!</span>
                  </>
                ) : (
                  <>
                    Subscribe
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {subscribed && (
            <p className="mt-4 text-sm font-medium text-white/80 animate-fadeIn">
              Thanks for subscribing! Check your inbox shortly.
            </p>
          )}
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 text-slate-400 px-6 pt-20 pb-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* BRAND */}
          <div className="space-y-6">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              Monu<span className="text-indigo-500">jaan</span>
            </h3>
            <p className="leading-relaxed text-slate-400">
              Computer Science Developer focused on building modern,
              scalable web applications and innovative IoT systems.
            </p>
          </div>

          {/* FOCUS AREAS */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Focus Areas</h4>
            <ul className="space-y-3">
              {[
                "Web Development",
                "IoT & Embedded Systems",
                "Cyber Security",
                "UI/UX Design"
              ].map((item, i) => (
                <li key={i} className="group flex items-center justify-between cursor-pointer">
                  <span className="group-hover:text-white transition-colors duration-300">{item}</span>
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-indigo-500">
                    <FaArrowRight size={12} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "About Me", href: "#about" },
                { name: "My Projects", href: "#projects" },
                { name: "Contact", href: "#contact" },
                { name: "Get CV", href: "#" }
              ].map((item, i) => (
                <li key={i} className="group flex items-center justify-between cursor-pointer">
                  <a href={item.href} className="group-hover:text-white transition-colors duration-300">{item.name}</a>
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-indigo-500">
                    <FaArrowRight size={12} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="p-2 bg-slate-900 rounded-lg border border-white/5 text-indigo-500">
                  <FaEnvelope size={16} />
                </div>
                <a href="mailto:wsonuramwadde360@gmail.com" className="hover:text-white transition-colors">
                  wsonuramwadde360@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-slate-900 rounded-lg border border-white/5 text-indigo-500">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <span className="hover:text-white transition-colors">
                  Kolkata, West Bengal<br />India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ================= SOCIAL ICONS ================= */}
        <div className="max-w-6xl mx-auto mt-16 border-t border-white/5 pt-10">
          <div className="flex justify-center gap-6">
            {[
              { icon: <FaGithub />, href: "https://github.com/Monujaanwadde", label: "GitHub", color: "hover:bg-white hover:text-black" },
              { icon: <FaLinkedin />, href: "#", label: "LinkedIn", color: "hover:bg-[#0077b5] hover:text-white" },
              { icon: <FaEnvelope />, href: "mailto:wsonuramwadde360@gmail.com", label: "Email", color: "hover:bg-indigo-600 hover:text-white" }
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className={`
                  w-12 h-12 flex items-center justify-center rounded-full
                  bg-slate-900 border border-white/10 text-slate-400
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:scale-110 hover:shadow-lg
                  ${social.color}
                `}
              >
                <span className="text-xl">{social.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ================= COPYRIGHT ================= */}
        <div className="mt-12 text-center text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} Monujaan Wadde. All rights reserved.</p>
          <p className="text-xs mt-2">Designed & Built with ❤️ and ☕</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );  
}

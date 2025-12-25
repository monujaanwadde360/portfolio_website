import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { isAuthenticated } from "../utils/auth";
import logo from "../assets/logo.ico";

import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";

/* ================= AUTO TYPING WORDS ================= */
const words = [
  "Full Stack Developer",
  "React Developer",
  "Node.js Specialist",
  "UI/UX Engineer",
];

/* ================= NAV ITEMS ================= */
const sections = [
  { label: "Home" },
  { label: "About" },
  { label: "Services" },
  { label: "Skills" },
  { label: "Projects" },
  { label: "Contact" },
];

export default function MainHome({ children }) {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  /* Lerp Animation State for Parallax */
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });

  /* ================= TYPING EFFECT ================= */
  useEffect(() => {
    const currentWord = words[wordIndex];
    const speed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      setText((prev) =>
        isDeleting
          ? currentWord.slice(0, prev.length - 1)
          : currentWord.slice(0, prev.length + 1)
      );

      if (!isDeleting && text === currentWord) {
        setTimeout(() => setIsDeleting(true), 1500);
      }

      if (isDeleting && text === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex]);

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= FLUID PARALLAX (LERP) ================= */
  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 60; // Wider range
      const y = (e.clientY / window.innerHeight - 0.5) * 60;
      targetPos.current = { x, y };
    };

    let rafId;
    const animate = () => {
      // Smoothly interpolate current position towards target
      setMousePos((prev) => ({
        x: prev.x + (targetPos.current.x - prev.x) * 0.08, // 0.08 = lag factor
        y: prev.y + (targetPos.current.y - prev.y) * 0.08,
      }));
      rafId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* ================= AUTH CHECK ================= */
  if (isAuthenticated()) {
    return children;
  }

  /* ================= PUBLIC LANDING ================= */
  return (
    <div 
      className="min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden selection:bg-indigo-500 selection:text-white"
    >
      {/* ================= AMBIENT BACKGROUND ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        
        {/* Fluid Orbs (Parallax) */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/25 rounded-full blur-[120px]"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
            transition: 'transform 0.1s linear' // CSS transition helps smooth rAF jumps
          }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/25 rounded-full blur-[120px]"
          style={{
            transform: `translate(-${mousePos.x * 1.2}px, -${mousePos.y * 1.2}px)`,
            transition: 'transform 0.1s linear'
          }}
        />
      </div>

      {/* ================= NAVBAR ================= */}
      <nav 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
          scrolled 
            ? "py-3 bg-slate-950/80 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/50" 
            : "py-6 bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => {
              window.scrollTo({top: 0, behavior: 'smooth'});
              navigate("/")
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={logo}
                alt="Monujaan Logo"
                className="w-9 h-9 rounded-full object-cover border border-white/10 group-hover:border-indigo-400 transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-indigo-100 transition-colors">
              Monu<span className="text-indigo-500">jaan</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {sections.map((s, i) => (
              <a
                key={i}
                href={`/#${s.label.toLowerCase()}`}
                className="relative px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-all duration-300 group"
              >
                {s.label}
                
                {/* Hover Dot Indicator */}
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                <span className="absolute inset-0 rounded-lg bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium transition-all duration-300 hover:bg-white/5"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="group relative px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] overflow-hidden"
            >
              Register
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine skew-x-12"></div>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-2xl text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <FaBars />
          </button>
        </div>
      </nav>

      {/* ================= MOBILE FULLSCREEN MENU ================= */}
      <div
        className={`fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-xl flex flex-col justify-center items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 p-3 text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <FaTimes size={24} />
        </button>

        <div className="flex flex-col gap-6 text-center">
          {sections.map((s, i) => (
            <a
              key={i}
              href={`/#${s.label.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="text-3xl font-bold text-white hover:text-indigo-400 transition-colors cursor-pointer"
              style={{ 
                animation: `slideInRight 0.4s ease-out forwards`,
                animationDelay: `${i * 50}ms`,
                opacity: 0
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
        
        {/* Mobile Actions */}
        <div 
           className="mt-8 flex flex-col gap-4 w-full px-12"
           style={{ animationDelay: `${sections.length * 50}ms`, opacity: 0, animation: 'slideInRight 0.4s ease-out forwards' }}
        >
           <button onClick={() => {setMenuOpen(false); navigate("/login")}} className="py-4 rounded-xl border border-white/10 text-white hover:bg-white/5 transition">Login</button>
           <button onClick={() => {setMenuOpen(false); navigate("/register")}} className="py-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20">Register</button>
        </div>
      </div>

      {/* ================= HERO ================= */}
      <main className="flex-1 flex items-center justify-center px-6 relative z-10 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-sm mb-8 animate-fadeIn">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Available for Hire</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold mb-6 leading-[1.1] tracking-tight">
            Hello, I’m{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                Monujaan
              </span>
              {/* Glow Effect behind name */}
              <span className="absolute inset-0 bg-indigo-500/20 blur-2xl -z-10"></span>
            </span>
          </h1>

          {/* Typewriter */}
          <div className="h-16 md:h-20 flex items-center justify-center mb-8">
            <h2 className="text-2xl md:text-4xl text-slate-300 font-medium">
              {text}
              <span className="ml-2 w-1.5 md:w-2 h-8 md:h-12 bg-indigo-500 inline-block animate-blink align-middle shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
            </h2>
          </div>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            I create clean, scalable, and high-performance web applications
            and IoT systems with a strong focus on modern UI/UX.
          </p>

          {/* Interactive Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {/* Magnetic Button Simulation */}
            <button
              onClick={() => navigate("/login")}
              className="group relative px-10 py-4 rounded-2xl font-semibold text-white
                       bg-gradient-to-r from-indigo-600 to-purple-600
                       overflow-hidden transition-all duration-300
                       hover:scale-105 hover:shadow-[0_10px_40px_rgba(79,70,229,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Login to Explore <FaArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine skew-x-12"></div>
            </button>

            <button
              onClick={() => navigate("/register")}
              className="group px-10 py-4 rounded-2xl font-semibold text-slate-300
                       border border-white/10 hover:bg-white/5 hover:text-white
                       transition-all duration-300 hover:scale-105"
            >
              Create Account
            </button>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950/80 backdrop-blur-md text-slate-400 px-6 pt-24 pb-10 relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Monu<span className="text-indigo-500">jaan</span>
            </h3>
            <p className="leading-relaxed text-sm opacity-80">
              Computer Science Developer focused on building modern,
              scalable web applications and innovative IoT systems.
            </p>
          </div>

          {/* Focus Areas */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Focus Areas</h4>
            <ul className="space-y-3">
              <li className="group flex items-center justify-between cursor-pointer w-fit">
                <span className="text-slate-300 group-hover:text-white transition-colors">Web Development</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500"><FaArrowRight size={12}/></span>
              </li>
              <li className="group flex items-center justify-between cursor-pointer w-fit">
                <span className="text-slate-300 group-hover:text-white transition-colors">IoT Systems</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500"><FaArrowRight size={12}/></span>
              </li>
              <li className="group flex items-center justify-between cursor-pointer w-fit">
                <span className="text-slate-300 group-hover:text-white transition-colors">Cyber Security</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500"><FaArrowRight size={12}/></span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li className="group flex items-center justify-between cursor-pointer w-fit">
                <span className="text-slate-300 group-hover:text-white transition-colors">Projects</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500"><FaArrowRight size={12}/></span>
              </li>
              <li className="group flex items-center justify-between cursor-pointer w-fit">
                <span className="text-slate-300 group-hover:text-white transition-colors">Skills</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500"><FaArrowRight size={12}/></span>
              </li>
              <li className="group flex items-center justify-between cursor-pointer w-fit">
                <span className="text-slate-300 group-hover:text-white transition-colors">Contact</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500"><FaArrowRight size={12}/></span>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Connect</h4>
            <p className="mb-4 text-sm">wsonuramwadde360@gmail.com</p>
            <div className="flex gap-4">
              <a href="#" className="group w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-white hover:scale-110 hover:bg-slate-800 transition-all">
                 <FaGithub />
              </a>
              <a href="#" className="group w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:border-blue-600 hover:text-white hover:scale-110 hover:bg-slate-800 transition-all">
                 <FaLinkedin />
              </a>
              <a href="#" className="group w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-white hover:scale-110 hover:bg-slate-800 transition-all">
                 <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-slate-600 border-t border-white/5 pt-8">
          <p>© {new Date().getFullYear()} Monujaan Wadde. All rights reserved.</p>
        </div>
      </footer>

      {/* CSS ANIMATIONS */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes gradient {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(20deg); }
        }
        @keyframes shine {
          100% { transform: translateX(300%) skewX(15deg); }
        }
        .animate-blink { animation: blink 1s step-end infinite; }
        .animate-slideIn { animation: slideInRight 0.4s ease-out forwards; opacity: 0; }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; opacity: 0; }
        .animate-gradient { animation: gradient 5s ease infinite; }
        .animate-shine { animation: shine 1s infinite linear; }
      `}</style>
    </div>
  );
}
import { useEffect, useState, useRef } from "react";
import { ArrowUp, ArrowDown, MousePointer2 } from "lucide-react";

export default function Home() {
  const words = [
    "Full Stack Developer",
    "React Developer",
    "Node.js Specialist",
    "UI/UX Engineer",
  ];

  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const pauseRef = useRef(null);
  const glowRef = useRef(null);

  /* ================= FLUID PARALLAX STATE (LERP) ================= */
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });

  /* ================= TYPEWRITER ================= */
  useEffect(() => {
    if (subIndex === words[index].length && !reverse) {
      pauseRef.current = setTimeout(() => setReverse(true), 1000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const t = setTimeout(
      () => setSubIndex((prev) => prev + (reverse ? -1 : 1)),
      reverse ? 30 : 80 // Faster delete, smoother type
    );

    return () => {
      clearTimeout(t);
      clearTimeout(pauseRef.current);
    };
  }, [subIndex, index, reverse]);

  /* ================= SCROLL TO TOP ================= */
  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= FLUID PARALLAX GLOW ================= */
  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 60;
      const y = (e.clientY / window.innerHeight - 0.5) * 60;
      targetPos.current = { x, y };
    };

    let rafId;
    const animate = () => {
      // Smoothly interpolate current position towards target (Lerp)
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

  return (
    <section
      id="home"
      className="
        relative min-h-screen flex flex-col items-center
        px-4 sm:px-6 pt-32
        bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
        from-slate-900 via-gray-950 to-black
        overflow-hidden selection:bg-indigo-500 selection:text-white
      "
    >
      {/* ================= FLUID GLOW BACKGROUND ================= */}
      <div 
        className="fixed inset-0 pointer-events-none mix-blend-screen opacity-60 z-0"
        style={{
           transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
           transition: 'transform 0.1s linear' // JS smooths it, CSS tightens it
        }}
      >
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-indigo-600/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[120px]" />
      </div>
      
      {/* Grid Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />

      {/* ================= HERO CONTENT ================= */}
      <div className="relative z-10 max-w-6xl text-center px-4">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-sm mb-8 animate-fadeIn">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Available for Work</span>
        </div>

        {/* Heading */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight tracking-tight">
          Hello, I’m{" "}
          <span 
            className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradientShift"
          >
            Monujaan
            {/* Text Glow */}
            <span className="absolute inset-0 bg-indigo-500/20 blur-2xl -z-10"></span>
          </span>
        </h1>

        {/* Typewriter */}
        <div className="h-16 md:h-20 flex items-center justify-center mb-8">
          <h2 className="text-2xl md:text-4xl font-medium text-slate-300">
            {words[index].substring(0, subIndex)}
            <span className="ml-2 w-1.5 md:w-2 h-8 md:h-12 bg-indigo-500 inline-block animate-blink align-middle shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
          </h2>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-12 font-light">
          I create clean, scalable, and high-performance web applications.
          Blending elegant UI design with powerful backend logic to deliver
          smooth and engaging user experiences.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          {/* Primary */}
          <a
            href="#projects"
            className="group relative px-10 py-4 rounded-2xl font-bold text-white
                       bg-gradient-to-r from-indigo-600 to-purple-600
                       overflow-hidden transition-all duration-300
                       hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore My Work
              <MousePointer2 size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                         -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out
                         skew-x-12" />
          </a>

          {/* Secondary */}
          <a
            href="#contact"
            className="px-10 py-4 rounded-2xl font-semibold text-slate-300
                       border border-white/10 hover:border-indigo-500/50
                       hover:bg-white/5 hover:text-white
                       transition-all duration-300 hover:scale-105"
          >
            Contact Me
          </a>
        </div>
      </div>

      {/* ================= SCROLL DOWN INDICATOR ================= */}
      <a
        href="#about"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors animate-fadeIn"
        style={{ animationDelay: '1s' }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="p-2 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-sm animate-bounce">
          <ArrowDown size={20} />
        </div>
      </a>

      {/* ================= SCROLL TO TOP ================= */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`
          fixed bottom-6 right-6 z-50
          p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600
          text-white shadow-xl shadow-indigo-500/20
          transition-all duration-500 ease-in-out
          hover:scale-110 hover:rotate-180
          ${showTop ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}
        `}
        aria-label="Back to top"
      >
        <ArrowUp size={24} />
        {/* Tooltip */}
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-white text-slate-900 text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Top
        </span>
      </button>

      {/* Custom Animations */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        @keyframes gradientShift {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(15deg); }
        }
        .animate-blink { animation: blink 1s step-end infinite; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; opacity: 0; }
        .animate-bounce { animation: bounce 2s infinite; }
        .animate-gradientShift { animation: gradientShift 5s ease infinite; }
      `}</style>
    </section>
  );
}
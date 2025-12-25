import { useState, useRef } from "react";

const SERVICES = [
  {
    title: "Frontend Development",
    desc: "I build modern, responsive, and visually appealing user interfaces using React, Vite, JavaScript, and advanced UI/UX practices.",
    icon: "🎨",
    btn: "Learn More",
    link: "https://react.dev/learn",
  },
  {
    title: "Backend Development",
    desc: "I develop secure and scalable backend systems using Node.js, Express, MongoDB, APIs, authentication, and server-side logic.",
    icon: "🖥️",
    btn: "Learn More",
    link: "https://nodejs.org/en/docs",
  },
  {
    title: "Ethical Hacking & Security",
    desc: "I perform penetration testing, vulnerability assessment, phishing simulation, and security research on Android & Windows.",
    icon: "🛡️",
    btn: "Learn More",
    link: "https://www.kali.org/docs/",
  },
  {
    title: "IoT Project Development",
    desc: "I build real-world IoT systems using Arduino, ESP-32, Raspberry Pi, sensors, automation, and cloud-based monitoring solutions.",
    icon: "📡",
    btn: "Learn More",
    link: "https://www.arduino.cc/en/Guide",
  },
];

/* ================= SUB COMPONENT: INTERACTIVE CARD ================= */
function ServiceCard({ item }) {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetPosition}
      className="group relative w-full h-full"
    >
      {/* 1. SPOTLIGHT GLOW (Follows Mouse) */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.15), transparent 40%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* 2. CARD BODY */}
      <div
        className={`
          relative h-full bg-gray-900/40 backdrop-blur-md
          border border-white/5 rounded-2xl p-8
          transition-all duration-500 ease-out
          ${isHovered ? "translate-y-[-8px] border-indigo-500/30 shadow-2xl shadow-indigo-500/10" : ""}
        `}
      >
        {/* 3. DECORATIVE BORDER GLOW (Top) */}
        <div
          className={`
            absolute top-0 left-0 right-0 h-[1px] 
            bg-gradient-to-r from-transparent via-indigo-500 to-transparent
            opacity-0 transition-opacity duration-500 blur-[1px]
            ${isHovered ? "opacity-100" : ""}
          `}
        />

        {/* 4. ICON WITH GLOW */}
        <div className="relative inline-flex mb-6">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
          <div
            className={`
              relative w-14 h-14 rounded-2xl bg-gray-800/80 border border-white/10
              flex items-center justify-center text-3xl
              shadow-inner transition-transform duration-500
              ${isHovered ? "scale-110 rotate-3 bg-indigo-600/20 border-indigo-500/50" : ""}
            `}
          >
            {item.icon}
          </div>
        </div>

        {/* 5. TEXT CONTENT */}
        <h3
          className={`
            text-xl font-bold mb-3 text-white transition-colors duration-300
            ${isHovered ? "text-indigo-200" : "text-slate-100"}
          `}
        >
          {item.title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed mb-8 h-20">
          {item.desc}
        </p>

        {/* 6. BUTTON */}
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
            transition-all duration-300
            ${isHovered 
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
              : "bg-white/5 text-slate-300 hover:bg-white/10"
            }
          `}
        >
          {item.btn}
          <span
            className={`
              transition-transform duration-300
              ${isHovered ? "translate-x-1" : "translate-x-0"}
            `}
          >
            →
          </span>
        </a>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section
      id="services"
      className="reveal py-24 px-6 bg-gradient-to-b from-gray-950 to-black text-white relative overflow-hidden"
    >
      {/* Background Mesh Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-6xl mx-auto text-center mb-20 relative z-10">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Services</span>
        </h2>
        <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full mb-4 shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
        <p className="text-slate-500 tracking-[0.3em] text-xs uppercase font-semibold">
          What I Provide
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 perspective-1000">
        {SERVICES.map((item, index) => (
          <div key={item.title} className="h-full">
            <ServiceCard item={item} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
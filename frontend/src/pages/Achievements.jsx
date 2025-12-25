import { useEffect, useRef } from "react";
import { Code, Cpu, Award, BookOpen, TrendingUp } from "lucide-react";

const ACHIEVEMENTS = [
  {
    icon: <Code size={32} />,
    label: "Projects Built",
    value: 18,
    note: "Web, IoT & academic projects",
  },
  {
    icon: <Cpu size={32} />,
    label: "Technologies Used",
    value: 12,
    note: "React, JS, Node, Firebase, Arduino, ESP32",
  },
  {
    icon: <Award size={32} />,
    label: "Certifications",
    value: 6,
    note: "Frontend, backend & CS fundamentals",
  },
  {
    icon: <BookOpen size={32} />,
    label: "Months of Coding",
    value: 36,
    note: "Consistent learning & hands-on practice",
  },
];

export default function Achievements() {
  const numberRefs = useRef([]);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          animateCounters();
        }
      },
      { threshold: 0.5 } // Trigger when 50% visible
    );

    numberRefs.current.forEach((ref) => ref && observer.observe(ref));

    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    if (animated.current) return;
    animated.current = true;

    numberRefs.current.forEach((el, index) => {
      if (!el) return;
      let start = 0;
      const end = ACHIEVEMENTS[index].value;
      const duration = 2000; // 2 seconds
      const stepTime = Math.abs(Math.floor(duration / end));
      
      const timer = setInterval(() => {
        start += 1;
        if (start >= end) {
          el.innerText = `${end}+`;
          clearInterval(timer);
        } else {
          el.innerText = `${start}`;
        }
      }, stepTime < 20 ? 20 : stepTime); // Cap speed
    });
  };

  return (
    <section
      id="achievements"
      className="reveal py-24 px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black text-white relative overflow-hidden"
    >
      
      {/* Background Dot Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />

      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-20 relative z-10">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Stats</span>
        </h2>
        <div className="h-1 w-24 bg-indigo-500 mx-auto rounded-full mb-4 shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
        <p className="text-slate-500 tracking-[0.3em] text-xs uppercase font-semibold">
          Milestones & Impact
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
        {ACHIEVEMENTS.map((item, i) => (
          <div
            key={item.label}
            className="group relative p-8 rounded-2xl
                       bg-white/5 backdrop-blur-md border border-white/5
                       transition-all duration-500 ease-out
                       hover:-translate-y-2 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10"
          >
            {/* Hover Gradient Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Icon Container */}
            <div className="relative mb-6 flex justify-center">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
              <div className="relative p-4 rounded-2xl bg-slate-900/50 border border-white/10 text-indigo-400 group-hover:text-white group-hover:border-indigo-500/50 group-hover:bg-indigo-600 transition-all duration-500">
                <div className="animate-floatIcon">
                  {item.icon}
                </div>
              </div>
            </div>

            {/* Counter */}
            <h3
              ref={(el) => (numberRefs.current[i] = el)}
              aria-live="polite"
              className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400"
            >
              0
            </h3>

            {/* Label */}
            <p className="text-white font-semibold mb-2">
              {item.label}
            </p>

            {/* Decorative Line */}
            <div className="h-1 w-10 bg-indigo-500/30 rounded-full mx-auto mb-4 group-hover:w-full group-hover:bg-indigo-500/50 transition-all duration-500"></div>

            {/* Note */}
            <p className="text-slate-400 text-xs leading-relaxed">
              {item.note}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-floatIcon {
          animation: floatIcon 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
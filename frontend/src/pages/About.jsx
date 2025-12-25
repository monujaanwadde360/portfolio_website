import { useState, useEffect, useRef } from "react";
import userimg from "../assets/userimg.jpg";

/* ================= PARTICLE IMAGE COMPONENT ================= */
function ParticleImage({ src, className }) {
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const mouseRef = useRef({ x: null, y: null });

  // Scan the image to create particles
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    
    const image = new Image();
    image.src = src;
    
    image.onload = () => {
      // Set canvas size to match image (scaled down slightly for performance)
      const width = 400; 
      const height = 500;
      canvas.width = width;
      canvas.height = height;

      // Draw image to get data
      ctx.drawImage(image, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      const newParticles = [];
      const gap = 4; // Skip every 4 pixels to optimize performance (smaller gap = more particles)

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];

          // Only create particles for visible, non-black pixels
          if (alpha > 128 && (r + g + b) > 100) {
            newParticles.push({
              x: Math.random() * width, // Start random (explode in)
              y: Math.random() * height,
              originX: x,               // Target position
              originY: y,
              color: `rgb(${r},${g},${b})`,
              size: Math.random() * 1.5 + 0.5, // Random size
            });
          }
        }
      }
      setParticles(newParticles);
    };
  }, [src]);

  // Handle Mouse Move
  useEffect(() => {
    const canvas = canvasRef.current;
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const mouse = mouseRef.current;
      const radius = 60; // Mouse repulsion radius

      particles.forEach((p) => {
        // Physics: Return to origin
        let dx = p.originX - p.x;
        let dy = p.originY - p.y;
        let distanceToOrigin = Math.sqrt(dx * dx + dy * dy);
        
        // Force to pull back
        let forceDirectionX = dx / distanceToOrigin;
        let forceDirectionY = dy / distanceToOrigin;
        let force = distanceToOrigin * 0.05; // Elasticity

        // Physics: Mouse Repulsion
        if (mouse.x !== null) {
          let dxMouse = mouse.x - p.x;
          let dyMouse = mouse.y - p.y;
          let distanceMouse = Math.sqrt(dxMouse*dxMouse + dyMouse*dyMouse);
          
          if (distanceMouse < radius) {
             const angle = Math.atan2(dyMouse, dxMouse);
             const moveForce = (radius - distanceMouse) / radius;
             const moveX = Math.cos(angle) * moveForce * 20; // Push strength
             const moveY = Math.sin(angle) * moveForce * 20;
             
             p.x -= moveX;
             p.y -= moveY;
          }
        }

        // Apply movement towards origin
        if (distanceToOrigin > 0) {
          p.x += forceDirectionX * force;
          p.y += forceDirectionY * force;
        }

        // Draw Particle
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [particles]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className} 
      // Scale the canvas visual size via CSS while keeping resolution constant
      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
    />
  );
}

export default function About() {
  const [tab, setTab] = useState("experience");

  const data = {
    experience: [
      { year: "2023 – 2025", title: "Web Development Projects", desc: "Built scalable React & Node.js applications." },
      { year: "2023 – 2025", title: "Ethical Hacking Research", desc: "Exploring cybersecurity vulnerabilities and fixes." },
      { year: "2022 – 2023", title: "Freelance Developer", desc: "Delivered UI/UX solutions for global clients." },
    ],
    education: [
      { year: "2021 – 2024", title: "B.Sc. Computer Science", desc: "Ramakrishna Mission Vidyamandira, Belur Math." },
      { year: "2024 – Present", title: "M.Sc. Computer Science", desc: "RKM Residential College, Narendrapur." },
      { year: "2019 – 2021", title: "Higher Secondary", desc: "Ramakrishna Mission Vivekananda Vidyapeeth." },
    ],
  };

  return (
    <section
      id="about"
      className="reveal py-24 px-6 bg-gradient-to-b from-black via-slate-950 to-gray-950 text-white overflow-hidden relative"
    >
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-20 relative z-10">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Me</span>
        </h2>
        <div className="h-1 w-24 bg-indigo-500 mx-auto rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
        <p className="mt-4 text-slate-500 tracking-[0.3em] text-xs uppercase font-semibold">
          Who I Am
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-start relative z-10">

        {/* ================= LEFT – PARTICLE IMAGE ================= */}
        <div className="flex justify-center md:sticky md:top-28 h-fit">
          <div className="relative w-full max-w-sm group perspective-1000">
            
           
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 z-0"></div>

            {/* === THE PARTICLE CANVAS === */}
            <div className="relative w-full aspect-[4/5] rounded-3xl shadow-2xl shadow-indigo-900/30 border border-white/10 overflow-hidden z-10 animate-float">
               <ParticleImage src={userimg} className="w-full h-full block" />
            </div>
          </div>
        </div>

        {/* ================= RIGHT – TEXT ================= */}
        <div className="space-y-8">
          <h3 className="text-3xl md:text-4xl font-bold leading-tight">
            I'm{" "}
            <span className="text-indigo-400">Monujaan Wadde</span>, a
            Developer &{" "}
            <span className="text-purple-400">Creative Coder</span>
          </h3>

          <p className="text-slate-400 leading-relaxed text-lg">
            I’m a computer science enthusiast passionate about building modern
            web applications, exploring ethical hacking, and experimenting with
            IoT systems.
          </p>

          <div className="space-y-6">
             <p className="text-slate-400 leading-relaxed flex gap-4 items-start">
                <span className="text-indigo-500 text-xl">✦</span>
                <span>
                  I completed my schooling from <strong className="text-white">Ramakrishna Mission Vivekananda Vidyapeeth</strong> and earned my <strong className="text-white">B.Sc. in Computer Science</strong> from <strong className="text-white">Ramakrishna Mission Vidyamandira, Belur Math</strong>.
                </span>
             </p>
             <p className="text-slate-400 leading-relaxed flex gap-4 items-start">
                <span className="text-purple-500 text-xl">✦</span>
                <span>
                  Currently pursuing <strong className="text-white">M.Sc. Computer Science</strong> at <strong className="text-white">RKM Residential College, Narendrapur</strong>.
                </span>
             </p>
          </div>

          {/* TABS */}
          <div className="relative bg-slate-900/50 p-1.5 rounded-xl inline-flex border border-white/5 backdrop-blur-sm">
            {["experience", "education"].map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`
                  relative px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300
                  ${tab === item 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"}
                `}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          {/* TIMELINE */}
          <div className="relative pl-4 space-y-8">
             <div className="absolute left-[21px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-transparent"></div>

            {data[tab].map((item, i) => (
              <TimelineItem 
                key={i} 
                year={item.year} 
                title={item.title} 
                desc={item.desc}
                delay={i * 100} 
              />
            ))}
          </div>

          {/* CV BUTTON */}
          <a
            href="/cv.pdf"
            download
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl
                       bg-gradient-to-r from-indigo-600 to-purple-600
                       text-white font-semibold transition-all
                       hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]
                       border border-white/10"
          >
            <span>Download CV</span>
            <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </a>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-slideIn { animation: slideInRight 0.5s ease-out forwards; opacity: 0; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
      `}</style>
    </section>
  );
}

function TimelineItem({ year, title, desc, delay }) {
  return (
    <div 
      className="relative pl-8 group cursor-default animate-slideIn" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full bg-slate-900 border-2 border-indigo-500 group-hover:scale-125 group-hover:bg-indigo-500 transition-all duration-300 z-10 shadow-[0_0_10px_rgba(99,102,241,0.3)]" />
      
      <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 w-24 shrink-0">
          {year}
        </span>
        <h4 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
          {title}
        </h4>
      </div>
      
      <p className="text-sm text-slate-400 ml-0 md:ml-24 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
        {desc}
      </p>
    </div>
  );
}
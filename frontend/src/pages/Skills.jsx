import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaPhp,
  FaDatabase,
  FaPython,
  FaJava,
  FaLinux,
  FaGitAlt,
  FaShieldAlt,
  FaPalette,
  FaTerminal,
} from "react-icons/fa";

const SKILL_GROUPS = [
  {
    title: "Frontend Development",
    skills: [
      {
        name: "HTML",
        level: "Advanced",
        link: "https://developer.mozilla.org/en-US/docs/Web/HTML",
        icon: <FaHtml5 />,
        preview: "Markup language for structuring web pages",
      },
      {
        name: "CSS",
        level: "Advanced",
        link: "https://developer.mozilla.org/en-US/docs/Web/CSS",
        icon: <FaCss3Alt />,
        preview: "Styling, layouts, animations & responsive design",
      },
      {
        name: "JavaScript",
        level: "Intermediate",
        link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        icon: <FaJs />,
        preview: "Logic, DOM manipulation & async programming",
      },
      {
        name: "React",
        level: "Intermediate",
        link: "https://react.dev",
        icon: <FaReact />,
        preview: "Component-based UI & state management",
      },
    ],
  },
  {
    title: "Backend & Databases",
    skills: [
      {
        name: "Node.js",
        level: "Intermediate",
        link: "https://nodejs.org/en/docs",
        icon: <FaNodeJs />,
        preview: "JavaScript runtime for backend development",
      },
      {
        name: "PHP",
        level: "Intermediate",
        link: "https://www.php.net/docs.php",
        icon: <FaPhp />,
        preview: "Server-side scripting language",
      },
      {
        name: "SQL / MySQL",
        level: "Intermediate",
        link: "https://dev.mysql.com/doc/",
        icon: <FaDatabase />,
        preview: "Relational database design & queries",
      },
    ],
  },
  {
    title: "Programming Languages",
    skills: [
      {
        name: "Python",
        level: "Intermediate",
        link: "https://docs.python.org/3/",
        icon: <FaPython />,
        preview: "Scripting, automation & problem solving",
      },
      {
        name: "Java",
        level: "Intermediate",
        link: "https://docs.oracle.com/en/java/",
        icon: <FaJava />,
        preview: "OOP concepts & academic projects",
      },
      {
        name: "Shell Scripting",
        level: "Basic",
        link: "https://www.gnu.org/software/bash/manual/",
        icon: <FaTerminal />,
        preview: "Automation & command-line utilities",
      },
    ],
  },
  {
    title: "Tools, Platforms & Security",
    skills: [
      {
        name: "Git & GitHub",
        level: "Intermediate",
        link: "https://docs.github.com/",
        icon: <FaGitAlt />,
        preview: "Version control & collaboration",
      },
      {
        name: "Linux",
        level: "Intermediate",
        link: "https://www.kernel.org/doc/html/latest/",
        icon: <FaLinux />,
        preview: "Linux OS, CLI tools & environment",
      },
      {
        name: "Cyber Security Fundamentals",
        level: "Basic",
        link: "https://owasp.org/www-project-top-ten/",
        icon: <FaShieldAlt />,
        preview: "Security basics & OWASP Top 10",
      },
      {
        name: "Graphics & Design Basics",
        level: "Basic",
        link: "https://www.adobe.com/creativecloud/design/discover.html",
        icon: <FaPalette />,
        preview: "UI visuals & basic design principles",
      },
    ],
  },
];

/* ================= SUB COMPONENT: SKILL ROW ================= */
function SkillRow({ skill, colorClass }) {
  return (
    <li className="group relative py-3">
      <div className="flex items-center justify-between">
        
        {/* Left: Icon & Link */}
        <a
          href={skill.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 flex-1 group/link"
        >
          {/* Icon Container */}
          <div className={`
             relative p-2.5 rounded-xl border border-white/5
             bg-white/5 backdrop-blur-sm
             transition-all duration-300
             group-hover/link:scale-110 group-hover/link:border-indigo-500/30
             group-hover/link:shadow-[0_0_15px_rgba(99,102,241,0.2)]
             ${colorClass}
          `}>
            <span className="text-xl relative z-10 animate-floatSlow">
              {skill.icon}
            </span>
          </div>

          {/* Name */}
          <div className="flex flex-col">
            <span className="text-base font-semibold text-slate-200 group-hover/link:text-white transition-colors">
              {skill.name}
            </span>
          </div>
        </a>

        {/* Right: Proficiency Badge */}
        <span className={`
           text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border
           transition-all duration-300
           ${skill.level === "Advanced"
             ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10 group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.3)]"
             : skill.level === "Intermediate"
             ? "text-blue-400 border-blue-500/20 bg-blue-500/10 group-hover:bg-blue-500/20 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
             : "text-purple-400 border-purple-500/20 bg-purple-500/10 group-hover:bg-purple-500/20 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
           }
        `}>
          {skill.level}
        </span>
      </div>

      {/* === INTERACTIVE TOOLTIP === */}
      <div
        className="
          absolute left-1/2 -translate-x-1/2 -top-14
          opacity-0 translate-y-2 scale-95 pointer-events-none
          group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
          transition-all duration-300 ease-out z-20 w-64
        "
      >
        {/* Tooltip Content */}
        <div className="relative bg-slate-900/95 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-xl shadow-2xl shadow-black/50">
           <div className="flex items-center gap-2 text-slate-300 text-xs leading-relaxed">
             <span className="text-indigo-400">•</span>
             {skill.preview}
           </div>
           
           {/* Little Arrow */}
           <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-b border-r border-white/10 rotate-45"></div>
        </div>
      </div>
    </li>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="reveal py-24 px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black text-white relative overflow-hidden"
    >
      
      {/* Background Dot Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-20 relative z-10">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
          Tech <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Stack</span>
        </h2>
        <div className="h-1 w-24 bg-indigo-500 mx-auto rounded-full mb-4 shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
        <p className="text-slate-500 tracking-[0.3em] text-xs uppercase font-semibold">
          Technologies & Tools
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 relative z-10">
        {SKILL_GROUPS.map((group) => (
          <div
            key={group.title}
            className="
              group/category bg-gray-900/40 backdrop-blur-md
              border border-white/5 rounded-2xl p-8
              transition-all duration-500 ease-out
              hover:-translate-y-2 hover:border-indigo-500/20
              hover:shadow-2xl hover:shadow-black/40
            "
          >
            {/* Category Title with Line */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                {group.title}
              </h3>
              <span className="text-xs font-mono text-slate-500">0{group.skills.length}</span>
            </div>

            {/* List */}
            <ul className="space-y-1">
              {group.skills.map((skill) => (
                <SkillRow 
                  key={skill.name} 
                  skill={skill} 
                  colorClass={skill.level === "Advanced" ? "text-emerald-400" : skill.level === "Intermediate" ? "text-blue-400" : "text-purple-400"}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-floatSlow {
          animation: floatSlow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
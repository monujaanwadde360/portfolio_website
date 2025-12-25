import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

import heading from "../assets/heading.jpg";

const CATEGORIES = ["All", "Development", "Web Development", "Full Stack Development"];

const PROJECTS = [
  {
    title: "Electronic Device Control Using ESP-32",
    desc: "Design and Implementation of an Electronic Device Control System Using ESP-32 and Android Application. Features real-time control and status monitoring.",
    img: heading,
    category: "Development",
    link: "https://github.com/your-project",
  },
  {
    title: "Portfolio Website (HTML/CSS/JS)",
    desc: "A full-stack portfolio website developed using HTML, CSS, and JavaScript with XAMPP and MySQL. Features include OTP-based authentication, real-time form validation, secure login & registration.",
    img: heading,
    category: "Web Development",
    link: "https://monujaan.kesug.com/",
  },
  {
    title: "Portfolio Website (MERN Stack)",
    desc: "A modern MERN-stack portfolio application built with React.js, Node.js, MongoDB Atlas, and Express. Includes JWT security, protected routes, and a responsive modern UI.",
    img: heading,
    category: "Full Stack Development",
    link: "https://github.com/your-project",
  },
];

export default function Projects() {
  const [active, setActive] = useState("All");
  const [modalData, setModalData] = useState(null);

  const filtered =
    active === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === active);

  return (
    <>
      {/* ================= PROJECTS SECTION ================= */}
      <section
        id="projects"
        className="reveal py-24 px-6 bg-gradient-to-b from-slate-950 to-black text-white relative overflow-hidden"
      >
        
        {/* Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="max-w-6xl mx-auto text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Projects</span>
          </h2>
          <div className="h-1 w-24 bg-indigo-500 mx-auto rounded-full mb-4 shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
          <p className="text-slate-500 tracking-[0.3em] text-xs uppercase font-semibold">
            What I Built
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-16 flex-wrap relative z-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`
                relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
                ${active === cat 
                  ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] scale-105" 
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/10"}
              `}
            >
              {cat}
              {/* Active Dot Indicator */}
              {active === cat && (
                <span className="absolute inset-0 rounded-full border border-white/20 animate-pulse"></span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="max-w-6xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10"
        >
          <AnimatePresence>
            {filtered.map((p, i) => (
              <motion.div
                layout
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                onClick={() => setModalData(p)}
                className="group relative h-full cursor-pointer"
              >
                {/* Card Container */}
                <div className="
                  relative h-full rounded-2xl overflow-hidden
                  bg-slate-900/40 backdrop-blur-md
                  border border-white/5
                  hover:border-indigo-500/50
                  transition-all duration-300
                  hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10
                ">
                  
                  {/* Image Area */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="
                        w-full h-full object-cover
                        transition-transform duration-700 ease-in-out
                        group-hover:scale-110
                      "
                    />
                    
                    {/* Overlay on Hover */}
                    <div className="
                      absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-300
                      flex flex-col justify-end p-6
                    ">
                       <span className="text-indigo-400 text-sm font-medium mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                          {p.category}
                       </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-300 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {p.desc}
                    </p>
                    
                    {/* Arrow Indicator */}
                    <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                      View Details <span>→</span>
                    </div>
                  </div>
                  
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ================= PROJECT MODAL ================= */}
      <AnimatePresence>
        {modalData && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalData(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="
                bg-slate-900 border border-white/10 rounded-2xl
                w-full max-w-3xl max-h-[90vh] overflow-y-auto
                shadow-2xl relative flex flex-col md:flex-row
              "
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Modal Image */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <img
                  src={modalData.img}
                  alt={modalData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-indigo-600/10 mix-blend-overlay"></div>
              </div>

              {/* Modal Content */}
              <div className="w-full md:w-1/2 p-8 flex flex-col">
                <div className="mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                    {modalData.category}
                  </span>
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">
                  {modalData.title}
                </h2>

                <p className="text-slate-400 leading-relaxed mb-8 flex-grow">
                  {modalData.desc}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <a
                    href={modalData.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-600/20"
                  >
                    <FaExternalLinkAlt size={16} />
                    View Live Project
                  </a>
                  
                  <button
                    onClick={() => setModalData(null)}
                    className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Close Button Top Right */}
              <button
                onClick={() => setModalData(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/80 text-white rounded-full transition-colors z-10"
                aria-label="Close Modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
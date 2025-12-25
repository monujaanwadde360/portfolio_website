import { useState, useEffect } from "react";
import { Award, X, Download } from "lucide-react";

import project from "../assets/project.jpg";
import computer from "../assets/computer.jpg";
import science from "../assets/science.jpg";

export default function Certifications() {
  const certs = [
    { title: "Electronic Device Control Using ESP-32", img: project, id: 1 },
    { title: "Computer Operator - Basic", img: computer, id: 2 },
    { title: "DST INSPIRE Internship Science Camp", img: science, id: 3 },
  ];

  const [index, setIndex] = useState(0);
  const [openCert, setOpenCert] = useState(null);

  /* AUTO SLIDE */
  useEffect(() => {
    const t = setInterval(() => {
      setIndex((p) => (p + 1) % certs.length);
    }, 4000);
    return () => clearInterval(t);
  }, [certs.length]);

  return (
    <>
      <section
        id="certifications"
        className="reveal py-24 px-6 bg-gradient-to-b from-slate-950 to-black text-white relative overflow-hidden"
      >
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* HEADER */}
        <div className="max-w-6xl mx-auto text-center mb-20 relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">Certifications</span>
          </h2>
          <div className="h-1 w-24 bg-amber-500 mx-auto rounded-full mb-4 shadow-[0_0_15px_rgba(245,158,11,0.6)]"></div>
          <p className="text-slate-500 tracking-[0.3em] text-xs uppercase font-semibold">
            Achievements & Awards
          </p>
        </div>

        {/* ================= 3D CAROUSEL ================= */}
        <div className="relative w-full h-[450px] md:h-[500px] flex items-center justify-center perspective-1000">
          {certs.map((c, i) => {
            const isCenter = i === index;
            // Logic to determine left and right neighbor
            const isRight = i === (index + 1) % certs.length;
            const isLeft = i === (index - 1 + certs.length) % certs.length;

            let classes = "absolute transition-all duration-700 ease-out w-[300px] md:w-[400px]";

            if (isCenter) {
              classes += " z-20 scale-100 opacity-100 translate-x-0";
            } else if (isRight) {
              classes += " z-10 scale-90 opacity-40 translate-x-[110%] md:translate-x-[60%] blur-sm cursor-pointer hover:opacity-60 hover:scale-95 hover:z-20";
            } else if (isLeft) {
              classes += " z-10 scale-90 opacity-40 -translate-x-[110%] md:-translate-x-[60%] blur-sm cursor-pointer hover:opacity-60 hover:scale-95 hover:z-20";
            } else {
              classes += " z-0 scale-75 opacity-0 translate-x-0 pointer-events-none";
            }

            return (
              <div
                key={i}
                onClick={() => !isCenter && setIndex(i)}
                className={`${classes} group`}
              >
                {/* CARD WRAPPER */}
                <div className={`
                  relative w-full h-full rounded-2xl overflow-hidden border
                  transition-all duration-300
                  ${isCenter 
                    ? "bg-white border-amber-200 shadow-[0_20px_50px_rgba(245,158,11,0.2)] animate-floatCard" 
                    : "bg-slate-800 border-slate-700 shadow-2xl"}
                `}>
                  
                  {/* IMAGE */}
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img
                      src={c.img}
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Shine effect on active card */}
                    {isCenter && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shine"></div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 relative bg-slate-900 text-center">
                    {isCenter && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-2 bg-amber-500 rounded-full shadow-lg shadow-amber-500/40 text-white animate-bounce">
                        <Award size={20} />
                      </div>
                    )}
                    
                    <h3 className={`font-bold mb-2 ${isCenter ? "text-amber-100 text-xl" : "text-slate-300 text-lg"}`}>
                      {c.title}
                    </h3>

                    {isCenter && (
                      <button
                        onClick={() => setOpenCert(c)}
                        className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white text-sm font-semibold shadow-lg transition-all hover:scale-105 flex items-center gap-2 mx-auto w-fit"
                      >
                        <span>View Full</span>
                        <Download size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= PREMIUM FRAME MODAL ================= */}
      {openCert && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center px-4 py-8 animate-fadeIn"
          onClick={() => setOpenCert(null)}
        >
          <div 
            className="relative max-w-4xl w-full flex flex-col items-center animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* FRAME DECORATION */}
            <div className="
              w-full bg-[#1a1818] border-4 md:border-8 border-[#2a2420] shadow-2xl
              relative group
            ">
              
              {/* Corner Accents (Gold) */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-500"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-500"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-500"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-500"></div>

              {/* CERTIFICATE IMAGE */}
              <div className="bg-white p-2 md:p-6">
                <img
                  src={openCert.img}
                  alt="Certificate"
                  className="w-full max-h-[70vh] object-contain"
                />
              </div>
            </div>

            {/* TITLE & ACTION */}
            <div className="mt-6 text-center">
              <h3 className="text-xl md:text-2xl text-amber-400 font-bold mb-2">{openCert.title}</h3>
              <button
                onClick={() => setOpenCert(null)}
                className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 text-white transition-colors"
              >
                Close
              </button>
            </div>

            {/* CLOSE BUTTON (Absolute) */}
            <button
              onClick={() => setOpenCert(null)}
              className="absolute -top-4 -right-4 md:top-0 md:-right-12 p-3 bg-slate-800 hover:bg-red-600 rounded-full text-white border border-white/10 shadow-lg transition-all"
              aria-label="Close Modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* CUSTOM ANIMATIONS */}
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shine {
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-floatCard { animation: floatCard 6s ease-in-out infinite; }
        .animate-shine { animation: shine 3s infinite linear; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </>
  );
}
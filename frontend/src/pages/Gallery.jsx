import { useState, useEffect } from "react";
import me1 from "../assets/me1.jpg";
import me2 from "../assets/me2.jpg";
import me3 from "../assets/me4.jpg";
import me4 from "../assets/me5.jpg";
import me5 from "../assets/me3.jpg";
import me6 from "../assets/me6.jpg";
import me7 from "../assets/me7.jpg";
import me8 from "../assets/me8.jpg";

// Helper for icons
const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);
const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);
const Expand = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m4.5 0L15 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v4.5m0-4.5L15 15" />
  </svg>
);

export default function Gallery() {
  const images = [me1, me2, me3, me4, me5, me6, me7, me8];

  const [index, setIndex] = useState(0);
  const [preview, setPreview] = useState(null);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (preview) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length, preview]);

  /* ================= ESC KEY ================= */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <section
      id="gallery"
      className="reveal py-24 px-6 bg-gradient-to-b from-slate-950 to-black text-white overflow-hidden relative"
    >
      {/* ================= HEADER ================= */}
      <div className="max-w-6xl mx-auto text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
          Photo <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Gallery</span>
        </h2>
        <div className="h-1 w-24 bg-indigo-500 mx-auto rounded-full mb-4 shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
        <p className="text-slate-500 tracking-[0.3em] text-xs uppercase font-semibold">
          Captured Moments
        </p>
      </div>

      {/* ================= MAIN SLIDER ================= */}
      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        
        {/* --- Slider Window --- */}
        <div className="relative group rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/20 border border-white/10 bg-black aspect-[16/9] md:aspect-[16/9] lg:aspect-[16/9]">
          
          {/* Dark Background for object-contain to fill gaps smoothly */}
          <div className="absolute inset-0 bg-slate-900 z-0"></div>
          
          {/* Slide Track */}
          <div
            className="relative z-10 flex h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {images.map((src, i) => (
              <div key={i} className="min-w-full h-full relative">
                {/* CHANGE: object-contain ensures no cutting of images */}
                {/* Added bg-slate-900 just in case container is slightly larger */}
                <img
                  src={src}
                  alt={`Gallery image ${i + 1}`}
                  className="
                    w-full h-full 
                    object-contain
                    cursor-zoom-in
                    transition-transform duration-700
                    group-hover:scale-105
                  "
                  onClick={() => setPreview(src)}
                />
                
                {/* Subtle gradient overlay for text visibility if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                {/* Index Badge */}
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono font-semibold text-white/80 pointer-events-none">
                  {String(i + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>

          {/* --- PROGRESS BAR (Top) --- */}
          {/* Key prop forces animation reset on index change */}
          <div
            key={index}
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 animate-progress shadow-[0_0_10px_rgba(99,102,241,0.8)] z-20"
          />

          {/* --- NAV CONTROLS --- */}
          {/* Previous */}
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-600 hover:border-indigo-600 -translate-x-2 group-hover:translate-x-0 z-30"
          >
            <ChevronLeft />
          </button>

          {/* Next */}
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-600 hover:border-indigo-600 translate-x-2 group-hover:translate-x-0 z-30"
          >
            <ChevronRight />
          </button>

          {/* Expand Button */}
          <button
            onClick={() => setPreview(images[index])}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all duration-300 z-30"
            aria-label="Open Lightbox"
          >
             <Expand />
          </button>
        </div>

        {/* --- THUMBNAIL STRIP --- */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`
                relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-300
                ${index === i 
                  ? "border-indigo-500 scale-105 shadow-lg shadow-indigo-500/20" 
                  : "border-transparent opacity-50 hover:opacity-100 hover:border-white/10"}
              `}
            >
              {/* CHANGE: object-contain for thumbnails too */}
              <img
                src={src}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-contain"
              />
              {index === i && (
                <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none"></div>
              )}
            </button>
          ))}
        </div>

      </div>

      {/* ================= LIGHTBOX MODAL ================= */}
      {preview && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fadeIn"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={preview}
              alt="Full Preview"
              onClick={(e) => e.stopPropagation()} // Prevent close on image click
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl hover:scale-[1.02] transition-transform duration-500"
            />
            
            {/* Close Button */}
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-12 right-0 md:top-0 md:-right-12 flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 hover:bg-red-600 text-white border border-white/20 hover:border-red-500 transition-all duration-300 shadow-lg"
              aria-label="Close Lightbox"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-progress {
          animation: progress 4s linear forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
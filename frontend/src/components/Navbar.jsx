import { useState, useEffect } from "react";
import { isAuthenticated } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ArrowRight } from "lucide-react"; // Using Lucide for better icons
import logo from "../assets/logo.ico";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  if (!isAuthenticated()) return null;

  const links = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Services", id: "services" },
    { name: "Skills", id: "skills" },
    { name: "Gallery", id: "gallery" },
    { name: "Projects", id: "projects" },
    { name: "Achievements", id: "achievements" },
    { name: "Certifications", id: "certifications" },
    { name: "Contact", id: "contact" },
  ];

  const logout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= HANDLE LINK CLICK ================= */
  const handleLinkClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      setOpen(false); // Close mobile menu
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled 
            ? "py-3 bg-slate-900/90 backdrop-blur-xl border-white/10 shadow-xl shadow-black/20" 
            : "py-6 bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

          {/* ================= LOGO ================= */}
          <div
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate("/portfolio");
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={logo}
                alt="Logo"
                className="w-9 h-9 rounded-full object-cover border border-white/10 group-hover:border-indigo-400 transition-all duration-300"
              />
              {/* Logo Hover Glow */}
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-indigo-100 transition-colors">
              Monu<span className="text-indigo-500">jaan</span>
            </span>
          </div>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleLinkClick(e, link.id)}
                className="relative px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-all duration-300 group"
              >
                {link.name}
                
                {/* Hover Pill Background */}
                <span className="absolute inset-0 rounded-lg bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                
                {/* Hover Dot Indicator */}
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
              </a>
            ))}

            {/* Desktop Logout Button */}
            <button
              onClick={logout}
              className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 transition-all duration-300 text-sm font-medium"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* ================= MOBILE TOGGLE ================= */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2.5 rounded-xl hover:bg-white/10 text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* ================= MOBILE FULLSCREEN DRAWER ================= */
      <div
        className={`fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-xl flex flex-col justify-center items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-y-0" : "-translate-y-full pointer-events-none"
        }`}
      >
        {/* Drawer Header (Close Button) */}
        <div className="flex justify-between items-center px-6 py-6 border-b border-white/10 w-full">
          <span className="text-xl font-bold text-white">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
        </div>

        {/* Drawer Links List */}
        <div className="h-full overflow-y-auto px-6 py-8 flex flex-col gap-2">
          {links.map((link, i) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                handleLinkClick(e, link.id);
              }}
              className="block w-full text-left px-6 py-4 rounded-2xl text-lg text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-200 group"
              style={{ 
                // Staggered animation on open
                animation: `slideInRight 0.3s ease-out forwards`,
                animationDelay: `${i * 50}ms`,
                opacity: open ? 1 : 0,
                transform: open ? 'translateX(0)' : 'translateX(20px)'
              }}
            >
              <span className="relative z-10 font-medium">{link.name}</span>
              
              {/* Hover Arrow */}
              <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-indigo-400">
                 <ArrowRight size={20} />
              </span>
            </a>
          ))}

          {/* Mobile Logout Area */}
          <div 
            className="mt-8 pt-8 border-t border-white/10 animate-slideInRight w-full"
            style={{ animationDelay: `${links.length * 50}ms`, opacity: open ? 1 : 0, transform: open ? 'translateX(0)' : 'translateX(20px)' }}
          >
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 transition-colors duration-300"
            >
              <LogOut size={20} />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </div>
}
      {/* Custom Animations */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
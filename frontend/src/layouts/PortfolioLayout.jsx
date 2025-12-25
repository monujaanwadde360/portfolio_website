
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Skills from "../pages/Skills";
import Gallery from "../pages/Gallery";
import Projects from "../pages/Projects";
import Achievements from "../pages/Achievements";
import Certifications from "../pages/Certifications";
import Contact from "../pages/Contact";

export default function PortfolioLayout() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen overflow-x-hidden">
      <Navbar />

      <main className="pt-24">
        <Home />
        <About />
        <Services />
        <Skills />
        <Gallery />
        <Projects />
        <Achievements />
        <Certifications />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

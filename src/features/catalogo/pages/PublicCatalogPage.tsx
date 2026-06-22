import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { HeroSection } from "../components/HeroSection";
import { BlogSection } from "../components/BlogSection";
import { AppPromoSection } from "../components/AppPromoSection";
import { PlansSection } from "../components/PlansSection";

export function PublicCatalogPage() {
  const navigate = useNavigate();

  const handleScrollToPlanes = () => {
    const element = document.getElementById("planes");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans selection:bg-black selection:text-white flex flex-col">
      {/* Dynamic Font Import for Serif Style */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Inter:wght@200;300;400;500;600;700&display=swap');
        .font-serif-elegant {
          font-family: 'Cormorant Garamond', serif;
        }
        .font-sans-clean {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Top Navbar */}
      <header className="w-full border-b border-black/10 sticky top-0 z-30 bg-[#fafafa]/90 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <span 
            onClick={() => navigate("/")}
            className="text-2xl font-serif-elegant tracking-[0.25em] uppercase font-bold cursor-pointer hover:opacity-75 transition-opacity"
          >
            THEONE
          </span>
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-sans-clean font-bold tracking-[0.2em] uppercase">
            <a href="#blog" className="hover:text-black/50 transition-colors">Blog Olfativo</a>
            <a href="#app" className="hover:text-black/50 transition-colors">La Aplicación</a>
            <a href="#planes" className="hover:text-black/50 transition-colors">Adquirir Plan</a>
          </nav>
          <div></div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection onExplorePlanes={handleScrollToPlanes} />

      {/* Blog Section */}
      <BlogSection />

      {/* App Presentation Section */}
      <AppPromoSection />

      {/* Subscription Plans Section (Now with exactly ONE plan) */}
      <PlansSection />

      {/* Footer */}
      <footer className="w-full bg-black text-white/50 py-16 mt-auto border-t border-white/10 font-sans-clean">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-light">
          <div className="space-y-4">
            <span className="text-white text-lg font-serif-elegant tracking-widest uppercase font-bold">THEONE</span>
            <p className="text-white/40 leading-relaxed pr-6">
              El primer club privado de perfumería de nicho en Latinoamérica. Diseñando sensaciones y curando momentos memorables a través del olfato.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-white font-bold tracking-wider uppercase mb-2">EXPLORAR</h4>
            <a href="#blog" className="block hover:text-white transition-colors">Blog Olfativo</a>
            <a href="#app" className="block hover:text-white transition-colors">Aplicación Móvil</a>
            <a href="#planes" className="block hover:text-white transition-colors">Planes del Club</a>
          </div>
          <div className="space-y-2">
            <h4 className="text-white font-bold tracking-wider uppercase mb-2">SOPORTE</h4>
            <p>Email: members@theone.com</p>
            <p>Tel: +52 55 9012 3456</p>
            <p>© 2026 TheOne Club. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

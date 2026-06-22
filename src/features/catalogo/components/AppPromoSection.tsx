import { Smartphone, BookOpen } from "lucide-react";

export function AppPromoSection() {
  return (
    <section id="app" className="w-full max-w-[1200px] mx-auto px-6 py-20 border-b border-black/5 flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1 space-y-6">
        <span className="text-[10px] font-sans-clean font-bold tracking-[0.25em] uppercase text-black/40">TheOne Mobile Experience</span>
        <h2 className="text-3xl md:text-5xl font-serif-elegant font-bold tracking-tight text-black">
          Lleva tu colección <br />
          <span className="italic">a todas partes</span>
        </h2>
        <p className="text-base font-serif-elegant font-light text-black/60 leading-relaxed">
          Nuestra aplicación móvil está diseñada para ofrecer una experiencia íntima de descubrimiento. Escanea tus frascos favoritos, guarda tu diario personal de sensaciones olfativas, y recibe notificaciones cuando tu próximo decant del plan de suscripción esté en camino.
        </p>
        <div className="grid grid-cols-2 gap-6 pt-4">
          <div className="space-y-1">
            <div className="w-10 h-10 bg-black/5 flex items-center justify-center text-black mb-2">
              <Smartphone size={20} />
            </div>
            <h4 className="text-sm font-sans-clean font-bold uppercase tracking-wider">Interfaz Elegante</h4>
            <p className="text-xs font-sans-clean font-light text-black/50">Diseño minimalista optimizado para pantallas OLED oscuras.</p>
          </div>
          <div className="space-y-1">
            <div className="w-10 h-10 bg-black/5 flex items-center justify-center text-black mb-2">
              <BookOpen size={20} />
            </div>
            <h4 className="text-sm font-sans-clean font-bold uppercase tracking-wider">Biblioteca Olfativa</h4>
            <p className="text-xs font-sans-clean font-light text-black/50">Más de 500 ingredientes catalogados detalladamente.</p>
          </div>
        </div>
      </div>

      {/* Minimal App Mockup Graphics */}
      <div className="flex-1 flex justify-center items-center">
        <div className="relative w-72 h-[550px] bg-black rounded-[2.5rem] p-3 shadow-2xl border-4 border-black/20 flex flex-col overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20 flex items-center justify-center">
            <div className="w-12 h-1 bg-white/20 rounded-full"></div>
          </div>
          
          {/* Mock Screen Content */}
          <div className="flex-1 bg-[#121212] text-white rounded-[2rem] p-6 pt-10 flex flex-col justify-between relative overflow-hidden font-sans-clean">
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] tracking-[0.2em] text-white/40 uppercase">
                <span>THEONE APP</span>
                <span>10:42 PM</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-[#D4AF37]">EDICIÓN LIMITADA</span>
                <h3 className="text-2xl font-serif-elegant font-light tracking-wide text-white">Santal 33</h3>
                <p className="text-xs text-white/50">Le Labo • EDP</p>
              </div>
              {/* Visual Graphic representation of a perfume notes wheel */}
              <div className="w-full aspect-square border border-white/5 rounded-full flex items-center justify-center p-4">
                <div className="w-full h-full border border-dashed border-white/10 rounded-full flex items-center justify-center p-4 animate-spin" style={{ animationDuration: '30s' }}>
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full absolute top-0"></div>
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full absolute bottom-4 left-4"></div>
                </div>
                <div className="absolute text-center space-y-1">
                  <span className="text-[10px] tracking-widest text-white/30 block uppercase">ACORDE</span>
                  <span className="text-xs font-bold text-white tracking-wider uppercase">Amaderado</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-0.5 bg-white/10 w-full"></div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-white/30 block uppercase tracking-wider">PRÓXIMO ENVÍO</span>
                  <span className="text-xs font-semibold text-white">Julio 10, 2026</span>
                </div>
                <span className="text-[10px] font-bold text-[#D4AF37] tracking-wider uppercase">ENTREGADO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

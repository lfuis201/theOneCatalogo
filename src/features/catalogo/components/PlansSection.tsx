import { useNavigate } from "react-router-dom";
import { Button, Card } from "@heroui/react";
import { Check, Sparkles } from "lucide-react";

export function PlansSection() {
  const navigate = useNavigate();

  return (
    <section id="planes" className="w-full max-w-[1200px] mx-auto px-6 py-20 flex flex-col items-center">
      <div className="text-center space-y-3 mb-16">
        <span className="text-[10px] font-sans-clean font-bold tracking-[0.25em] uppercase text-black/40">Membresía & Licencia Digital</span>
        <h2 className="text-4xl md:text-6xl font-serif-elegant font-bold tracking-tight text-black">Comienza tu Experiencia</h2>
        <p className="text-sm font-sans-clean font-light text-black/50 max-w-md mx-auto">
          Prueba todas las funcionalidades por 7 días gratis o adquiere una licencia profesional.
        </p>
      </div>

      {/* 7 Days Trial Banner Box */}
      <div className="w-full max-w-3xl mb-10 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-emerald-900 via-zinc-900 to-black text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-emerald-500/30">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-sans-clean font-bold tracking-widest uppercase border border-emerald-500/30">
            <Sparkles size={12} /> Prueba Gratuita Especial
          </div>
          <h3 className="text-2xl md:text-3xl font-serif-elegant font-bold">7 Días de Acceso Completo</h3>
          <p className="text-xs text-white/70 font-sans-clean font-light max-w-md">
            Sin tarjeta de crédito. Accede a la app móvil, buscador inteligente y cotizador de WhatsApp al instante.
          </p>
        </div>
        <Button 
          onPress={() => navigate("/planes")}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-sans-clean font-bold text-xs tracking-widest uppercase h-12 px-8 rounded-xl flex-shrink-0 transition-all shadow-lg shadow-emerald-500/20"
        >
          Iniciar Prueba Gratis
        </Button>
      </div>

      <div className="flex justify-center w-full">
        <Card 
          className="p-8 border rounded-2xl bg-white flex flex-col justify-between relative transition-all border-black/10 shadow-xl max-w-md w-full"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-sans-clean font-bold tracking-widest uppercase py-1 px-3 rounded-full border border-black/20 text-black/60 bg-black/5">
                Licencia Consultor
              </span>
              <span className="text-[10px] font-sans-clean font-bold tracking-widest uppercase text-[#C5A028]">
                Popular ★
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-serif-elegant font-bold text-black">Plan Silver</h3>
              <p className="text-xs font-sans-clean font-light text-black/40 mt-1">
                Herramienta digital completa para consultores y vendedores independientes.
              </p>
            </div>

            <div className="flex items-baseline gap-1 py-3 border-y border-black/5">
              <span className="text-4xl font-serif-elegant font-black text-black">$29</span>
              <span className="text-xs font-sans-clean font-bold text-black/40 self-end mb-1 ml-1">USD</span>
              <span className="text-sm font-sans-clean font-light text-black/40">/ mes</span>
            </div>

            <ul className="space-y-3">
              {[
                "Uso completo Online y Offline",
                "Buscador Inteligente por notas olfativas",
                "Fichas técnicas ilimitadas para clientes",
                "Cotizador directo a WhatsApp",
                "Acceso inmediato en iOS y Android"
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-2.5 text-xs font-sans-clean font-light text-black/70 leading-snug">
                  <Check size={14} className="text-[#C5A028] mt-0.5 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <Button 
              onPress={() => navigate("/planes")}
              className="w-full font-sans-clean font-bold text-xs tracking-widest uppercase h-12 rounded-xl transition-all bg-black text-white hover:bg-black/90 shadow-lg"
            >
              Ver Todos los Planes
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}

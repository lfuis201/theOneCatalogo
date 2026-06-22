import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { ChevronRight } from "lucide-react";

interface HeroSectionProps {
  onExplorePlanes: () => void;
}

export function HeroSection({ onExplorePlanes }: HeroSectionProps) {
  return (
    <section className="relative w-full max-w-[1200px] mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center border-b border-black/5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <span className="text-[11px] font-sans-clean font-bold tracking-[0.3em] uppercase text-black/40">El Futuro de la Perfumería Fina</span>
        <h1 className="text-5xl md:text-8xl font-serif-elegant font-light tracking-tight text-black leading-[1.05]">
          Curaduría Olfativa <br />
          <span className="italic">en tus manos</span>
        </h1>
        <p className="text-base md:text-lg font-serif-elegant font-light text-black/60 max-w-2xl mx-auto leading-relaxed">
          Navega por las notas de las fragancias más prestigiosas del mundo, aprende el arte de vestir aromas con nuestro blog exclusivo, y adquiere tu suscripción mensual para recibir decants de lujo directamente en tu hogar.
        </p>
        <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button 
            onPress={onExplorePlanes}
            className="bg-black text-white hover:bg-black/90 font-sans-clean font-bold text-xs tracking-widest uppercase h-12 px-8 rounded-none transition-all shadow-xl shadow-black/10"
          >
            Ver Planes Disponibles
          </Button>
          <a href="#blog">
            <Button variant="light" className="text-black font-sans-clean font-bold text-xs tracking-widest uppercase h-12 px-8 rounded-none hover:bg-black/5 transition-all">
              Explorar Blog <ChevronRight size={14} className="ml-1" />
            </Button>
          </a>
        </div>
      </motion.div>
    </section>
  );
}

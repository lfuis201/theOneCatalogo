import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Card } from "@heroui/react";
import { Check } from "lucide-react";

export function PlansSection() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      name: "TheOne Premium Club",
      price: "$29",
      period: "/mes",
      description: "Acceso completo a nuestra biblioteca exclusiva de decants y recomendaciones olfativas premium.",
      features: [
        "3 Decants de Súper Lujo de 10ml al mes",
        "Acceso completo a la app móvil y catálogo digital",
        "Envío express premium gratuito",
        "Muestras exclusivas de lanzamientos limitados",
        "Asesoría olfativa personalizada por IA"
      ],
      popular: true
    }
  ];

  return (
    <section id="planes" className="w-full max-w-[1200px] mx-auto px-6 py-20 flex flex-col items-center">
      <div className="text-center space-y-3 mb-16">
        <span className="text-[10px] font-sans-clean font-bold tracking-[0.25em] uppercase text-black/40">Membresía Exclusiva</span>
        <h2 className="text-4xl md:text-6xl font-serif-elegant font-bold tracking-tight text-black">Adquiere tu Plan</h2>
        <p className="text-sm font-sans-clean font-light text-black/50 max-w-md mx-auto">
          Acceso sin restricciones a nuestra experiencia olfativa premium.
        </p>
      </div>

      <div className="flex justify-center w-full">
        {plans.map((p) => (
          <Card 
            key={p.name}
            className="p-8 border rounded-none bg-white flex flex-col justify-between relative transition-all border-black shadow-2xl shadow-black/5 max-w-md w-full"
          >
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-black text-white text-[9px] font-sans-clean font-black tracking-widest uppercase py-1 px-3">
              Club de Miembros
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-serif-elegant font-bold text-black">{p.name}</h3>
                <p className="text-xs font-sans-clean font-light text-black/40 mt-1">{p.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-serif-elegant font-black text-black">{p.price}</span>
                <span className="text-sm font-sans-clean font-light text-black/40">{p.period}</span>
              </div>

              <div className="h-[1px] bg-black/5 w-full"></div>

              <ul className="space-y-3.5">
                {p.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-xs font-sans-clean font-light text-black/60 leading-tight">
                    <Check size={14} className="text-black mt-0.5 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Button 
                onPress={() => setSelectedPlan(p.name)}
                className="w-full font-sans-clean font-bold text-xs tracking-widest uppercase h-12 rounded-none transition-all bg-black text-white hover:bg-black/90"
              >
                Adquirir Membresía
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedPlan && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-12 p-6 border border-black bg-black text-white text-center max-w-md w-full"
        >
          <h4 className="font-serif-elegant text-xl font-bold">¡Excelente Elección!</h4>
          <p className="text-xs font-sans-clean font-light text-white/70 mt-1">
            Has seleccionado el plan <span className="font-bold text-white">{selectedPlan}</span>. Ponte en contacto con un administrador en el panel o regístrate en nuestra app para completar tu activación.
          </p>
          <Button 
            size="sm"
            onPress={() => setSelectedPlan(null)}
            className="mt-4 bg-white text-black font-sans-clean font-bold text-[10px] tracking-wider uppercase rounded-none"
          >
            Entendido
          </Button>
        </motion.div>
      )}
    </section>
  );
}

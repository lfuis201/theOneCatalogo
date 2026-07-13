import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, Smartphone, ShieldCheck } from "lucide-react";
import { useAuth } from "../../auth";
import { suscripcionesService } from "../../suscripciones/services/suscripcionesService";

export function PublicPlansPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loadingPurchase, setLoadingPurchase] = useState(false);
  const [successPurchase, setSuccessPurchase] = useState(false);

  const appProduct = {
    name: "Catálogo Electrónico THE ONE",
    price: "$29",
    currency: "USD",
    period: " / mes",
    description: "La herramienta digital definitiva para consultores y vendedores de perfumería. Accede al catálogo, comparte fichas técnicas y cierra ventas ágilmente.",
    features: [
      "Uso completo Online y Offline (sin necesidad de internet)",
      "Buscador Inteligente por notas, marcas y familias olfativas",
      "Generación y envío de fichas técnicas ilimitadas a clientes",
      "Precios de referencia departamentales integrados",
      "Acceso inmediato en todos tus dispositivos",
      "Botón de cotizaciones automáticas directo a WhatsApp"
    ],
    dbPlan: "Silver Collector", // Map to DB Enum
    dbPrice: 29.00
  };

  const handlePurchase = async () => {
    if (!user) {
      navigate("/register");
      return;
    }

    setLoadingPurchase(true);
    try {
      const startDate = new Date().toISOString().split("T")[0];
      const nextRenewal = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      await suscripcionesService.create({
        usuarioId: user.id,
        plan: appProduct.dbPlan,
        status: 'Active',
        price: appProduct.dbPrice,
        startDate,
        nextRenewal
      });
      
      setSuccessPurchase(true);
    } catch (error) {
      console.error("Error creating subscription:", error);
      alert("Ocurrió un error al procesar tu adquisición. Inténtalo de nuevo.");
    } finally {
      setLoadingPurchase(false);
    }
  };

  return (
    <div className="py-10 px-6 relative flex flex-col items-center w-full">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,40,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1200px] w-full flex flex-col items-center relative z-10">
        
        <button 
          onClick={() => navigate("/")}
          className="self-start flex items-center gap-2 text-xs font-sans-clean font-bold tracking-widest uppercase text-black/50 hover:text-black transition-colors mb-12 bg-transparent border-0 cursor-pointer"
        >
          <ArrowLeft size={16} /> Volver al Catálogo
        </button>

        <div className="text-center space-y-4 mb-16 max-w-2xl">
          <span className="text-[11px] font-sans-clean font-bold tracking-[0.4em] uppercase text-[#C5A028]">
            THE ONE • APLICACIÓN DIGITAL
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif-elegant font-light tracking-tight text-black leading-tight">
            Adquiere el Catálogo <span className="italic text-gold font-normal">Digital</span>
          </h1>
          <p className="text-sm sm:text-base font-sans-clean font-light text-black/50 leading-relaxed">
            Obtén acceso inmediato a la aplicación móvil y automatiza tu proceso de ventas de alta perfumería.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {successPurchase ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl w-full bg-white border border-[#C5A028] p-12 text-center space-y-6 shadow-2xl rounded-3xl"
            >
              <div className="w-20 h-20 rounded-full bg-green-50 mx-auto flex items-center justify-center text-green-500 border border-green-200">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-3xl font-serif-elegant font-bold text-black">¡Acceso Concedido!</h2>
              <p className="text-sm font-sans-clean font-light text-black/60 max-w-md mx-auto leading-relaxed">
                Tu cuenta está activa. Ya puedes descargar e iniciar sesión en la aplicación de **THE ONE** para comenzar a vender.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onPress={() => navigate("/dashboard")}
                  className="bg-black text-white hover:bg-black/90 font-sans-clean font-bold text-xs tracking-widest uppercase h-12 px-8 rounded-none transition-all shadow-lg"
                >
                  Ir al Dashboard
                </Button>
                <Button 
                  onPress={() => navigate("/")}
                  className="bg-transparent border border-black/20 text-black hover:bg-black/5 font-sans-clean font-bold text-xs tracking-widest uppercase h-12 px-8 rounded-none transition-all"
                >
                  Regresar al Inicio
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center w-full"
            >
              <Card 
                className="p-8 border rounded-none bg-white flex flex-col justify-between relative transition-all duration-500 shadow-2xl border-secondary max-w-lg w-full"
              >
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-secondary text-white text-[9px] font-sans-clean font-black tracking-widest uppercase py-1 px-3">
                  Acceso Total
                </div>

                <div className="space-y-6 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-serif-elegant font-bold text-black">{appProduct.name}</h3>
                      <p className="text-xs font-sans-clean font-light text-black/40 mt-2">{appProduct.description}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#9333EA] to-[#D946EF] text-white">
                      <Smartphone size={24} />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 py-4 border-y border-black/5">
                    <span className="text-5xl font-serif-elegant font-black text-black">{appProduct.price}</span>
                    <span className="text-xs font-sans-clean font-bold text-black/40 self-end mb-1 ml-1">{appProduct.currency}</span>
                    <span className="text-sm font-sans-clean font-light text-black/40">{appProduct.period}</span>
                  </div>

                  <ul className="space-y-3.5">
                    {appProduct.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs font-sans-clean font-light text-black/60 leading-tight">
                        <Check size={14} className="text-secondary mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Button 
                    isLoading={loadingPurchase}
                    onPress={handlePurchase}
                    className="w-full font-sans-clean font-bold text-xs tracking-widest uppercase h-12 rounded-none transition-all bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/20"
                  >
                    Adquirir Acceso a la App
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

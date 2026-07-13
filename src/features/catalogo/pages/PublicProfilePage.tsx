import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Spinner } from "@heroui/react";
import { User, Calendar, CreditCard, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../../auth";
import { useUserSubscription } from "../../suscripciones";

export function PublicProfilePage() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const { subscription, isLoading } = useUserSubscription(user?.id);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center bg-[#fafafa]">
        <Spinner size="lg" color="warning" label="Verificando sesión..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center bg-[#fafafa]">
        <Spinner size="lg" color="warning" label="Cargando perfil..." />
      </div>
    );
  }

  return (
    <div className="py-20 px-6 relative flex flex-col items-center w-full min-h-[80vh] bg-[#fafafa]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,40,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[800px] w-full flex flex-col items-center relative z-10 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-[11px] font-sans-clean font-bold tracking-[0.4em] uppercase text-[#C5A028]">
            ÁREA DE CLIENTES
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif-elegant font-light tracking-tight text-black">
            Mi <span className="italic text-gold font-normal">Cuenta</span>
          </h1>
          <p className="text-sm font-sans-clean font-light text-black/50 max-w-md mx-auto">
            Gestiona tus datos personales y revisa el estado de tu licencia digital de THE ONE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 w-full">
          {/* User Data Card */}
          <Card className="p-8 border rounded-none bg-white md:col-span-2 flex flex-col justify-between shadow-lg border-black/5 text-left space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-[#C5A028]">
                <User size={22} />
              </div>
              <div>
                <h3 className="text-xs font-sans-clean font-bold tracking-widest text-black/40 uppercase">Nombre</h3>
                <p className="text-lg font-serif-elegant font-bold text-black mt-1">
                  {profile?.nombre || user?.user_metadata?.full_name || "Usuario Premium"}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-sans-clean font-bold tracking-widest text-black/40 uppercase">Correo Electrónico</h3>
                <p className="text-sm font-sans-clean font-medium text-black/70 mt-1 break-all">
                  {user?.email}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-sans-clean font-bold tracking-widest text-black/40 uppercase">Rol</h3>
                <p className="text-[10px] font-sans-clean font-bold tracking-wider text-white bg-black px-2.5 py-1 uppercase rounded-none inline-block mt-2">
                  {profile?.rol === "admin" ? "Administrador" : "Cliente / Consultor"}
                </p>
              </div>
            </div>
            
            {profile?.rol === "admin" && (
              <Button 
                onPress={() => navigate("/dashboard")}
                className="w-full bg-black text-[#C5A028] hover:bg-black/90 font-sans-clean font-bold text-xs tracking-widest uppercase h-11 rounded-none transition-all mt-4"
              >
                Panel de Control
              </Button>
            )}
          </Card>

          {/* Subscription Status Card */}
          <Card className="p-8 border rounded-none bg-white md:col-span-3 flex flex-col justify-between shadow-lg border-black/5 text-left space-y-6">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-[#C5A028]">
                  <CreditCard size={22} />
                </div>
                {subscription ? (
                  <span className={`text-[10px] font-sans-clean font-bold tracking-widest uppercase py-1 px-3.5 border ${
                    subscription.status.toLowerCase() === "active"
                      ? "bg-green-50 border-green-200 text-green-600"
                      : "bg-red-50 border-red-200 text-red-600"
                  }`}>
                    {subscription.status.toLowerCase() === "active" ? "Activa" : "Vencida"}
                  </span>
                ) : (
                  <span className="text-[10px] font-sans-clean font-bold tracking-widest uppercase py-1 px-3.5 bg-yellow-50 border border-yellow-200 text-yellow-600">
                    Sin Plan
                  </span>
                )}
              </div>

              {subscription ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-sans-clean font-bold tracking-widest text-black/40 uppercase">Plan Adquirido</h3>
                    <p className="text-2xl font-serif-elegant font-bold text-black mt-1">
                      {subscription.plan === "Silver Collector" ? "Licencia App THE ONE" : subscription.plan}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-black/5">
                    <div>
                      <h4 className="text-[10px] font-sans-clean font-bold tracking-widest text-black/40 uppercase flex items-center gap-1.5">
                        <Calendar size={12} /> Fecha de Inicio
                      </h4>
                      <p className="text-sm font-sans-clean font-medium text-black/70 mt-1">
                        {subscription.startDate}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-sans-clean font-bold tracking-widest text-black/40 uppercase flex items-center gap-1.5">
                        <Calendar size={12} /> Próximo Vencimiento
                      </h4>
                      <p className="text-sm font-sans-clean font-bold text-black mt-1">
                        {subscription.nextRenewal}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs font-sans-clean font-light text-black/50">
                    <ShieldCheck size={16} className="text-green-500" />
                    <span>Tu licencia digital está sincronizada correctamente.</span>
                  </div>

                  <div className="mt-6 pt-4 border-t border-black/5 space-y-3">
                    <h4 className="text-[11px] font-sans-clean font-bold tracking-widest text-black/40 uppercase">Descargas Disponibles</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        as="a"
                        href="#"
                        target="_blank"
                        className="bg-black text-[#C5A028] hover:bg-black/90 font-sans-clean font-bold text-[10px] tracking-widest uppercase h-10 rounded-none transition-all flex items-center justify-center"
                      >
                        Android (APK)
                      </Button>
                      <Button
                        as="a"
                        href="#"
                        target="_blank"
                        className="border border-black/20 text-black hover:bg-black/5 bg-transparent font-sans-clean font-bold text-[10px] tracking-widest uppercase h-10 rounded-none transition-all flex items-center justify-center"
                      >
                        iOS (App Store)
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2 items-start text-sm font-sans-clean font-light text-black/60 bg-amber-50/50 border border-amber-100 p-4">
                    <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Aún no has adquirido una licencia de la aplicación móvil de **THE ONE**. Adquiere tu acceso mensual para habilitar las ventas digitales.
                    </p>
                  </div>
                  <Button 
                    onPress={() => navigate("/planes")}
                    className="w-full bg-secondary text-white hover:bg-secondary/90 font-sans-clean font-bold text-xs tracking-widest uppercase h-12 rounded-none transition-all flex items-center justify-center gap-2 shadow-lg shadow-secondary/20"
                  >
                    Ver Planes <ArrowRight size={14} />
                  </Button>
                </div>
              )}
            </div>

            {subscription && (
              <div className="pt-4 border-t border-black/5 flex justify-between items-center text-xs font-sans-clean font-medium">
                <span className="text-black/40">Inversión mensual:</span>
                <span className="text-black font-bold">${subscription.price} USD</span>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}

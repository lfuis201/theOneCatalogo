import { RegisterForm } from '../components/RegisterForm'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Spinner } from "@heroui/react"

export function RegisterPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-primary/70 font-medium animate-pulse">Cargando...</p>
      </div>
    );
  }

  // If user is already authenticated, let them go to /planes
  if (user) {
    return <Navigate to="/planes" replace />;
  }

  return (
    <div className="min-h-screen flex w-full overflow-hidden bg-background">
      {/* Left Side: Cinematic Image (Public URL for reliability) */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Fragrance"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent" />

        <div className="relative z-10 p-16 flex flex-col justify-end h-full text-white">
          <div>
            <h3 className="text-6xl font-black leading-tight mb-4 drop-shadow-md">
              Únete a <br />
              <span className="text-primary-foreground/80">THE ONE.</span>
            </h3>
            <p className="text-white/90 text-xl max-w-md font-medium">
              Regístrate y adquiere tu suscripción para acceder a la aplicación móvil y potenciar tus ventas.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[380px] space-y-8">
          <div className="space-y-3">
            <h1 className="text-5xl font-black tracking-tight text-primary">Crear Cuenta</h1>
            <p className="text-default-500 text-lg font-medium">Regístrate para comenzar</p>
          </div>

          <div className="py-4">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}

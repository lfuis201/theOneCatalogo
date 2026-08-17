import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Spinner } from "@heroui/react";

export function ForgotPasswordPage() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-primary/70 font-medium animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (user) {
    if (profile?.rol !== 'admin' && profile?.rol !== 'superadmin') {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex w-full overflow-hidden bg-background">
      {/* Left Side: Cinematic Image */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Perfume"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent" />

        <div className="relative z-10 p-16 flex flex-col justify-end h-full text-white">
          <div>
            <h3 className="text-6xl font-black leading-tight mb-4 drop-shadow-md">
              Catálogo de <br />
              <span className="text-primary-foreground/80">Fragancias.</span>
            </h3>
            <p className="text-white/90 text-xl max-w-md font-medium">
              Recupera el acceso a tu panel de gestión de forma rápida y segura.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Forgot Password Form */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[380px] space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tight text-primary">¿Olvidaste tu contraseña?</h1>
            <p className="text-default-500 text-sm font-medium">
              Ingresa tu correo electrónico registrado y te enviaremos un enlace para restablecerla.
            </p>
          </div>

          <div className="py-2">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}

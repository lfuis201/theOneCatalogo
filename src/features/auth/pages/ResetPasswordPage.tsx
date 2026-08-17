import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, InputGroup, TextField, Label, Spinner } from "@heroui/react";
import { Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await authService.updatePassword(data.password);
      await authService.signOut();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

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
              Crea tu nueva contraseña de forma rápida y segura.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Reset Password Form */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[380px] space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tight text-primary">Nueva Contraseña</h1>
            <p className="text-default-500 text-sm font-medium">
              Ingresa tu nueva contraseña para volver a acceder a tu cuenta.
            </p>
          </div>

          {success ? (
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 bg-success-50 text-success rounded-full flex items-center justify-center border border-success-200 shadow-sm animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-primary">¡Contraseña actualizada!</h2>
                <p className="text-default-600 text-sm max-w-sm">
                  Tu contraseña ha sido modificada correctamente. Redirigiéndote al inicio de sesión en unos segundos...
                </p>
              </div>
              <Button
                onClick={() => navigate('/login')}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-2xl shadow-xl shadow-primary/40"
              >
                Ir a Iniciar Sesión ahora
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <TextField isInvalid={!!errors.password}>
                <Label className="text-primary font-bold mb-1 ml-1 text-sm">Nueva Contraseña</Label>
                <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all overflow-hidden shadow-sm">
                  <InputGroup.Input 
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    className="px-3 text-sm font-medium"
                  />
                  <InputGroup.Suffix 
                    className="pr-3 text-primary/40 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </InputGroup.Suffix>
                </InputGroup>
                {errors.password && (
                  <p className="text-danger text-tiny mt-1 ml-1">{errors.password.message}</p>
                )}
              </TextField>

              <TextField isInvalid={!!errors.confirmPassword}>
                <Label className="text-primary font-bold mb-1 ml-1 text-sm">Confirmar Contraseña</Label>
                <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all overflow-hidden shadow-sm">
                  <InputGroup.Input 
                    placeholder="••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register('confirmPassword')}
                    className="px-3 text-sm font-medium"
                  />
                  <InputGroup.Suffix 
                    className="pr-3 text-primary/40 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </InputGroup.Suffix>
                </InputGroup>
                {errors.confirmPassword && (
                  <p className="text-danger text-tiny mt-1 ml-1">{errors.confirmPassword.message}</p>
                )}
              </TextField>

              {error && (
                <div className="p-4 rounded-2xl bg-danger-50 border border-danger-100 text-danger text-tiny font-medium animate-shake text-center">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                isPending={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-medium h-12 rounded-2xl shadow-xl shadow-primary/40 active:scale-95 transition-all mt-2"
              >
                {({ isPending }) => (
                  <div className="flex items-center justify-center gap-2">
                    {isPending ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      <Lock size={18} />
                    )}
                    <span>Guardar Nueva Contraseña</span>
                  </div>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

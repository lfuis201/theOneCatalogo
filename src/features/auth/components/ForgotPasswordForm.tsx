import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, InputGroup, TextField, Label, Spinner } from "@heroui/react";
import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await authService.resetPasswordEmail(data.email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-16 bg-success-50 text-success rounded-full flex items-center justify-center border border-success-200 shadow-sm animate-bounce">
          <CheckCircle2 size={36} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-primary">Correo enviado</h2>
          <p className="text-default-600 text-sm max-w-sm">
            Hemos enviado las instrucciones para restablecer tu contraseña a tu correo electrónico. Por favor revisa tu bandeja de entrada o spam.
          </p>
        </div>
        <Link 
          to="/login"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold text-sm transition-colors pt-2"
        >
          <ArrowLeft size={16} />
          Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <TextField isInvalid={!!errors.email}>
          <Label className="text-primary font-bold mb-1 ml-1 text-sm">Correo Electrónico</Label>
          <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all overflow-hidden shadow-sm">
            <InputGroup.Input 
              placeholder="tu@email.com"
              type="email"
              {...register('email')}
              className="px-3 text-sm font-medium"
            />
            <InputGroup.Suffix className="pr-3 text-primary/40">
              <Mail size={18} />
            </InputGroup.Suffix>
          </InputGroup>
          {errors.email && (
            <p className="text-danger text-tiny mt-1 ml-1">{errors.email.message}</p>
          )}
        </TextField>

        {error && (
          <div className="p-4 rounded-2xl bg-danger-50 border border-danger-100 text-danger text-tiny font-medium animate-shake text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center gap-4 pt-2">
          <Button 
            type="submit" 
            isPending={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-medium h-12 rounded-2xl shadow-xl shadow-primary/40 active:scale-95 transition-all"
          >
            {({ isPending }) => (
              <div className="flex items-center justify-center gap-2">
                {isPending ? (
                  <Spinner color="white" size="sm" />
                ) : (
                  <Mail size={18} />
                )}
                <span>Enviar enlace de recuperación</span>
              </div>
            )}
          </Button>

          <Link 
            to="/login"
            className="inline-flex items-center gap-2 text-default-500 hover:text-primary font-medium text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Volver a iniciar sesión
          </Link>
        </div>
      </form>
    </div>
  );
}

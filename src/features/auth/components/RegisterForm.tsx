import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Input, Card } from "@heroui/react";
import { authService } from '../services/authService';
import { useState } from 'react';
import { UserPlus } from 'lucide-react';

const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre es muy corto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await authService.signUp(data.email, data.password, data.nombre);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-[400px] w-full mx-auto shadow-none border-none bg-transparent">
        <Card.Content className="text-center py-12">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 text-success">
             <UserPlus size={32} />
          </div>
          <Card.Title className="text-2xl font-bold mb-2 text-foreground">¡Casi listo!</Card.Title>
          <Card.Description className="text-default-500">Hemos enviado un enlace de confirmación a tu correo electrónico.</Card.Description>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className="max-w-[400px] w-full mx-auto shadow-none border-none bg-transparent">
      <Card.Header className="flex flex-col gap-1 items-center pb-0">
        <div className="p-3 bg-secondary/10 rounded-full mb-2 text-secondary">
          <UserPlus size={24} />
        </div>
        <Card.Title className="text-2xl font-bold">Únete ahora</Card.Title>
        <Card.Description className="text-default-500 text-small text-center">Forma parte de la experiencia gastronómica</Card.Description>
      </Card.Header>
      <Card.Content className="px-0">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Nombre Completo"
            placeholder="Juan Pérez"
            variant="bordered"
            {...register('nombre')}
            isInvalid={!!errors.nombre}
            errorMessage={errors.nombre?.message}
          />
          <Input
            label="Email"
            placeholder="ejemplo@correo.com"
            variant="bordered"
            {...register('email')}
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />
          <Input
            label="Contraseña"
            placeholder="********"
            type="password"
            variant="bordered"
            {...register('password')}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />
          <Input
            label="Confirmar Contraseña"
            placeholder="********"
            type="password"
            variant="bordered"
            {...register('confirmPassword')}
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
          />
          
          {error && (
            <div className="p-3 rounded-xl bg-danger-50 border border-danger-200">
              <p className="text-danger text-tiny font-medium">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            color="secondary" 
            isLoading={loading}
            className="font-semibold h-12 rounded-xl mt-2"
          >
            Registrarse
          </Button>
        </form>
      </Card.Content>
    </Card>
  );
}

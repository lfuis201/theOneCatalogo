import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, InputGroup, TextField, Label, Card } from "@heroui/react";
import { authService } from '../services/authService';
import { useState } from 'react';
import { UserPlus, User, Mail, Key, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await authService.signUp(data.email, data.password, data.nombre);
      setSuccess(true);
      setTimeout(() => {
        navigate('/planes');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-[400px] w-full mx-auto shadow-none border-none bg-transparent">
        <div className="text-center py-12 flex flex-col items-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4 text-success animate-bounce">
             <UserPlus size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-foreground">¡Registro Exitoso!</h2>
          <p className="text-default-500 mb-6">Tu cuenta ha sido creada. Redirigiéndote a los planes...</p>
          <Button 
            onPress={() => navigate('/planes')}
            color="primary"
            className="font-bold w-full h-12 rounded-xl shadow-lg shadow-primary/30"
          >
            Ver Planes de Suscripción
          </Button>
        </div>
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
        <Card.Description className="text-default-500 text-small text-center">Crea tu cuenta de consultor independiente</Card.Description>
      </Card.Header>
      <Card.Content className="px-0">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 pt-4">
          
          {/* Nombre Field */}
          <TextField isInvalid={!!errors.nombre}>
            <Label className="text-primary font-bold mb-1 ml-1 text-sm">Nombre Completo</Label>
            <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all overflow-hidden shadow-sm">
              <InputGroup.Prefix className="pl-3 text-primary/40"><User size={18} /></InputGroup.Prefix>
              <InputGroup.Input 
                placeholder="Juan Pérez"
                {...register('nombre')}
                className="px-3 text-sm font-medium"
              />
            </InputGroup>
            {errors.nombre && (
              <p className="text-danger text-tiny mt-1 ml-1">{errors.nombre.message}</p>
            )}
          </TextField>

          {/* Email Field */}
          <TextField isInvalid={!!errors.email}>
            <Label className="text-primary font-bold mb-1 ml-1 text-sm">Correo Electrónico</Label>
            <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all overflow-hidden shadow-sm">
              <InputGroup.Prefix className="pl-3 text-primary/40"><Mail size={18} /></InputGroup.Prefix>
              <InputGroup.Input 
                placeholder="ejemplo@correo.com"
                {...register('email')}
                className="px-3 text-sm font-medium"
              />
            </InputGroup>
            {errors.email && (
              <p className="text-danger text-tiny mt-1 ml-1">{errors.email.message}</p>
            )}
          </TextField>

          {/* Password Field */}
          <TextField isInvalid={!!errors.password}>
            <Label className="text-primary font-bold mb-1 ml-1 text-sm">Contraseña</Label>
            <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all overflow-hidden shadow-sm">
              <InputGroup.Prefix className="pl-3 text-primary/40"><Key size={18} /></InputGroup.Prefix>
              <InputGroup.Input 
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                {...register('password')}
                className="px-3 text-sm font-medium"
              />
              <InputGroup.Suffix className="pr-2">
                <Button 
                  isIconOnly 
                  variant="ghost" 
                  size="sm" 
                  onPress={() => setShowPassword(!showPassword)}
                  className="text-primary/60 hover:text-primary hover:bg-primary/10 rounded-xl animate-fade-in"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </InputGroup.Suffix>
            </InputGroup>
            {errors.password && (
              <p className="text-danger text-tiny mt-1 ml-1">{errors.password.message}</p>
            )}
          </TextField>

          {/* Confirm Password Field */}
          <TextField isInvalid={!!errors.confirmPassword}>
            <Label className="text-primary font-bold mb-1 ml-1 text-sm">Confirmar Contraseña</Label>
            <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all overflow-hidden shadow-sm">
              <InputGroup.Prefix className="pl-3 text-primary/40"><Key size={18} /></InputGroup.Prefix>
              <InputGroup.Input 
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repite tu contraseña"
                {...register('confirmPassword')}
                className="px-3 text-sm font-medium"
              />
              <InputGroup.Suffix className="pr-2">
                <Button 
                  isIconOnly 
                  variant="ghost" 
                  size="sm" 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-primary/60 hover:text-primary hover:bg-primary/10 rounded-xl animate-fade-in"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </InputGroup.Suffix>
            </InputGroup>
            {errors.confirmPassword && (
              <p className="text-danger text-tiny mt-1 ml-1">{errors.confirmPassword.message}</p>
            )}
          </TextField>
          
          {error && (
            <div className="p-4 rounded-2xl bg-danger-50 border border-danger-100 text-danger text-tiny font-medium text-center animate-shake">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            isLoading={loading}
            className="bg-primary hover:bg-primary/90 text-white font-bold text-medium h-12 rounded-2xl shadow-xl shadow-primary/40 active:scale-95 transition-all mt-4"
          >
            Registrarse
          </Button>
        </form>
      </Card.Content>
    </Card>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, InputGroup, TextField, Label, Spinner } from "@heroui/react";
import { useState } from 'react';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema';

export function LoginForm() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@test.com',
      password: 'admin123',
    }
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await signIn(data.email, data.password);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Email Field */}
        <TextField isInvalid={!!errors.email}>
          <Label className="text-primary font-bold mb-1 ml-1 text-sm">Email del Administrador</Label>
          <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all overflow-hidden shadow-sm">
            <InputGroup.Input 
              placeholder="admin@test.com"
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
            <InputGroup.Input 
              type={isVisible ? "text" : "password"}
              placeholder="••••••••"
              {...register('password')}
              className="px-3 text-sm font-medium"
            />
            <InputGroup.Suffix className="pr-2">
              <Button 
                isIconOnly 
                variant="ghost" 
                size="sm" 
                onPress={toggleVisibility}
                className="text-primary/60 hover:text-primary hover:bg-primary/10 rounded-xl"
              >
                {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </InputGroup.Suffix>
          </InputGroup>
          {errors.password && (
            <p className="text-danger text-tiny mt-1 ml-1">{errors.password.message}</p>
          )}
        </TextField>
        
        {error && (
          <div className="p-4 rounded-2xl bg-danger-50 border border-danger-100 text-danger text-tiny font-medium animate-shake text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button 
            type="submit" 
            isPending={loading}
            className="bg-primary hover:bg-primary/90 text-white font-bold text-medium h-12 px-12 rounded-2xl shadow-xl shadow-primary/40 active:scale-95 transition-all"
          >
            {({ isPending }) => (
              <div className="flex items-center gap-2">
                {isPending ? (
                  <Spinner color="white" size="sm" />
                ) : (
                  <LogIn size={18} />
                )}
                <span>Acceder al panel</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

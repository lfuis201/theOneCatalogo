import { useState, useEffect } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { supabase } from "../../../shared/lib/supabase";
import { Button, Card, TextField, Label, InputGroup, toast } from "@heroui/react";
import { User, Mail, Phone, Building, Save, Lock, KeyRound, Eye, EyeOff } from "lucide-react";

export function PerfilPage() {
  const { profile, user } = useAuth();

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Cambio de contraseña
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setNombre(profile.nombre || "");
      setTelefono(profile.telefono || "");
      setEmpresaNombre(profile.empresa || "");
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSavingProfile(true);
    try {
      // 1. Actualizar usuario en tabla 'usuarios'
      const { error: userError } = await supabase
        .from("usuarios")
        .update({
          nombre,
          telefono,
          empresa: empresaNombre,
        })
        .eq("id", profile.id);

      if (userError) throw userError;

      // 2. Actualizar también la tabla 'empresas' si el usuario tiene empresa_id asignada
      if (profile.empresa_id && empresaNombre) {
        const { error: empError } = await supabase
          .from("empresas")
          .update({ nombre: empresaNombre })
          .eq("id", profile.empresa_id);

        if (empError) console.error("Error actualizando tabla empresas:", empError);
      }

      toast.success("¡Perfil actualizado con éxito!");
    } catch (err: any) {
      console.error("Error al actualizar perfil:", err);
      toast.error(err.message || "Ocurrió un error al guardar los datos.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("¡Contraseña actualizada con éxito!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Error actualizando contraseña:", err);
      toast.error(err.message || "Error al cambiar la contraseña.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      <header className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight text-default-900 flex items-center gap-3">
          <User className="text-primary" size={32} />
          Mi Perfil y Configuración
        </h1>
        <p className="text-default-500 font-medium">Gestiona tu información personal, empresa y credenciales de acceso.</p>
      </header>

      {/* Formulario de Datos Personales y Empresa */}
      <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-white">
        <h2 className="text-xl font-bold text-default-900 mb-6 flex items-center gap-2">
          <Building className="text-primary" size={22} />
          Datos Personales y de Negocio
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField>
              <Label className="text-primary font-bold mb-1 ml-1 text-sm">Nombre Completo</Label>
              <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                <InputGroup.Prefix className="pl-3 text-primary/40"><User size={18} /></InputGroup.Prefix>
                <InputGroup.Input 
                  placeholder="Tu nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="px-3 text-sm font-medium"
                  required
                />
              </InputGroup>
            </TextField>

            <TextField>
              <Label className="text-primary font-bold mb-1 ml-1 text-sm">Correo Electrónico</Label>
              <InputGroup className="bg-default-100 border-default-200 rounded-xl h-11 transition-all cursor-not-allowed">
                <InputGroup.Prefix className="pl-3 text-default-400"><Mail size={18} /></InputGroup.Prefix>
                <InputGroup.Input 
                  value={user?.email || profile?.email || ""}
                  disabled
                  className="px-3 text-sm font-medium text-default-500 cursor-not-allowed"
                />
                <InputGroup.Suffix className="pr-3 text-default-400"><Lock size={16} /></InputGroup.Suffix>
              </InputGroup>
            </TextField>

            <TextField>
              <Label className="text-primary font-bold mb-1 ml-1 text-sm">Teléfono / WhatsApp</Label>
              <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                <InputGroup.Prefix className="pl-3 text-primary/40"><Phone size={18} /></InputGroup.Prefix>
                <InputGroup.Input 
                  placeholder="Ej. +56 9 8765 4321"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="px-3 text-sm font-medium"
                />
              </InputGroup>
            </TextField>

            <TextField>
              <Label className="text-primary font-bold mb-1 ml-1 text-sm">Nombre de la Empresa / Negocio</Label>
              <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                <InputGroup.Prefix className="pl-3 text-primary/40"><Building size={18} /></InputGroup.Prefix>
                <InputGroup.Input 
                  placeholder="Nombre de tu negocio"
                  value={empresaNombre}
                  onChange={(e) => setEmpresaNombre(e.target.value)}
                  className="px-3 text-sm font-medium"
                />
              </InputGroup>
            </TextField>
          </div>

          <div className="pt-2 flex justify-end">
            <Button 
              type="submit"
              isLoading={isSavingProfile}
              isDisabled={isSavingProfile}
              className="bg-primary text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/30"
            >
              <Save size={18} />
              Guardar Datos
            </Button>
          </div>
        </form>
      </Card>

      {/* Formulario de Seguridad / Cambiar Contraseña */}
      <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-white">
        <h2 className="text-xl font-bold text-default-900 mb-6 flex items-center gap-2">
          <KeyRound className="text-primary" size={22} />
          Cambiar Contraseña
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField>
              <Label className="text-primary font-bold mb-1 ml-1 text-sm">Nueva Contraseña</Label>
              <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                <InputGroup.Prefix className="pl-3 text-primary/40"><KeyRound size={18} /></InputGroup.Prefix>
                <InputGroup.Input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="px-3 text-sm font-medium"
                  required
                />
                <InputGroup.Suffix className="pr-2">
                  <Button 
                    isIconOnly 
                    variant="ghost" 
                    size="sm" 
                    onPress={() => setShowPassword(!showPassword)}
                    className="text-primary/60 hover:text-primary rounded-xl"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>
            </TextField>

            <TextField>
              <Label className="text-primary font-bold mb-1 ml-1 text-sm">Confirmar Nueva Contraseña</Label>
              <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                <InputGroup.Prefix className="pl-3 text-primary/40"><KeyRound size={18} /></InputGroup.Prefix>
                <InputGroup.Input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Repite la contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="px-3 text-sm font-medium"
                  required
                />
              </InputGroup>
            </TextField>
          </div>

          <div className="pt-2 flex justify-end">
            <Button 
              type="submit"
              isLoading={isChangingPassword}
              isDisabled={isChangingPassword || !newPassword}
              className="bg-zinc-900 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-zinc-900/20"
            >
              <KeyRound size={18} />
              Actualizar Contraseña
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}


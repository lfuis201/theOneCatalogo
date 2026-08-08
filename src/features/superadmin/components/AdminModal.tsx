import {
  Modal,
  Button,
  TextField,
  Label,
  InputGroup,
  Select,
  ListBox,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Phone, Building, Key, Eye, EyeOff, Hash } from "lucide-react";
import type { AdminUser } from "../types";
import { getAdminSchema, type AdminFormValues } from "../schemas/adminSchema";

interface AdminModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSubmit: (data: AdminFormValues) => void;
  admin?: AdminUser | null;
}

export function AdminModal({ isOpen, onOpenChange, onSubmit, admin }: AdminModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdminFormValues>({
    resolver: zodResolver(getAdminSchema(!!admin)),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      empresa: "",
      status: "active",
      limite_licencias: 10,
      password: "",
    },
  });

  const selectedStatus = watch("status");

  useEffect(() => {
    if (admin && isOpen) {
      reset({
        nombre: admin.nombre || "",
        email: admin.email || "",
        telefono: admin.telefono || "",
        empresa: admin.empresa || "",
        status: admin.status || "active",
        limite_licencias: admin.limite_licencias ?? 10,
        password: "",
      });
    } else if (isOpen) {
      reset({
        nombre: "",
        email: "",
        telefono: "",
        empresa: "",
        status: "active",
        limite_licencias: 10,
        password: "",
      });
    }
    setShowPassword(false);
  }, [admin, isOpen, reset]);

  const handleFormSubmit = (data: AdminFormValues) => {
    onSubmit(data);
    reset();
    onOpenChange();
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[700px] bg-background border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <Modal.CloseTrigger />
          <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col max-h-[90vh]">
            <Modal.Header className="flex flex-col gap-1 p-8 border-b border-default-100">
              <Modal.Heading className="text-2xl font-black text-default-900">
                {admin ? "Editar Administrador" : "Registrar Nuevo Administrador"}
              </Modal.Heading>
              <p className="text-sm text-default-500 font-medium tracking-wide">
                {admin ? "Actualiza los datos del administrador de catálogo." : "Completa los datos para crear una nueva cuenta de administrador."}
              </p>
            </Modal.Header>
            <Modal.Body className="gap-6 p-8 overflow-y-auto min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField isInvalid={!!errors.nombre}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Nombre Completo</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Prefix className="pl-3 text-primary/40"><User size={18} /></InputGroup.Prefix>
                    <InputGroup.Input 
                      placeholder="Ej. Carlos Mendoza"
                      {...register("nombre")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.nombre && <p className="text-danger text-tiny mt-1 ml-1">{errors.nombre.message}</p>}
                </TextField>

                <TextField isInvalid={!!errors.email}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Correo Electrónico</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Prefix className="pl-3 text-primary/40"><Mail size={18} /></InputGroup.Prefix>
                    <InputGroup.Input 
                      placeholder="admin@empresa.com"
                      {...register("email")}
                      className="px-3 text-sm font-medium"
                      disabled={!!admin}
                    />
                  </InputGroup>
                  {errors.email && <p className="text-danger text-tiny mt-1 ml-1">{errors.email.message}</p>}
                </TextField>

                {!admin && (
                  <TextField isInvalid={!!errors.password}>
                    <Label className="text-primary font-bold mb-1 ml-1 text-sm">Contraseña de Acceso</Label>
                    <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all overflow-hidden shadow-sm">
                      <InputGroup.Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        {...register("password")}
                        className="px-3 text-sm font-medium"
                      />
                      <InputGroup.Suffix className="pr-2">
                        <Button 
                          isIconOnly 
                          variant="ghost" 
                          size="sm" 
                          onPress={() => setShowPassword(!showPassword)}
                          className="text-primary/60 hover:text-primary hover:bg-primary/10 rounded-xl"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </Button>
                      </InputGroup.Suffix>
                    </InputGroup>
                    {errors.password && <p className="text-danger text-tiny mt-1 ml-1">{errors.password.message}</p>}
                  </TextField>
                )}

                <TextField isInvalid={!!errors.telefono}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Teléfono</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Prefix className="pl-3 text-primary/40"><Phone size={18} /></InputGroup.Prefix>
                    <InputGroup.Input 
                      placeholder="Ej. +56 9 8765 4321"
                      {...register("telefono")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.telefono && <p className="text-danger text-tiny mt-1 ml-1">{errors.telefono.message}</p>}
                </TextField>

                <TextField isInvalid={!!errors.empresa}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Empresa / Nombre de Tienda</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Prefix className="pl-3 text-primary/40"><Building size={18} /></InputGroup.Prefix>
                    <InputGroup.Input 
                      placeholder="Ej. Perfumes Importados SAC"
                      {...register("empresa")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.empresa && <p className="text-danger text-tiny mt-1 ml-1">{errors.empresa.message}</p>}
                </TextField>

                <TextField isInvalid={!!errors.limite_licencias}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Límite de Licencias / Suscripciones</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Prefix className="pl-3 text-primary/40"><Hash size={18} /></InputGroup.Prefix>
                    <InputGroup.Input 
                      type="number"
                      placeholder="Ej. 10"
                      {...register("limite_licencias")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.limite_licencias && <p className="text-danger text-tiny mt-1 ml-1">{errors.limite_licencias.message}</p>}
                </TextField>

                {admin && (
                  <div className="flex flex-col">
                    <Label className="text-primary font-bold mb-1 ml-1 text-sm">Estado del Administrador</Label>
                    <Select
                      selectedKey={selectedStatus}
                      onSelectionChange={(key) => setValue("status", key as any)}
                      className="w-full"
                    >
                      <Select.Trigger className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all shadow-sm">
                        <Select.Value className="text-sm font-medium" />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="active" textValue="Activo">Activo <ListBox.ItemIndicator /></ListBox.Item>
                          <ListBox.Item id="inactive" textValue="Inactivo">Inactivo <ListBox.ItemIndicator /></ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer className="p-8 border-t border-default-100">
              <Button 
                variant="flat" 
                color="danger" 
                onPress={() => onOpenChange()}
                className="font-bold rounded-xl"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30"
              >
                {admin ? "Guardar Cambios" : "Guardar Administrador"}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

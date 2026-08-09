import { useState } from "react";
import { Button, Card, toast } from "@heroui/react";
import { Plus, ShieldAlert } from "lucide-react";
import { AdminsTable } from "../components/AdminsTable";
import { AdminModal } from "../components/AdminModal";
import { useAdmins } from "../hooks/useAdmins";
import { useEmpresas } from "../hooks/useEmpresas";
import { empresasService } from "../services/empresasService";
import type { AdminUser } from "../types";

export default function AdminsPage() {
  const { 
    admins, 
    isLoading, 
    isError, 
    error,
    createAdmin, 
    updateAdmin, 
    deleteAdmin 
  } = useAdmins();

  const { empresas } = useEmpresas();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  const handleOpenChange = () => {
    if (isModalOpen) {
      setEditingAdmin(null);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleEditClick = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingAdmin(null);
    setIsModalOpen(true);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleFormSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      let finalEmpresaId = data.empresa_id || null;
      let finalEmpresaNombre = null;

      if (data.tipo_empresa === "crear" && data.empresa_nueva_nombre) {
        const newEmp = await empresasService.create({
          nombre: data.empresa_nueva_nombre,
          status: "active",
        });
        finalEmpresaId = newEmp.id;
        finalEmpresaNombre = newEmp.nombre;
      } else if (data.tipo_empresa === "asignar" && data.empresa_id) {
        finalEmpresaId = data.empresa_id;
        const matchedEmpresa = empresas.find(e => e.id === data.empresa_id);
        finalEmpresaNombre = matchedEmpresa ? matchedEmpresa.nombre : null;
      }

      const adminPayload = {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        empresa: finalEmpresaNombre,
        empresa_id: finalEmpresaId,
        status: data.status,
        plan_suscripcion: data.plan_suscripcion,
        limite_licencias: data.limite_licencias,
        password: data.password,
      };

      if (editingAdmin) {
        await updateAdmin({ id: editingAdmin.id, data: adminPayload });
        toast.success("¡Administrador actualizado con éxito!");
      } else {
        await createAdmin(adminPayload);
        toast.success("¡Administrador registrado con éxito!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error guardando administrador:", err);
      toast.error(err.message || "Ocurrió un error al guardar el administrador.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este administrador? Esto revocará su acceso.")) {
      try {
        await deleteAdmin(id);
      } catch (err) {
        console.error("Error eliminando administrador:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-primary/70 font-semibold animate-pulse">Cargando administradores...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-danger font-bold text-lg">Ocurrió un error al cargar los administradores</p>
        <p className="text-default-500 max-w-md">{(error as Error)?.message || "Error desconocido"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-default-900 flex items-center gap-3">
            <ShieldAlert className="text-primary" size={32} />
            Administradores de Catálogos (Clientes B2B)
          </h1>
          <p className="text-default-500 font-medium">Gestiona las cuentas de los administradores que poseen licencias/catálogos.</p>
        </div>
        <Button 
          onPress={handleAddClick}
          className="bg-primary text-white font-bold h-12 px-6 rounded-2xl shadow-lg shadow-primary/30"
        >
          <Plus size={20} />
          Nuevo Administrador
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Total Admins</p>
          <p className="text-3xl font-black text-default-900">{admins.length}</p>
        </Card>
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Activos</p>
          <p className="text-3xl font-black text-success">{admins.filter(a => a.status === 'active').length}</p>
        </Card>
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Inactivos</p>
          <p className="text-3xl font-black text-danger">{admins.filter(a => a.status === 'inactive').length}</p>
        </Card>
      </div>

      <AdminsTable 
        admins={admins} 
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {isModalOpen && (
        <AdminModal 
          isOpen={isModalOpen} 
          onOpenChange={handleOpenChange} 
          onSubmit={handleFormSubmit} 
          admin={editingAdmin}
          isLoading={isSaving}
        />
      )}
    </div>
  );
}

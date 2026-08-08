import { useState } from "react";
import { Button, Card } from "@heroui/react";
import { Plus, Building } from "lucide-react";
import { EmpresasTable } from "../components/EmpresasTable";
import { EmpresaModal } from "../components/EmpresaModal";
import { useEmpresas } from "../hooks/useEmpresas";
import type { Empresa } from "../services/empresasService";

export default function EmpresasPage() {
  const { 
    empresas, 
    isLoading, 
    isError, 
    error,
    createEmpresa, 
    updateEmpresa, 
    deleteEmpresa 
  } = useEmpresas();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);

  const handleOpenChange = () => {
    if (isModalOpen) {
      setEditingEmpresa(null);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleEditClick = (empresa: Empresa) => {
    setEditingEmpresa(empresa);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingEmpresa(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingEmpresa) {
        await updateEmpresa({ id: editingEmpresa.id, data });
      } else {
        await createEmpresa(data);
      }
    } catch (err) {
      console.error("Error guardando empresa:", err);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta empresa? Todos sus productos y suscripciones podrían verse afectados.")) {
      try {
        await deleteEmpresa(id);
      } catch (err) {
        console.error("Error eliminando empresa:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-primary/70 font-semibold animate-pulse">Cargando empresas...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-danger font-bold text-lg">Ocurrió un error al cargar las empresas</p>
        <p className="text-default-500 max-w-md">{(error as Error)?.message || "Error desconocido"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-default-900 flex items-center gap-3">
            <Building className="text-primary" size={32} />
            Gestión de Empresas (Tenants B2B)
          </h1>
          <p className="text-default-500 font-medium">Administra las marcas, distribuidoras y tiendas registradas en la plataforma.</p>
        </div>
        <Button 
          onPress={handleAddClick}
          className="bg-primary text-white font-bold h-12 px-6 rounded-2xl shadow-lg shadow-primary/30"
        >
          <Plus size={20} />
          Nueva Empresa
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Total Empresas</p>
          <p className="text-3xl font-black text-default-900">{empresas.length}</p>
        </Card>
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Activas</p>
          <p className="text-3xl font-black text-success">{empresas.filter(e => e.status === 'active').length}</p>
        </Card>
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Inactivas</p>
          <p className="text-3xl font-black text-danger">{empresas.filter(e => e.status === 'inactive').length}</p>
        </Card>
      </div>

      <EmpresasTable 
        empresas={empresas} 
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {isModalOpen && (
        <EmpresaModal 
          isOpen={isModalOpen} 
          onOpenChange={handleOpenChange} 
          onSubmit={handleFormSubmit} 
          empresa={editingEmpresa}
        />
      )}
    </div>
  );
}

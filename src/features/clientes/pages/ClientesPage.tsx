import { useState } from "react";
import { Button, Card, toast } from "@heroui/react";
import { Plus, Users } from "lucide-react";
import { ClientesTable } from "../components/ClientesTable";
import { ClienteModal } from "../components/ClienteModal";
import { useClientes } from "../hooks/useClientes";
import type { Cliente } from "../types";

export default function ClientesPage() {
  const { 
    clientes, 
    isLoading, 
    isError, 
    error,
    createCliente, 
    updateCliente, 
    deleteCliente 
  } = useClientes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenChange = () => {
    if (isModalOpen) {
      setEditingCliente(null);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleEditClick = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingCliente(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      if (editingCliente) {
        await updateCliente({ id: editingCliente.id, data });
        toast.success("¡Cliente actualizado con éxito!");
      } else {
        await createCliente(data);
        toast.success("¡Cliente creado con éxito!");
      }
      setIsModalOpen(false);
      setEditingCliente(null);
    } catch (err: any) {
      console.error("Error guardando cliente:", err);
      toast.error(err?.message || "Ocurrió un error al guardar el cliente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        await deleteCliente(id);
        toast.success("¡Cliente eliminado con éxito!");
      } catch (err: any) {
        console.error("Error eliminando cliente:", err);
        toast.error(err?.message || "Ocurrió un error al eliminar el cliente.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-primary/70 font-semibold animate-pulse">Cargando clientes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-danger font-bold text-lg">Ocurrió un error al cargar los clientes</p>
        <p className="text-default-500 max-w-md">{(error as Error)?.message || "Error desconocido"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-default-900 flex items-center gap-3">
            <Users className="text-primary" size={32} />
            Clientes
          </h1>
          <p className="text-default-500 font-medium">Gestiona la base de datos de tus clientes y sus contactos.</p>
        </div>
        <Button 
          onPress={handleAddClick}
          className="bg-primary text-white font-bold h-12 px-6 rounded-2xl shadow-lg shadow-primary/30"
        >
          <Plus size={20} />
          Nuevo Cliente
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Total Clientes</p>
          <p className="text-3xl font-black text-default-900">{clientes.length}</p>
        </Card>
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Activos</p>
          <p className="text-3xl font-black text-success">{clientes.filter(c => c.status === 'active').length}</p>
        </Card>
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Inactivos</p>
          <p className="text-3xl font-black text-danger">{clientes.filter(c => c.status === 'inactive').length}</p>
        </Card>
      </div>

      <ClientesTable 
        clientes={clientes} 
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {isModalOpen && (
        <ClienteModal 
          isOpen={isModalOpen} 
          onOpenChange={handleOpenChange} 
          onSubmit={handleFormSubmit} 
          cliente={editingCliente}
          isLoading={isSaving}
        />
      )}
    </div>
  );
}

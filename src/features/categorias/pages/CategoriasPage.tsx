import { useState } from "react";
import { Button, Card } from "@heroui/react";
import { Plus, Tag } from "lucide-react";
import { CategoriasTable } from "../components/CategoriasTable";
import { CategoriaModal } from "../components/CategoriaModal";
import { useCategorias } from "../hooks/useCategorias";
import type { Categoria } from "../types";

export default function CategoriasPage() {
  const { 
    categorias, 
    isLoading, 
    isError, 
    error,
    createCategoria, 
    updateCategoria, 
    deleteCategoria 
  } = useCategorias();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

  const handleOpenChange = () => {
    if (isModalOpen) {
      setEditingCategoria(null);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleEditClick = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingCategoria(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Categoria>) => {
    try {
      if (editingCategoria) {
        await updateCategoria({ id: editingCategoria.id, data });
      } else {
        await createCategoria(data);
      }
    } catch (err) {
      console.error("Error guardando categoría:", err);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría? Esto podría afectar a los productos asociados.")) {
      try {
        await deleteCategoria(id);
      } catch (err) {
        console.error("Error eliminando categoría:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-primary/70 font-semibold animate-pulse">Cargando categorías...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-danger font-bold text-lg">Ocurrió un error al cargar las categorías</p>
        <p className="text-default-500 max-w-md">{(error as Error)?.message || "Error desconocido"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-default-900 flex items-center gap-3">
            <Tag className="text-primary" size={32} />
            Categorías
          </h1>
          <p className="text-default-500 font-medium">Gestiona las categorías del catálogo para organizar tus fragancias.</p>
        </div>
        <Button 
          onPress={handleAddClick}
          className="bg-primary text-white font-bold h-12 px-6 rounded-2xl shadow-lg shadow-primary/30"
        >
          <Plus size={20} />
          Nueva Categoría
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Total Categorías</p>
          <p className="text-3xl font-black text-default-900">{categorias.length}</p>
        </Card>
      </div>

      <CategoriasTable 
        categorias={categorias} 
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <CategoriaModal 
        isOpen={isModalOpen} 
        onOpenChange={handleOpenChange} 
        onSubmit={handleFormSubmit}
        categoria={editingCategoria}
      />
    </div>
  );
}

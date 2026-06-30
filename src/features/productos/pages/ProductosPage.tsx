import { useState } from "react";
import { Button, Card } from "@heroui/react";
import { Plus, Package } from "lucide-react";
import { ProductosTable } from "../components/ProductosTable";
import { ProductoModal } from "../components/ProductoModal";
import { ProductoFichaModal } from "../components/ProductoFichaModal";
import { useProductos } from "../hooks/useProductos";
import type { Producto } from "../types";

export default function ProductosPage() {
  const { 
    productos, 
    isLoading, 
    isError, 
    error,
    createProducto, 
    updateProducto, 
    deleteProducto 
  } = useProductos();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [fichaProducto, setFichaProducto] = useState<Producto | null>(null);

  const handleOpenChange = () => {
    if (isModalOpen) {
      setEditingProducto(null);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleEditClick = (producto: Producto) => {
    setEditingProducto(producto);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingProducto(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Producto>) => {
    try {
      if (editingProducto) {
        await updateProducto({ id: editingProducto.id, data });
      } else {
        await createProducto(data);
      }
    } catch (err) {
      console.error("Error guardando producto:", err);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProducto(id);
      } catch (err) {
        console.error("Error eliminando producto:", err);
      }
    }
  };

  if (isError) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-danger font-bold text-lg">Ocurrió un error al cargar los productos</p>
        <p className="text-default-500 max-w-md">{(error as Error)?.message || "Error desconocido"}</p>
      </div>
    );
  }

  const safeProductos = productos || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-default-900 flex items-center gap-3">
            <Package className="text-primary" size={32} />
            Catálogo de Perfumes
          </h1>
          <p className="text-default-500 font-medium">Gestiona tu inventario, detalles técnicos y precios de perfumes.</p>
        </div>
        <Button 
          onPress={handleAddClick}
          className="bg-primary text-white font-bold h-12 px-6 rounded-2xl shadow-lg shadow-primary/30"
          isDisabled={isLoading}
        >
          <Plus size={20} />
          Nuevo Perfume
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Total Perfumes</p>
          <p className="text-3xl font-black text-default-900">
            {isLoading ? "..." : safeProductos.length}
          </p>
        </Card>
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Activos</p>
          <p className="text-3xl font-black text-success">
            {isLoading ? "..." : safeProductos.filter(p => p.status === 'active').length}
          </p>
        </Card>
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Valor Inventario</p>
          <p className="text-3xl font-black text-primary">
            {isLoading ? "..." : `$${safeProductos.reduce((acc, curr) => acc + (curr.precioTienda || 0), 0).toFixed(2)}`}
          </p>
        </Card>
      </div>

      <ProductosTable 
        productos={safeProductos} 
        isLoading={isLoading}
        onViewFicha={(producto) => setFichaProducto(producto)}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <ProductoModal 
        isOpen={isModalOpen} 
        onOpenChange={handleOpenChange} 
        onSubmit={handleFormSubmit}
        producto={editingProducto}
      />

      <ProductoFichaModal
        isOpen={!!fichaProducto}
        onOpenChange={() => setFichaProducto(null)}
        producto={fichaProducto}
      />
    </div>
  );
}

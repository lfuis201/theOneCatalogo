import { useGlobalProducts } from "../hooks/useGlobalProducts";
import { Table, Button, Tooltip, Card } from "@heroui/react";
import { Trash2, Package, Tag } from "lucide-react";

export default function ProductosGlobalesPage() {
  const { products, isLoading, isError, deleteProduct } = useGlobalProducts();

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto globalmente?")) {
      try {
        await deleteProduct(id);
      } catch (err) {
        console.error("Error al eliminar producto:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-primary/70 font-semibold animate-pulse">Cargando catálogo global...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-danger font-bold text-lg">Error al cargar productos globales</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-default-900 flex items-center gap-3">
            <Package className="text-primary" size={32} />
            Catálogo Global de Productos
          </h1>
          <p className="text-default-500 font-medium">Supervisa todos los productos creados por los administradores de la plataforma.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Total de Productos en Plataforma</p>
          <p className="text-3xl font-black text-default-900">{products.length}</p>
        </Card>
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Categoría Principal</p>
          <p className="text-3xl font-black text-primary">Perfumería B2B</p>
        </Card>
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Tabla de productos globales" className="min-w-[700px]">
            <Table.Header>
              <Table.Column isRowHeader>Producto</Table.Column>
              <Table.Column>Categoría</Table.Column>
              <Table.Column>Administrador / Empresa</Table.Column>
              <Table.Column>Precio</Table.Column>
              <Table.Column>Acciones</Table.Column>
            </Table.Header>
            <Table.Body>
              {products.map((item) => (
                <Table.Row key={item.id} id={item.id}>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-default-900">{item.nombre}</span>
                      <span className="text-tiny text-default-400">{item.marca}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-default-600 font-semibold">{item.categoria}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-default-700">{item.adminNombre}</span>
                      <span className="text-tiny text-default-400">{item.adminEmpresa} ({item.adminEmail})</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm font-bold text-default-900">${item.precioTienda.toFixed(2)}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Tooltip color="danger" content="Eliminar de la plataforma">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        className="text-danger"
                        onPress={() => handleDeleteProduct(item.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </Tooltip>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}

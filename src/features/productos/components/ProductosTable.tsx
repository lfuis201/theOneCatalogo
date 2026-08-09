import React from "react";
import { 
  Table,
  Chip, 
  Tooltip, 
  Button,
  Skeleton,
} from "@heroui/react";
import { Edit, Trash2, Eye } from "lucide-react";
import type { Producto } from "../types";

interface ProductosTableProps {
  productos: Producto[];
  isLoading?: boolean;
  onViewFicha?: (producto: Producto) => void;
  onEdit?: (producto: Producto) => void;
  onDelete?: (id: string) => void;
}

export function ProductosTable({ productos, isLoading, onViewFicha, onEdit, onDelete }: ProductosTableProps) {
  const columns = [
    { name: "Producto", id: "nombre" },
    { name: "Detalles", id: "detalles" },
    { name: "Categoría", id: "categoria" },
    { name: "Precio", id: "precio" },
    { name: "Acciones", id: "actions" },
  ];

  const renderCell = (producto: Producto, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-default-100 border border-default-200 overflow-hidden flex items-center justify-center shrink-0">
              {producto.imagen ? (
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-xs font-black text-default-400">
                  {producto.nombre.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-wider text-primary/70">{producto.marca}</span>
              <span className="text-sm font-bold text-default-900">{producto.nombre}</span>
            </div>
          </div>
        );
      case "detalles":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-default-700">{producto.familiaOlfativa}</p>
            <p className="text-bold text-tiny text-default-400">{producto.volumen}</p>
          </div>
        );
      case "categoria":
        const getCatColor = (cat: Producto['categoria']) => {
          if (cat === 'Dama') return 'danger';
          if (cat === 'Caballero') return 'primary';
          if (cat === 'Unisex') return 'secondary';
          return 'default';
        };
        return (
          <Chip
            className="capitalize font-bold border-none"
            color={getCatColor(producto.categoria)}
            size="sm"
            variant="flat"
          >
            {producto.categoria || "Unisex"}
          </Chip>
        );
      case "precio":
        return (
          <span className="text-sm font-bold text-default-900">
            ${producto.precioTienda.toFixed(2)}
          </span>
        );

      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Ver ficha técnica">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                className="text-primary hover:bg-primary/10"
                onPress={() => onViewFicha?.(producto)}
              >
                <Eye size={18} />
              </Button>
            </Tooltip>
            <Tooltip content="Editar producto">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                className="text-default-400 hover:text-primary"
                onPress={() => onEdit?.(producto)}
              >
                <Edit size={18} />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar producto">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                className="text-danger"
                onPress={() => onDelete?.(producto.id)}
              >
                <Trash2 size={18} />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Tabla de productos" className="min-w-[800px]">
          <Table.Header>
            <Table.Column isRowHeader>Producto</Table.Column>
            <Table.Column>Detalles</Table.Column>
            <Table.Column>Categoría</Table.Column>
            <Table.Column>Precio</Table.Column>
            <Table.Column>Acciones</Table.Column>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Table.Row key={`skeleton-${index}`} id={`skeleton-${index}`}>
                  <Table.Cell>
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-3 w-12 rounded-lg" />
                      <Skeleton className="h-4 w-32 rounded-lg" />
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-4 w-24 rounded-lg" />
                      <Skeleton className="h-3.5 w-16 rounded-lg" />
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton className="h-4 w-12 rounded-lg" />
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              productos.map((item) => (
                <Table.Row key={item.id} id={item.id}>
                  <Table.Cell>{renderCell(item, "nombre")}</Table.Cell>
                  <Table.Cell>{renderCell(item, "detalles")}</Table.Cell>
                  <Table.Cell>{renderCell(item, "categoria")}</Table.Cell>
                  <Table.Cell>{renderCell(item, "precio")}</Table.Cell>
                  <Table.Cell>{renderCell(item, "actions")}</Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

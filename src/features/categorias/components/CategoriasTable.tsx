import React from "react";
import { 
  Table,
  Tooltip, 
  Button,
} from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import type { Categoria } from "../types";

interface CategoriasTableProps {
  categorias: Categoria[];
  onEdit?: (categoria: Categoria) => void;
  onDelete?: (id: string) => void;
}

export function CategoriasTable({ categorias, onEdit, onDelete }: CategoriasTableProps) {
  const columns = [
    { name: "Categoría", id: "nombre" },
    { name: "Fecha de Creación", id: "fecha" },
    { name: "Acciones", id: "actions" },
  ];

  const renderCell = (categoria: Categoria, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return (
          <span className="text-sm font-bold text-default-900">
            {categoria.nombre}
          </span>
        );
      case "fecha":
        return (
          <span className="text-sm text-default-500 font-medium">
            {categoria.created_at ? new Date(categoria.created_at).toLocaleDateString() : "N/A"}
          </span>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Editar categoría">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                className="text-default-400 hover:text-primary"
                onPress={() => onEdit?.(categoria)}
              >
                <Edit size={18} />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar categoría">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                className="text-danger"
                onPress={() => onDelete?.(categoria.id)}
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
        <Table.Content aria-label="Tabla de categorías" className="min-w-[600px]">
          <Table.Header>
            <Table.Column isRowHeader>Categoría</Table.Column>
            <Table.Column>Fecha de Creación</Table.Column>
            <Table.Column>Acciones</Table.Column>
          </Table.Header>
          <Table.Body>
            {categorias.map((item) => (
              <Table.Row key={item.id} id={item.id}>
                <Table.Cell>{renderCell(item, "nombre")}</Table.Cell>
                <Table.Cell>{renderCell(item, "fecha")}</Table.Cell>
                <Table.Cell>{renderCell(item, "actions")}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

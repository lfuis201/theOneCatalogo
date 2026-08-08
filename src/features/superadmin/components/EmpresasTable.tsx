import React from "react";
import { 
  Table,
  Chip, 
  Tooltip, 
  Button,
} from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import type { Empresa } from "../services/empresasService";

interface EmpresasTableProps {
  empresas: Empresa[];
  onEdit?: (empresa: Empresa) => void;
  onDelete?: (id: string) => void;
}

export function EmpresasTable({ empresas, onEdit, onDelete }: EmpresasTableProps) {
  const renderCell = (empresa: Empresa, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            {empresa.logo_url ? (
              <img src={empresa.logo_url} alt={empresa.nombre} className="w-10 h-10 rounded-xl object-cover border border-zinc-100 shadow-sm" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                {empresa.nombre.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm font-bold text-default-900">{empresa.nombre}</span>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={empresa.status === "active" ? "success" : "danger"}
            size="sm"
            variant="flat"
          >
            {empresa.status === "active" ? "Activo" : "Inactivo"}
          </Chip>
        );
      case "created_at":
        return (
          <span className="text-sm text-default-500 font-medium">
            {new Date(empresa.created_at).toLocaleDateString()}
          </span>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Editar Empresa">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                className="text-default-400 hover:text-primary"
                onPress={() => onEdit?.(empresa)}
              >
                <Edit size={18} />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar Empresa">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                className="text-danger"
                onPress={() => onDelete?.(empresa.id)}
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
        <Table.Content aria-label="Tabla de empresas" className="min-w-[600px]">
          <Table.Header>
            <Table.Column isRowHeader>Empresa / Tienda</Table.Column>
            <Table.Column>Estado</Table.Column>
            <Table.Column>Fecha de Registro</Table.Column>
            <Table.Column>Acciones</Table.Column>
          </Table.Header>
          <Table.Body>
            {empresas.map((item) => (
              <Table.Row key={item.id} id={item.id}>
                <Table.Cell>{renderCell(item, "name")}</Table.Cell>
                <Table.Cell>{renderCell(item, "status")}</Table.Cell>
                <Table.Cell>{renderCell(item, "created_at")}</Table.Cell>
                <Table.Cell>{renderCell(item, "actions")}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

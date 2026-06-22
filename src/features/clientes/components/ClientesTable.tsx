import React from "react";
import { 
  Table,
  Chip, 
  Tooltip, 
  Button,
} from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import type { Cliente } from "../types";

interface ClientesTableProps {
  clientes: Cliente[];
  onEdit?: (cliente: Cliente) => void;
  onDelete?: (id: string) => void;
}

export function ClientesTable({ clientes, onEdit, onDelete }: ClientesTableProps) {
  const renderCell = (cliente: Cliente, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-default-900">{cliente.nombre}</span>
            <span className="text-tiny text-default-400">{cliente.email}</span>
          </div>
        );
      case "empresa":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-default-700">{cliente.empresa || "Particular"}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{cliente.telefono}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={cliente.status === "active" ? "success" : "danger"}
            size="sm"
            variant="flat"
          >
            {cliente.status === "active" ? "Activo" : "Inactivo"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Editar cliente">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                className="text-default-400 hover:text-primary"
                onPress={() => onEdit?.(cliente)}
              >
                <Edit size={18} />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar cliente">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                className="text-danger"
                onPress={() => onDelete?.(cliente.id)}
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
        <Table.Content aria-label="Tabla de clientes" className="min-w-[600px]">
          <Table.Header>
            <Table.Column isRowHeader>Cliente</Table.Column>
            <Table.Column>Empresa</Table.Column>
            <Table.Column>Estado</Table.Column>
            <Table.Column>Acciones</Table.Column>
          </Table.Header>
          <Table.Body>
            {clientes.map((item) => (
              <Table.Row key={item.id} id={item.id}>
                <Table.Cell>{renderCell(item, "name")}</Table.Cell>
                <Table.Cell>{renderCell(item, "empresa")}</Table.Cell>
                <Table.Cell>{renderCell(item, "status")}</Table.Cell>
                <Table.Cell>{renderCell(item, "actions")}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

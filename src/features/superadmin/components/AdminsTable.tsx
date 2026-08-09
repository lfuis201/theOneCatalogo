import React from "react";
import { 
  Table,
  Chip, 
  Tooltip, 
  Button,
} from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import type { AdminUser } from "../types";

interface AdminsTableProps {
  admins: AdminUser[];
  onEdit?: (admin: AdminUser) => void;
  onDelete?: (id: string) => void;
}

export function AdminsTable({ admins, onEdit, onDelete }: AdminsTableProps) {
  const renderCell = (admin: AdminUser, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-default-900">{admin.nombre}</span>
            <span className="text-tiny text-default-400">{admin.email}</span>
          </div>
        );
      case "empresa":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-default-700">{admin.empresa || "Sin Empresa"}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{admin.telefono}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={admin.status === "active" ? "success" : "danger"}
            size="sm"
            variant="flat"
          >
            {admin.status === "active" ? "Activo" : "Inactivo"}
          </Chip>
        );
      case "limite_licencias":
        const hasGold = admin.plan_activo === "VIP Gold Perfumer";
        const hasSilver = admin.plan_activo === "Silver Collector";
        const creadas = admin.licencias_creadas || 0;
        
        return (
          <div className="flex flex-col gap-1">
            <Chip
              className="capitalize border-none font-bold"
              color={hasGold ? "primary" : hasSilver ? "success" : "warning"}
              size="sm"
              variant="flat"
            >
              {hasGold ? "VIP Gold Perfumer" : hasSilver ? "Silver Collector" : "Sin Suscripción"}
            </Chip>
            <span className="text-tiny font-bold text-default-500 ml-1">
              📊 {creadas} Licencia(s) vendida(s)
            </span>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Editar Administrador">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                className="text-default-400 hover:text-primary"
                onPress={() => onEdit?.(admin)}
              >
                <Edit size={18} />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar Administrador">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                className="text-danger"
                onPress={() => onDelete?.(admin.id)}
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
        <Table.Content aria-label="Tabla de administradores" className="min-w-[600px]">
          <Table.Header>
            <Table.Column isRowHeader>Administrador</Table.Column>
            <Table.Column>Empresa/Negocio</Table.Column>
            <Table.Column>Estado</Table.Column>
            <Table.Column>Plan / Licencias</Table.Column>
            <Table.Column>Acciones</Table.Column>
          </Table.Header>
          <Table.Body>
            {admins.map((item) => (
              <Table.Row key={item.id} id={item.id}>
                <Table.Cell>{renderCell(item, "name")}</Table.Cell>
                <Table.Cell>{renderCell(item, "empresa")}</Table.Cell>
                <Table.Cell>{renderCell(item, "status")}</Table.Cell>
                <Table.Cell>{renderCell(item, "limite_licencias")}</Table.Cell>
                <Table.Cell>{renderCell(item, "actions")}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

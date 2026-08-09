import { useState } from "react";
import { Button, Card, Table, toast, Tooltip } from "@heroui/react";
import { Settings, Edit } from "lucide-react";
import { usePlanesConfig } from "../hooks/usePlanesConfig";
import { PlanConfigModal } from "../components/PlanConfigModal";
import type { PlanConfig } from "../services/planesConfigService";

export default function PlanesConfigPage() {
  const { planes, isLoading, isError, error, updatePlan, isUpdating } = usePlanesConfig();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanConfig | null>(null);

  const handleEditClick = (plan: PlanConfig) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (!selectedPlan) return;
    try {
      await updatePlan({ plan: selectedPlan.plan, data });
      toast.success("¡Plan configurado con éxito!");
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error actualizando plan:", err);
      toast.error(err.message || "Ocurrió un error al guardar la configuración del plan.");
    }
  };

  if (isLoading) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-primary/70 font-semibold animate-pulse">Cargando configuración de planes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-danger font-bold text-lg">Error al cargar planes config</p>
        <p className="text-default-500 max-w-md">{(error as Error)?.message || "Error desconocido"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-default-900 flex items-center gap-3">
            <Settings className="text-primary" size={32} />
            Configuración de Planes
          </h1>
          <p className="text-default-500 font-medium">Establece precios, límites de licencias y nombres públicos para los planes de la plataforma.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Total Planes</p>
          <p className="text-3xl font-black text-default-900">{planes.length}</p>
        </Card>
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Tabla de planes config" className="min-w-[700px]">
            <Table.Header>
              <Table.Column isRowHeader>Código Plan</Table.Column>
              <Table.Column>Nombre Público</Table.Column>
              <Table.Column>Precio Sugerido</Table.Column>
              <Table.Column>Límite de Licencias</Table.Column>
              <Table.Column>Acciones</Table.Column>
            </Table.Header>
            <Table.Body>
              {planes.map((item) => (
                <Table.Row key={item.plan} id={item.plan}>
                  <Table.Cell>
                    <span className="font-bold text-default-900">{item.plan}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm font-medium text-default-700">{item.nombre_legible}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-bold text-[#C5A028]">${Number(item.precio_sugerido).toFixed(2)} USD</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm font-bold text-primary">{item.limite_suscripciones} Licencias</span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="relative flex items-center gap-2">
                      <Tooltip content="Configurar Plan">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light" 
                          className="text-default-400 hover:text-primary"
                          onPress={() => handleEditClick(item)}
                        >
                          <Edit size={18} />
                        </Button>
                      </Tooltip>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      {isModalOpen && (
        <PlanConfigModal 
          isOpen={isModalOpen}
          onOpenChange={() => setIsModalOpen(!isModalOpen)}
          onSubmit={handleFormSubmit}
          plan={selectedPlan}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
}

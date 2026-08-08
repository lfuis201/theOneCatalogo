import { useGlobalSubscriptions } from "../hooks/useGlobalSubscriptions";
import { Table, Button, Tooltip, Card, Chip } from "@heroui/react";
import { Trash2, CreditCard, DollarSign } from "lucide-react";

export default function SuscripcionesGlobalesPage() {
  const { subscriptions, isLoading, isError, deleteSubscription, updateSubscriptionStatus } = useGlobalSubscriptions();

  const handleDeleteSubscription = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta suscripción? Esto cancelará la licencia de inmediato.")) {
      try {
        await deleteSubscription(id);
      } catch (err) {
        console.error("Error al eliminar suscripción:", err);
      }
    }
  };

  const handleToggleStatus = async (item: any) => {
    const nextStatus = item.status === 'Active' ? 'Paused' : 'Active';
    try {
      await updateSubscriptionStatus({ id: item.id, status: nextStatus });
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Active') return "success";
    if (status === 'Paused') return "warning";
    return "danger";
  };

  if (isLoading) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-primary/70 font-semibold animate-pulse">Cargando licencias globales...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-danger font-bold text-lg">Error al cargar suscripciones globales</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-default-900 flex items-center gap-3">
            <CreditCard className="text-primary" size={32} />
            Licencias y Suscripciones Globales
          </h1>
          <p className="text-default-500 font-medium">Controla y activa/cancela de forma manual las licencias de la plataforma y de los clientes.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Total de Suscripciones</p>
          <p className="text-3xl font-black text-default-900">{subscriptions.length}</p>
        </Card>
        <Card className="p-4 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Suscripciones Activas</p>
          <p className="text-3xl font-black text-success">{subscriptions.filter(s => s.status === 'Active').length}</p>
        </Card>
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Tabla de suscripciones globales" className="min-w-[800px]">
            <Table.Header>
              <Table.Column isRowHeader>Suscriptor</Table.Column>
              <Table.Column>Plan</Table.Column>
              <Table.Column>Estado</Table.Column>
              <Table.Column>Administrador / Empresa</Table.Column>
              <Table.Column>Precio</Table.Column>
              <Table.Column>Próxima Renovación</Table.Column>
              <Table.Column>Acciones</Table.Column>
            </Table.Header>
            <Table.Body>
              {subscriptions.map((item) => (
                <Table.Row key={item.id} id={item.id}>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-default-900">{item.clienteNombre}</span>
                      <span className="text-tiny text-default-400">{item.clienteEmail}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Chip size="sm" variant="flat" color="secondary" className="font-bold">
                      {item.plan}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <Tooltip content="Haz clic para activar/pausar rápidamente">
                      <Chip
                        color={getStatusColor(item.status)}
                        size="sm"
                        variant="flat"
                        className="font-bold cursor-pointer hover:opacity-85 transition-opacity"
                        onPress={() => handleToggleStatus(item)}
                      >
                        {item.status === 'Active' ? 'Activo' : item.status === 'Paused' ? 'Pausado' : 'Cancelado'}
                      </Chip>
                    </Tooltip>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-default-700">{item.adminNombre}</span>
                      <span className="text-tiny text-default-400">{item.adminEmpresa}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm font-bold text-default-900">${item.price.toFixed(2)}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-default-600 font-medium">{item.nextRenewal}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Tooltip color="danger" content="Eliminar Suscripción">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        className="text-danger"
                        onPress={() => handleDeleteSubscription(item.id)}
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

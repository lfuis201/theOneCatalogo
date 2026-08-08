import { useState, useMemo, useEffect } from "react";
import {
  Button,
  Card,
  Table,
  Chip,
  Tooltip,
  Modal,
  TextField,
  Label,
  InputGroup,
  Select,
  ListBox,
} from "@heroui/react";
import { Plus, CreditCard, Sparkles, Check, Activity, Trash2, ShieldAlert, Edit, DollarSign } from "lucide-react";
import { useSuscripciones } from "../hooks/useSuscripciones";
import { useClientes } from "../../clientes/hooks/useClientes";
import { SuscripcionPagosModal } from "../components/SuscripcionPagosModal";
import type { Subscription, SubscriptionPlan } from "../types";

export default function SuscripcionesPage() {
  const {
    subscriptions,
    isLoading: isLoadingSubs,
    isError: isErrorSubs,
    error: errorSubs,
    createSuscripcion,
    updateSuscripcion,
    deleteSuscripcion,
    createPayment,
    deletePayment,
  } = useSuscripciones();

  const { clientes, isLoading: isLoadingClientes } = useClientes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [isPagosModalOpen, setIsPagosModalOpen] = useState(false);
  const [selectedSubForPagos, setSelectedSubForPagos] = useState<Subscription | null>(null);

  // Form States
  const [selectedUsuarioId, setSelectedUsuarioId] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("Silver Collector");
  const [selectedStatus, setSelectedStatus] = useState<'Active' | 'Paused' | 'Cancelled'>("Active");
  const [customPrice, setCustomPrice] = useState("29.00");
  const [startDate, setStartDate] = useState("");
  const [nextRenewal, setNextRenewal] = useState("");

  // Sync price when plan changes during creation
  useEffect(() => {
    if (!editingSub) {
      if (selectedPlan === 'Bronze Decanter') setCustomPrice("15.00");
      else if (selectedPlan === 'Silver Collector') setCustomPrice("29.00");
      else if (selectedPlan === 'VIP Gold Perfumer') setCustomPrice("49.00");
    }
  }, [selectedPlan, editingSub]);

  // Reset form states when modal opens/closes or when editingSub changes
  useEffect(() => {
    if (editingSub && isOpen) {
      setSelectedUsuarioId(""); // Cannot change user on edit usually, but keep it empty or bound
      setSelectedPlan(editingSub.plan);
      setSelectedStatus(editingSub.status);
      setCustomPrice(editingSub.price.toString());
      setStartDate(editingSub.startDate);
      setNextRenewal(editingSub.nextRenewal);
    } else if (isOpen) {
      setSelectedUsuarioId("");
      setSelectedPlan("Silver Collector");
      setSelectedStatus("Active");
      setCustomPrice("29.00");
      setStartDate(new Date().toISOString().split("T")[0]);
      setNextRenewal(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    }
  }, [editingSub, isModalOpen]);

  const isOpen = isModalOpen;

  const handleOpenChange = () => {
    if (isModalOpen) {
      setEditingSub(null);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleEditClick = (sub: Subscription) => {
    setEditingSub(sub);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingSub(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSub) {
        await updateSuscripcion({
          id: editingSub.id,
          updates: {
            plan: selectedPlan,
            status: selectedStatus,
            price: Number(customPrice),
            startDate,
            nextRenewal,
          }
        });
      } else {
        if (!selectedUsuarioId) return alert("Por favor selecciona un cliente.");
        await createSuscripcion({
          usuarioId: selectedUsuarioId,
          plan: selectedPlan,
          status: selectedStatus,
          price: Number(customPrice),
          startDate,
          nextRenewal,
        });
      }
      setIsModalOpen(false);
      setEditingSub(null);
    } catch (err) {
      console.error("Error guardando suscripción:", err);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta suscripción?")) {
      try {
        await deleteSuscripcion(id);
      } catch (err) {
        console.error("Error eliminando suscripción:", err);
      }
    }
  };

  // Toggle status quickly
  const handleToggleStatus = async (sub: Subscription) => {
    const nextStatusMap: Record<Subscription['status'], Subscription['status']> = {
      'Active': 'Paused',
      'Paused': 'Active',
      'Cancelled': 'Active',
    };
    const nextStatus = nextStatusMap[sub.status];
    try {
      await updateSuscripcion({
        id: sub.id,
        updates: { status: nextStatus }
      });
    } catch (err) {
      console.error("Error actualizando estado de suscripción:", err);
    }
  };

  // Summary Metrics
  const metrics = useMemo(() => {
    const activeSubs = subscriptions.filter(s => s.status === 'Active');
    const mrr = activeSubs.reduce((acc, curr) => acc + curr.price, 0);
    const vipCount = subscriptions.filter(s => s.plan === 'VIP Gold Perfumer' && s.status === 'Active').length;
    return {
      mrr,
      activeCount: activeSubs.length,
      vipCount
    };
  }, [subscriptions]);

  const getPlanColor = (plan: SubscriptionPlan) => {
    if (plan === 'VIP Gold Perfumer') return "warning";
    if (plan === 'Silver Collector') return "secondary";
    return "default";
  };

  const getStatusColor = (status: Subscription['status']) => {
    if (status === 'Active') return "success";
    if (status === 'Paused') return "warning";
    return "danger";
  };

  if (isLoadingSubs || isLoadingClientes) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-primary/70 font-semibold animate-pulse">Cargando suscripciones...</p>
      </div>
    );
  }

  if (isErrorSubs) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-danger font-bold text-lg">Ocurrió un error al cargar las suscripciones</p>
        <p className="text-default-500 max-w-md">{(errorSubs as Error)?.message || "Error desconocido"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-default-900 flex items-center gap-3">
            <CreditCard className="text-primary" size={32} />
            Licencias
          </h1>
          <p className="text-default-500 font-medium">Gestión del Club de Perfumes y suscripciones de decants mensuales.</p>
        </div>
        <Button
          onPress={handleAddClick}
          className="bg-primary text-white font-bold h-12 px-6 rounded-2xl shadow-lg shadow-primary/30"
        >
          <Plus size={20} />
          Nueva Suscripción
        </Button>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white flex flex-row items-center justify-between">
          <div>
            <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Ingresos Estimados</p>
            <p className="text-3xl font-black text-default-900">${metrics.mrr.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-primary/10 rounded-2xl text-primary">
            <DollarSign size={24} />
          </div>
        </Card>
        <Card className="p-6 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white flex flex-row items-center justify-between">
          <div>
            <p className="text-sm font-bold text-default-400 uppercase tracking-wider mb-1">Suscripciones Activas</p>
            <p className="text-3xl font-black text-success">{metrics.activeCount}</p>
          </div>
          <div className="p-4 bg-success/10 rounded-2xl text-success">
            <Activity size={24} />
          </div>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-default-800 tracking-tight">Listado de Suscriptores</h2>
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Tabla de suscripciones" className="min-w-[600px]">
              <Table.Header>
                <Table.Column isRowHeader>Suscriptor</Table.Column>
                <Table.Column>Plan</Table.Column>
                <Table.Column>Estado</Table.Column>
                <Table.Column>Pago</Table.Column>
                <Table.Column>Renovación</Table.Column>
                <Table.Column>Acciones</Table.Column>
              </Table.Header>
              <Table.Body>
                {subscriptions.map((item) => (
                  <Table.Row key={item.id} id={item.id}>

                    {/* Subscriber cell */}
                    <Table.Cell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-default-900">{item.clienteNombre}</span>
                        <span className="text-tiny text-default-400">{item.clienteEmail}</span>
                      </div>
                    </Table.Cell>

                    {/* Plan cell */}
                    <Table.Cell>
                      <Chip
                        color={getPlanColor(item.plan)}
                        size="sm"
                        variant="flat"
                        className="font-bold border-none"
                      >
                        {item.plan === "Silver Collector" ? "Licencia App" : item.plan}
                      </Chip>
                    </Table.Cell>

                    {/* Status cell */}
                    <Table.Cell>
                      <Tooltip content="Haz clic para activar/pausar rápidamente">
                        <Chip
                          color={getStatusColor(item.status)}
                          size="sm"
                          variant="flat"
                          className="font-bold border-none cursor-pointer hover:opacity-85 transition-opacity"
                          onPress={() => handleToggleStatus(item)}
                        >
                          {item.status === 'Active' ? 'Activo' : item.status === 'Paused' ? 'Pausado' : 'Cancelado'}
                        </Chip>
                      </Tooltip>
                    </Table.Cell>

                    {/* Payment cell */}
                    <Table.Cell>
                      <span className="text-sm font-bold text-default-900">${item.price.toFixed(2)}</span>
                    </Table.Cell>

                    {/* Renewal cell */}
                    <Table.Cell>
                      <div className="flex flex-col">
                        <span className="text-sm text-default-700 font-bold">{item.nextRenewal}</span>
                        <span className="text-tiny text-default-400">Inició: {item.startDate}</span>
                      </div>
                    </Table.Cell>

                    {/* Actions cell */}
                    <Table.Cell>
                      <div className="relative flex items-center justify-center gap-2">
                        <Tooltip content="Ver Historial de Pagos">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="text-primary hover:bg-primary/10"
                            onPress={() => {
                              setSelectedSubForPagos(item);
                              setIsPagosModalOpen(true);
                            }}
                          >
                            <DollarSign size={18} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Editar suscripción">
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
                        <Tooltip color="danger" content="Eliminar suscripción">
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
                      </div>
                    </Table.Cell>

                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      {/* Add/Edit Subscription Modal */}
      <Modal.Backdrop isOpen={isModalOpen} onOpenChange={handleOpenChange}>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[500px] bg-background border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
            <Modal.CloseTrigger />
            <form onSubmit={handleFormSubmit} className="flex flex-col max-h-[90vh]">
              <Modal.Header className="flex flex-col gap-1 p-8 border-b border-default-100">
                <Modal.Heading className="text-2xl font-black text-default-900">
                  {editingSub ? "Editar Suscripción" : "Activar Nueva Suscripción"}
                </Modal.Heading>
                <p className="text-sm text-default-500 font-medium tracking-wide">
                  {editingSub
                    ? `Editando suscripción de ${editingSub.clienteNombre}`
                    : "Vincula un cliente a un plan de decants mensuales."}
                </p>
              </Modal.Header>

              <Modal.Body className="gap-6 p-8 overflow-y-auto min-h-0">

                {/* Cliente Selector (only visible on creation) */}
                {!editingSub && (
                  <Select
                    value={selectedUsuarioId}
                    onChange={(val) => setSelectedUsuarioId(val as string)}
                    placeholder="Selecciona un cliente"
                    className="w-full"
                  >
                    <Label className="text-primary font-bold mb-1 ml-1 text-sm">Cliente</Label>
                    <Select.Trigger className="w-full bg-[#FAFAFA] border border-default-200 rounded-xl px-4 py-2 text-sm text-default-900 focus:outline-none focus:border-primary transition-all cursor-pointer h-11 font-medium flex items-center justify-between">
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {clientes.map((cli) => (
                          <ListBox.Item key={cli.id} id={cli.id} textValue={`${cli.nombre} (${cli.email})`}>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold">{cli.nombre}</span>
                              <span className="text-xs text-default-400">{cli.email}</span>
                            </div>
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                )}

                {/* Plan Selector */}
                <Select
                  value={selectedPlan}
                  onChange={(val) => setSelectedPlan(val as SubscriptionPlan)}
                  placeholder="Selecciona el plan"
                  className="w-full"
                >
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Selecciona el Plan</Label>
                  <Select.Trigger className="w-full bg-[#FAFAFA] border border-default-200 rounded-xl px-4 py-2 text-sm text-default-900 focus:outline-none focus:border-primary transition-all cursor-pointer h-11 font-medium flex items-center justify-between">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="Silver Collector" textValue="Licencia App ($29.00/mes)">Licencia App ($29.00/mes) <ListBox.ItemIndicator /></ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>

                {/* Price (Editable) */}
                <TextField>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Precio Mensual ($)</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Input
                      type="number"
                      placeholder="0.00"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      required
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                </TextField>

                {/* Status Selector */}
                <Select
                  value={selectedStatus}
                  onChange={(val) => setSelectedStatus(val as any)}
                  placeholder="Estado"
                  className="w-full"
                >
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Estado de Suscripción</Label>
                  <Select.Trigger className="w-full bg-[#FAFAFA] border border-default-200 rounded-xl px-4 py-2 text-sm text-default-900 focus:outline-none focus:border-primary transition-all cursor-pointer h-11 font-medium flex items-center justify-between">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="Active" textValue="Activa">Activa <ListBox.ItemIndicator /></ListBox.Item>
                      <ListBox.Item id="Paused" textValue="Pausada">Pausada <ListBox.ItemIndicator /></ListBox.Item>
                      <ListBox.Item id="Cancelled" textValue="Cancelada">Cancelada <ListBox.ItemIndicator /></ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <TextField>
                    <Label className="text-primary font-bold mb-1 ml-1 text-sm">Inicio</Label>
                    <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                      <InputGroup.Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="px-3 text-sm font-medium"
                      />
                    </InputGroup>
                  </TextField>

                  <TextField>
                    <Label className="text-primary font-bold mb-1 ml-1 text-sm">Próxima Renovación</Label>
                    <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                      <InputGroup.Input
                        type="date"
                        value={nextRenewal}
                        onChange={(e) => setNextRenewal(e.target.value)}
                        required
                        className="px-3 text-sm font-medium"
                      />
                    </InputGroup>
                  </TextField>
                </div>

              </Modal.Body>

              <Modal.Footer className="p-8 border-t border-default-100 flex justify-end gap-3">
                <Button
                  variant="flat"
                  color="danger"
                  onPress={handleOpenChange}
                  className="font-bold rounded-xl h-11 px-6"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 h-11 px-6"
                >
                  {editingSub ? "Guardar Cambios" : "Activar Plan"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
      {/* Suscripcion Pagos Modal */}
      <SuscripcionPagosModal
        isOpen={isPagosModalOpen}
        onOpenChange={() => setIsPagosModalOpen(!isPagosModalOpen)}
        subscription={selectedSubForPagos}
        onAddPayment={async (pago) => {
          await createPayment(pago);
        }}
        onDeletePayment={async (id) => {
          await deletePayment(id);
        }}
      />
    </div>
  );
}

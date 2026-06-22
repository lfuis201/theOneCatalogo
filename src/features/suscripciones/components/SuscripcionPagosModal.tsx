import {
  Modal,
  Button,
  TextField,
  Label,
  InputGroup,
  Select,
  ListBox,
  Table,
  Chip,
  Tooltip,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DollarSign, Tag, Trash2, Calendar, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { suscripcionesService } from "../services/suscripcionesService";
import type { Subscription, Pago } from "../types";

const pagoSchema = z.object({
  monto: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number({ invalid_type_error: "El monto debe ser un número" }).min(0.01, "El monto debe ser mayor a 0")
  ),
  metodo: z.enum(["Card", "Transfer", "Cash", "Other"]),
  status: z.enum(["Paid", "Pending", "Failed", "Refunded"]),
  referencia: z.string().optional(),
  comprobanteUrl: z.string().optional(),
});

type PagoFormValues = z.infer<typeof pagoSchema>;

interface SuscripcionPagosModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  subscription: Subscription | null;
  onAddPayment: (pago: {
    suscripcionId: string;
    monto: number;
    metodo: string;
    status: string;
    referencia?: string;
    comprobanteUrl?: string;
  }) => Promise<void>;
  onDeletePayment: (id: string) => Promise<void>;
}

export function SuscripcionPagosModal({
  isOpen,
  onOpenChange,
  subscription,
  onAddPayment,
  onDeletePayment,
}: SuscripcionPagosModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch payments for the subscription
  const { data: payments = [], refetch, isLoading } = useQuery({
    queryKey: ["pagos", subscription?.id],
    queryFn: () => suscripcionesService.getPayments(subscription!.id),
    enabled: !!subscription && isOpen,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PagoFormValues>({
    resolver: zodResolver(pagoSchema),
    defaultValues: {
      monto: undefined,
      metodo: "Card",
      status: "Paid",
      referencia: "",
      comprobanteUrl: "",
    },
  });

  const selectedMetodo = watch("metodo");
  const selectedStatus = watch("status");

  useEffect(() => {
    if (subscription) {
      reset({
        monto: subscription.price,
        metodo: "Card",
        status: "Paid",
        referencia: "",
        comprobanteUrl: "",
      });
    }
    setShowAddForm(false);
  }, [subscription, isOpen, reset]);

  const handleFormSubmit = async (data: PagoFormValues) => {
    if (!subscription) return;
    try {
      await onAddPayment({
        suscripcionId: subscription.id,
        monto: data.monto,
        metodo: data.metodo,
        status: data.status,
        referencia: data.referencia || undefined,
        comprobanteUrl: data.comprobanteUrl || undefined,
      });
      setShowAddForm(false);
      reset({
        monto: subscription.price,
        metodo: "Card",
        status: "Paid",
        referencia: "",
        comprobanteUrl: "",
      });
      void refetch();
    } catch (err) {
      console.error("Error al registrar pago:", err);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro de pago?")) {
      try {
        await onDeletePayment(id);
        void refetch();
      } catch (err) {
        console.error("Error al eliminar pago:", err);
      }
    }
  };

  const getMetodoLabel = (metodo: string) => {
    const map: Record<string, string> = {
      Card: "Tarjeta",
      Transfer: "Transferencia",
      Cash: "Efectivo",
      Other: "Otro",
    };
    return map[metodo] || metodo;
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, "success" | "warning" | "danger" | "default"> = {
      Paid: "success",
      Pending: "warning",
      Failed: "danger",
      Refunded: "default",
    };
    return map[status] || "default";
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      Paid: "Pagado",
      Pending: "Pendiente",
      Failed: "Fallido",
      Refunded: "Reembolsado",
    };
    return map[status] || status;
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[750px] bg-background border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <Modal.CloseTrigger />
          <div className="flex flex-col max-h-[90vh]">
            <Modal.Header className="flex flex-col gap-1 p-8 border-b border-default-100 bg-primary/5">
              <Modal.Heading className="text-2xl font-black text-default-900">
                Historial de Pagos
              </Modal.Heading>
              {subscription && (
                <p className="text-sm font-semibold text-default-500 mt-1">
                  Cliente: <span className="text-primary font-bold">{subscription.clienteNombre}</span> | Plan: <span className="text-secondary font-bold">{subscription.plan}</span>
                </p>
              )}
            </Modal.Header>

            <Modal.Body className="gap-6 p-8 overflow-y-auto min-h-0">
              {showAddForm ? (
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 border border-default-150 p-6 rounded-3xl bg-default-50/50">
                  <h3 className="text-lg font-black text-default-900">Registrar Nuevo Pago</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <TextField isInvalid={!!errors.monto}>
                      <Label className="text-primary font-bold mb-1 ml-1 text-sm">Monto ($)</Label>
                      <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                        <InputGroup.Prefix className="pl-3 text-primary/40"><DollarSign size={18} /></InputGroup.Prefix>
                        <InputGroup.Input 
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...register("monto")}
                          className="px-3 text-sm font-medium"
                        />
                      </InputGroup>
                      {errors.monto && <p className="text-danger text-tiny mt-1 ml-1">{errors.monto.message}</p>}
                    </TextField>

                    <Select
                      value={selectedMetodo}
                      onChange={(val) => setValue("metodo", val as any)}
                      placeholder="Método de Pago"
                      className="w-full"
                    >
                      <Label className="text-primary font-bold mb-1 ml-1 text-sm">Método de Pago</Label>
                      <Select.Trigger className="w-full bg-[#FAFAFA] border border-default-200 rounded-xl px-4 py-2 text-sm text-default-900 focus:outline-none focus:border-primary transition-all cursor-pointer h-11 font-medium flex items-center justify-between">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="Card" textValue="Tarjeta">Tarjeta <ListBox.ItemIndicator /></ListBox.Item>
                          <ListBox.Item id="Transfer" textValue="Transferencia">Transferencia <ListBox.ItemIndicator /></ListBox.Item>
                          <ListBox.Item id="Cash" textValue="Efectivo">Efectivo <ListBox.ItemIndicator /></ListBox.Item>
                          <ListBox.Item id="Other" textValue="Otro">Otro <ListBox.ItemIndicator /></ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      value={selectedStatus}
                      onChange={(val) => setValue("status", val as any)}
                      placeholder="Estado"
                      className="w-full"
                    >
                      <Label className="text-primary font-bold mb-1 ml-1 text-sm">Estado del Pago</Label>
                      <Select.Trigger className="w-full bg-[#FAFAFA] border border-default-200 rounded-xl px-4 py-2 text-sm text-default-900 focus:outline-none focus:border-primary transition-all cursor-pointer h-11 font-medium flex items-center justify-between">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="Paid" textValue="Pagado">Pagado <ListBox.ItemIndicator /></ListBox.Item>
                          <ListBox.Item id="Pending" textValue="Pendiente">Pendiente <ListBox.ItemIndicator /></ListBox.Item>
                          <ListBox.Item id="Failed" textValue="Fallido">Fallido <ListBox.ItemIndicator /></ListBox.Item>
                          <ListBox.Item id="Refunded" textValue="Reembolsado">Reembolsado <ListBox.ItemIndicator /></ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>

                    <TextField isInvalid={!!errors.referencia}>
                      <Label className="text-primary font-bold mb-1 ml-1 text-sm">Referencia / Comprobante ID</Label>
                      <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                        <InputGroup.Input 
                          placeholder="Ej. #TRSF-9908"
                          {...register("referencia")}
                          className="px-3 text-sm font-medium"
                        />
                      </InputGroup>
                    </TextField>
                  </div>

                  <TextField isInvalid={!!errors.comprobanteUrl}>
                    <Label className="text-primary font-bold mb-1 ml-1 text-sm">URL de Imagen del Comprobante</Label>
                    <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                      <InputGroup.Input 
                        placeholder="Ej. /comprobante.jpg"
                        {...register("comprobanteUrl")}
                        className="px-3 text-sm font-medium"
                      />
                    </InputGroup>
                  </TextField>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button 
                      variant="flat" 
                      color="danger" 
                      onPress={() => setShowAddForm(false)}
                      className="font-bold rounded-xl h-11 px-6"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 h-11 px-6"
                    >
                      Registrar Pago
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-default-900">Historial de Transacciones</h3>
                  <Button 
                    onPress={() => setShowAddForm(true)}
                    className="bg-primary text-white font-bold h-10 px-4 rounded-xl shadow-md shadow-primary/20"
                  >
                    + Registrar Pago
                  </Button>
                </div>
              )}

              {isLoading ? (
                <div className="h-[150px] w-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : payments.length === 0 ? (
                <div className="p-8 border border-dashed border-default-200 rounded-3xl text-center text-default-500 font-medium">
                  No hay transacciones registradas para esta suscripción.
                </div>
              ) : (
                <Table>
                  <Table.ScrollContainer className="max-h-[300px]">
                    <Table.Content aria-label="Tabla de transacciones de pagos">
                      <Table.Header>
                        <Table.Column isRowHeader>Monto</Table.Column>
                        <Table.Column>Fecha</Table.Column>
                        <Table.Column>Método</Table.Column>
                        <Table.Column>Estado</Table.Column>
                        <Table.Column>Referencia</Table.Column>
                        <Table.Column>Acciones</Table.Column>
                      </Table.Header>
                      <Table.Body>
                        {payments.map((pago: Pago) => (
                          <Table.Row key={pago.id} id={pago.id}>
                            <Table.Cell className="font-bold text-default-900">
                              ${pago.monto.toFixed(2)}
                            </Table.Cell>
                            <Table.Cell className="text-default-500 font-medium">
                              {new Date(pago.fechaPago).toLocaleDateString()}
                            </Table.Cell>
                            <Table.Cell className="text-default-700 font-semibold">
                              {getMetodoLabel(pago.metodo)}
                            </Table.Cell>
                            <Table.Cell>
                              <Chip
                                color={getStatusColor(pago.status)}
                                size="sm"
                                variant="flat"
                                className="font-bold border-none"
                              >
                                {getStatusLabel(pago.status)}
                              </Chip>
                            </Table.Cell>
                            <Table.Cell className="font-mono text-xs text-default-600">
                              {pago.referencia || "Sin Ref."}
                            </Table.Cell>
                            <Table.Cell>
                              <div className="flex gap-2">
                                {pago.comprobanteUrl && (
                                  <Tooltip content="Ver Comprobante">
                                    <Button
                                      isIconOnly
                                      size="sm"
                                      variant="light"
                                      className="text-primary"
                                      onPress={() => window.open(pago.comprobanteUrl, "_blank")}
                                    >
                                      <FileText size={16} />
                                    </Button>
                                  </Tooltip>
                                )}
                                <Tooltip color="danger" content="Eliminar Registro">
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    className="text-danger"
                                    onPress={() => handleDeleteClick(pago.id)}
                                  >
                                    <Trash2 size={16} />
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
              )}
            </Modal.Body>

            <Modal.Footer className="p-8 border-t border-default-100 flex justify-end">
              <Button 
                variant="flat"
                color="danger"
                onPress={() => onOpenChange()}
                className="font-bold rounded-xl h-11 px-6"
              >
                Cerrar Ventana
              </Button>
            </Modal.Footer>
          </div>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

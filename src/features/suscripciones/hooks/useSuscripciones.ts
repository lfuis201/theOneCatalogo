import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suscripcionesService } from '../services/suscripcionesService';

export function useSuscripciones() {
  const queryClient = useQueryClient();

  const suscripcionesQuery = useQuery({
    queryKey: ['suscripciones'],
    queryFn: suscripcionesService.getAll,
  });

  const createSuscripcionMutation = useMutation({
    mutationFn: (newSuscripcion: {
      usuarioId: string;
      plan: string;
      status: string;
      price: number;
      startDate: string;
      nextRenewal: string;
    }) => suscripcionesService.create(newSuscripcion),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['suscripciones'] });
    },
  });

  const updateSuscripcionMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      suscripcionesService.update(id, updates),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['suscripciones'] });
    },
  });

  const deleteSuscripcionMutation = useMutation({
    mutationFn: (id: string) => suscripcionesService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['suscripciones'] });
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: (newPayment: {
      suscripcionId: string;
      monto: number;
      metodo: string;
      status: string;
      referencia?: string;
      comprobanteUrl?: string;
    }) => suscripcionesService.createPayment(newPayment),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['pagos'] });
      void queryClient.invalidateQueries({ queryKey: ['suscripciones'] });
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: (id: string) => suscripcionesService.deletePayment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['pagos'] });
      void queryClient.invalidateQueries({ queryKey: ['suscripciones'] });
    },
  });

  return {
    subscriptions: suscripcionesQuery.data || [],
    isLoading: suscripcionesQuery.isLoading,
    isError: suscripcionesQuery.isError,
    error: suscripcionesQuery.error,
    createSuscripcion: createSuscripcionMutation.mutateAsync,
    isCreating: createSuscripcionMutation.isPending,
    updateSuscripcion: updateSuscripcionMutation.mutateAsync,
    isUpdating: updateSuscripcionMutation.isPending,
    deleteSuscripcion: deleteSuscripcionMutation.mutateAsync,
    isDeleting: deleteSuscripcionMutation.isPending,
    createPayment: createPaymentMutation.mutateAsync,
    deletePayment: deletePaymentMutation.mutateAsync,
  };
}

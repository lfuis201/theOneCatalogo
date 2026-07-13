import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suscripcionesService } from '../services/suscripcionesService';

export function useUserSubscription(userId: string | undefined) {
  const queryClient = useQueryClient();

  const userSubscriptionQuery = useQuery({
    queryKey: ['suscripcion-usuario', userId],
    queryFn: () => userId ? suscripcionesService.getByUserId(userId) : Promise.resolve(null),
    enabled: !!userId,
  });

  const acquireSubscriptionMutation = useMutation({
    mutationFn: (newSuscripcion: {
      usuarioId: string;
      plan: string;
      status: string;
      price: number;
      startDate: string;
      nextRenewal: string;
    }) => suscripcionesService.create(newSuscripcion),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['suscripcion-usuario', userId] });
      void queryClient.invalidateQueries({ queryKey: ['suscripciones'] });
    },
  });

  return {
    subscription: userSubscriptionQuery.data || null,
    isLoading: userSubscriptionQuery.isLoading,
    isError: userSubscriptionQuery.isError,
    error: userSubscriptionQuery.error,
    acquireSubscription: acquireSubscriptionMutation.mutateAsync,
    isAcquiring: acquireSubscriptionMutation.isPending,
  };
}

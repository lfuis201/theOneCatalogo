import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superadminService } from '../services/superadminService';

export function useGlobalSubscriptions() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['global-subscriptions'],
    queryFn: superadminService.getGlobalSubscriptions,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => superadminService.deleteGlobalSubscription(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['global-subscriptions'] });
      void queryClient.invalidateQueries({ queryKey: ['global-stats'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'Active' | 'Paused' | 'Cancelled' }) => 
      superadminService.updateGlobalSubscriptionStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['global-subscriptions'] });
      void queryClient.invalidateQueries({ queryKey: ['global-stats'] });
    },
  });

  return {
    subscriptions: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    deleteSubscription: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    updateSubscriptionStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
}

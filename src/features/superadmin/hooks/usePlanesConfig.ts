import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { planesConfigService, type PlanConfig } from '../services/planesConfigService';

export function usePlanesConfig() {
  const queryClient = useQueryClient();

  const planesQuery = useQuery({
    queryKey: ['planes_config'],
    queryFn: planesConfigService.getAll,
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({ plan, data }: { plan: string; data: Partial<PlanConfig> }) => 
      planesConfigService.update(plan, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['planes_config'] });
    },
  });

  return {
    planes: planesQuery.data || [],
    isLoading: planesQuery.isLoading,
    isError: planesQuery.isError,
    error: planesQuery.error,
    updatePlan: updatePlanMutation.mutateAsync,
    isUpdating: updatePlanMutation.isPending,
  };
}

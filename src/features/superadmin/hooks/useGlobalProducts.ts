import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superadminService } from '../services/superadminService';

export function useGlobalProducts() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['global-products'],
    queryFn: superadminService.getGlobalProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => superadminService.deleteGlobalProduct(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['global-products'] });
      void queryClient.invalidateQueries({ queryKey: ['global-stats'] });
    },
  });

  return {
    products: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    deleteProduct: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

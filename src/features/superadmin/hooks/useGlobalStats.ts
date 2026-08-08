import { useQuery } from '@tanstack/react-query';
import { superadminService } from '../services/superadminService';

export function useGlobalStats() {
  const query = useQuery({
    queryKey: ['global-stats'],
    queryFn: superadminService.getGlobalStats,
  });

  return {
    stats: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminsService } from '../services/adminsService';
import type { AdminUser } from '../types';

export function useAdmins() {
  const queryClient = useQueryClient();

  const adminsQuery = useQuery({
    queryKey: ['admins'],
    queryFn: adminsService.getAll,
  });

  const createAdminMutation = useMutation({
    mutationFn: (newAdmin: Partial<AdminUser> & { password?: string }) => adminsService.create(newAdmin),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });

  const updateAdminMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminUser> }) => 
      adminsService.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: (id: string) => adminsService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });

  return {
    admins: adminsQuery.data || [],
    isLoading: adminsQuery.isLoading,
    isError: adminsQuery.isError,
    error: adminsQuery.error,
    createAdmin: createAdminMutation.mutateAsync,
    isCreating: createAdminMutation.isPending,
    updateAdmin: updateAdminMutation.mutateAsync,
    isUpdating: updateAdminMutation.isPending,
    deleteAdmin: deleteAdminMutation.mutateAsync,
    isDeleting: deleteAdminMutation.isPending,
  };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientesService } from '../services/clientesService';
import type { Cliente } from '../types';

export function useClientes() {
  const queryClient = useQueryClient();

  const clientesQuery = useQuery({
    queryKey: ['clientes'],
    queryFn: clientesService.getAll,
  });

  const createClienteMutation = useMutation({
    mutationFn: (newCliente: Partial<Cliente> & { password?: string }) => clientesService.create(newCliente),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });

  const updateClienteMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Cliente> }) => 
      clientesService.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });

  const deleteClienteMutation = useMutation({
    mutationFn: (id: string) => clientesService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });

  return {
    clientes: clientesQuery.data || [],
    isLoading: clientesQuery.isLoading,
    isError: clientesQuery.isError,
    error: clientesQuery.error,
    createCliente: createClienteMutation.mutateAsync,
    isCreating: createClienteMutation.isPending,
    updateCliente: updateClienteMutation.mutateAsync,
    isUpdating: updateClienteMutation.isPending,
    deleteCliente: deleteClienteMutation.mutateAsync,
    isDeleting: deleteClienteMutation.isPending,
  };
}

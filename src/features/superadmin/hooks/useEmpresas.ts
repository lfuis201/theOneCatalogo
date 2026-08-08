import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { empresasService, type Empresa } from '../services/empresasService';

export function useEmpresas() {
  const queryClient = useQueryClient();

  const empresasQuery = useQuery({
    queryKey: ['empresas'],
    queryFn: empresasService.getAll,
  });

  const createEmpresaMutation = useMutation({
    mutationFn: (newEmpresa: Partial<Empresa>) => empresasService.create(newEmpresa),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['empresas'] });
    },
  });

  const updateEmpresaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Empresa> }) => 
      empresasService.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['empresas'] });
    },
  });

  const deleteEmpresaMutation = useMutation({
    mutationFn: (id: string) => empresasService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['empresas'] });
    },
  });

  return {
    empresas: empresasQuery.data || [],
    isLoading: empresasQuery.isLoading,
    isError: empresasQuery.isError,
    error: empresasQuery.error,
    createEmpresa: createEmpresaMutation.mutateAsync,
    isCreating: createEmpresaMutation.isPending,
    updateEmpresa: updateEmpresaMutation.mutateAsync,
    isUpdating: updateEmpresaMutation.isPending,
    deleteEmpresa: deleteEmpresaMutation.mutateAsync,
    isDeleting: deleteEmpresaMutation.isPending,
  };
}

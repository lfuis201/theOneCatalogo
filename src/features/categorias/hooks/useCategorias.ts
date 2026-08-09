import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriasService } from '../services/categoriasService';
import type { Categoria } from '../types';
import { useAuth } from '../../auth/hooks/useAuth';

export function useCategorias() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const empresaId = profile?.empresa_id;
  const isSuperAdmin = profile?.rol === 'superadmin';

  const categoriasQuery = useQuery({
    queryKey: ['categorias', empresaId, isSuperAdmin],
    queryFn: () => categoriasService.getAll(empresaId, isSuperAdmin),
  });

  const createCategoriaMutation = useMutation({
    mutationFn: (newCat: Partial<Categoria>) => categoriasService.create(newCat, empresaId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });

  const updateCategoriaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Categoria> }) => 
      categoriasService.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });

  const deleteCategoriaMutation = useMutation({
    mutationFn: (id: string) => categoriasService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });

  return {
    categorias: categoriasQuery.data || [],
    isLoading: categoriasQuery.isLoading,
    isError: categoriasQuery.isError,
    error: categoriasQuery.error,
    createCategoria: createCategoriaMutation.mutateAsync,
    isCreating: createCategoriaMutation.isPending,
    updateCategoria: updateCategoriaMutation.mutateAsync,
    isUpdating: updateCategoriaMutation.isPending,
    deleteCategoria: deleteCategoriaMutation.mutateAsync,
    isDeleting: deleteCategoriaMutation.isPending,
  };
}

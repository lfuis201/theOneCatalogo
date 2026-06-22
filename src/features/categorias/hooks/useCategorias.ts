import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriasService } from '../services/categoriasService';
import type { Categoria } from '../types';

export function useCategorias() {
  const queryClient = useQueryClient();

  const categoriasQuery = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasService.getAll,
  });

  const createCategoriaMutation = useMutation({
    mutationFn: (newCat: Partial<Categoria>) => categoriasService.create(newCat),
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

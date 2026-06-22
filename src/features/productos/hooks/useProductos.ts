import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productosService } from '../services/productosService';
import type { Producto } from '../types';

export function useProductos() {
  const queryClient = useQueryClient();

  const productosQuery = useQuery({
    queryKey: ['productos'],
    queryFn: productosService.getAll,
  });

  const createProductoMutation = useMutation({
    mutationFn: (newProducto: Partial<Producto>) => productosService.create(newProducto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });

  const updateProductoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Producto> }) => 
      productosService.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });

  const deleteProductoMutation = useMutation({
    mutationFn: (id: string) => productosService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });

  return {
    productos: productosQuery.data || [],
    isLoading: productosQuery.isLoading,
    isError: productosQuery.isError,
    error: productosQuery.error,
    createProducto: createProductoMutation.mutateAsync,
    isCreating: createProductoMutation.isPending,
    updateProducto: updateProductoMutation.mutateAsync,
    isUpdating: updateProductoMutation.isPending,
    deleteProducto: deleteProductoMutation.mutateAsync,
    isDeleting: deleteProductoMutation.isPending,
  };
}

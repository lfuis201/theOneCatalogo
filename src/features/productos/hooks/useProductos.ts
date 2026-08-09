import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productosService } from '../services/productosService';
import type { Producto } from '../types';
import { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';

export function useProductos() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const { profile } = useAuth();

  const empresaId = profile?.empresa_id;
  const isSuperAdmin = profile?.rol === 'superadmin';

  const uploadImage = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dajklcwc4";
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ml_default";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      setIsUploading(true);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Fallback a FileReader base64 si el preset está en modo Signed
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      const data = await response.json();
      return data.secure_url;
    } finally {
      setIsUploading(false);
    }
  };

  const productosQuery = useQuery({
    queryKey: ['productos', empresaId, isSuperAdmin],
    queryFn: () => productosService.getAll(empresaId, isSuperAdmin),
  });

  const createProductoMutation = useMutation({
    mutationFn: (newProducto: Partial<Producto>) => productosService.create(newProducto, empresaId),
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
    uploadImage,
    isUploading,
  };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productosService } from '../services/productosService';
import type { Producto } from '../types';
import { useState } from 'react';

export function useProductos() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dajklcwc4";
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || "986225729123396";
    const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET || "Ie6ElXmSXNl_rJm_nJs-8HukyLgager";

    const timestamp = Math.round(new Date().getTime() / 1000);
    const msgBuffer = new TextEncoder().encode(`timestamp=${timestamp}${apiSecret}`);
    const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    try {
      setIsUploading(true);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error en la subida a Cloudinary");
      }

      const data = await response.json();
      return data.secure_url;
    } finally {
      setIsUploading(false);
    }
  };

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
    uploadImage,
    isUploading,
  };
}

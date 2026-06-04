import api from '@/lib/api';

export const uploadProductImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post<{ url: string }>('/admin/upload/product-image', formData);
  return response.data.url;
};

export const uploadProductImages = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  const response = await api.post<{ urls: string[] }>('/admin/upload/product-images', formData);
  return response.data.urls;
};

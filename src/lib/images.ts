/** Resolve product image URLs (uploads on API server vs external URLs). */
export const resolveImageUrl = (url: string | undefined | null): string => {
  if (!url?.trim()) return '/placeholder.svg';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('/uploads')) {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const origin = apiBase.replace(/\/api\/?$/, '');
    return `${origin}${trimmed}`;
  }
  if (trimmed.startsWith('/')) {
    return trimmed;
  }
  return trimmed;
};

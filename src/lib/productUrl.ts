/** Build safe product URL (slashes/parentheses in slug break /product/:slug routes). */
export const getProductPath = (slug: string): string => {
  if (!slug?.trim()) return '/products';
  return `/product/${encodeURIComponent(slug.trim())}`;
};

/** Read slug from /product/... pathname (supports splat and encoded segments). */
export const parseProductSlugFromLocation = (pathname: string): string => {
  const prefix = '/product/';
  if (!pathname.startsWith(prefix)) return '';
  const raw = pathname.slice(prefix.length).replace(/\/$/, '');
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

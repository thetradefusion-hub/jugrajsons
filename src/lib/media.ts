import { resolveImageUrl } from '@/lib/images';

export type MediaKind = 'image' | 'video';

export type VideoEmbed =
  | { kind: 'file'; src: string }
  | { kind: 'youtube'; embedUrl: string; thumbnailUrl: string }
  | { kind: 'vimeo'; embedUrl: string };

const VIDEO_EXT = /\.(?:mp4|webm|mov|ogg|m4v|avi)(?:\?[^\s]*)?$/i;

export const isVideoUrl = (url: string | undefined | null): boolean => {
  if (!url?.trim()) return false;
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  if (VIDEO_EXT.test(lower)) return true;
  if (lower.includes('youtube.com/') || lower.includes('youtu.be/')) return true;
  if (/vimeo\.com\/\d+/.test(lower)) return true;

  return false;
};

export const resolveMediaUrl = (url: string | undefined | null): string => resolveImageUrl(url);

export const getYouTubeId = (url: string): string | null => {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return parsed.pathname.slice(1).split('/')[0] || null;
    }

    if (host.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/')[2] || null;
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/')[2] || null;
      }
      return parsed.searchParams.get('v');
    }
  } catch {
    return null;
  }
  return null;
};

export const getVimeoId = (url: string): string | null => {
  const match = url.trim().match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return match?.[1] ?? null;
};

export const getVideoEmbed = (url: string): VideoEmbed | null => {
  const trimmed = url.trim();
  const youtubeId = getYouTubeId(trimmed);
  if (youtubeId) {
    return {
      kind: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    };
  }

  const vimeoId = getVimeoId(trimmed);
  if (vimeoId) {
    return {
      kind: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
    };
  }

  if (VIDEO_EXT.test(trimmed.toLowerCase()) || trimmed.startsWith('/uploads/')) {
    return { kind: 'file', src: resolveMediaUrl(trimmed) };
  }

  return null;
};

export type GalleryMediaItem = {
  type: MediaKind;
  url: string;
  resolved: string;
  embed: VideoEmbed | null;
};

export const parseGalleryMedia = (urls: string[] | undefined | null): GalleryMediaItem[] => {
  if (!urls?.length) {
    return [
      {
        type: 'image',
        url: '',
        resolved: resolveMediaUrl(null),
        embed: null,
      },
    ];
  }

  return urls.map((url) => {
    const video = isVideoUrl(url);
    return {
      type: video ? 'video' : 'image',
      url,
      resolved: resolveMediaUrl(url),
      embed: video ? getVideoEmbed(url) : null,
    };
  });
};

/** First image in the list (skips video URLs for card thumbnails). */
export const getFirstImageUrl = (urls: string[] | undefined | null): string => {
  const firstImage = urls?.find((url) => !isVideoUrl(url));
  return resolveMediaUrl(firstImage ?? null);
};

export const getVideoThumbnail = (item: GalleryMediaItem): string | null => {
  if (item.type !== 'video' || !item.embed) return null;
  if (item.embed.kind === 'youtube') return item.embed.thumbnailUrl;
  return null;
};

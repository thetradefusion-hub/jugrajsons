import { useState } from 'react';
import { resolveImageUrl } from '@/lib/images';

type DescriptionPart =
  | { type: 'text'; content: string }
  | { type: 'image'; src: string; alt: string };

const IMAGE_EXT = /\.(?:jpe?g|png|gif|webp|svg|bmp|avif)(?:\?[^\s]*)?$/i;

const isImageUrl = (url: string): boolean => {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/uploads/')) return true;
  if (trimmed.startsWith('/') && IMAGE_EXT.test(trimmed)) return true;
  if (/^https?:\/\//i.test(trimmed)) {
    return IMAGE_EXT.test(trimmed) || trimmed.includes('/uploads/');
  }
  return false;
};

const IMAGE_URL_REGEX =
  /(?:https?:\/\/[^\s<>"']+|\/uploads\/[^\s<>"']+|\/[^\s<>"']+\.(?:jpe?g|png|gif|webp|svg|bmp|avif)(?:\?[^\s<>"']*)?)/gi;

const MARKDOWN_IMAGE_REGEX = /!\[([^\]]*)\]\(([^)]+)\)/g;
const HTML_IMG_REGEX = /<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi;

/** Split description into text and image segments (URLs, markdown, or img tags). */
export const parseProductDescription = (description: string): DescriptionPart[] => {
  if (!description.trim()) return [];

  let remaining = description;
  const parts: DescriptionPart[] = [];

  const pushText = (text: string) => {
    const trimmed = text.replace(/\n{3,}/g, '\n\n');
    if (trimmed) parts.push({ type: 'text', content: trimmed });
  };

  const pushImage = (src: string, alt: string) => {
    parts.push({ type: 'image', src: src.trim(), alt });
  };

  // Extract <img src="..."> tags
  remaining = remaining.replace(HTML_IMG_REGEX, (_, src: string) => {
    pushImage(src, 'Product description image');
    return '\n';
  });

  // Extract markdown images ![alt](url)
  remaining = remaining.replace(MARKDOWN_IMAGE_REGEX, (_, alt: string, src: string) => {
    pushImage(src, alt || 'Product description image');
    return '\n';
  });

  // Split remaining text by image URLs
  const lines = remaining.split('\n');
  let textBuffer = '';

  const flushText = () => {
    if (textBuffer) {
      pushText(textBuffer);
      textBuffer = '';
    }
  };

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (isImageUrl(trimmedLine)) {
      flushText();
      pushImage(trimmedLine, 'Product description image');
      continue;
    }

    const segments: DescriptionPart[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    const lineRegex = new RegExp(IMAGE_URL_REGEX.source, 'gi');

    while ((match = lineRegex.exec(line)) !== null) {
      const url = match[0];
      if (!isImageUrl(url)) continue;

      const before = line.slice(lastIndex, match.index);
      if (before) segments.push({ type: 'text', content: before });

      segments.push({ type: 'image', src: url, alt: 'Product description image' });
      lastIndex = match.index + url.length;
    }

    if (segments.length > 0) {
      const after = line.slice(lastIndex);
      if (after) segments.push({ type: 'text', content: after });

      flushText();
      parts.push(...segments);
    } else {
      textBuffer += (textBuffer ? '\n' : '') + line;
    }
  }

  flushText();
  return parts;
};

type ProductDescriptionProps = {
  description: string;
  className?: string;
};

const DescriptionImage = ({ src, alt }: { src: string; alt: string }) => {
  const [failed, setFailed] = useState(false);
  const resolved = resolveImageUrl(src);

  if (failed) {
    return (
      <p className="break-all rounded-lg border border-dashed border-[#E6A817]/30 bg-[#fffaf2] px-3 py-2 text-xs text-[#2B1D0E]/60">
        Image could not load: {src}
      </p>
    );
  }

  return (
    <figure className="my-2">
      <img
        src={resolved}
        alt={alt}
        loading="lazy"
        className="product-image-sharp max-h-[480px] w-full rounded-xl border border-[#E6A817]/20 bg-[#fffaf2] object-contain"
        onError={() => setFailed(true)}
      />
    </figure>
  );
};

export const ProductDescription = ({ description, className = '' }: ProductDescriptionProps) => {
  const parts = parseProductDescription(description);

  if (parts.length === 0) return null;

  return (
    <div className={`space-y-3 text-sm leading-relaxed text-[#2B1D0E]/75 ${className}`}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return (
            <p key={index} className="whitespace-pre-line">
              {part.content}
            </p>
          );
        }

        return <DescriptionImage key={index} src={part.src} alt={part.alt} />;
      })}
    </div>
  );
};

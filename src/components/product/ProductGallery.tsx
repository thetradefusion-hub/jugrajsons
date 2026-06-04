import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { resolveImageUrl } from '@/lib/images';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const safeImages = images?.length
    ? images.map((img) => resolveImageUrl(img))
    : [resolveImageUrl(null)];

  const activeSrc = safeImages[activeIndex];

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i === 0 ? safeImages.length - 1 : i - 1));
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i === safeImages.length - 1 ? 0 : i + 1));
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxOpen, safeImages.length]);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="group relative w-full overflow-hidden rounded-2xl border border-[#E6A817]/25 bg-[#fffaf2] md:rounded-3xl">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="flex w-full cursor-zoom-in items-center justify-center p-3 sm:p-4 md:p-5"
          aria-label="View full size image"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeSrc}
              src={activeSrc}
              alt={`${productName} - Image ${activeIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              draggable={false}
              fetchPriority={activeIndex === 0 ? 'high' : 'auto'}
              decoding="async"
              className="product-image-sharp mx-auto block h-auto w-full max-h-[min(78vh,720px)] max-w-full object-contain"
            />
          </AnimatePresence>
        </button>

        <div className="pointer-events-none absolute bottom-3 right-3 z-10 flex items-center gap-2 rounded-full border border-[#E6A817]/25 bg-white/90 px-3 py-1.5 text-xs text-[#2B1D0E]/80 shadow-sm">
          <ZoomIn className="h-3.5 w-3.5 text-[#1F3D2B]" />
          <span className="hidden sm:inline">Tap for full quality</span>
        </div>

        {safeImages.length > 1 && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full border border-[#E6A817]/20 bg-white/95 shadow-sm md:left-3"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4 text-[#2B1D0E]" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full border border-[#E6A817]/20 bg-white/95 shadow-sm md:right-3"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4 text-[#2B1D0E]" />
            </Button>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'flex h-[4.5rem] w-[4.5rem] flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 bg-[#fffaf2] sm:h-20 sm:w-20 md:h-24 md:w-24 md:rounded-2xl',
                index === activeIndex
                  ? 'border-[#1F3D2B] ring-2 ring-[#E6A817]/40'
                  : 'border-[#E6A817]/20 hover:border-[#E6A817]/50',
              )}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="product-image-sharp max-h-full max-w-full object-contain p-0.5"
              />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2B1D0E]/92 p-4 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
          >
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-4 top-4 z-[110] h-10 w-10 rounded-full"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>

            {safeImages.length > 1 && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute left-3 top-1/2 z-[110] h-11 w-11 -translate-y-1/2 rounded-full md:left-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-3 top-1/2 z-[110] h-11 w-11 -translate-y-1/2 rounded-full md:right-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Next"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            <img
              src={activeSrc}
              alt={productName}
              onClick={(e) => e.stopPropagation()}
              className="product-image-sharp max-h-[92vh] max-w-[min(96vw,1200px)] object-contain"
              decoding="sync"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductGallery;

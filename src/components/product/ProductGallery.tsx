import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);
  const safeImages = images?.length ? images : ['/placeholder.svg'];

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="space-y-4">
      <div
        ref={imageRef}
        className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-[#E6A817]/25 bg-[#fffaf2] md:rounded-3xl"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={safeImages[activeIndex]}
            alt={`${productName} - Image ${activeIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'h-full w-full object-contain p-6 transition-transform duration-200 md:p-8',
              isZoomed && 'scale-[1.35]',
            )}
            style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : undefined}
          />
        </AnimatePresence>

        {!isZoomed && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-[#E6A817]/25 bg-white/90 px-3 py-1.5 text-xs text-[#2B1D0E]/80 shadow-sm backdrop-blur-sm">
            <ZoomIn className="h-3.5 w-3.5 text-[#1F3D2B]" />
            <span className="hidden sm:inline">Hover to zoom</span>
          </div>
        )}

        {safeImages.length > 1 && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border border-[#E6A817]/20 bg-white/95 opacity-90 shadow-sm transition-opacity hover:opacity-100 md:left-3 md:opacity-0 md:group-hover:opacity-100"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4 text-[#2B1D0E]" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border border-[#E6A817]/20 bg-white/95 opacity-90 shadow-sm transition-opacity hover:opacity-100 md:right-3 md:opacity-0 md:group-hover:opacity-100"
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
                'h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all md:h-20 md:w-20 md:rounded-2xl',
                index === activeIndex
                  ? 'border-[#1F3D2B] ring-2 ring-[#E6A817]/40'
                  : 'border-transparent hover:border-[#E6A817]/40',
              )}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="h-full w-full object-contain bg-[#fffaf2] p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;

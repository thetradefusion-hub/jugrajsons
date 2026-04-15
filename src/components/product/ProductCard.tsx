import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addItem, getItemQuantity, updateQuantity } = useCart();

  const quantity = getItemQuantity(product.id);
  const savings = product.originalPrice - product.price;
  const imgSrc = product.images?.[0] || '/placeholder.svg';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleQuantityChange = (e: React.MouseEvent, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity + delta);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group h-full"
    >
      <Link to={`/product/${product.slug}`} className="block h-full">
        <div
          className={cn(
            'relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E6A817]/25 bg-white sm:rounded-3xl',
            'shadow-[0_10px_22px_rgba(43,29,14,0.06)] transition-all duration-300 sm:shadow-[0_14px_28px_rgba(43,29,14,0.07)]',
            'hover:-translate-y-0.5 hover:border-[#E6A817]/45 hover:shadow-[0_16px_32px_rgba(43,29,14,0.1)] sm:hover:-translate-y-1 sm:hover:shadow-[0_20px_40px_rgba(43,29,14,0.12)]',
          )}
        >
          <div className="relative aspect-[5/6] overflow-hidden bg-[#fffaf2] sm:aspect-square">
            <img
              src={imgSrc}
              alt={product.name}
              className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03] sm:p-3 md:p-4"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2B1D0E]/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="absolute bottom-2 right-2 z-10 sm:bottom-3 sm:right-3">
              {quantity === 0 ? (
                <Button
                  type="button"
                  onClick={handleAddToCart}
                  size="icon"
                  className="h-9 w-9 rounded-full border-0 bg-[#E6A817] text-[#2B1D0E] shadow-lg transition-transform hover:scale-105 hover:bg-[#d89c14] sm:h-11 sm:w-11"
                  aria-label="Add to cart"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              ) : (
                <div className="flex items-center gap-1 rounded-full border border-[#E6A817]/35 bg-white/95 p-1.5 shadow-lg backdrop-blur-sm">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-[#2B1D0E] hover:bg-[#fff9ef]"
                    onClick={(e) => handleQuantityChange(e, -1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[1.25rem] text-center text-sm font-bold text-[#2B1D0E]">{quantity}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-[#2B1D0E] hover:bg-[#fff9ef]"
                    onClick={(e) => handleQuantityChange(e, 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col border-t border-[#E6A817]/15 p-2.5 sm:p-3 md:p-5">
            <div className="mb-1 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
              <div className="inline-flex items-center gap-0.5 rounded-full border border-[#E6A817]/30 bg-[#fff9ef] px-1.5 py-0.5 text-[#2B1D0E] sm:gap-1 sm:px-2">
                <Star className="h-3 w-3 fill-[#E6A817] text-[#E6A817] sm:h-3.5 sm:w-3.5" />
                <span className="text-[10px] font-bold sm:text-xs">{product.rating}</span>
              </div>
              <span className="text-[10px] text-[#2B1D0E]/55 sm:text-xs">({product.reviewCount.toLocaleString()})</span>
            </div>

            <h3 className="line-clamp-2 min-h-[2.35rem] font-display text-sm font-semibold leading-snug text-[#2B1D0E] transition-colors group-hover:text-[#1F3D2B] sm:min-h-[2.6rem] sm:text-base md:text-lg">
              {product.name}
            </h3>

            <div className="mt-auto flex flex-col gap-1.5 pt-2 sm:gap-2 sm:pt-3">
              <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                <span className="text-base font-bold text-[#2B1D0E] sm:text-lg md:text-2xl">Rs. {product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-[#2B1D0E]/50 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                    <Badge variant="secondary" className="border-0 bg-[#1F3D2B]/10 text-[11px] font-semibold text-[#1F3D2B]">
                      Save Rs. {savings.toLocaleString()}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

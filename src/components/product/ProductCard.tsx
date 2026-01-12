import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Plus, Minus, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addItem, getItemQuantity, updateQuantity } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  
  const quantity = getItemQuantity(product.id);
  const inWishlist = isInWishlist(product.id);
  const savings = product.originalPrice - product.price;
  const isLowStock = product.stockCount > 0 && product.stockCount < 10;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group h-full"
    >
      <Link to={`/product/${product.slug}`} className="h-full block">
        <div className="h-full bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-emerald-500 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col relative">
          {/* Conversion Badge - Top Left */}
          {product.isBestseller && (
            <div className="absolute top-3 left-3 z-20">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] md:text-xs px-3 py-1.5 shadow-xl font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Popular
              </Badge>
            </div>
          )}

          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Discount Badge */}
            {product.discount > 0 && (
              <div className="absolute top-3 right-3 z-10">
                <Badge className="bg-gradient-to-r from-rose-600 to-red-600 text-white border-0 text-[11px] md:text-xs px-3 py-1.5 shadow-xl font-extrabold animate-pulse">
                  {product.discount}% OFF
                </Badge>
              </div>
            )}

            {/* New Badge */}
            {product.isNew && !product.isBestseller && (
              <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 text-[10px] md:text-xs px-3 py-1.5 shadow-xl font-bold">
                  ✨ New
                </Badge>
              </div>
            )}

            {/* Stock Indicator */}
            {isLowStock && (
              <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Only {product.stockCount} left!
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={cn(
                'absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-xl z-10 backdrop-blur-md',
                inWishlist
                  ? 'bg-rose-500 text-white hover:bg-rose-600 hover:scale-110'
                  : 'bg-white/95 text-gray-700 hover:bg-white hover:scale-110 border border-gray-200'
              )}
            >
              <Heart className={cn('w-4 h-4 md:w-5 md:h-5 transition-all', inWishlist && 'fill-current')} />
            </button>

            {/* Quick Add Button - Enhanced */}
            <div className="absolute bottom-3 right-3 z-10">
              {quantity === 0 ? (
                <Button
                  onClick={handleAddToCart}
                  size="icon"
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 transition-all duration-300 group/btn"
                >
                  <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
                </Button>
              ) : (
                <div className="flex items-center gap-1.5 bg-white/98 backdrop-blur-md rounded-full p-2 shadow-2xl border border-gray-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-emerald-50 hover:text-emerald-600"
                    onClick={(e) => handleQuantityChange(e, -1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-extrabold text-base min-w-[1.5ch] text-center text-gray-900">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-emerald-50 hover:text-emerald-600"
                    onClick={(e) => handleQuantityChange(e, 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col border-t border-gray-100 bg-white">
            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-extrabold">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                ({product.reviewCount.toLocaleString()})
              </span>
            </div>
            
            {/* Product Name */}
            <h3 className="font-bold text-base md:text-lg text-gray-900 line-clamp-2 mb-3 group-hover:text-emerald-600 transition-colors leading-tight min-h-[3rem]">
              {product.name}
            </h3>

            {/* Price with Savings Highlight */}
            <div className="flex flex-col gap-2 mt-auto">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-sm md:text-base text-gray-500 line-through font-medium">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs font-bold px-2 py-1">
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

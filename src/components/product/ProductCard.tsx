import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
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
      className="group"
    >
      <Link to={`/product/${product.slug}`}>
        <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1.5">
              {product.isBestseller && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] px-2 py-0.5 shadow-sm">
                  ⭐ Bestseller
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 text-[10px] px-2 py-0.5 shadow-sm">
                  ✨ New
                </Badge>
              )}
              {product.discount > 0 && (
                <Badge className="bg-gradient-to-r from-rose-500 to-red-500 text-white border-0 text-[10px] px-2 py-0.5 shadow-sm">
                  {product.discount}% OFF
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={cn(
                'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm',
                inWishlist
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 backdrop-blur-sm text-foreground hover:bg-white'
              )}
            >
              <Heart className={cn('w-4 h-4', inWishlist && 'fill-current')} />
            </button>

            {/* Quick Add Button */}
            <div className="absolute bottom-2 right-2">
              {quantity === 0 ? (
                <Button
                  onClick={handleAddToCart}
                  size="icon"
                  className="w-9 h-9 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              ) : (
                <div className="flex items-center gap-1 bg-white rounded-full p-1 shadow-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full hover:bg-muted"
                    onClick={(e) => handleQuantityChange(e, -1)}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="font-bold text-sm min-w-[1.5ch] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full hover:bg-muted"
                    onClick={(e) => handleQuantityChange(e, 1)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-3">
            {/* Rating */}
            <div className="flex items-center gap-1 mb-1">
              <div className="flex items-center gap-0.5 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs font-semibold">{product.rating}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                ({product.reviewCount.toLocaleString()})
              </span>
            </div>
            
            {/* Product Name */}
            <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-1.5 group-hover:text-primary transition-colors leading-snug">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-foreground">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

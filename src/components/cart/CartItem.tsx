import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/context/CartContext';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;
  const img = product.images?.[0] || '/placeholder.svg';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      className={cn(
        'flex gap-4 rounded-2xl border border-[#E6A817]/25 bg-white p-4 shadow-sm',
        'md:gap-5 md:rounded-3xl md:p-5',
      )}
    >
      <Link to={`/product/${product.slug}`} className="shrink-0">
        <div className="h-24 w-24 overflow-hidden rounded-2xl border border-[#E6A817]/20 bg-[#fffaf2] md:h-28 md:w-28">
          <img src={img} alt={product.name} className="h-full w-full object-contain p-2" />
        </div>
      </Link>

      <div className="min-w-0 flex-1">
        <Link to={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 font-display text-base font-semibold text-[#2B1D0E] transition-colors hover:text-[#1F3D2B] md:text-lg">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#1F3D2B]/75 md:text-sm">{product.productType}</p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold text-[#2B1D0E]">Rs. {product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-[#2B1D0E]/45 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-1 rounded-full border border-[#E6A817]/35 bg-[#fff9ef] p-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-[#2B1D0E] hover:bg-white"
              onClick={() => updateQuantity(product.id, quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="min-w-[2rem] text-center text-sm font-bold text-[#2B1D0E]">{quantity}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-[#2B1D0E] hover:bg-white"
              onClick={() => updateQuantity(product.id, quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-fit self-start text-[#2B1D0E]/60 hover:bg-red-50 hover:text-red-700 sm:self-center"
            onClick={() => removeItem(product.id)}
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>

      <div className="hidden shrink-0 text-right sm:block">
        <p className="text-xs font-medium text-[#2B1D0E]/55">Subtotal</p>
        <p className="font-display text-lg font-bold text-[#2B1D0E]">Rs. {(product.price * quantity).toLocaleString()}</p>
      </div>
    </motion.div>
  );
};

export default CartItem;

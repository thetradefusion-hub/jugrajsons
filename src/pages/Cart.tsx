import { AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/seo/SEO';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyState from '@/components/common/EmptyState';
import { useCart } from '@/context/CartContext';

const Cart = () => {
  const { items } = useCart();

  return (
    <>
      <SEO title="Shopping Cart" />
      <main className="container-custom py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/products"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Shopping Cart</h1>
        </div>

        {items.length === 0 ? (
          <EmptyState type="cart" />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map(item => <CartItem key={item.product.id} item={item} />)}
              </AnimatePresence>
            </div>
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Cart;

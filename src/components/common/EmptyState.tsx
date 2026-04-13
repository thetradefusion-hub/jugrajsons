import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  type: 'cart' | 'wishlist' | 'search' | 'orders';
  title?: string;
  description?: string;
}

const emptyStates = {
  cart: {
    icon: ShoppingBag,
    title: 'Your cart is empty',
    description: 'Looks like you haven\'t added any products yet. Explore our collection to find what you need.',
    cta: 'Start Shopping',
    link: '/products',
  },
  wishlist: {
    icon: Heart,
    title: 'Your wishlist is empty',
    description: 'Save your favorite products here for later. Just click the heart icon on any product.',
    cta: 'Explore Products',
    link: '/products',
  },
  search: {
    icon: Search,
    title: 'No products found',
    description: 'We couldn\'t find any products matching your search. Try adjusting your filters or search terms.',
    cta: 'View All Products',
    link: '/products',
  },
  orders: {
    icon: Package,
    title: 'No orders yet',
    description: 'You haven\'t placed any orders yet. Start shopping to see your orders here.',
    cta: 'Start Shopping',
    link: '/products',
  },
};

const EmptyState: React.FC<EmptyStateProps> = ({ type, title, description }) => {
  const state = emptyStates[type] ?? emptyStates.orders;
  const Icon = state.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-foreground mb-2">
        {title || state.title}
      </h3>
      
      <p className="text-muted-foreground max-w-md mb-8">
        {description || state.description}
      </p>
      
      <Button asChild>
        <Link to={state.link}>{state.cta}</Link>
      </Button>
    </motion.div>
  );
};

export default EmptyState;

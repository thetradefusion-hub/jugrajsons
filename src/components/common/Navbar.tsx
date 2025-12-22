import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  Phone,
  Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { concerns, productTypes } from '@/data/products';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { 
      label: 'Shop by Concern', 
      key: 'concern',
      items: concerns.map(c => ({ name: c.name, slug: c.slug, icon: c.icon }))
    },
    { 
      label: 'Shop by Product', 
      key: 'product',
      items: productTypes.map(p => ({ name: p.name, slug: p.slug }))
    },
    { label: 'Bestsellers', href: '/products?tag=bestseller' },
    { label: 'New Arrivals', href: '/products?tag=new' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-sm hidden md:block">
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Leaf className="w-4 h-4" />
              100% Authentic Ayurvedic Products
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+919876543210" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <Phone className="w-4 h-4" />
              +91 98765 43210
            </a>
            <span>Free Shipping Above ₹499</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header 
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          isScrolled 
            ? 'bg-card/95 backdrop-blur-md shadow-md' 
            : 'bg-card'
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center shadow-md">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-base sm:text-lg font-bold text-foreground leading-tight">
                  Atharva
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground -mt-0.5">Health Solutions</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
              {navLinks.map((link) => (
                <div key={link.key || link.label} className="relative">
                  {link.items ? (
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === link.key ? null : link.key!)}
                      className={cn(
                        'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                        activeDropdown === link.key
                          ? 'bg-muted text-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}
                    >
                      {link.label}
                      <ChevronDown className={cn(
                        'w-4 h-4 transition-transform',
                        activeDropdown === link.key && 'rotate-180'
                      )} />
                    </button>
                  ) : (
                    <Link
                      to={link.href!}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {link.items && activeDropdown === link.key && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-popover rounded-xl shadow-xl border border-border overflow-hidden z-50"
                      >
                        <div className="p-2">
                          {link.items.map((item: { name: string; slug: string; icon?: string }) => (
                            <Link
                              key={item.slug}
                              to={`/products?${link.key === 'concern' ? 'concern' : 'category'}=${item.slug}`}
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                            >
                              {item.icon && <span className="text-lg">{item.icon}</span>}
                              <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex relative max-w-xs lg:max-w-sm w-full">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-10 w-full bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile Search Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link to="/wishlist">
                  <Heart className="w-5 h-5" />
                  {wishlistItems.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground">
                      {wishlistItems.length}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link to="/cart">
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {itemCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Account */}
              <Button variant="ghost" size="icon" asChild>
                <Link to={isAuthenticated ? '/profile' : '/login'}>
                  <User className="w-5 h-5" />
                </Link>
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden"
              >
                <form onSubmit={handleSearch} className="pb-4">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 h-10 w-full"
                      autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-card z-50 lg:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-display font-semibold">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]">
                {navLinks.map((link) => (
                  <div key={link.key || link.label}>
                    {link.items ? (
                      <div className="space-y-2">
                        <span className="text-sm font-semibold text-foreground">{link.label}</span>
                        <div className="grid grid-cols-2 gap-2">
                          {link.items.map((item: { name: string; slug: string; icon?: string }) => (
                            <Link
                              key={item.slug}
                              to={`/products?${link.key === 'concern' ? 'concern' : 'category'}=${item.slug}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-2 p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                              {item.icon && <span>{item.icon}</span>}
                              <span>{item.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={link.href!}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

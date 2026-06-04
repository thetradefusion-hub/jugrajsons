import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Heart, User, Menu, X, Phone, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const logoSrc = '/WhatsApp%20Image%202026-03-21%20at%203.15.06%20PM.jpeg';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Shop All', href: '/products' },
    { label: 'About Us', href: '/about' },
    { label: 'Training Program', href: '/training-program' },
  ];

  const mobileMenuLinks = [
    ...navLinks,
    { label: 'Track Order', href: '/track-order', icon: Truck },
  ];

  return (
    <>
      <div className="hidden border-b border-[#E6A817]/15 bg-[#1F3D2B] py-2 text-sm text-[#F5E9D7] md:block">
        <div className="container-custom flex items-center justify-between">
          <span className="flex items-center gap-2 font-medium">
            <img src={logoSrc} alt="Jugraj Son's Hive Logo" className="h-5 w-5 rounded-full object-cover ring-1 ring-[#E6A817]/40" />
            Premium Raw Forest Honey
          </span>
          <a href="tel:+919826124108" className="flex items-center gap-2 hover:text-[#E6A817]">
            <Phone className="h-4 w-4" />
            9826124108
          </a>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 border-b border-[#E6A817]/15 bg-[#F5E9D7]/95 backdrop-blur-md transition-all duration-300',
          isScrolled && 'shadow-[0_10px_25px_rgba(43,29,14,0.08)]'
        )}
      >
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <Link
              to="/"
              className="group flex min-w-0 max-w-[calc(100vw-8rem)] items-center gap-2.5 sm:max-w-none sm:gap-3"
            >
              <img
                src={logoSrc}
                alt="Jugraj Son's Hive"
                className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-[0_2px_8px_rgba(43,29,14,0.12)] ring-2 ring-[#E6A817]/45 transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="min-w-0 border-l border-[#E6A817]/45 pl-2.5 sm:pl-3">
                <p className="font-brand text-[1.125rem] font-semibold leading-[1.05] tracking-[-0.02em] text-[#2B1D0E] drop-shadow-[0_1px_0_rgba(255,250,240,0.95)] sm:text-xl md:text-[1.5rem] md:leading-[1.02]">
                  Jugraj Son&apos;s
                </p>
                <p className="mt-[3px] font-brand text-[0.7rem] font-bold uppercase leading-none tracking-[0.38em] sm:text-[11px] md:tracking-[0.42em]">
                  <span className="inline-block bg-gradient-to-r from-[#9a7310] via-[#E6A817] to-[#b88912] bg-clip-text text-transparent">
                    Hive
                  </span>
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-[#2B1D0E]/80 hover:bg-[#E6A817]/15 hover:text-[#2B1D0E]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <form onSubmit={handleSearch} className="relative hidden w-full max-w-xs md:block lg:max-w-sm">
              <Input
                type="search"
                placeholder="Search raw honey..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-full border-[#E6A817]/30 bg-white pl-10 pr-4 text-[#2B1D0E] placeholder:text-[#2B1D0E]/45 focus-visible:ring-[#1F3D2B]"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2B1D0E]/45" />
            </form>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search className="h-5 w-5 text-[#2B1D0E]" />
              </Button>

              <Button variant="ghost" size="icon" asChild className="relative">
                <Link to="/wishlist">
                  <Heart className="h-5 w-5 text-[#2B1D0E]" />
                  {wishlistItems.length > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-[#1F3D2B] p-0 text-xs text-[#F5E9D7]">
                      {wishlistItems.length}
                    </Badge>
                  )}
                </Link>
              </Button>

              <Button variant="ghost" size="icon" asChild className="relative">
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5 text-[#2B1D0E]" />
                  {itemCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-[#1F3D2B] p-0 text-xs text-[#F5E9D7]">
                      {itemCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              <Button variant="ghost" size="icon" asChild>
                <Link to={isAuthenticated ? '/profile' : '/login'}>
                  <User className="h-5 w-5 text-[#2B1D0E]" />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-5 w-5 text-[#2B1D0E]" />
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-[#E6A817]/20 md:hidden"
              >
                <form onSubmit={handleSearch} className="py-3">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Search raw honey..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 rounded-full border-[#E6A817]/30 bg-white pl-10 pr-4"
                      autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2B1D0E]/45" />
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              className="fixed right-0 top-0 z-50 h-full w-80 border-l border-[#E6A817]/20 bg-[#F5E9D7] p-5 shadow-2xl lg:hidden"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="font-display text-xl text-[#2B1D0E]">Menu</p>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5 text-[#2B1D0E]" />
                </Button>
              </div>
              <div className="space-y-3">
                {mobileMenuLinks.map((link) => {
                  const Icon = 'icon' in link ? link.icon : null;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-[#2B1D0E]"
                    >
                      {Icon ? <Icon className="h-4 w-4 shrink-0 text-[#1F3D2B]" /> : null}
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

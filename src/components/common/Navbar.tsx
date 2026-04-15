import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { productTypes } from '@/data/products';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const logoSrc = '/WhatsApp%20Image%202026-03-21%20at%203.15.06%20PM.jpeg';
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
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
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
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const navLinks = [
    {
      label: 'Honey Range',
      key: 'category',
      items: productTypes.map((c) => ({ name: c.name, slug: c.slug })),
    },
    { label: 'Shop All', href: '/products' },
    { label: 'Gift Packs', href: '/products?search=gift' },
    { label: 'New Arrivals', href: '/products?tag=new' },
  ];

  return (
    <>
      <div className="hidden border-b border-[#E6A817]/15 bg-[#1F3D2B] py-2 text-sm text-[#F5E9D7] md:block">
        <div className="container-custom flex items-center justify-between">
          <span className="flex items-center gap-2 font-medium">
            <img src={logoSrc} alt="Jugraj Son's Hive Logo" className="h-5 w-5 rounded-full object-cover ring-1 ring-[#E6A817]/40" />
            Premium Raw Forest Honey
          </span>
          <a href="tel:+919669361290" className="flex items-center gap-2 hover:text-[#E6A817]">
            <Phone className="h-4 w-4" />
            09669361290
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
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logoSrc}
                alt="Jugraj Son's Hive"
                className="h-10 w-10 rounded-xl object-cover ring-1 ring-[#E6A817]/35"
              />
              <div>
                <p className="font-display text-lg font-bold leading-tight text-[#2B1D0E]">Jugraj Son&apos;s</p>
                <p className="text-xs text-[#2B1D0E]/65">Hive</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" ref={dropdownRef}>
              {navLinks.map((link) => (
                <div key={link.key || link.label} className="relative">
                  {link.items ? (
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === link.key ? null : link.key!)}
                      className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-[#2B1D0E]/80 hover:bg-[#E6A817]/15 hover:text-[#2B1D0E]"
                    >
                      {link.label}
                      <ChevronDown className={cn('h-4 w-4 transition-transform', activeDropdown === link.key && 'rotate-180')} />
                    </button>
                  ) : (
                    <Link
                      to={link.href!}
                      className="rounded-full px-4 py-2 text-sm font-medium text-[#2B1D0E]/80 hover:bg-[#E6A817]/15 hover:text-[#2B1D0E]"
                    >
                      {link.label}
                    </Link>
                  )}

                  <AnimatePresence>
                    {link.items && activeDropdown === link.key && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-[#E6A817]/20 bg-white p-2 shadow-xl"
                      >
                        {link.items.map((item) => (
                          <Link
                            key={item.slug}
                            to={`/products?category=${item.slug}`}
                            onClick={() => setActiveDropdown(null)}
                            className="block rounded-xl px-4 py-2.5 text-sm font-medium text-[#2B1D0E]/85 hover:bg-[#F5E9D7]"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
              <div className="space-y-5">
                {navLinks.map((link) => (
                  <div key={link.key || link.label}>
                    {link.items ? (
                      <>
                        <p className="mb-2 text-sm font-semibold text-[#2B1D0E]/70">{link.label}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {link.items.map((item) => (
                            <Link
                              key={item.slug}
                              to={`/products?category=${item.slug}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="rounded-xl border border-[#E6A817]/20 bg-white px-3 py-2 text-center text-sm text-[#2B1D0E]"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link
                        to={link.href!}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block rounded-xl bg-white px-4 py-3 text-sm font-medium text-[#2B1D0E]"
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

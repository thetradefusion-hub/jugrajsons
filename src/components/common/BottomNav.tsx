import { Home, Package, User, BookOpen, Truck } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Package, label: 'Shop', path: '/products' },
  { icon: BookOpen, label: 'About us', path: '/about' },
  { icon: Truck, label: 'Track order', path: '/track-order' },
  { icon: User, label: 'Profile', path: '/profile' },
] as const;

const BottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className="safe-area-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-[#E6A817]/30 bg-[#F5E9D7]/95 shadow-[0_-10px_32px_rgba(43,29,14,0.12)] backdrop-blur-lg md:hidden"
      aria-label="Main mobile navigation"
    >
      <div className="mx-auto flex min-h-[4.5rem] max-w-2xl items-stretch justify-around gap-0 px-0.5 pb-1 pt-1 sm:px-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={handleLinkClick}
              className={cn(
                'flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-2 transition-all duration-200',
                active
                  ? 'bg-[#1F3D2B] text-[#F5E9D7] shadow-[0_4px_14px_rgba(31,61,43,0.35)]'
                  : 'text-[#2B1D0E]/55 active:scale-[0.98]',
              )}
            >
              <item.icon
                className={cn(
                  'h-[1.2rem] w-[1.2rem] shrink-0 transition-transform duration-200 sm:h-[1.35rem] sm:w-[1.35rem]',
                  active && 'scale-105 text-[#E6A817]',
                )}
                strokeWidth={active ? 2.25 : 2}
              />
              <span
                className={cn(
                  'max-w-full px-0.5 text-center text-[9px] font-medium leading-[1.15] tracking-wide sm:text-[10px]',
                  'line-clamp-2 break-words',
                  active ? 'font-semibold text-[#F5E9D7]' : 'text-[#2B1D0E]/65',
                )}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

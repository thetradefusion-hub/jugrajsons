import { Home, Package, User, Stethoscope, Truck } from "lucide-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Package, label: "Products", path: "/products" },
  { icon: Truck, label: "Track", path: "/track-order" },
  { icon: Stethoscope, label: "Consult", path: "/expert" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    // Scroll to top when clicking any navigation link
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

      return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-emerald-600 to-emerald-500 border-t border-emerald-700/30 md:hidden safe-area-bottom shadow-[0_-2px_8px_rgba(0,0,0,0.15)]">
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <RouterNavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex flex-col items-center justify-center flex-1 py-2 px-1 transition-colors duration-200",
                    active 
                      ? "text-white" 
                      : "text-white/80"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 mb-1 transition-colors",
                    active && "text-white scale-110"
                  )} />
                  <span className={cn(
                    "text-xs font-medium transition-colors",
                    active 
                      ? "text-white font-semibold" 
                      : "text-white/80"
                  )}>
                    {item.label}
                  </span>
                </RouterNavLink>
              );
            })}
          </div>
        </nav>
      );
};

export default BottomNav;

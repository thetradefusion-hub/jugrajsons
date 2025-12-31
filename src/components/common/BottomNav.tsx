import { Home, Package, User, Stethoscope, Truck } from "lucide-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Package, label: "Products", path: "/products" },
  { icon: Truck, label: "Track", path: "/track-order" },
  { icon: Stethoscope, label: "Expert", path: "/expert" },
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t-2 border-primary/20 shadow-[0_-8px_32px_rgba(0,0,0,0.15)] md:hidden safe-area-bottom backdrop-blur-xl bg-background/98">
      <div className="flex items-center justify-around h-20 px-2 pb-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <RouterNavLink
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-2xl transition-all duration-300 relative",
                active 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {/* Active indicator background */}
              {active && (
                <div className="absolute inset-0 bg-primary/10 rounded-2xl -z-10 scale-110" />
              )}
              
              <div className={cn(
                "p-2.5 rounded-2xl transition-all duration-300 mb-1",
                active 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110" 
                  : "hover:bg-muted/50"
              )}>
                <item.icon className={cn(
                  "w-6 h-6 transition-all",
                  active && "stroke-[2.5px]"
                )} />
              </div>
              
              <span className={cn(
                "text-[11px] font-semibold transition-all leading-tight",
                active 
                  ? "text-primary font-bold" 
                  : "text-muted-foreground"
              )}>
                {item.label}
              </span>
              
              {/* Active dot indicator */}
              {active && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </RouterNavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

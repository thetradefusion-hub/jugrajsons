import { Home, Package, User, Stethoscope } from "lucide-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Package, label: "Products", path: "/products" },
  { icon: Stethoscope, label: "Expert", path: "/expert" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <RouterNavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl transition-all duration-200",
                active ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-300",
                active && "bg-primary/15 scale-110"
              )}>
                <item.icon className={cn(
                  "w-5 h-5 transition-all",
                  active && "stroke-[2.5px]"
                )} />
              </div>
              <span className={cn(
                "text-[10px] font-medium mt-0.5 transition-all",
                active && "font-semibold"
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

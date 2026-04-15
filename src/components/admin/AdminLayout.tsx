import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
  BarChart3,
  Settings,
  Ticket,
  Warehouse,
  FileText,
  Star,
  Bell,
  History,
  UserCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const logoSrc = '/WhatsApp%20Image%202026-03-21%20at%203.15.06%20PM.jpeg';
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const mq = window.matchMedia('(max-width: 1023px)');
    const apply = () => {
      if (mq.matches && sidebarOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };
    apply();
    mq.addEventListener('change', apply);
    return () => {
      mq.removeEventListener('change', apply);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // Show loading state while auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-emerald-50/50 via-teal-50/40 to-cyan-50/30 dark:from-background dark:via-emerald-950/20 dark:via-teal-950/15 dark:to-cyan-950/10">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  // Redirect to login if not admin
  if (!user || user.role !== 'admin') {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', color: 'emerald' },
    { icon: Package, label: 'Products', path: '/admin/products', color: 'purple' },
    { icon: Warehouse, label: 'Inventory', path: '/admin/inventory', color: 'emerald' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders', color: 'amber' },
    { icon: Users, label: 'Users', path: '/admin/users', color: 'blue' },
    { icon: Ticket, label: 'Coupons', path: '/admin/coupons', color: 'orange' },
    { icon: Star, label: 'Reviews', path: '/admin/reviews', color: 'purple' },
    { icon: FileText, label: 'Reports', path: '/admin/reports', color: 'emerald' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics', color: 'cyan' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications', color: 'blue' },
    { icon: History, label: 'Activity Logs', path: '/admin/activity-logs', color: 'gray' },
    { icon: Settings, label: 'Settings', path: '/admin/settings', color: 'emerald' },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-background via-emerald-50/60 via-teal-50/50 to-cyan-50/40 dark:from-background dark:via-emerald-950/25 dark:via-teal-950/20 dark:to-cyan-950/15">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none"></div>
      {/* Gradient orbs for depth */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/30 dark:bg-emerald-900/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-200/30 dark:bg-teal-900/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-200/20 dark:bg-cyan-900/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10">
      {/* Mobile Header */}
      <div className="border-b-2 border-emerald-200/50 bg-card/80 shadow-sm backdrop-blur-sm dark:border-emerald-900/50 lg:hidden pt-[env(safe-area-inset-top,0px)]">
        <div className="flex items-center justify-between gap-2 p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <img
              src={logoSrc}
              alt="Jugraj Son's Hive"
              className="h-9 w-9 rounded-xl object-cover ring-1 ring-emerald-200 shadow-lg"
            />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs text-muted-foreground">Jugraj Son's Hive</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-xl"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="relative z-10 flex min-w-0">
        {/* Enhanced Sidebar */}
        <aside
          className={cn(
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            'fixed inset-y-0 left-0 z-50 h-[100dvh] w-[min(18rem,calc(100vw-1rem))] max-w-[85vw] border-r-2 border-emerald-200/50 bg-gradient-to-b from-card via-card to-emerald-50/40 shadow-xl backdrop-blur-sm transition-transform duration-300 dark:border-emerald-900/50 dark:to-emerald-950/15 sm:max-w-none sm:w-72 lg:static lg:h-auto lg:max-w-none lg:translate-x-0 lg:shadow-none',
          )}
        >
          <div className="scrollbar-hide flex h-full flex-col overflow-y-auto overscroll-y-contain pb-[env(safe-area-inset-bottom)]">
            {/* Sidebar Header */}
            <div className="p-6 border-b-2 border-emerald-200/50 dark:border-emerald-900/50 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={logoSrc}
                  alt="Jugraj Son's Hive"
                  className="h-11 w-11 rounded-xl object-cover ring-1 ring-emerald-200 shadow-lg"
                />
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Jugraj Son's Hive
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium">Admin Panel</p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-1.5">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
                
                const colorClasses = {
                  emerald: isActive 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30' 
                    : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 dark:hover:text-emerald-400',
                  purple: isActive 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                    : 'hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600 dark:hover:text-purple-400',
                  amber: isActive 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30' 
                    : 'hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:text-amber-600 dark:hover:text-amber-400',
                  blue: isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30' 
                    : 'hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400',
                  orange: isActive 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30' 
                    : 'hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600 dark:hover:text-orange-400',
                  cyan: isActive 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30' 
                    : 'hover:bg-cyan-50 dark:hover:bg-cyan-950/20 hover:text-cyan-600 dark:hover:text-cyan-400',
                  gray: isActive 
                    ? 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg shadow-gray-500/30' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-950/20 hover:text-gray-600 dark:hover:text-gray-400',
                  teal: isActive 
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30' 
                    : 'hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:text-teal-600 dark:hover:text-teal-400',
                  indigo: isActive 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30' 
                    : 'hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400',
                };

                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link
                      to={item.path}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium group relative overflow-hidden',
                        colorClasses[item.color as keyof typeof colorClasses]
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                          layoutId="activeIndicator"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      
                      {/* Icon */}
                      <div className={cn(
                        'p-1.5 rounded-lg transition-all duration-300',
                        isActive 
                          ? 'bg-white/20' 
                          : 'bg-transparent group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30'
                      )}>
                        <item.icon className={cn(
                          'h-5 w-5 transition-transform duration-300',
                          isActive ? 'text-white' : 'text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
                          !isActive && 'group-hover:scale-110'
                        )} />
                      </div>
                      
                      {/* Label */}
                      <span className={cn(
                        'flex-1 transition-colors',
                        isActive ? 'text-white font-semibold' : 'text-foreground'
                      )}>
                        {item.label}
                      </span>

                      {/* Hover effect */}
                      {!isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                          initial={false}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t-2 border-emerald-200/50 dark:border-emerald-900/50 bg-gradient-to-r from-emerald-50/30 to-teal-50/30 dark:from-emerald-950/10 dark:to-teal-950/10">
              <div className="mb-4 px-4 py-3 rounded-xl bg-card border-2 border-emerald-200/50 dark:border-emerald-900/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                    <UserCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <Badge variant="outline" className="mt-2 w-full justify-center border-emerald-500 text-emerald-600 dark:text-emerald-400">
                  Admin
                </Badge>
              </div>
              
              <Button
                variant="outline"
                className="w-full justify-start border-2 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="font-medium">Logout</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Main Content with Gradient Background */}
        <main className="relative min-h-0 w-full min-w-0 flex-1 overflow-x-hidden p-3 sm:p-6 lg:min-h-screen lg:p-8">
          {/* Additional gradient layers for depth */}
          <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-emerald-100/40 via-teal-100/30 to-transparent dark:from-emerald-900/20 dark:via-teal-900/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-cyan-100/40 via-blue-100/30 to-transparent dark:from-cyan-900/20 dark:via-blue-900/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      </div>
    </div>
  );
};

export default AdminLayout;

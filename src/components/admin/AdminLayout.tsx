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
  Sparkles,
  UserCircle,
  Stethoscope,
  Calendar,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    { icon: Stethoscope, label: 'Experts', path: '/admin/experts', color: 'teal' },
    { icon: Calendar, label: 'Appointments', path: '/admin/appointments', color: 'indigo' },
    { icon: Ticket, label: 'Coupons', path: '/admin/coupons', color: 'orange' },
    { icon: Star, label: 'Reviews', path: '/admin/reviews', color: 'purple' },
    { icon: FileText, label: 'Reports', path: '/admin/reports', color: 'emerald' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics', color: 'cyan' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications', color: 'blue' },
    { icon: History, label: 'Activity Logs', path: '/admin/activity-logs', color: 'gray' },
    { icon: Settings, label: 'Settings', path: '/admin/settings', color: 'emerald' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/60 via-teal-50/50 to-cyan-50/40 dark:from-background dark:via-emerald-950/25 dark:via-teal-950/20 dark:to-cyan-950/15 relative">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none"></div>
      {/* Gradient orbs for depth */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/30 dark:bg-emerald-900/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-200/30 dark:bg-teal-900/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-200/20 dark:bg-cyan-900/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10">
      {/* Mobile Header */}
      <div className="lg:hidden border-b-2 border-emerald-200/50 dark:border-emerald-900/50 bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs text-muted-foreground">AtharvaHelth</p>
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

      <div className="flex relative z-10">
        {/* Enhanced Sidebar */}
        <aside
          className={cn(
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            'lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-card via-card to-emerald-50/40 dark:to-emerald-950/15 border-r-2 border-emerald-200/50 dark:border-emerald-900/50 transition-transform duration-300 h-screen lg:h-auto shadow-xl lg:shadow-none backdrop-blur-sm'
          )}
        >
          <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
            {/* Sidebar Header */}
            <div className="p-6 border-b-2 border-emerald-200/50 dark:border-emerald-900/50 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    AtharvaHelth
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
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full overflow-x-hidden min-h-screen relative">
          {/* Additional gradient layers for depth */}
          <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-emerald-100/40 via-teal-100/30 to-transparent dark:from-emerald-900/20 dark:via-teal-900/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-cyan-100/40 via-blue-100/30 to-transparent dark:from-cyan-900/20 dark:via-blue-900/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
      </div>
    </div>
  );
};

export default AdminLayout;

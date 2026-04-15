import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  HelpCircle,
  Shield,
  Star,
  Award,
  TrendingUp,
  Edit,
  Phone,
  Mail,
  Sparkles,
  ShoppingBag,
  Home,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import SEO from '@/components/seo/SEO';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: Package, label: 'My orders', path: '/orders' },
  { icon: Heart, label: 'Wishlist', path: '/wishlist' },
  { icon: MapPin, label: 'Saved addresses', path: '/addresses' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: HelpCircle, label: 'Help & support', path: '/support' },
  { icon: Shield, label: 'Privacy policy', path: '/privacy' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface UserStats {
  orders: number;
  wishlist: number;
  totalSpent: number;
  completedOrders: number;
  pendingOrders: number;
}

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<UserStats>({
    orders: 0,
    wishlist: 0,
    totalSpent: 0,
    completedOrders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      calculateProfileCompletion();
    }
  }, [isAuthenticated, user]);

  const calculateProfileCompletion = () => {
    if (!user) return;
    let completed = 0;
    const total = 5;

    if (user.name) completed++;
    if (user.email) completed++;
    if (user.phone) completed++;
    if (user.addresses && user.addresses.length > 0) completed++;
    if (user.avatar) completed++;

    setProfileCompletion((completed / total) * 100);
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const ordersResponse = await api.get('/orders/my-orders').catch(() => ({ data: [] }));

      const orders = ordersResponse.data || [];
      const wishlist = JSON.parse(localStorage.getItem('atharva-wishlist') || '[]');

      const totalSpent = orders
        .filter((o: { status?: string }) => o.status === 'delivered')
        .reduce((sum: number, o: { finalTotal?: number }) => sum + (o.finalTotal || 0), 0);

      setStats({
        orders: orders.length,
        wishlist: wishlist.length,
        totalSpent,
        completedOrders: orders.filter((o: { status?: string }) => o.status === 'delivered').length,
        pendingOrders: orders.filter(
          (o: { status?: string }) => o.status === 'pending' || o.status === 'processing',
        ).length,
      });
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="My Profile | Jugraj Son's Hive" description="Account, orders aur settings — ek jagah." />

      <main className="min-h-screen overflow-x-hidden bg-[#F5E9D7] pb-28 text-[#2B1D0E] md:pb-12">
        <section className="relative isolate border-b border-[#E6A817]/15 bg-gradient-to-br from-[#F5E9D7] via-[#fff8ed] to-[#f0e1cb]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.11] [background:radial-gradient(circle_at_1px_1px,#1F3D2B_1px,transparent_0)] [background-size:22px_22px]" />
          <div className="container-custom relative px-4 pb-10 pt-6 md:pb-14 md:pt-8">
            <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-[#2B1D0E]/65 md:text-sm">
              <Link to="/" className="inline-flex items-center gap-1 hover:text-[#1F3D2B]">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
              <span className="font-medium text-[#2B1D0E]">Profile</span>
            </nav>

            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="rounded-3xl border border-[#E6A817]/25 bg-white/95 p-5 shadow-[0_16px_40px_rgba(43,29,14,0.08)] md:p-7"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="relative mx-auto shrink-0 sm:mx-0">
                    <Avatar className="h-24 w-24 border-4 border-[#E6A817]/35 shadow-md ring-2 ring-[#1F3D2B]/10 md:h-28 md:w-28">
                      <AvatarImage src={user?.avatar} className="object-cover" alt={user?.name || 'User'} />
                      <AvatarFallback className="bg-[#1F3D2B] font-display text-3xl font-bold text-[#F5E9D7] md:text-4xl">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full border-2 border-white bg-[#E6A817] text-[#2B1D0E] shadow-md hover:bg-[#d89c14]"
                      onClick={() => navigate('/settings')}
                      aria-label="Edit profile"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <div className="mb-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                      <h1 className="font-display text-2xl font-bold text-[#2B1D0E] md:text-3xl">{user?.name || 'User'}</h1>
                      {profileCompletion === 100 && (
                        <Badge className="border-0 bg-[#E6A817] px-2.5 py-0.5 text-xs font-semibold text-[#2B1D0E]">
                          <Award className="mr-1 inline h-3 w-3" />
                          Profile complete
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-[#2B1D0E]/75 sm:justify-start">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-[#1F3D2B]" />
                      <span className="truncate">{user?.email}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-center gap-2 text-xs text-[#2B1D0E]/65 sm:justify-start">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-[#1F3D2B]" />
                      <span>{user?.phone || 'Phone add karein — Settings'}</span>
                    </div>

                    {profileCompletion < 100 && (
                      <div className="mx-auto mt-4 max-w-md sm:mx-0">
                        <div className="mb-1 flex items-center justify-between text-xs font-medium text-[#2B1D0E]/80">
                          <span>Profile complete</span>
                          <span>{Math.round(profileCompletion)}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#E6A817]/25">
                          <div
                            className="h-full rounded-full bg-[#1F3D2B] transition-all duration-500 ease-out"
                            style={{ width: `${profileCompletion}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4 rounded-full border-[#E6A817]/40 text-[#2B1D0E] hover:bg-[#fff9ef] sm:mt-5"
                      onClick={() => navigate('/settings')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mx-auto max-w-md rounded-3xl border border-[#E6A817]/25 bg-white/95 p-8 text-center shadow-[0_16px_40px_rgba(43,29,14,0.08)]"
              >
                <Avatar className="mx-auto mb-4 h-24 w-24 border-4 border-[#E6A817]/30">
                  <AvatarFallback className="bg-[#fffaf2]">
                    <User className="h-12 w-12 text-[#1F3D2B]/50" />
                  </AvatarFallback>
                </Avatar>
                <h1 className="font-display text-2xl font-bold text-[#2B1D0E]">Welcome</h1>
                <p className="mt-2 text-sm text-[#2B1D0E]/70">Orders, wishlist aur address ke liye login karein.</p>
                <Button asChild className="mt-6 rounded-full bg-[#E6A817] px-8 font-semibold text-[#2B1D0E] hover:bg-[#d89c14]" size="lg">
                  <Link to="/login">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Login / Sign up
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>
        </section>

        {isAuthenticated && (
          <div className="container-custom relative z-10 -mt-4 space-y-5 px-4 pb-6 md:-mt-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <Card className="rounded-2xl border border-[#E6A817]/25 bg-white shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1F3D2B] text-[#F5E9D7]">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold text-[#2B1D0E]">{loading ? '—' : stats.orders}</p>
                    <p className="text-xs font-medium text-[#2B1D0E]/60">Orders</p>
                    {stats.pendingOrders > 0 && (
                      <Badge variant="outline" className="mt-2 border-[#E6A817]/40 text-[11px] text-[#2B1D0E]">
                        {stats.pendingOrders} pending
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="rounded-2xl border border-[#E6A817]/25 bg-white shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E6A817] text-[#2B1D0E]">
                      <Heart className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold text-[#2B1D0E]">{loading ? '—' : stats.wishlist}</p>
                    <p className="text-xs font-medium text-[#2B1D0E]/60">Wishlist</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="rounded-2xl border border-[#E6A817]/25 bg-white shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl border border-[#E6A817]/30 bg-[#fffaf2]">
                      <TrendingUp className="h-5 w-5 text-[#1F3D2B]" />
                    </div>
                    <p className="text-xl font-bold text-[#2B1D0E]">{loading ? '—' : `Rs. ${stats.totalSpent.toLocaleString()}`}</p>
                    <p className="text-xs font-medium text-[#2B1D0E]/60">Delivered spend</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="rounded-3xl border border-[#E6A817]/20 bg-[#fffaf2] shadow-sm">
                <CardContent className="p-4 md:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-[#2B1D0E]">Quick actions</h3>
                      <p className="text-sm text-[#2B1D0E]/65">Orders aur wishlist turant kholein.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/orders')}
                        className="rounded-xl border-[#E6A817]/40 bg-white text-[#2B1D0E] hover:bg-[#fff9ef]"
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Orders
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/wishlist')}
                        className="rounded-xl border-[#E6A817]/40 bg-white text-[#2B1D0E] hover:bg-[#fff9ef]"
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Wishlist
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        <div className="container-custom space-y-5 px-4 pb-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="overflow-hidden rounded-3xl border border-[#E6A817]/25 bg-white shadow-sm">
              <CardHeader className="border-b border-[#E6A817]/10 pb-3">
                <CardTitle className="flex items-center gap-2 font-display text-lg text-[#2B1D0E]">
                  <Settings className="h-5 w-5 text-[#1F3D2B]" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.04 }}
                  >
                    <Link
                      to={item.path}
                      className={cn(
                        'group flex items-center justify-between p-4 transition-colors hover:bg-[#fff9ef]',
                        index !== menuItems.length - 1 && 'border-b border-[#E6A817]/10',
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E6A817]/25 bg-[#fffaf2] text-[#1F3D2B] transition-transform group-hover:scale-105">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span className="truncate font-medium text-[#2B1D0E]">{item.label}</span>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-[#2B1D0E]/35 transition-transform group-hover:translate-x-0.5 group-hover:text-[#1F3D2B]" />
                    </Link>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {isAuthenticated && stats.completedOrders > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Card className="rounded-3xl border border-[#E6A817]/30 bg-gradient-to-r from-[#173423] to-[#214733] text-[#FFF8E9] shadow-md">
                <CardContent className="flex items-center gap-4 p-4 md:p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E6A817] text-[#2B1D0E]">
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-semibold">Thank you for trusting us</h3>
                    <p className="text-sm text-[#FFF8E9]/85">
                      {stats.completedOrders} delivered order{stats.completedOrders > 1 ? 's' : ''}
                    </p>
                  </div>
                  <Star className="h-8 w-8 shrink-0 fill-[#E6A817] text-[#E6A817]" />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isAuthenticated && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full rounded-2xl border-2 border-red-200/80 bg-white font-semibold text-red-700 hover:bg-red-50"
                onClick={() => {
                  logout();
                  toast({
                    title: 'Logged out',
                    description: 'Aap safely sign out ho gaye.',
                  });
                }}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex justify-center pb-4 pt-2"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E6A817]/30 bg-white/90 px-4 py-2 text-xs text-[#2B1D0E]/80">
              <Sparkles className="h-3.5 w-3.5 text-[#E6A817]" />
              <div className="text-left leading-tight">
                <p className="font-semibold text-[#2B1D0E]">Jugraj Son&apos;s Hive</p>
                <p className="text-[#2B1D0E]/60">v1.0.0</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Profile;

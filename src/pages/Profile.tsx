import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, Bell, HelpCircle, Shield, Calendar, Star, Award, TrendingUp, Edit, Phone, Mail, Sparkles, CheckCircle2, Clock, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import SEO from "@/components/seo/SEO";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { icon: Package, label: "My Orders", path: "/orders" },
  { icon: Calendar, label: "My Appointments", path: "/appointments" },
  { icon: Heart, label: "Wishlist", path: "/wishlist" },
  { icon: MapPin, label: "Saved Addresses", path: "/addresses" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: HelpCircle, label: "Help & Support", path: "/support" },
  { icon: Shield, label: "Privacy Policy", path: "/privacy" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface UserStats {
  orders: number;
  wishlist: number;
  appointments: number;
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
    appointments: 0,
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
      const [ordersResponse, appointmentsResponse] = await Promise.all([
        api.get('/orders/my-orders').catch(() => ({ data: [] })),
        api.get('/appointments/my-appointments').catch(() => ({ data: [] })),
      ]);
      
      const orders = ordersResponse.data || [];
      const appointments = appointmentsResponse.data || [];
      const wishlist = JSON.parse(localStorage.getItem('atharva-wishlist') || '[]');
      
      const totalSpent = orders
        .filter((o: any) => o.status === 'delivered')
        .reduce((sum: number, o: any) => sum + (o.finalTotal || 0), 0);
      
      setStats({
        orders: orders.length,
        wishlist: wishlist.length,
        appointments: appointments.length,
        totalSpent,
        completedOrders: orders.filter((o: any) => o.status === 'delivered').length,
        pendingOrders: orders.filter((o: any) => o.status === 'pending' || o.status === 'processing').length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="My Profile | Atharva Health Solutions"
        description="Manage your account and orders"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 pb-24">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white px-4 pt-8 pb-12 rounded-b-3xl relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-4"
              >
                <div className="relative group">
                  <div className="relative">
                    <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4 border-white/50 shadow-2xl ring-4 ring-white/20 transition-all duration-300 group-hover:scale-105 group-hover:ring-white/40">
                      <AvatarImage 
                        src={user?.avatar} 
                        className="object-cover"
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-white/30 to-white/10 text-3xl md:text-4xl font-bold text-white backdrop-blur-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {/* Status indicator */}
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 border-4 border-white rounded-full shadow-xl ring-2 ring-green-400/50 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                    {/* Edit button overlay */}
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-lg border-2 border-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() => navigate('/settings')}
                    >
                      <Edit className="w-4 h-4 text-emerald-600" />
                    </Button>
                    {/* Decorative rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold font-display">{user?.name || "User"}</h1>
                    {profileCompletion === 100 && (
                      <Badge variant="secondary" className="bg-amber-500 text-white border-0">
                        <Award className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-95 mb-2">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs opacity-85">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{user?.phone || "Add phone number"}</span>
                  </div>
                  {profileCompletion < 100 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Profile Completion</span>
                        <span>{Math.round(profileCompletion)}%</span>
                      </div>
                      <Progress value={profileCompletion} className="h-1.5" />
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/settings')}
                  className="text-white hover:bg-white/20"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-4"
              >
                <div className="relative mx-auto mb-4 w-28 h-28">
                  <Avatar className="w-28 h-28 border-4 border-white/50 shadow-2xl ring-4 ring-white/20">
                    <AvatarFallback className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm">
                      <User className="w-14 h-14 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Welcome Guest</h1>
                <p className="text-sm opacity-90 mb-6">Login for personalized experience</p>
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="rounded-full px-8 bg-white text-emerald-600 hover:bg-white/90">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Login / Sign Up
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Enhanced Stats */}
        {isAuthenticated && (
          <div className="px-4 -mt-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="shadow-xl border-2 border-emerald-200 hover:border-emerald-300 transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                      <ShoppingBag className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-600">{stats.orders}</p>
                    <p className="text-xs text-muted-foreground font-medium">Orders</p>
                    {stats.pendingOrders > 0 && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {stats.pendingOrders} pending
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-xl border-2 border-pink-200 hover:border-pink-300 transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-2">
                      <Heart className="w-6 h-6 text-pink-600" />
                    </div>
                    <p className="text-2xl font-bold text-pink-600">{stats.wishlist}</p>
                    <p className="text-xs text-muted-foreground font-medium">Wishlist</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-xl border-2 border-blue-200 hover:border-blue-300 transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{stats.appointments}</p>
                    <p className="text-xs text-muted-foreground font-medium">Appointments</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-xl border-2 border-amber-200 hover:border-amber-300 transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-xl font-bold text-amber-600">Rs. {stats.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground font-medium">Total Spent</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="shadow-lg border-2 border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-1">Quick Actions</h3>
                      <p className="text-sm text-muted-foreground">Manage your account quickly</p>
                    </div>
                    <Sparkles className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/orders')}
                      className="justify-start border-emerald-200 hover:bg-emerald-50"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      View Orders
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/appointments')}
                      className="justify-start border-emerald-200 hover:bg-emerald-50"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Appointments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Enhanced Menu Items */}
        <div className="px-4 mt-6 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-2 border-emerald-100 shadow-lg overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-600" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center justify-between p-4 hover:bg-emerald-50 transition-all group ${
                        index !== menuItems.length - 1 ? "border-b border-emerald-100" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <item.icon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="font-semibold text-foreground">{item.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievement Badges */}
          {isAuthenticated && stats.completedOrders > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-amber-900">Loyal Customer</h3>
                      <p className="text-sm text-amber-800">
                        {stats.completedOrders} order{stats.completedOrders > 1 ? 's' : ''} completed
                      </p>
                    </div>
                    <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Logout Button */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="px-4 mt-6"
          >
            <Button
              variant="outline"
              className="w-full h-12 text-destructive border-2 border-destructive/30 hover:bg-destructive/10 rounded-xl font-semibold transition-all hover:scale-[1.02]"
              onClick={() => {
                logout();
                toast({
                  title: "Logged Out",
                  description: "You have been successfully logged out",
                });
              }}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </motion.div>
        )}

        {/* App Version */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <div className="text-xs">
              <p className="font-semibold text-emerald-900">Atharva Health Solutions</p>
              <p className="text-emerald-700">Version 1.0.0</p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Profile;

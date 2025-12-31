import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Package, ShoppingCart, DollarSign, TrendingUp, ArrowRight, 
  BarChart3, CreditCard, Activity, Calendar, Clock, CheckCircle2,
  AlertCircle, Zap, Sparkles, Target, Award, TrendingDown,
  ArrowUpRight, ArrowDownRight, RefreshCw, RotateCcw
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { cn } from '@/lib/utils';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  paidOrders: number;
  unpaidOrders: number;
  recentOrders: any[];
}

const AdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchStats();
  }, [user, isLoading, navigate]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <div className="text-muted-foreground">Loading dashboard...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, orders: 120 },
    { month: 'Feb', revenue: 52000, orders: 145 },
    { month: 'Mar', revenue: 48000, orders: 132 },
    { month: 'Apr', revenue: 61000, orders: 168 },
    { month: 'May', revenue: 55000, orders: 152 },
    { month: 'Jun', revenue: 67000, orders: 185 },
    { month: 'Jul', revenue: stats?.totalRevenue || 0, orders: stats?.totalOrders || 0 },
  ];

  const orderStatusData = [
    { name: 'Delivered', value: stats?.paidOrders || 0, color: '#10b981' },
    { name: 'Pending', value: stats?.pendingOrders || 0, color: '#f59e0b' },
    { name: 'Processing', value: 15, color: '#3b82f6' },
    { name: 'Cancelled', value: 5, color: '#ef4444' },
  ];

  const topProducts = [
    { name: 'Balbuddhi Swarn', sales: 125, revenue: 125000 },
    { name: 'Deep Slim Fit', sales: 98, revenue: 98000 },
    { name: 'Diaba Tune DS', sales: 87, revenue: 87000 },
    { name: 'Himalayan Shilajit', sales: 76, revenue: 76000 },
    { name: 'Kasadeep Syrup', sales: 65, revenue: 65000 },
  ];

  // First row KPIs
  const firstRowStats = [
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      borderColor: 'border-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      iconBg: 'bg-emerald-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      borderColor: 'border-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      iconBg: 'bg-amber-500',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      iconBg: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      iconBg: 'bg-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  // Second row KPIs (shifted left - 3 boxes)
  const secondRowStats = [
    {
      title: 'Pending Order',
      value: stats?.pendingOrders || 0,
      icon: AlertCircle,
      borderColor: 'border-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      iconBg: 'bg-amber-500',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Paid Order',
      value: stats?.paidOrders || 0,
      icon: CheckCircle2,
      borderColor: 'border-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      iconBg: 'bg-emerald-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Unpaid Order',
      value: stats?.unpaidOrders || 0,
      icon: CreditCard,
      borderColor: 'border-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      iconBg: 'bg-red-500',
      textColor: 'text-red-600 dark:text-red-400',
    },
    {
      title: 'Refund Order',
      value: 0, // Mock data - add to backend if needed
      icon: RotateCcw,
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      iconBg: 'bg-orange-500',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <AdminLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="admin-section-spacing"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="admin-heading-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <p className="admin-description mt-2">
                    Welcome back, <span className="font-bold text-foreground">{user?.name}</span>! 👋
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-5 py-3 rounded-xl bg-card border-2 shadow-sm">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="admin-body-small font-semibold text-foreground">
                  {new Date().toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchStats}
                className="rounded-xl h-11 w-11"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Top Section - First Row KPIs (4 boxes) */}
        <motion.div variants={itemVariants}>
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {firstRowStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className={cn(
                  "border-2 shadow-lg hover:shadow-xl transition-all duration-300",
                  stat.borderColor,
                  stat.bgColor
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <p className="admin-stat-label mb-2">{stat.title}</p>
                        <p className={cn("admin-stat-value", stat.textColor)}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={cn("p-3 rounded-xl shadow-md", stat.iconBg)}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Section - Second Row KPIs (4 boxes, but shifted left) */}
        <motion.div variants={itemVariants}>
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {secondRowStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className={cn(
                  "border-2 shadow-lg hover:shadow-xl transition-all duration-300",
                  stat.borderColor,
                  stat.bgColor
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <p className="admin-stat-label mb-2">{stat.title}</p>
                        <p className={cn("admin-stat-value", stat.textColor)}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={cn("p-3 rounded-xl shadow-md", stat.iconBg)}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Middle Section - Recent Orders (Full Width) */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-amber-500 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="admin-heading-3 flex items-center gap-3">
                    <Activity className="h-6 w-6 text-amber-600" />
                    Recent Orders
                  </CardTitle>
                  <CardDescription className="admin-card-description mt-1">
                    Latest customer orders
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/admin/orders')}
                  className="admin-body-small font-semibold"
                >
                  View All
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentOrders.slice(0, 5).map((order: any, index: number) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border-2 border-amber-200 dark:border-amber-900 rounded-xl hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all cursor-pointer group hover:shadow-md"
                      onClick={() => navigate('/admin/orders')}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-mono admin-body-small font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                            #{order._id.slice(-6).toUpperCase()}
                          </div>
                          <Badge
                            className={`admin-body-small font-bold px-2.5 py-1 ${
                              order.status === 'delivered'
                                ? 'bg-emerald-500 text-white'
                                : order.status === 'pending'
                                ? 'bg-amber-500 text-white'
                                : 'bg-blue-500 text-white'
                            }`}
                          >
                            {order.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`admin-body-small font-bold px-2.5 py-1 ${
                              order.paymentStatus === 'paid'
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-amber-500 text-white border-amber-500'
                            }`}
                          >
                            {order.paymentStatus}
                          </Badge>
                        </div>
                        <p className="admin-body font-semibold text-foreground">
                          {order.user?.name || 'Guest'}
                        </p>
                        <p className="admin-body-small flex items-center gap-1.5 mt-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="admin-heading-4 text-foreground">
                          ₹{order.total?.toLocaleString() || '0'}
                        </p>
                        <ArrowRight className="h-4 w-4 text-muted-foreground mt-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-sm">No recent orders</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Middle Section - Quick Actions (Full Width) */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-emerald-500 shadow-xl bg-gradient-to-br from-emerald-50/30 to-teal-50/30 dark:from-emerald-950/5 dark:to-teal-950/5">
            <CardHeader>
              <CardTitle className="admin-heading-3 flex items-center gap-3">
                <Zap className="h-6 w-6 text-emerald-600" />
                Quick Actions
              </CardTitle>
              <CardDescription className="admin-card-description">
                Common admin tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { icon: Package, label: 'Products', path: '/admin/products', color: 'emerald' },
                  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders', color: 'amber' },
                  { icon: Users, label: 'Users', path: '/admin/users', color: 'blue' },
                  { icon: CreditCard, label: 'Coupons', path: '/admin/coupons', color: 'purple' },
                  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics', color: 'cyan' },
                ].map((action, index) => (
                  <motion.div
                    key={action.label}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-24 flex-col gap-2.5 hover:shadow-lg transition-all border-2",
                        `hover:border-${action.color}-300 hover:bg-${action.color}-50 dark:hover:bg-${action.color}-950/20`
                      )}
                      onClick={() => navigate(action.path)}
                    >
                      <action.icon className="h-6 w-6" />
                      <span className="admin-body-small font-bold">{action.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom Section - Revenue Trend (Full Width) */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-emerald-500 shadow-xl bg-gradient-to-br from-white to-emerald-50/30 dark:from-card dark:to-emerald-950/10">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="admin-heading-3 flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                    Revenue Trend
                  </CardTitle>
                  <CardDescription className="admin-description">Monthly revenue and orders overview</CardDescription>
                </div>
                <Badge variant="outline" className="admin-body-small px-4 py-2 font-semibold">
                  <Target className="h-3.5 w-3.5 mr-2" />
                  Last 7 Months
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px', fontWeight: 600 }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px', fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#colorRevenue)"
                    name="Revenue (₹)"
                    animationDuration={1500}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#colorOrders)"
                    name="Orders"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom Section - Order Status & Top Products (2 boxes side by side) */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Order Status */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-amber-500 shadow-xl">
              <CardHeader>
                <CardTitle className="admin-heading-4 flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-amber-600" />
                  Order Status
                </CardTitle>
                <CardDescription className="admin-card-description">Current order distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={1000}
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Products */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-purple-500 shadow-xl">
              <CardHeader>
                <CardTitle className="admin-heading-4 flex items-center gap-3">
                  <Award className="h-6 w-6 text-purple-600" />
                  Top Products
                </CardTitle>
                <CardDescription className="admin-card-description">Best selling products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                      }}
                    />
                    <Bar
                      dataKey="sales"
                      fill="#a855f7"
                      radius={[0, 8, 8, 0]}
                      animationDuration={1500}
                    >
                      {topProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${270 + index * 20}, 70%, 60%)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;

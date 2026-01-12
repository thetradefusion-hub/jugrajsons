import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, DollarSign, ShoppingCart, Users, Package, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  topProducts: Array<{ name: string; sales: number }>;
  orderStatus: Array<{ status: string; count: number }>;
}

const AdminAnalytics = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return;

    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const [statsResponse, ordersResponse] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/orders'),
        ]);

        const stats = statsResponse.data;
        const orders = ordersResponse.data;

        // Generate mock analytics data (in real app, this would come from backend)
        const monthlyRevenue = [
          { month: 'Jan', revenue: 45000 },
          { month: 'Feb', revenue: 52000 },
          { month: 'Mar', revenue: 48000 },
          { month: 'Apr', revenue: 61000 },
          { month: 'May', revenue: 55000 },
          { month: 'Jun', revenue: 67000 },
        ];

        const topProducts = [
          { name: 'Balbuddhi Swarn', sales: 125 },
          { name: 'Deep Slim Fit', sales: 98 },
          { name: 'Diaba Tune DS', sales: 87 },
          { name: 'Himalayan Shilajit', sales: 76 },
          { name: 'Kasadeep Syrup', sales: 65 },
        ];

        const orderStatus = [
          { status: 'Pending', count: orders.filter((o: any) => o.status === 'pending').length },
          { status: 'Confirmed', count: orders.filter((o: any) => o.status === 'confirmed').length },
          { status: 'Processing', count: orders.filter((o: any) => o.status === 'processing').length },
          { status: 'Shipped', count: orders.filter((o: any) => o.status === 'shipped').length },
          { status: 'Delivered', count: orders.filter((o: any) => o.status === 'delivered').length },
        ];

        setData({
          ...stats,
          monthlyRevenue,
          topProducts,
          orderStatus,
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, navigate]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading analytics...</div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `Rs. ${(data?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-500',
      change: '+15%',
      trend: 'up',
    },
    {
      title: 'Total Orders',
      value: data?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-500',
      change: '+8%',
      trend: 'up',
    },
    {
      title: 'Total Users',
      value: data?.totalUsers || 0,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Total Products',
      value: data?.totalProducts || 0,
      icon: Package,
      color: 'from-amber-500 to-orange-500',
      change: '+5%',
      trend: 'up',
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-section-spacing">
        <div className="space-y-2">
          <h1 className="admin-heading-1">Analytics</h1>
          <p className="admin-description">Track your business performance</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <Card key={stat.title} className="border-2 border-cyan-500 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="admin-card-title">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="admin-stat-value">{stat.value}</div>
                <div className="flex items-center admin-body-small mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowUp className="h-3 w-3 mr-1 text-emerald-500" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  <span>{stat.change} from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="products">Top Products</TabsTrigger>
            <TabsTrigger value="orders">Order Status</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <Card className="border-2 border-cyan-500 shadow-xl">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue trend over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data?.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card className="border-2 border-purple-500 shadow-xl">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Best performing products by sales</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data?.topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card className="border-2 border-amber-500 shadow-xl">
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
                <CardDescription>Current order status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data?.orderStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;


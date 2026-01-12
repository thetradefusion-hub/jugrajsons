import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Download, Calendar, TrendingUp, DollarSign,
  ShoppingCart, Users, Package, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ReportData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  averageOrderValue: number;
  orders: any[];
}

const AdminReports = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<string>('7d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchReports();
  }, [user, isLoading, navigate]);

  const fetchReports = async () => {
    try {
      const params: any = {};
      
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      } else {
        // Set date range based on quick select
        const now = new Date();
        let filterDate = new Date();
        
        switch (dateRange) {
          case '7d':
            filterDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            filterDate.setDate(now.getDate() - 30);
            break;
          case '90d':
            filterDate.setDate(now.getDate() - 90);
            break;
          case '1y':
            filterDate.setFullYear(now.getFullYear() - 1);
            break;
          default:
            filterDate = new Date(0);
        }
        params.startDate = filterDate.toISOString().split('T')[0];
      }

      const [statsResponse, reportsResponse] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/reports', { params }),
      ]);

      const stats = statsResponse.data;
      const reports = reportsResponse.data;

      setReportData({
        totalRevenue: reports.totalRevenue,
        totalOrders: reports.totalOrders,
        totalUsers: stats.totalUsers || 0,
        totalProducts: stats.totalProducts || 0,
        averageOrderValue: reports.averageOrderValue,
        orders: reports.orders,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch reports',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    toast({
      title: 'Export PDF',
      description: 'PDF export feature coming soon',
    });
  };

  const handleExportExcel = () => {
    if (!reportData) return;

    const csv = [
      ['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Status', 'Payment Status'].join(','),
      ...reportData.orders.map(order => [
        order._id.slice(-6).toUpperCase(),
        new Date(order.createdAt).toLocaleDateString(),
        order.user?.name || 'Guest',
        order.items.length,
        `Rs. ${order.total}`,
        order.status,
        order.paymentStatus || 'pending'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading reports...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-section-spacing">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="admin-heading-1">Sales Reports</h1>
            <p className="admin-description">View and export sales data and analytics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportExcel}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Date Range Filter */}
        <Card className="border-2 border-emerald-500 shadow-xl">
          <CardHeader>
            <CardTitle className="admin-card-title">Filter Reports</CardTitle>
            <CardDescription className="admin-card-description">Select date range for reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label>Quick Select</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                    <SelectItem value="1y">Last Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={fetchReports}>
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {reportData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="admin-stat-value">Rs. {reportData.totalRevenue.toLocaleString()}</div>
                      <div className="admin-stat-label mt-2">Total Revenue</div>
                    </div>
                    <DollarSign className="h-9 w-9 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="admin-stat-value">{reportData.totalOrders}</div>
                      <div className="admin-stat-label mt-2">Total Orders</div>
                    </div>
                    <ShoppingCart className="h-9 w-9 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="admin-stat-value">Rs. {Math.round(reportData.averageOrderValue).toLocaleString()}</div>
                      <div className="admin-stat-label mt-2">Avg Order Value</div>
                    </div>
                    <TrendingUp className="h-9 w-9 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="admin-stat-value">{reportData.totalUsers}</div>
                      <div className="admin-stat-label mt-2">Total Customers</div>
                    </div>
                    <Users className="h-9 w-9 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders Table */}
            <Card className="border-2 border-amber-500 shadow-xl">
              <CardHeader>
                <CardTitle className="admin-card-title">Order Details</CardTitle>
                <CardDescription className="admin-card-description">
                  {reportData.orders.length} orders in selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.orders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No orders found in selected period
                          </TableCell>
                        </TableRow>
                      ) : (
                        reportData.orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell className="font-mono text-xs">
                              #{order._id.slice(-6).toUpperCase()}
                            </TableCell>
                            <TableCell>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{order.user?.name || 'Guest'}</TableCell>
                            <TableCell>{order.items.length}</TableCell>
                            <TableCell className="font-semibold">Rs. {order.total.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{order.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.paymentStatus === 'paid' ? 'default' :
                                  order.paymentStatus === 'failed' ? 'destructive' : 'outline'
                                }
                              >
                                {order.paymentStatus || 'pending'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;


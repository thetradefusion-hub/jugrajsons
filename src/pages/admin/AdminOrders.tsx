import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Download, Search, Filter, Eye, Edit, 
  Calendar, MapPin, CreditCard, User, Phone, Mail,
  Truck, CheckCircle, XCircle, Printer, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images?: string[];
    slug?: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  total: number;
  discount?: number;
  couponCode?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
  updatedAt: string;
}

const AdminOrders = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return;

    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchOrders();
  }, [user, isLoading, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      await api.put(`/admin/orders/${orderId}`, { status: newStatus });
      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      });
      await fetchOrders();
      if (selectedOrder?._id === orderId) {
        const updated = await api.get(`/admin/orders`);
        const order = updated.data.find((o: Order) => o._id === orderId);
        if (order) setSelectedOrder(order);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update order status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handlePaymentStatusUpdate = async (orderId: string, newPaymentStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      await api.put(`/admin/orders/${orderId}`, { paymentStatus: newPaymentStatus });
      toast({
        title: 'Success',
        description: 'Payment status updated successfully',
      });
      await fetchOrders();
      if (selectedOrder?._id === orderId) {
        const updated = await api.get(`/admin/orders`);
        const order = updated.data.find((o: Order) => o._id === orderId);
        if (order) setSelectedOrder(order);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update payment status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewDetails = async (order: Order) => {
    try {
      // Fetch full order details
      const response = await api.get(`/admin/orders`);
      const fullOrder = response.data.find((o: Order) => o._id === order._id);
      setSelectedOrder(fullOrder || order);
      setIsDetailsOpen(true);
    } catch (error) {
      setSelectedOrder(order);
      setIsDetailsOpen(true);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleExport = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Email', 'Phone', 'Items', 'Total', 'Discount', 'Status', 'Payment', 'Date'].join(','),
      ...filteredOrders.map(o => [
        o._id.slice(-6),
        o.user?.name || 'Guest',
        o.user?.email || '',
        o.shippingAddress?.phone || '',
        o.items.length,
        o.total,
        o.discount || 0,
        o.status,
        o.paymentStatus,
        new Date(o.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast({
      title: 'Export Successful',
      description: 'Orders exported to CSV',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500 text-white';
      case 'shipped':
        return 'bg-blue-500 text-white';
      case 'processing':
        return 'bg-purple-500 text-white';
      case 'confirmed':
        return 'bg-cyan-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-amber-500 text-white';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500 text-white';
      case 'failed':
        return 'bg-red-500 text-white';
      default:
        return 'bg-amber-500 text-white';
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => ['confirmed', 'processing', 'shipped'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0),
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading orders...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-section-spacing">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="admin-heading-1">Order Management</h1>
          <p className="admin-description">Manage and track all customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-2 border-blue-500 shadow-lg">
            <CardContent className="p-5">
              <div className="admin-stat-value">{stats.total}</div>
              <div className="admin-stat-label mt-2">Total Orders</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-500 shadow-lg">
            <CardContent className="p-5">
              <div className="admin-stat-value text-amber-600">{stats.pending}</div>
              <div className="admin-stat-label mt-2">Pending</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-500 shadow-lg">
            <CardContent className="p-5">
              <div className="admin-stat-value text-blue-600">{stats.processing}</div>
              <div className="admin-stat-label mt-2">Processing</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-emerald-500 shadow-lg">
            <CardContent className="p-5">
              <div className="admin-stat-value text-emerald-600">{stats.delivered}</div>
              <div className="admin-stat-label mt-2">Delivered</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-500 shadow-lg">
            <CardContent className="p-5">
              <div className="admin-stat-value text-purple-600">Rs. {stats.revenue.toLocaleString()}</div>
              <div className="admin-stat-label mt-2">Revenue</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-2 border-amber-500 shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>
                  Showing {filteredOrders.length} of {orders.length} orders
                </CardDescription>
              </div>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID, customer name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium">Order ID</th>
                    <th className="text-left p-3 text-sm font-medium">Customer</th>
                    <th className="text-left p-3 text-sm font-medium">Items</th>
                    <th className="text-left p-3 text-sm font-medium">Total</th>
                    <th className="text-left p-3 text-sm font-medium">Status</th>
                    <th className="text-left p-3 text-sm font-medium">Payment</th>
                    <th className="text-left p-3 text-sm font-medium">Date</th>
                    <th className="text-right p-3 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center text-muted-foreground py-8">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-3">
                          <div className="font-mono text-xs font-semibold">
                            #{order._id.slice(-6).toUpperCase()}
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-sm">{order.user?.name || 'Guest'}</p>
                            <p className="admin-body-small">{order.user?.email}</p>
                          </div>
                        </td>
                        <td className="p-3 text-sm">{order.items.length} item(s)</td>
                        <td className="p-3">
                          <div className="font-semibold">Rs. {order.total.toLocaleString()}</div>
                          {order.discount && order.discount > 0 && (
                            <div className="admin-body-small">
                              Discount: Rs. {order.discount}
                            </div>
                          )}
                        </td>
                        <td className="p-3">
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusUpdate(order._id, value)}
                            disabled={updatingStatus === order._id}
                          >
                            <SelectTrigger className="w-36 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                          <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                            {order.paymentStatus}
                          </Badge>
                        </td>
                        <td className="p-3 admin-body-small">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(order)}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No orders found
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <Card key={order._id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="admin-card-title">
                            Order #{order._id.slice(-6).toUpperCase()}
                          </CardTitle>
                          <CardDescription className="admin-card-description mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Customer</span>
                        <span className="font-medium">{order.user?.name || 'Guest'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Items</span>
                        <span>{order.items.length} item(s)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-semibold">Rs. {order.total.toLocaleString()}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm items-center">
                          <span className="text-muted-foreground">Payment Status</span>
                        </div>
                        <Select
                          value={order.paymentStatus}
                          onValueChange={(value) => handlePaymentStatusUpdate(order._id, value)}
                          disabled={updatingStatus === order._id}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pt-2 border-t space-y-2">
                        <div className="flex justify-between text-sm items-center mb-2">
                          <span className="text-muted-foreground">Order Status</span>
                        </div>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusUpdate(order._id, value)}
                          disabled={updatingStatus === order._id}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order #{selectedOrder._id.slice(-6).toUpperCase()}
                  </DialogTitle>
                  <DialogDescription>
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="details" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="items">Items</TabsTrigger>
                    <TabsTrigger value="address">Address</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="admin-card-title flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Customer Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">{selectedOrder.user?.name || 'Guest'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span>{selectedOrder.user?.email || 'N/A'}</span>
                          </div>
                          {selectedOrder.user?.phone && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Phone:</span>
                              <span>{selectedOrder.user.phone}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="admin-card-title flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Payment Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Method:</span>
                            <span className="font-medium uppercase">{selectedOrder.paymentMethod || 'COD'}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Payment Status:</span>
                            </div>
                            <Select
                              value={selectedOrder.paymentStatus}
                              onValueChange={(value) => handlePaymentStatusUpdate(selectedOrder._id, value)}
                              disabled={updatingStatus === selectedOrder._id}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    Pending
                                  </div>
                                </SelectItem>
                                <SelectItem value="paid">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    Paid
                                  </div>
                                </SelectItem>
                                <SelectItem value="failed">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    Failed
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-between pt-2 border-t">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-semibold text-lg">Rs. {selectedOrder.total.toLocaleString()}</span>
                          </div>
                          {selectedOrder.discount && selectedOrder.discount > 0 && (
                            <div className="flex justify-between text-primary">
                              <span>Discount:</span>
                              <span>-Rs. {selectedOrder.discount.toLocaleString()}</span>
                            </div>
                          )}
                          {selectedOrder.couponCode && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Coupon:</span>
                              <Badge variant="outline">{selectedOrder.couponCode}</Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="admin-card-title flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Order Status
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Select
                            value={selectedOrder.status}
                            onValueChange={(value) => handleStatusUpdate(selectedOrder._id, value)}
                            disabled={updatingStatus === selectedOrder._id}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="items" className="space-y-4">
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              {item.product.images?.[0] && (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="font-medium">{item.product.name}</h4>
                                <p className="admin-body-small">
                                  Quantity: {item.quantity} × Rs. {item.price.toLocaleString()}
                                </p>
                                <p className="font-semibold mt-1">
                                  Rs. {(item.price * item.quantity).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="address" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="admin-card-title flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Shipping Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                        <p>{selectedOrder.shippingAddress.addressLine1}</p>
                        {selectedOrder.shippingAddress.addressLine2 && (
                          <p>{selectedOrder.shippingAddress.addressLine2}</p>
                        )}
                        <p>
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                        </p>
                        <p className="flex items-center gap-2 mt-2">
                          <Phone className="h-4 w-4" />
                          {selectedOrder.shippingAddress.phone}
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;

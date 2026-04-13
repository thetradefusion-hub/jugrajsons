import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Package, Eye, Calendar, MapPin, CreditCard, 
  Truck, CheckCircle, XCircle, Phone, Mail, Download,
  RefreshCw, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import SEO from '@/components/seo/SEO';
import EmptyState from '@/components/common/EmptyState';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images?: string[];
    price: number;
    slug?: string;
  } | null;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
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

const MyOrders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
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
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleReorder = async (order: Order) => {
    // Add all items from order to cart
    toast({
      title: 'Feature Coming Soon',
      description: 'Reorder functionality will be available soon',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'confirmed':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Truck className="h-4 w-4" />;
    }
  };

  const getStatusSteps = (status: string) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', completed: true },
      { key: 'confirmed', label: 'Confirmed', completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(status) },
      { key: 'processing', label: 'Processing', completed: ['processing', 'shipped', 'delivered'].includes(status) },
      { key: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(status) },
      { key: 'delivered', label: 'Delivered', completed: status === 'delivered' },
    ];
    return steps;
  };

  const filteredOrders = {
    all: orders,
    pending: orders.filter(o => o.status === 'pending'),
    processing: orders.filter(o => ['confirmed', 'processing', 'shipped'].includes(o.status)),
    delivered: orders.filter(o => o.status === 'delivered'),
    cancelled: orders.filter(o => o.status === 'cancelled'),
  };

  if (loading) {
    return (
      <>
        <SEO title="My Orders" />
        <main className="container-custom py-8 pb-24">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading your orders...</div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO title="My Orders" />
      <main className="container-custom py-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">My Orders</h1>
              <p className="text-muted-foreground">Track and manage your orders</p>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            type="orders"
            title="No Orders Yet"
            description="Start shopping to see your orders here"
          />
        ) : (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
              <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({filteredOrders.pending.length})</TabsTrigger>
              <TabsTrigger value="processing">Active ({filteredOrders.processing.length})</TabsTrigger>
              <TabsTrigger value="delivered">Delivered ({filteredOrders.delivered.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({filteredOrders.cancelled.length})</TabsTrigger>
            </TabsList>

            {['all', 'pending', 'processing', 'delivered', 'cancelled'].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {filteredOrders[tab as keyof typeof filteredOrders].length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No {tab} orders found</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredOrders[tab as keyof typeof filteredOrders].map((order) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-muted/50 pb-3">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <Package className="w-5 h-5" />
                                Order #{order._id.slice(-6).toUpperCase()}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </CardDescription>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className={`${getStatusColor(order.status)} border flex items-center gap-1`}>
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                              <Badge
                                variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}
                                className={
                                  order.paymentStatus === 'paid'
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-amber-500 text-white'
                                }
                              >
                                {order.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6">
                          {/* Order Progress Steps */}
                          {order.status !== 'cancelled' && (
                            <div className="mb-6 pb-6 border-b">
                              <div className="flex items-center justify-between text-xs md:text-sm">
                                {getStatusSteps(order.status).map((step, index) => (
                                  <div key={step.key} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                      <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                          step.completed
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-muted border-muted-foreground/30'
                                        }`}
                                      >
                                        {step.completed ? (
                                          <CheckCircle className="h-4 w-4" />
                                        ) : (
                                          <span className="text-xs">{index + 1}</span>
                                        )}
                                      </div>
                                      <span
                                        className={`mt-2 text-center ${
                                          step.completed ? 'font-medium' : 'text-muted-foreground'
                                        }`}
                                      >
                                        {step.label}
                                      </span>
                                    </div>
                                    {index < getStatusSteps(order.status).length - 1 && (
                                      <div
                                        className={`h-0.5 flex-1 mx-2 ${
                                          step.completed ? 'bg-primary' : 'bg-muted'
                                        }`}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Order Items - Mobile Optimized */}
                          <div className="space-y-3 mb-4">
                            {order.items.slice(0, 2).map((item, index) => (
                              item.product ? (
                                <div key={index} className="flex gap-3 p-3 border rounded-lg">
                                  {item.product.images?.[0] && (
                                    <img
                                      src={item.product.images[0]}
                                      alt={item.product.name || 'Product'}
                                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm md:text-base truncate">
                                      {item.product.name || 'Product'}
                                    </h4>
                                    <p className="text-xs md:text-sm text-muted-foreground">
                                      Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                                    </p>
                                    <p className="font-semibold text-sm md:text-base mt-1">
                                      Rs. {(item.price * item.quantity).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div key={index} className="flex gap-3 p-3 border rounded-lg">
                                  <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded flex items-center justify-center">
                                    <Package className="w-8 h-8 text-muted-foreground" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm md:text-base truncate">
                                      Product (Removed)
                                    </h4>
                                    <p className="text-xs md:text-sm text-muted-foreground">
                                      Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                                    </p>
                                    <p className="font-semibold text-sm md:text-base mt-1">
                                      Rs. {(item.price * item.quantity).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              )
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-sm text-muted-foreground text-center">
                                +{order.items.length - 2} more item(s)
                              </p>
                            )}
                          </div>

                          {/* Order Summary */}
                          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 mb-4 p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="text-xs text-muted-foreground">Total Items</p>
                              <p className="font-semibold">{order.items.length}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Order Total</p>
                              <p className="font-semibold">Rs. {order.total.toLocaleString()}</p>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                              <p className="text-xs text-muted-foreground">Payment</p>
                              <p className="font-semibold uppercase text-sm">
                                {order.paymentMethod || 'COD'}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleViewDetails(order)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            {order.status === 'delivered' && (
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleReorder(order)}
                              >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reorder
                              </Button>
                            )}
                            {(order.status === 'pending' || order.status === 'confirmed') && (
                              <Button
                                variant="outline"
                                className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleCancelOrder(order)}
                                disabled={cancellingOrderId === order._id}
                              >
                                {cancellingOrderId === order._id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Cancelling...
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel Order
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Order Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

                <div className="space-y-6 mt-4">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        item.product ? (
                          <div key={index} className="flex gap-4 p-3 border rounded-lg">
                            {item.product.images?.[0] && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name || 'Product'}
                                className="w-20 h-20 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium">{item.product.name || 'Product'}</h4>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {item.quantity} × Rs. {item.price.toLocaleString()}
                              </p>
                              <p className="font-semibold mt-1">
                                Rs. {(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div key={index} className="flex gap-4 p-3 border rounded-lg">
                            <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
                              <Package className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">Product (Removed)</h4>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {item.quantity} × Rs. {item.price.toLocaleString()}
                              </p>
                              <p className="font-semibold mt-1">
                                Rs. {(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Shipping Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-1">
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

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Payment Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Method:</span>
                          <span className="font-medium uppercase">{selectedOrder.paymentMethod || 'COD'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge
                            className={
                              selectedOrder.paymentStatus === 'paid'
                                ? 'bg-emerald-500'
                                : 'bg-amber-500'
                            }
                          >
                            {selectedOrder.paymentStatus}
                          </Badge>
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
                        <div className="flex justify-between pt-2 border-t font-semibold text-base">
                          <span>Total:</span>
                          <span>Rs. {selectedOrder.total.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
};

export default MyOrders;

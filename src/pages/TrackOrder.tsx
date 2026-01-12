import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Package, Truck, CheckCircle2, Clock, MapPin,
  Phone, Mail, Calendar, CreditCard, AlertCircle, Loader2,
  RefreshCw, Download, Eye, ArrowRight, Copy, Share2, 
  MessageCircle, ShoppingCart, TrendingUp, Info, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import SEO from '@/components/seo/SEO';
import { format, addDays, differenceInDays } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

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
  shiprocketOrderId?: string;
  shiprocketShipmentId?: string;
  shiprocketAwbCode?: string;
  shiprocketCourierName?: string;
  createdAt: string;
  updatedAt: string;
}

interface TrackingStatus {
  status: string;
  timestamp: string;
  location?: string;
  description?: string;
}

const TrackOrder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trackingStatuses, setTrackingStatuses] = useState<TrackingStatus[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Auto-refresh tracking every 30 seconds if order is shipped
  useEffect(() => {
    if (order && (order.status === 'shipped' || order.status === 'processing') && autoRefresh && orderId) {
      const interval = setInterval(() => {
        handleSearch();
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, autoRefresh, orderId]);

  // Fetch recent orders if user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchRecentOrders();
    }
  }, [isAuthenticated, user]);

  const statusConfig = {
    pending: {
      label: 'Pending',
      color: 'bg-yellow-500',
      icon: Clock,
      description: 'Your order is being confirmed',
    },
    confirmed: {
      label: 'Confirmed',
      color: 'bg-blue-500',
      icon: CheckCircle2,
      description: 'Your order has been confirmed',
    },
    processing: {
      label: 'Processing',
      color: 'bg-purple-500',
      icon: Package,
      description: 'Your order is being prepared',
    },
    shipped: {
      label: 'Shipped',
      color: 'bg-indigo-500',
      icon: Truck,
      description: 'Your order is on the way',
    },
    delivered: {
      label: 'Delivered',
      color: 'bg-emerald-500',
      icon: CheckCircle2,
      description: 'Your order has been delivered',
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-red-500',
      icon: AlertCircle,
      description: 'Your order has been cancelled',
    },
  };

  const getStatusSteps = (currentStatus: string) => {
    const allStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = allStatuses.indexOf(currentStatus);
    
    return allStatuses.map((status, index) => ({
      status,
      completed: index <= currentIndex,
      current: index === currentIndex,
      ...statusConfig[status as keyof typeof statusConfig],
    }));
  };

  const handleSearch = async () => {
    if (!orderId.trim()) {
      toast({
        title: 'Order ID Required',
        description: 'Please enter an order ID or tracking number',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get(`/orders/track/${orderId}`, {
        // This is a public endpoint, so we don't need auth headers
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setOrder(response.data.order);
      // Transform Shiprocket tracking data if available
      if (response.data.tracking && Array.isArray(response.data.tracking)) {
        const transformed = response.data.tracking.map((item: any) => ({
          status: item.status || item.current_status || 'Unknown',
          timestamp: item.updated_at || item.timestamp || new Date().toISOString(),
          location: item.location || item.city || '',
          description: item.comment || item.status || '',
        }));
        setTrackingStatuses(transformed);
      } else {
        setTrackingStatuses([]);
      }
      setSearchParams({ id: orderId });
    } catch (error: any) {
      toast({
        title: 'Order Not Found',
        description: error.response?.data?.message || 'Could not find order with this ID. Please check and try again.',
        variant: 'destructive',
      });
      setOrder(null);
      setTrackingStatuses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      const orders = response.data || [];
      setRecentOrders(orders.slice(0, 5)); // Get last 5 orders
    } catch (error) {
      // Silently fail - not critical
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
    } catch {
      return dateString;
    }
  };

  const getEstimatedDelivery = (orderDate: string, status: string) => {
    if (status === 'delivered' || status === 'cancelled') return null;
    try {
      const orderDateObj = new Date(orderDate);
      let estimatedDays = 5; // Default 5 days
      
      if (status === 'shipped') {
        estimatedDays = 2; // 2 days if already shipped
      } else if (status === 'processing') {
        estimatedDays = 4; // 4 days if processing
      } else if (status === 'confirmed') {
        estimatedDays = 5; // 5 days if confirmed
      }
      
      return addDays(orderDateObj, estimatedDays);
    } catch {
      return null;
    }
  };

  const getProgressPercentage = (status: string) => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const copyOrderId = () => {
    if (order) {
      const shortId = order._id.slice(-6).toUpperCase();
      navigator.clipboard.writeText(shortId);
      toast({
        title: 'Copied!',
        description: 'Order ID copied to clipboard',
      });
    }
  };

  const shareOrder = async () => {
    if (order) {
      const shortId = order._id.slice(-6).toUpperCase();
      const shareUrl = `${window.location.origin}/track-order?id=${shortId}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Track Order #${shortId}`,
            text: `Track your order #${shortId} from Atharva Health Solutions`,
            url: shareUrl,
          });
        } catch (error) {
          // User cancelled or error occurred
          copyToClipboard(shareUrl);
        }
      } else {
        copyToClipboard(shareUrl);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Link Copied!',
      description: 'Tracking link copied to clipboard',
    });
  };

  const getShortOrderId = (orderId: string) => {
    return orderId.slice(-6).toUpperCase();
  };

  return (
    <>
      <SEO 
        title="Track Your Order - Order Tracking | Atharva Health Solutions"
        description="Track your order status in real-time. Enter your order ID or tracking number to see the current status and delivery updates."
      />
      <main className="pb-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 py-12 md:py-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Track Your Order
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Enter your order ID or tracking number to see real-time updates
              </p>

              {/* Search Box */}
              <div className="max-w-2xl mx-auto">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter Order ID (e.g., CA1F19)"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 h-12 text-base"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={isLoading}
                    size="lg"
                    className="h-12 px-8"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Track
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-muted-foreground">
                    Don't have your order ID?{' '}
                    {isAuthenticated ? (
                      <Link to="/orders" className="text-primary hover:underline font-medium">
                        View my orders
                      </Link>
                    ) : (
                      <>
                        Check your email or{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                          login to view orders
                        </Link>
                      </>
                    )}
                  </p>
                </div>

                {/* Recent Orders Quick Access */}
                {isAuthenticated && recentOrders.length > 0 && !order && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <Card className="bg-muted/50 border-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Recent Orders
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {recentOrders.map((recentOrder) => (
                            <button
                              key={recentOrder._id}
                              onClick={() => {
                                setOrderId(getShortOrderId(recentOrder._id));
                                setTimeout(() => handleSearch(), 100);
                              }}
                              className="w-full text-left p-3 rounded-lg hover:bg-background transition-colors border border-transparent hover:border-border"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-sm">
                                    Order #{getShortOrderId(recentOrder._id)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(recentOrder.createdAt)}
                                  </p>
                                </div>
                                <Badge variant="outline" className="ml-2">
                                  {recentOrder.status}
                                </Badge>
                              </div>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container-custom py-12">
          <AnimatePresence>
            {order && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Order Status Timeline */}
                <Card className="border-2 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-2xl">Order Status</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyOrderId}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={shareOrder}
                            className="h-8 w-8 p-0"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-muted-foreground">
                            Order ID: <span className="font-mono font-semibold text-foreground">
                              {getShortOrderId(order._id)}
                            </span>
                          </p>
                          {order.shiprocketAwbCode && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <p className="text-muted-foreground">
                                AWB: <span className="font-mono font-semibold text-foreground">
                                  {order.shiprocketAwbCode}
                                </span>
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'cancelled' ? 'destructive' :
                            'secondary'
                          }
                          className="text-lg px-4 py-2"
                        >
                          {statusConfig[order.status].label}
                        </Badge>
                        {(order.status === 'shipped' || order.status === 'processing') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setAutoRefresh(!autoRefresh);
                              toast({
                                title: autoRefresh ? 'Auto-refresh disabled' : 'Auto-refresh enabled',
                                description: autoRefresh 
                                  ? 'Tracking will no longer refresh automatically'
                                  : 'Tracking will refresh every 30 seconds',
                              });
                            }}
                          >
                            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                            {autoRefresh ? 'Auto' : 'Manual'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {order.status !== 'cancelled' && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(getProgressPercentage(order.status))}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${getProgressPercentage(order.status)}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              order.status === 'delivered' ? 'bg-emerald-500' :
                              order.status === 'shipped' ? 'bg-indigo-500' :
                              order.status === 'processing' ? 'bg-purple-500' :
                              order.status === 'confirmed' ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    {/* Estimated Delivery */}
                    {(() => {
                      const estimatedDelivery = getEstimatedDelivery(order.createdAt, order.status);
                      if (estimatedDelivery) {
                        const daysLeft = differenceInDays(estimatedDelivery, new Date());
                        return (
                          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-primary" />
                              <div>
                                <p className="text-sm font-medium">
                                  Estimated Delivery: {format(estimatedDelivery, 'MMM dd, yyyy')}
                                </p>
                                {daysLeft > 0 && (
                                  <p className="text-xs text-muted-foreground">
                                    {daysLeft} {daysLeft === 1 ? 'day' : 'days'} remaining
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {getStatusSteps(order.status).map((step, index, array) => {
                        const Icon = step.icon;
                        const isLast = index === array.length - 1;
                        return (
                          <div key={step.status} className="relative pb-8">
                            {!isLast && (
                              <div
                                className={`absolute left-6 top-12 w-0.5 h-full ${
                                  step.completed ? 'bg-primary' : 'bg-border'
                                }`}
                              />
                            )}
                            <div className="flex items-start gap-4">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  step.completed
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                <Icon className="w-6 h-6" />
                              </div>
                              <div className="flex-1 pt-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{step.label}</h3>
                                  {step.current && (
                                    <Badge variant="outline" className="text-xs">
                                      Current
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                                {step.status === 'shipped' && order.shiprocketAwbCode && (
                                  <div className="mt-2 space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                      AWB: <span className="font-mono">{order.shiprocketAwbCode}</span>
                                    </p>
                                    {order.shiprocketCourierName && (
                                      <p className="text-xs text-muted-foreground">
                                        Courier: {order.shiprocketCourierName}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Details */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Order Items */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                            >
                              {item.product?.images?.[0] ? (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                                  <Package className="w-8 h-8 text-muted-foreground" />
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">
                                  {item.product?.name || 'Product not found'}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {item.quantity} × Rs. {item.price.toFixed(2)}
                                </p>
                                {item.product?.slug && (
                                  <Link
                                    to={`/product/${item.product.slug}`}
                                    className="text-sm text-primary hover:underline mt-1 inline-flex items-center gap-1"
                                  >
                                    View Product <ArrowRight className="w-3 h-3" />
                                  </Link>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  Rs. {(item.quantity * item.price).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tracking Updates */}
                    {trackingStatuses.length > 0 && (
                      <Card className="border-2">
                        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
                          <CardTitle className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-primary" />
                            Real-time Tracking Updates
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20" />
                            <div className="space-y-6">
                              {trackingStatuses.map((status, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="relative flex items-start gap-4"
                                >
                                  <div className="relative z-10 flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                      <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                  </div>
                                  <div className="flex-1 pt-1 pb-4">
                                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                                      <p className="font-semibold text-base mb-1">{status.status}</p>
                                      {status.description && (
                                        <p className="text-sm text-muted-foreground mb-2">
                                          {status.description}
                                        </p>
                                      )}
                                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                        {status.location && (
                                          <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            <span>{status.location}</span>
                                          </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          <span>{formatDate(status.timestamp)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Info Card for Shipped Orders */}
                    {order.status === 'shipped' && order.shiprocketCourierName && (
                      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-800">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                              <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                                Shipping Information
                              </h3>
                              <div className="space-y-2 text-sm">
                                <p className="text-blue-700 dark:text-blue-300">
                                  <span className="font-medium">Courier:</span> {order.shiprocketCourierName}
                                </p>
                                {order.shiprocketAwbCode && (
                                  <p className="text-blue-700 dark:text-blue-300">
                                    <span className="font-medium">AWB Number:</span>{' '}
                                    <span className="font-mono">{order.shiprocketAwbCode}</span>
                                  </p>
                                )}
                                <p className="text-blue-600 dark:text-blue-400 text-xs mt-3">
                                  Your order is on the way! You can track it using the AWB number on the courier's website.
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Order Summary & Shipping */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>Rs. {(order.total + (order.discount || 0)).toFixed(2)}</span>
                        </div>
                        {order.discount && order.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Discount</span>
                            <span className="text-emerald-600">-Rs. {order.discount.toFixed(2)}</span>
                          </div>
                        )}
                        {order.couponCode && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Coupon</span>
                            <span className="text-xs">{order.couponCode}</span>
                          </div>
                        )}
                        <div className="border-t pt-3 flex justify-between font-semibold">
                          <span>Total</span>
                          <span>Rs. {order.total.toFixed(2)}</span>
                        </div>
                        <div className="pt-3 border-t space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Payment:</span>
                            <Badge
                              variant={
                                order.paymentStatus === 'paid' ? 'default' :
                                order.paymentStatus === 'failed' ? 'destructive' :
                                'secondary'
                              }
                            >
                              {order.paymentStatus.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Method:</span>
                            <span>{order.paymentMethod}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="font-semibold">{order.shippingAddress.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.shippingAddress.addressLine1}
                            {order.shippingAddress.addressLine2 && (
                              <>, {order.shippingAddress.addressLine2}</>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                            <Phone className="w-4 h-4" />
                            <span>{order.shippingAddress.phone}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Order Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Ordered</p>
                            <p className="font-medium">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                        {order.updatedAt !== order.createdAt && (
                          <div className="flex items-center gap-2 text-sm">
                            <RefreshCw className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground">Last Updated</p>
                              <p className="font-medium">{formatDate(order.updatedAt)}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-base">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                          {isAuthenticated && (
                            <Button variant="outline" className="flex-1" asChild>
                              <Link to="/orders">
                                <Eye className="w-4 h-4 mr-2" />
                                All Orders
                              </Link>
                            </Button>
                          )}
                          <Button variant="outline" className="flex-1" onClick={() => window.print()}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" className="flex-1" asChild>
                            <Link to="/contact">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Support
                            </Link>
                          </Button>
                          {order.status === 'delivered' && (
                            <Button variant="outline" className="flex-1" onClick={() => {
                              toast({
                                title: 'Feature Coming Soon',
                                description: 'Reorder functionality will be available soon',
                              });
                            }}>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Reorder
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!order && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Card className="max-w-md mx-auto">
                <CardContent className="p-12">
                  <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Track Your Order</h3>
                  <p className="text-muted-foreground mb-6">
                    Enter your order ID or tracking number above to see the current status and delivery updates.
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/orders">View My Orders</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
};

export default TrackOrder;


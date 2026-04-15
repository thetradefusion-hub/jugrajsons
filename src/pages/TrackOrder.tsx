import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  AlertCircle,
  Loader2,
  RefreshCw,
  Download,
  Eye,
  ArrowRight,
  Copy,
  Share2,
  MessageCircle,
  ShoppingCart,
  Info,
  ChevronRight,
  Home,
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
import { cn } from '@/lib/utils';

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

  useEffect(() => {
    if (order && (order.status === 'shipped' || order.status === 'processing') && autoRefresh && orderId) {
      const interval = setInterval(() => {
        handleSearch();
      }, 30000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, autoRefresh, orderId]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchRecentOrders();
    }
  }, [isAuthenticated, user]);

  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: Clock,
      description: 'Order confirm ho raha hai',
      badge: 'border-[#E6A817]/40 bg-[#fff9ef] text-[#2B1D0E]',
    },
    confirmed: {
      label: 'Confirmed',
      icon: CheckCircle2,
      description: 'Order confirm ho chuka hai',
      badge: 'border-[#1F3D2B]/30 bg-[#1F3D2B]/10 text-[#1F3D2B]',
    },
    processing: {
      label: 'Processing',
      icon: Package,
      description: 'Packaging / dispatch ki taiyaari',
      badge: 'border-[#E6A817]/40 bg-[#E6A817]/15 text-[#2B1D0E]',
    },
    shipped: {
      label: 'Shipped',
      icon: Truck,
      description: 'Courier ke saath raste mein',
      badge: 'border-[#1F3D2B]/40 bg-[#1F3D2B] text-[#F5E9D7]',
    },
    delivered: {
      label: 'Delivered',
      icon: CheckCircle2,
      description: 'Aap tak pahunch chuka hai',
      badge: 'border-[#1F3D2B]/30 bg-[#173423] text-[#F5E9D7]',
    },
    cancelled: {
      label: 'Cancelled',
      icon: AlertCircle,
      description: 'Order cancel kar diya gaya',
      badge: 'border-red-200 bg-red-50 text-red-800',
    },
  };

  const getStatusSteps = (currentStatus: string) => {
    if (currentStatus === 'cancelled') {
      return [
        {
          status: 'cancelled',
          completed: true,
          current: true,
          ...statusConfig.cancelled,
        },
      ];
    }
    const allStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'] as const;
    const currentIndex = allStatuses.indexOf(currentStatus as (typeof allStatuses)[number]);

    return allStatuses.map((status, index) => ({
      status,
      completed: index <= currentIndex,
      current: index === currentIndex,
      ...statusConfig[status],
    }));
  };

  const handleSearch = async () => {
    if (!orderId.trim()) {
      toast({
        title: 'Order ID chahiye',
        description: 'Order ID ya tracking number daaliye',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get(`/orders/track/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setOrder(response.data.order);
      if (response.data.tracking && Array.isArray(response.data.tracking)) {
        const transformed = response.data.tracking.map((item: Record<string, unknown>) => ({
          status: (item.status || item.current_status || 'Unknown') as string,
          timestamp: (item.updated_at || item.timestamp || new Date().toISOString()) as string,
          location: (item.location || item.city || '') as string,
          description: (item.comment || item.status || '') as string,
        }));
        setTrackingStatuses(transformed);
      } else {
        setTrackingStatuses([]);
      }
      setSearchParams({ id: orderId });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'Order nahi mila',
        description: err.response?.data?.message || 'ID check karke dubara try kijiye.',
        variant: 'destructive',
      });
      setOrder(null);
      setTrackingStatuses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      const orders = response.data || [];
      setRecentOrders(orders.slice(0, 5));
    } catch {
      /* optional */
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
      let estimatedDays = 5;
      if (status === 'shipped') estimatedDays = 2;
      else if (status === 'processing') estimatedDays = 4;
      else if (status === 'confirmed') estimatedDays = 5;
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
        title: 'Copy ho gaya',
        description: 'Order ID clipboard me save ho gayi',
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
            text: `Jugraj Son's Hive — order #${shortId} track karein`,
            url: shareUrl,
          });
        } catch {
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
      title: 'Link copy',
      description: 'Tracking link clipboard me hai',
    });
  };

  const getShortOrderId = (id: string) => {
    return id.slice(-6).toUpperCase();
  };

  return (
    <>
      <SEO
        title="Track Order | Jugraj Son's Hive"
        description="Order ID se real-time status aur delivery updates dekhein."
      />
      <main className="min-h-screen overflow-x-hidden bg-[#F5E9D7] pb-28 text-[#2B1D0E] md:pb-12">
        <section className="relative isolate border-b border-[#E6A817]/15 bg-gradient-to-br from-[#F5E9D7] via-[#fff8ed] to-[#f0e1cb]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.11] [background:radial-gradient(circle_at_1px_1px,#1F3D2B_1px,transparent_0)] [background-size:22px_22px]" />
          <div className="container-custom relative py-8 md:py-12">
            <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-[#2B1D0E]/65 md:text-sm">
              <Link to="/" className="inline-flex items-center gap-1 hover:text-[#1F3D2B]">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
              <span className="font-medium text-[#2B1D0E]">Track order</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E6A817]/35 bg-white/90 shadow-sm">
                <Truck className="h-7 w-7 text-[#1F3D2B]" />
              </div>
              <h1 className="font-display text-3xl font-bold leading-tight text-[#2B1D0E] md:text-5xl">Track your order</h1>
              <p className="mx-auto mt-3 max-w-xl text-sm text-[#2B1D0E]/75 md:text-base">
                Order ID daaliye — status, shipping aur delivery estimate yahin dikhega.
              </p>

              <div className="mx-auto mt-8 max-w-2xl">
                <Card className="overflow-hidden rounded-3xl border border-[#E6A817]/25 bg-white/95 shadow-[0_16px_40px_rgba(43,29,14,0.08)]">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2B1D0E]/40" />
                        <Input
                          type="text"
                          placeholder="Order ID (jaise CA1F19)"
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearch();
                          }}
                          className="h-12 rounded-2xl border-[#E6A817]/30 bg-[#fffaf2] pl-10 text-base text-[#2B1D0E] placeholder:text-[#2B1D0E]/40"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleSearch}
                        disabled={isLoading}
                        size="lg"
                        className="h-12 shrink-0 rounded-2xl bg-[#E6A817] px-8 font-semibold text-[#2B1D0E] hover:bg-[#d89c14] sm:px-6"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Search…
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Track
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="mt-4 text-left text-xs text-[#2B1D0E]/60 md:text-sm">
                      Order ID email / SMS me milti hai.{' '}
                      {isAuthenticated ? (
                        <Link to="/orders" className="font-semibold text-[#1F3D2B] underline-offset-2 hover:underline">
                          Meri orders
                        </Link>
                      ) : (
                        <>
                          <Link to="/login" className="font-semibold text-[#1F3D2B] underline-offset-2 hover:underline">
                            Login
                          </Link>{' '}
                          karke bhi orders dekh sakte hain.
                        </>
                      )}
                    </p>
                  </CardContent>
                </Card>

                {isAuthenticated && recentOrders.length > 0 && !order && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-left">
                    <Card className="rounded-3xl border border-[#E6A817]/20 bg-white/90 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 font-display text-lg text-[#2B1D0E]">
                          <Clock className="h-4 w-4 text-[#1F3D2B]" />
                          Recent orders
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {recentOrders.map((recentOrder) => (
                            <button
                              key={recentOrder._id}
                              type="button"
                              onClick={() => {
                                setOrderId(getShortOrderId(recentOrder._id));
                                setTimeout(() => handleSearch(), 100);
                              }}
                              className="w-full rounded-2xl border border-transparent p-3 text-left transition-colors hover:border-[#E6A817]/35 hover:bg-[#fff9ef]"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold text-[#2B1D0E]">#{getShortOrderId(recentOrder._id)}</p>
                                  <p className="text-xs text-[#2B1D0E]/55">{formatDate(recentOrder.createdAt)}</p>
                                </div>
                                <Badge variant="outline" className="shrink-0 border-[#E6A817]/40 capitalize text-[#2B1D0E]">
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

        <div className="container-custom py-8 md:py-12">
          <AnimatePresence>
            {order && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card className="overflow-hidden rounded-3xl border border-[#E6A817]/25 bg-white shadow-[0_16px_40px_rgba(43,29,14,0.06)]">
                  <CardHeader className="space-y-4 border-b border-[#E6A817]/15 bg-[#fffaf2]/80 px-4 py-5 md:px-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <CardTitle className="font-display text-2xl text-[#2B1D0E]">Order status</CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={copyOrderId}
                            className="h-9 w-9 rounded-full border border-[#E6A817]/25 text-[#2B1D0E] hover:bg-[#fff9ef]"
                            aria-label="Copy order ID"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={shareOrder}
                            className="h-9 w-9 rounded-full border border-[#E6A817]/25 text-[#2B1D0E] hover:bg-[#fff9ef]"
                            aria-label="Share tracking"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#2B1D0E]/70">
                          <span>
                            ID:{' '}
                            <span className="font-mono font-semibold text-[#2B1D0E]">{getShortOrderId(order._id)}</span>
                          </span>
                          {order.shiprocketAwbCode && (
                            <>
                              <span className="text-[#2B1D0E]/35">·</span>
                              <span>
                                AWB:{' '}
                                <span className="font-mono font-semibold text-[#2B1D0E]">{order.shiprocketAwbCode}</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={cn('rounded-full px-4 py-2 text-sm font-semibold', statusConfig[order.status].badge)}>
                          {statusConfig[order.status].label}
                        </Badge>
                        {(order.status === 'shipped' || order.status === 'processing') && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-full border-[#E6A817]/40 bg-white text-[#2B1D0E] hover:bg-[#fff9ef]"
                            onClick={() => {
                              setAutoRefresh(!autoRefresh);
                              toast({
                                title: autoRefresh ? 'Auto-refresh band' : 'Auto-refresh on',
                                description: autoRefresh ? '' : 'Har 30 sec par refresh hoga',
                              });
                            }}
                          >
                            <RefreshCw className={cn('mr-2 h-4 w-4', autoRefresh && 'animate-spin')} />
                            {autoRefresh ? 'Auto' : 'Manual'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {order.status !== 'cancelled' && (
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-[#2B1D0E]">Progress</span>
                          <span className="text-[#2B1D0E]/60">{Math.round(getProgressPercentage(order.status))}%</span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E6A817]/20">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${getProgressPercentage(order.status)}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="h-full rounded-full bg-[#1F3D2B]"
                          />
                        </div>
                      </div>
                    )}

                    {(() => {
                      const estimatedDelivery = getEstimatedDelivery(order.createdAt, order.status);
                      if (estimatedDelivery) {
                        const daysLeft = differenceInDays(estimatedDelivery, new Date());
                        return (
                          <div className="rounded-2xl border border-[#E6A817]/25 bg-white/90 p-4">
                            <div className="flex items-start gap-3">
                              <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-[#1F3D2B]" />
                              <div>
                                <p className="text-sm font-semibold text-[#2B1D0E]">
                                  Estimated delivery: {format(estimatedDelivery, 'MMM dd, yyyy')}
                                </p>
                                {daysLeft > 0 && (
                                  <p className="text-xs text-[#2B1D0E]/60">
                                    {daysLeft} {daysLeft === 1 ? 'day' : 'days'} baaki
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
                  <CardContent className="px-4 py-6 md:px-6">
                    <div className="relative">
                      {getStatusSteps(order.status).map((step, index, array) => {
                        const Icon = step.icon;
                        const isLast = index === array.length - 1;
                        return (
                          <div key={step.status} className="relative pb-8 last:pb-0">
                            {!isLast && (
                              <div
                                className={cn(
                                  'absolute left-6 top-12 h-full w-0.5',
                                  step.completed ? 'bg-[#1F3D2B]/35' : 'bg-[#E6A817]/20',
                                )}
                              />
                            )}
                            <div className="flex items-start gap-4">
                              <div
                                className={cn(
                                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2',
                                  step.completed
                                    ? 'border-[#1F3D2B] bg-[#1F3D2B] text-[#F5E9D7]'
                                    : 'border-[#E6A817]/25 bg-[#fffaf2] text-[#2B1D0E]/35',
                                )}
                              >
                                <Icon className="h-6 w-6" />
                              </div>
                              <div className="min-w-0 flex-1 pt-1">
                                <div className="mb-1 flex flex-wrap items-center gap-2">
                                  <h3 className="font-semibold text-[#2B1D0E]">{step.label}</h3>
                                  {step.current && (
                                    <Badge variant="outline" className="border-[#E6A817]/50 text-xs text-[#2B1D0E]">
                                      Current
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-[#2B1D0E]/65">{step.description}</p>
                                {step.status === 'shipped' && order.shiprocketAwbCode && (
                                  <div className="mt-2 space-y-1 text-xs text-[#2B1D0E]/60">
                                    <p>
                                      AWB: <span className="font-mono text-[#2B1D0E]">{order.shiprocketAwbCode}</span>
                                    </p>
                                    {order.shiprocketCourierName && <p>Courier: {order.shiprocketCourierName}</p>}
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

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="space-y-6 lg:col-span-2">
                    <Card className="rounded-3xl border border-[#E6A817]/20 bg-white shadow-sm">
                      <CardHeader className="border-b border-[#E6A817]/10 pb-4">
                        <CardTitle className="font-display text-xl text-[#2B1D0E]">Order items</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-4 border-b border-[#E6A817]/10 pb-4 last:border-0 last:pb-0"
                            >
                              {item.product?.images?.[0] ? (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="h-16 w-16 shrink-0 rounded-2xl border border-[#E6A817]/20 bg-[#fffaf2] object-contain p-1"
                                />
                              ) : (
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#E6A817]/20 bg-[#fffaf2]">
                                  <Package className="h-8 w-8 text-[#2B1D0E]/35" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-[#2B1D0E]">{item.product?.name || 'Product'}</h4>
                                <p className="text-sm text-[#2B1D0E]/60">
                                  Qty {item.quantity} × Rs. {item.price.toFixed(2)}
                                </p>
                                {item.product?.slug && (
                                  <Link
                                    to={`/product/${item.product.slug}`}
                                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-[#1F3D2B] hover:underline"
                                  >
                                    View product <ArrowRight className="h-3 w-3" />
                                  </Link>
                                )}
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="font-semibold text-[#2B1D0E]">Rs. {(item.quantity * item.price).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {trackingStatuses.length > 0 && (
                      <Card className="rounded-3xl border border-[#E6A817]/25 bg-white shadow-sm">
                        <CardHeader className="border-b border-[#E6A817]/10 bg-[#fffaf2]/80">
                          <CardTitle className="flex items-center gap-2 font-display text-xl text-[#2B1D0E]">
                            <Truck className="h-5 w-5 text-[#1F3D2B]" />
                            Tracking updates
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="relative">
                            <div className="absolute bottom-0 left-4 top-0 w-0.5 bg-[#E6A817]/25" />
                            <div className="space-y-6">
                              {trackingStatuses.map((status, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -12 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.06 }}
                                  className="relative flex items-start gap-4"
                                >
                                  <div className="relative z-10 flex shrink-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F3D2B] text-[#F5E9D7]">
                                      <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                  </div>
                                  <div className="min-w-0 flex-1 pb-4">
                                    <div className="rounded-2xl border border-[#E6A817]/20 bg-[#fff9ef] p-4">
                                      <p className="mb-1 text-base font-semibold text-[#2B1D0E]">{status.status}</p>
                                      {status.description && (
                                        <p className="mb-2 text-sm text-[#2B1D0E]/70">{status.description}</p>
                                      )}
                                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#2B1D0E]/55">
                                        {status.location && (
                                          <span className="inline-flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {status.location}
                                          </span>
                                        )}
                                        <span className="inline-flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {formatDate(status.timestamp)}
                                        </span>
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

                    {order.status === 'shipped' && order.shiprocketCourierName && (
                      <Card className="rounded-3xl border border-[#E6A817]/30 bg-[#fff9ef] shadow-sm">
                        <CardContent className="p-5 md:p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1F3D2B] text-[#F5E9D7]">
                              <Info className="h-6 w-6" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="mb-2 font-display text-lg font-semibold text-[#2B1D0E]">Shipping info</h3>
                              <div className="space-y-2 text-sm text-[#2B1D0E]/80">
                                <p>
                                  <span className="font-medium text-[#2B1D0E]">Courier:</span> {order.shiprocketCourierName}
                                </p>
                                {order.shiprocketAwbCode && (
                                  <p>
                                    <span className="font-medium text-[#2B1D0E]">AWB:</span>{' '}
                                    <span className="font-mono">{order.shiprocketAwbCode}</span>
                                  </p>
                                )}
                                <p className="mt-3 text-xs text-[#2B1D0E]/60">
                                  Courier site par AWB se bhi tracking kar sakte hain.
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="space-y-6">
                    <Card className="rounded-3xl border border-[#E6A817]/20 bg-white shadow-sm">
                      <CardHeader className="border-b border-[#E6A817]/10 pb-3">
                        <CardTitle className="font-display text-lg text-[#2B1D0E]">Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-4">
                        <div className="flex justify-between text-sm text-[#2B1D0E]/80">
                          <span>Subtotal</span>
                          <span className="font-medium">Rs. {(order.total + (order.discount || 0)).toFixed(2)}</span>
                        </div>
                        {order.discount != null && order.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[#2B1D0E]/70">Discount</span>
                            <span className="font-medium text-[#1F3D2B]">-Rs. {order.discount.toFixed(2)}</span>
                          </div>
                        )}
                        {order.couponCode && (
                          <div className="flex justify-between text-sm text-[#2B1D0E]/70">
                            <span>Coupon</span>
                            <span className="text-xs font-mono">{order.couponCode}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-[#E6A817]/15 pt-3 font-semibold text-[#2B1D0E]">
                          <span>Total</span>
                          <span>Rs. {order.total.toFixed(2)}</span>
                        </div>
                        <div className="space-y-2 border-t border-[#E6A817]/15 pt-3">
                          <div className="flex items-center gap-2 text-sm text-[#2B1D0E]/75">
                            <CreditCard className="h-4 w-4 shrink-0 text-[#1F3D2B]" />
                            <span>Payment:</span>
                            <Badge
                              className={cn(
                                'capitalize',
                                order.paymentStatus === 'paid' && 'border-0 bg-[#173423] text-[#F5E9D7]',
                                order.paymentStatus === 'failed' && 'border-red-200 bg-red-50 text-red-800',
                                order.paymentStatus === 'pending' && 'border-[#E6A817]/40 bg-[#fff9ef] text-[#2B1D0E]',
                              )}
                            >
                              {order.paymentStatus}
                            </Badge>
                          </div>
                          <p className="text-sm text-[#2B1D0E]/70">
                            Method: <span className="font-medium text-[#2B1D0E]">{order.paymentMethod}</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl border border-[#E6A817]/20 bg-white shadow-sm">
                      <CardHeader className="border-b border-[#E6A817]/10 pb-3">
                        <CardTitle className="font-display text-lg text-[#2B1D0E]">Shipping address</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 pt-4 text-sm text-[#2B1D0E]/80">
                        <p className="font-semibold text-[#2B1D0E]">{order.shippingAddress.name}</p>
                        <p>
                          {order.shippingAddress.addressLine1}
                          {order.shippingAddress.addressLine2 && <>, {order.shippingAddress.addressLine2}</>}
                        </p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-[#2B1D0E]/70">
                          <Phone className="h-4 w-4 shrink-0 text-[#1F3D2B]" />
                          <span>{order.shippingAddress.phone}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl border border-[#E6A817]/20 bg-white shadow-sm">
                      <CardHeader className="border-b border-[#E6A817]/10 pb-3">
                        <CardTitle className="font-display text-lg text-[#2B1D0E]">Timeline</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-4 text-sm">
                        <div className="flex gap-3">
                          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#1F3D2B]" />
                          <div>
                            <p className="text-[#2B1D0E]/60">Ordered</p>
                            <p className="font-medium text-[#2B1D0E]">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                        {order.updatedAt !== order.createdAt && (
                          <div className="flex gap-3">
                            <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-[#1F3D2B]" />
                            <div>
                              <p className="text-[#2B1D0E]/60">Last updated</p>
                              <p className="font-medium text-[#2B1D0E]">{formatDate(order.updatedAt)}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl border border-[#E6A817]/25 bg-[#fffaf2] shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="font-display text-base text-[#2B1D0E]">Quick actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                          {isAuthenticated && (
                            <Button variant="outline" className="rounded-xl border-[#E6A817]/40 bg-white text-[#2B1D0E] hover:bg-[#fff9ef]" asChild>
                              <Link to="/orders">
                                <Eye className="mr-2 h-4 w-4" />
                                Orders
                              </Link>
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl border-[#E6A817]/40 bg-white text-[#2B1D0E] hover:bg-[#fff9ef]"
                            onClick={() => window.print()}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Print
                          </Button>
                          <Button variant="outline" className="rounded-xl border-[#E6A817]/40 bg-white text-[#2B1D0E] hover:bg-[#fff9ef]" asChild>
                            <Link to="/contact">
                              <MessageCircle className="mr-2 h-4 w-4" />
                              Support
                            </Link>
                          </Button>
                          {order.status === 'delivered' && (
                            <Button
                              type="button"
                              variant="outline"
                              className="rounded-xl border-[#E6A817]/40 bg-white text-[#2B1D0E] hover:bg-[#fff9ef]"
                              onClick={() => {
                                toast({
                                  title: 'Jald aa raha hai',
                                  description: 'Reorder feature update me hai',
                                });
                              }}
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" />
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

          {!order && !isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8">
              <Card className="mx-auto max-w-md rounded-3xl border border-[#E6A817]/25 bg-white/95 shadow-sm">
                <CardContent className="p-8 text-center md:p-10">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E6A817]/30 bg-[#fffaf2]">
                    <Truck className="h-8 w-8 text-[#1F3D2B]/70" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#2B1D0E]">Abhi koi order load nahi hai</h3>
                  <p className="mt-2 text-sm text-[#2B1D0E]/70">
                    Upar order ID daal kar &quot;Track&quot; dabayein — status yahin dikhega.
                  </p>
                  <Button asChild className="mt-6 rounded-full bg-[#E6A817] text-[#2B1D0E] hover:bg-[#d89c14]">
                    <Link to="/orders">Meri orders</Link>
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

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, CreditCard, Package, Phone, Tag, Truck, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/CartContext';
import { useAuth, type Address } from '@/context/AuthContext';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/seo/SEO';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const quickSchema = z.object({
  name: z.string().min(2, 'Name required'),
  phone: z
    .string()
    .min(10, 'Valid mobile required')
    .refine((s) => s.replace(/\D/g, '').length >= 10, 'Valid mobile required'),
  pincode: z.string().regex(/^\d{6}$/, '6-digit pincode'),
  addressDetail: z.string().min(8, 'House / building / area required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
});

type QuickForm = z.infer<typeof quickSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user, addresses, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [shiprocketUi, setShiprocketUi] = useState<{
    enabled: boolean;
    autoAwb: boolean;
  } | null>(null);

  type LocStatus = 'idle' | 'loading' | 'ok' | 'fail';
  const [locStatus, setLocStatus] = useState<LocStatus>('idle');
  const [manualLocation, setManualLocation] = useState(false);

  const defaultAddr = useMemo(
    () => addresses.find((a) => a.isDefault) || addresses[0],
    [addresses]
  );

  const profilePhone =
    user?.phone?.replace(/\D/g, '').slice(-10) ||
    '';

  const getDefaultValues = useCallback((): QuickForm => {
    if (defaultAddr) {
      const detail = [defaultAddr.addressLine1, defaultAddr.addressLine2].filter(Boolean).join(', ').trim();
      const addrPhone = defaultAddr.phone?.replace(/\D/g, '').slice(-10) || '';
      return {
        name: defaultAddr.name?.trim() || user?.name || '',
        phone: addrPhone || profilePhone,
        pincode: defaultAddr.pincode.replace(/\D/g, '').slice(0, 6),
        addressDetail: detail || defaultAddr.addressLine1,
        city: defaultAddr.city,
        state: defaultAddr.state,
      };
    }
    return {
      name: user?.name?.trim() || '',
      phone: profilePhone,
      pincode: '',
      addressDetail: '',
      city: '',
      state: '',
    };
  }, [defaultAddr, user?.name, profilePhone]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<QuickForm>({
    resolver: zodResolver(quickSchema),
    defaultValues: getDefaultValues(),
  });

  // Auto-fill from profile (/auth/me) + saved addresses once auth and data are ready
  useEffect(() => {
    if (authLoading) return;
    reset(getDefaultValues());
    if (defaultAddr?.city && defaultAddr?.state) {
      setLocStatus('ok');
      setManualLocation(false);
    } else {
      setLocStatus('idle');
      setManualLocation(false);
    }
  }, [
    authLoading,
    defaultAddr?.id,
    user?.id,
    user?.phone,
    user?.name,
    addresses.length,
    reset,
    getDefaultValues,
    defaultAddr?.city,
    defaultAddr?.state,
  ]);

  const pincodeWatch = watch('pincode');

  useEffect(() => {
    const p = (pincodeWatch || '').replace(/\D/g, '').slice(0, 6);
    if (p.length !== 6) {
      if (p.length < 6) setLocStatus((s) => (s === 'loading' ? s : 'idle'));
      return;
    }

    const handle = setTimeout(async () => {
      setLocStatus('loading');
      try {
        const { data } = await api.get<{ city: string; state: string }>(`/pincode/${p}`);
        setValue('city', data.city, { shouldValidate: true });
        setValue('state', data.state, { shouldValidate: true });
        setLocStatus('ok');
        setManualLocation(false);
      } catch {
        setLocStatus('fail');
        toast({
          title: 'Pincode lookup failed',
          description: 'City & state niche manually bhar dein.',
          variant: 'destructive',
        });
      }
    }, 450);

    return () => clearTimeout(handle);
  }, [pincodeWatch, setValue, toast]);

  const applySavedAddress = (addr: Address) => {
    const detail = [addr.addressLine1, addr.addressLine2].filter(Boolean).join(', ').trim();
    reset({
      name: addr.name,
      phone: addr.phone,
      pincode: addr.pincode.replace(/\D/g, '').slice(0, 6),
      addressDetail: detail || addr.addressLine1,
      city: addr.city,
      state: addr.state,
    });
    setLocStatus(addr.city && addr.state ? 'ok' : 'idle');
    setManualLocation(false);
    toast({ title: 'Address applied' });
  };

  const shippingCost = 0;
  const discount = appliedCoupon?.discount || 0;
  const finalTotal = total + shippingCost - discount;

  useEffect(() => {
    const saved = localStorage.getItem('applied-coupon');
    if (saved) {
      try {
        setAppliedCoupon(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/health');
        if (!cancelled) {
          if (data?.shiprocket) {
            setShiprocketUi({
              enabled: Boolean(data.shiprocket.enabled),
              autoAwb: data.shiprocket.autoAwb !== false,
            });
          } else {
            setShiprocketUi({ enabled: false, autoAwb: false });
          }
        }
      } catch {
        if (!cancelled) setShiprocketUi({ enabled: false, autoAwb: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      const cartItems = items.map((item) => ({
        productId: (item.product as { _id?: string })._id || item.product.id,
        category: item.product.category,
      }));

      const response = await api.post('/coupons/validate', {
        code: couponCode,
        cartTotal: total,
        items: cartItems,
      });

      if (response.data.valid) {
        setAppliedCoupon({
          code: response.data.coupon.code,
          discount: response.data.discount,
        });
        localStorage.setItem(
          'applied-coupon',
          JSON.stringify({
            code: response.data.coupon.code,
            discount: response.data.discount,
          })
        );
        toast({
          title: 'Coupon Applied!',
          description: response.data.coupon.description,
        });
        setCouponCode('');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
      toast({
        title: 'Coupon Invalid',
        description: err.response?.data?.message || 'Please check the coupon code',
        variant: 'destructive',
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
    localStorage.removeItem('applied-coupon');
  };

  const toShippingPayload = (data: QuickForm) => ({
    name: data.name.trim(),
    phone: data.phone.replace(/\D/g, '').slice(-10),
    addressLine1: data.addressDetail.trim().slice(0, 500),
    addressLine2: '',
    city: data.city.trim(),
    state: data.state.trim(),
    pincode: data.pincode,
  });

  const onSubmit = async (data: QuickForm) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to place an order',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const productSlugs = items.map((item) => item.product.slug);

      if (!productSlugs || productSlugs.length === 0) {
        throw new Error('No products in cart. Please add items to cart first.');
      }

      let productsResponse;
      try {
        productsResponse = await api.post('/products/by-slugs', { slugs: productSlugs });
      } catch (fetchError: unknown) {
        const fe = fetchError as { response?: { data?: { message?: string } }; message?: string };
        throw new Error(`Failed to fetch product details: ${fe.response?.data?.message || fe.message}`);
      }

      const backendProducts = productsResponse.data || [];

      if (backendProducts.length === 0) {
        throw new Error('Products not found. Please refresh the page and try again.');
      }

      const orderItems = items.map((item) => {
        const backendProduct = backendProducts.find((p: { slug?: string }) => p.slug === item.product.slug);

        if (!backendProduct || !(backendProduct as { _id?: string })._id) {
          throw new Error(`Product "${item.product.name}" not found in backend. Please refresh the page and try again.`);
        }

        return {
          productId: (backendProduct as { _id: string })._id.toString(),
          quantity: item.quantity,
        };
      });

      const shippingAddress = toShippingPayload(data);

      const orderData = {
        items: orderItems,
        shippingAddress,
        paymentMethod: paymentMethod || 'cod',
        couponCode: appliedCoupon?.code,
        discount: appliedCoupon?.discount || 0,
        shippingCost: shippingCost,
      };

      const response = await api.post('/orders', orderData);
      const orderId = response.data._id;
      const shiprocket = response.data.shiprocket as { synced?: boolean; message?: string } | undefined;
      if (shiprocket && shiprocket.synced === false) {
        toast({
          title: 'Order placed — Shiprocket notice',
          description:
            shiprocket.message ||
            'Order saved but courier sync failed. Check backend logs and Shiprocket pickup location.',
          variant: 'destructive',
        });
      }

      if (paymentMethod === 'online') {
        try {
          const paymentResponse = await api.post('/payment/create-order', {
            amount: finalTotal,
            currency: 'INR',
            orderId: orderId,
          });

          const { orderId: razorpayOrderId, keyId } = paymentResponse.data;

          const options = {
            key: keyId,
            amount: paymentResponse.data.amount,
            currency: paymentResponse.data.currency,
            name: 'Atharva Health',
            description: `Order #${orderId.slice(-6).toUpperCase()}`,
            order_id: razorpayOrderId,
            handler: async function (response: {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }) {
              try {
                const verifyResponse = await api.post('/payment/verify', {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: orderId,
                });

                if (verifyResponse.data.success) {
                  toast({
                    title: 'Payment Successful!',
                    description: 'Your order has been placed successfully',
                  });
                  const sr = verifyResponse.data.shiprocket as
                    | { synced?: boolean; message?: string }
                    | undefined;
                  if (sr && sr.synced === false) {
                    toast({
                      title: 'Shiprocket sync failed',
                      description:
                        sr.message ||
                        'Order is paid; fix pickup location / Shiprocket account and retry from admin.',
                      variant: 'destructive',
                    });
                  }

                  clearCart();
                  localStorage.removeItem('applied-coupon');
                  navigate(`/order-success/${orderId}`);
                }
              } catch (verifyError: unknown) {
                console.error('Payment verification error:', verifyError);
                const ve = verifyError as { response?: { data?: { message?: string } } };
                toast({
                  title: 'Payment Verification Failed',
                  description: ve.response?.data?.message || 'Please contact support',
                  variant: 'destructive',
                });
                setIsLoading(false);
              }
            },
            prefill: {
              name: user.name,
              email: user.email,
              contact: shippingAddress.phone,
            },
            theme: {
              color: '#10b981',
            },
            modal: {
              ondismiss: function () {
                setIsLoading(false);
                toast({
                  title: 'Payment Cancelled',
                  description: 'You cancelled the payment. Order is still pending.',
                  variant: 'destructive',
                });
              },
            },
          };

          const razorpayInstance = new window.Razorpay(options);
          razorpayInstance.open();
        } catch (paymentError: unknown) {
          console.error('Razorpay payment error:', paymentError);
          const pe = paymentError as { response?: { data?: { message?: string } } };
          toast({
            title: 'Payment Failed',
            description: pe.response?.data?.message || 'Failed to initiate payment. Please try again.',
            variant: 'destructive',
          });
          setIsLoading(false);
        }
      } else {
        toast({
          title: 'Order Placed!',
          description: 'Your order has been placed successfully',
        });

        clearCart();
        localStorage.removeItem('applied-coupon');
        navigate(`/order-success/${orderId}`);
      }
    } catch (error: unknown) {
      console.error('Order placement error:', error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = err.response?.data?.message || err.message || 'Failed to place order. Please try again.';

      toast({
        title: 'Order Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showCityStateFields = manualLocation || locStatus === 'fail' || (locStatus === 'idle' && (pincodeWatch || '').replace(/\D/g, '').length === 6);
  const cityStateReadOnly = locStatus === 'ok' && !manualLocation;

  if (items.length === 0) {
    return (
      <>
        <SEO title="Checkout" />
        <main className="container-custom py-8">
          <div className="text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some products to your cart first</p>
            <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO title="Checkout" />
      <main className="container-custom py-6 md:py-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Checkout</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Jaldi se — mobile &amp; pincode se delivery</p>
          </div>
        </div>

        {shiprocketUi?.enabled && (
          <Alert className="mb-4 border-primary/30 bg-primary/5 py-3">
            <Truck className="h-4 w-4" />
            <AlertTitle className="text-sm">Shiprocket delivery</AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground">
              Order place hote hi courier panel sync; prepaid mein payment ke baad.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
            <div className="lg:col-span-3 space-y-5">
              <Card className="border-2 border-primary/10 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-primary" />
                    Quick buy
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Sirf zaroori details — pincode se city/state auto-fill (India Post data).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {addresses.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Saved address</Label>
                      <div className="flex flex-wrap gap-2">
                        {addresses.map((addr) => (
                          <Button
                            key={addr.id}
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="text-xs h-8"
                            onClick={() => applySavedAddress(addr)}
                          >
                            {addr.name} · {addr.pincode}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" {...register('name')} placeholder="Full name" autoComplete="name" />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        Mobile
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        {...register('phone')}
                        placeholder="10-digit mobile"
                        autoComplete="tel"
                      />
                      {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      inputMode="numeric"
                      maxLength={6}
                      {...register('pincode')}
                      placeholder="6 digits"
                      autoComplete="postal-code"
                    />
                    {locStatus === 'loading' && <p className="text-xs text-muted-foreground">Pincode check ho raha hai…</p>}
                    {errors.pincode && <p className="text-xs text-destructive">{errors.pincode.message}</p>}
                  </div>

                  {cityStateReadOnly && (
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm">
                      <span className="text-muted-foreground">
                        <span className="font-medium text-foreground">{watch('city')}</span>, {watch('state')}
                      </span>
                      <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => setManualLocation(true)}>
                        Change city / state
                      </Button>
                    </div>
                  )}

                  {showCityStateFields && !cityStateReadOnly ? (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...register('city')} placeholder="City" autoComplete="address-level2" />
                        {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" {...register('state')} placeholder="State" autoComplete="address-level1" />
                        {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
                      </div>
                    </div>
                  ) : null}

                  <div className="space-y-1.5">
                    <Label htmlFor="addressDetail">Where to deliver</Label>
                    <Textarea
                      id="addressDetail"
                      {...register('addressDetail')}
                      placeholder="House / flat no., building, street, landmark"
                      rows={3}
                      className="resize-none min-h-[88px]"
                      autoComplete="street-address"
                    />
                    {errors.addressDetail && <p className="text-xs text-destructive">{errors.addressDetail.message}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CreditCard className="h-4 w-4" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer text-sm">
                        <span className="font-medium">Cash on delivery</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex-1 cursor-pointer text-sm">
                        <span className="font-medium">UPI / Card / Netbanking</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="lg:sticky lg:top-24">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Order summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm gap-2">
                        <span className="line-clamp-2">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="shrink-0">Rs. {(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-primary/10 text-primary rounded-lg px-3 py-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          <span className="font-medium">{appliedCoupon.code}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>-Rs. {appliedCoupon.discount.toLocaleString()}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" type="button" onClick={handleRemoveCoupon}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Coupon"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                          className="flex-1 uppercase text-sm h-9"
                          disabled={isApplyingCoupon}
                        />
                        <Button type="button" variant="outline" size="sm" onClick={handleApplyCoupon} disabled={isApplyingCoupon}>
                          {isApplyingCoupon ? '…' : 'Apply'}
                        </Button>
                      </div>
                    )}
                    {couponError && <p className="text-xs text-destructive">{couponError}</p>}
                  </div>

                  <div className="border-t pt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>Rs. {total.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-primary">
                        <span>Discount</span>
                        <span>-Rs. {discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shippingCost === 0 ? 'FREE' : `Rs. ${shippingCost}`}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-base">
                      <span>Total</span>
                      <span>Rs. {finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading
                      ? 'Processing…'
                      : shiprocketUi?.enabled
                        ? `Buy now — Rs. ${finalTotal.toLocaleString()}`
                        : `Place order — Rs. ${finalTotal.toLocaleString()}`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export default Checkout;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { ArrowLeft, CreditCard, MapPin, Package, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/seo/SEO';

const addressSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Pincode must be 6 digits'),
});

type AddressFormData = z.infer<typeof addressSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: user?.addresses?.[0] ? {
      name: user.addresses[0].name,
      phone: user.addresses[0].phone,
      addressLine1: user.addresses[0].addressLine1,
      addressLine2: user.addresses[0].addressLine2,
      city: user.addresses[0].city,
      state: user.addresses[0].state,
      pincode: user.addresses[0].pincode,
    } : undefined,
  });

  const shippingCost = total >= 499 ? 0 : 49;
  const discount = appliedCoupon?.discount || 0;
  const finalTotal = total + shippingCost - discount;

  // Load applied coupon from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('applied-coupon');
    if (saved) {
      try {
        setAppliedCoupon(JSON.parse(saved));
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      const cartItems = items.map(item => ({
        productId: (item.product as any)._id || item.product.id,
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
        localStorage.setItem('applied-coupon', JSON.stringify({
          code: response.data.coupon.code,
          discount: response.data.discount,
        }));
        toast({
          title: 'Coupon Applied!',
          description: response.data.coupon.description,
        });
        setCouponCode('');
      }
    } catch (error: any) {
      setCouponError(error.response?.data?.message || 'Invalid coupon code');
      toast({
        title: 'Coupon Invalid',
        description: error.response?.data?.message || 'Please check the coupon code',
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

  const onSubmit = async (data: AddressFormData) => {
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
      // Fetch all products from backend by slugs in one call
      const productSlugs = items.map(item => item.product.slug);
      
      if (!productSlugs || productSlugs.length === 0) {
        throw new Error('No products in cart. Please add items to cart first.');
      }
      
      let productsResponse;
      try {
        productsResponse = await api.post('/products/by-slugs', { slugs: productSlugs });
      } catch (fetchError: any) {
        throw new Error(`Failed to fetch product details: ${fetchError.response?.data?.message || fetchError.message}`);
      }
      
      const backendProducts = productsResponse.data || [];
      
      if (backendProducts.length === 0) {
        throw new Error('Products not found. Please refresh the page and try again.');
      }
      
      // Convert cart items to order format with backend product _id
      const orderItems = items.map(item => {
        // Find product in backend by slug
        const backendProduct = backendProducts.find((p: any) => 
          p.slug === item.product.slug
        );
        
        if (!backendProduct || !backendProduct._id) {
          throw new Error(`Product "${item.product.name}" not found in backend. Please refresh the page and try again.`);
        }
        
        return {
          productId: backendProduct._id.toString(),
          quantity: item.quantity,
        };
      });

      const orderData = {
        items: orderItems,
        shippingAddress: data,
        paymentMethod: paymentMethod || 'cod',
        couponCode: appliedCoupon?.code,
        discount: appliedCoupon?.discount || 0,
        shippingCost: shippingCost,
      };

      const response = await api.post('/orders', orderData);
      const orderId = response.data._id;

      // If payment method is online, process Razorpay payment
      if (paymentMethod === 'online') {
        try {
          // Create Razorpay order
          const paymentResponse = await api.post('/payment/create-order', {
            amount: finalTotal,
            currency: 'INR',
            orderId: orderId,
          });

          const { orderId: razorpayOrderId, keyId } = paymentResponse.data;

          // Open Razorpay checkout
          const options = {
            key: keyId,
            amount: paymentResponse.data.amount,
            currency: paymentResponse.data.currency,
            name: 'Atharva Health',
            description: `Order #${orderId.slice(-6).toUpperCase()}`,
            order_id: razorpayOrderId,
            handler: async function (response: any) {
              try {
                // Verify payment
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

                  clearCart();
                  localStorage.removeItem('applied-coupon');
                  navigate(`/order-success/${orderId}`);
                }
              } catch (verifyError: any) {
                console.error('Payment verification error:', verifyError);
                toast({
                  title: 'Payment Verification Failed',
                  description: verifyError.response?.data?.message || 'Please contact support',
                  variant: 'destructive',
                });
                setIsLoading(false);
              }
            },
            prefill: {
              name: user.name,
              email: user.email,
              contact: data.phone,
            },
            theme: {
              color: '#10b981',
            },
            modal: {
              ondismiss: function() {
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
        } catch (paymentError: any) {
          console.error('Razorpay payment error:', paymentError);
          toast({
            title: 'Payment Failed',
            description: paymentError.response?.data?.message || 'Failed to initiate payment. Please try again.',
            variant: 'destructive',
          });
          setIsLoading(false);
        }
      } else {
        // COD - Direct success
        toast({
          title: 'Order Placed!',
          description: 'Your order has been placed successfully',
        });

        clearCart();
        localStorage.removeItem('applied-coupon');
        navigate(`/order-success/${orderId}`);
      }
    } catch (error: any) {
      console.error('Order placement error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to place order. Please try again.';
      
      toast({
        title: 'Order Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <SEO title="Checkout" />
        <main className="container-custom py-8">
          <div className="text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some products to your cart first</p>
            <Button onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO title="Checkout" />
      <main className="container-custom py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                  <CardDescription>Enter your delivery address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" {...register('name')} placeholder="John Doe" />
                      {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" {...register('phone')} placeholder="9876543210" />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input id="addressLine1" {...register('addressLine1')} placeholder="House/Flat No., Building Name" />
                    {errors.addressLine1 && <p className="text-sm text-destructive">{errors.addressLine1.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                    <Input id="addressLine2" {...register('addressLine2')} placeholder="Street, Area, Landmark" />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" {...register('city')} placeholder="Mumbai" />
                      {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input id="state" {...register('state')} placeholder="Maharashtra" />
                      {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input id="pincode" {...register('pincode')} placeholder="400001" />
                      {errors.pincode && <p className="text-sm text-destructive">{errors.pincode.message}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Choose your payment method</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-muted-foreground">Pay when you receive</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Online Payment (Razorpay)</p>
                          <p className="text-sm text-muted-foreground">Pay via UPI/Card/Net Banking/Wallet</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span>{item.product.name} × {item.quantity}</span>
                        <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Section */}
                  <div className="border-t pt-4 space-y-2">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-primary/10 text-primary rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          <span className="text-sm font-medium">{appliedCoupon.code}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">-₹{appliedCoupon.discount.toLocaleString()}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={handleRemoveCoupon}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            className="flex-1 uppercase"
                            disabled={isApplyingCoupon}
                          />
                          <Button
                            variant="outline"
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon}
                          >
                            {isApplyingCoupon ? '...' : 'Apply'}
                          </Button>
                        </div>
                        {couponError && (
                          <p className="text-sm text-destructive">{couponError}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-primary">
                        <span>Discount</span>
                        <span>-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? 'Placing Order...' : `Place Order - ₹${finalTotal.toLocaleString()}`}
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


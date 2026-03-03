import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, Truck, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const CartSummary: React.FC = () => {
  const { total, itemCount, items } = useCart();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // For now, disable shipping charges so you can test payments easily
  const shippingThreshold = 0;
  const shippingCost = 0;
  const discount = appliedCoupon?.discount || 0;
  const finalTotal = total + shippingCost - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsApplying(true);
    setCouponError(null);

    try {
      // Prepare cart items for validation
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
        // Save to localStorage
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
      setCouponError(
        error.response?.data?.message || 'Invalid or expired coupon code'
      );
      toast({
        title: 'Coupon Invalid',
        description: error.response?.data?.message || 'Please check the coupon code',
        variant: 'destructive',
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
    localStorage.removeItem('applied-coupon');
  };

  // Load applied coupon from localStorage on mount
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

  return (
    <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
      <h3 className="font-display text-lg font-semibold mb-6">Order Summary</h3>

      {/* Items Count */}
      <div className="flex justify-between text-sm mb-4">
        <span className="text-muted-foreground">Items ({itemCount})</span>
        <span>Rs. {total.toLocaleString()}</span>
      </div>

      {/* Coupon */}
      <div className="mb-4">
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-primary/10 text-primary rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span className="text-sm font-medium">{appliedCoupon.code}</span>
              <span className="text-xs">-Rs. {appliedCoupon.discount.toLocaleString()}</span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                className="flex-1 uppercase"
                disabled={isApplying}
              />
              <Button 
                variant="outline" 
                onClick={handleApplyCoupon}
                disabled={isApplying}
              >
                {isApplying ? 'Applying...' : 'Apply'}
              </Button>
            </div>
            {couponError && (
              <p className="text-sm text-destructive">{couponError}</p>
            )}
          </div>
        )}
      </div>

      {/* Discount */}
      {discount > 0 && (
        <div className="flex justify-between text-sm mb-4 text-primary">
          <span>Coupon Discount</span>
          <span>-Rs. {discount.toLocaleString()}</span>
        </div>
      )}

      {/* Shipping */}
      <div className="flex justify-between text-sm mb-4">
        <span className="text-muted-foreground">Shipping</span>
        {shippingCost === 0 ? (
          <span className="text-primary font-medium">FREE</span>
        ) : (
          <span>Rs. {shippingCost}</span>
        )}
      </div>

      {/* Free Shipping Progress */}
      {shippingCost > 0 && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm mb-2">
            <Truck className="w-4 h-4 text-primary" />
            <span>
              Add Rs. {(shippingThreshold - total).toLocaleString()} more for free shipping
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((total / shippingThreshold) * 100, 100)}%` }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>
      )}

      {/* Total */}
      <div className="border-t border-border pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <span className="text-2xl font-bold">Rs. {finalTotal.toLocaleString()}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          (Inclusive of all taxes)
        </p>
      </div>

      {/* Enhanced Checkout Button */}
      <Button 
        asChild 
        className="w-full h-14 bg-gradient-to-r from-emerald-600 via-primary to-teal-600 hover:from-emerald-700 hover:via-primary/90 hover:to-teal-700 font-extrabold text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all hover:scale-[1.02] relative overflow-hidden group" 
        size="lg"
      >
        <Link to="/checkout" className="flex items-center justify-center gap-2">
          <span>Proceed to Checkout</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Button>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-primary" />
          <span>100% Secure Payments</span>
        </div>
        <div className="flex gap-2 mt-3">
          {['visa', 'mastercard', 'upi', 'paytm'].map((method) => (
            <div
              key={method}
              className="h-8 w-12 bg-muted rounded flex items-center justify-center text-xs uppercase"
            >
              {method}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartSummary;

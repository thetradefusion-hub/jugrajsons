import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, Truck, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

const CartSummary: React.FC = () => {
  const { total, itemCount } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const shippingThreshold = 499;
  const shippingCost = total >= shippingThreshold ? 0 : 49;
  const discount = appliedCoupon ? Math.round(total * 0.1) : 0;
  const finalTotal = total + shippingCost - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'ATHARVA10') {
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponError(null);
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
      <h3 className="font-display text-lg font-semibold mb-6">Order Summary</h3>

      {/* Items Count */}
      <div className="flex justify-between text-sm mb-4">
        <span className="text-muted-foreground">Items ({itemCount})</span>
        <span>₹{total.toLocaleString()}</span>
      </div>

      {/* Coupon */}
      <div className="mb-4">
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-primary/10 text-primary rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span className="text-sm font-medium">{appliedCoupon}</span>
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
                className="flex-1"
              />
              <Button variant="outline" onClick={handleApplyCoupon}>
                Apply
              </Button>
            </div>
            {couponError && (
              <p className="text-sm text-destructive">{couponError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Try: ATHARVA10 for 10% off
            </p>
          </div>
        )}
      </div>

      {/* Discount */}
      {discount > 0 && (
        <div className="flex justify-between text-sm mb-4 text-primary">
          <span>Coupon Discount</span>
          <span>-₹{discount.toLocaleString()}</span>
        </div>
      )}

      {/* Shipping */}
      <div className="flex justify-between text-sm mb-4">
        <span className="text-muted-foreground">Shipping</span>
        {shippingCost === 0 ? (
          <span className="text-primary font-medium">FREE</span>
        ) : (
          <span>₹{shippingCost}</span>
        )}
      </div>

      {/* Free Shipping Progress */}
      {shippingCost > 0 && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm mb-2">
            <Truck className="w-4 h-4 text-primary" />
            <span>
              Add ₹{(shippingThreshold - total).toLocaleString()} more for free shipping
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
          <span className="text-2xl font-bold">₹{finalTotal.toLocaleString()}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          (Inclusive of all taxes)
        </p>
      </div>

      {/* Checkout Button */}
      <Button asChild className="w-full" size="lg">
        <Link to="/checkout">
          Proceed to Checkout
          <ChevronRight className="w-4 h-4 ml-2" />
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

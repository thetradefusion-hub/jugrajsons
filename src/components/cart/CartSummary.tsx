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

  const shippingThreshold = 0;
  const shippingCost = 0;
  const discount = appliedCoupon?.discount || 0;
  const finalTotal = total + shippingCost - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Coupon code likhiye');
      return;
    }

    setIsApplying(true);
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
          }),
        );
        toast({
          title: 'Coupon lag gaya',
          description: response.data.coupon.description,
        });
        setCouponCode('');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setCouponError(err.response?.data?.message || 'Coupon galat ya expire ho chuka hai');
      toast({
        title: 'Coupon invalid',
        description: err.response?.data?.message || 'Code dubara check karein',
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

  useEffect(() => {
    const saved = localStorage.getItem('applied-coupon');
    if (saved) {
      try {
        setAppliedCoupon(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);

  return (
    <div className="sticky top-24 rounded-3xl border border-[#E6A817]/25 bg-white p-5 shadow-[0_16px_40px_rgba(43,29,14,0.08)] md:p-6">
      <h3 className="mb-5 font-display text-xl font-bold text-[#2B1D0E]">Order summary</h3>

      <div className="mb-4 flex justify-between text-sm text-[#2B1D0E]/80">
        <span>Items ({itemCount})</span>
        <span className="font-semibold text-[#2B1D0E]">Rs. {total.toLocaleString()}</span>
      </div>

      <div className="mb-4">
        {appliedCoupon ? (
          <div className="flex items-center justify-between rounded-2xl border border-[#1F3D2B]/20 bg-[#fff9ef] px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <Tag className="h-4 w-4 shrink-0 text-[#1F3D2B]" />
              <span className="truncate text-sm font-semibold text-[#2B1D0E]">{appliedCoupon.code}</span>
              <span className="shrink-0 text-xs font-medium text-[#1F3D2B]">-Rs. {appliedCoupon.discount.toLocaleString()}</span>
            </div>
            <button type="button" onClick={handleRemoveCoupon} className="shrink-0 text-sm font-medium text-[#2B1D0E]/70 hover:text-[#2B1D0E] hover:underline">
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                className="flex-1 rounded-xl border-[#E6A817]/30 bg-[#fffaf2] uppercase text-[#2B1D0E] placeholder:text-[#2B1D0E]/40"
                disabled={isApplying}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleApplyCoupon}
                disabled={isApplying}
                className="shrink-0 rounded-xl border-[#E6A817]/40 bg-white font-semibold text-[#2B1D0E] hover:bg-[#fff9ef]"
              >
                {isApplying ? '…' : 'Apply'}
              </Button>
            </div>
            {couponError && <p className="text-sm text-red-600">{couponError}</p>}
          </div>
        )}
      </div>

      {discount > 0 && (
        <div className="mb-4 flex justify-between text-sm font-medium text-[#1F3D2B]">
          <span>Coupon discount</span>
          <span>-Rs. {discount.toLocaleString()}</span>
        </div>
      )}

      <div className="mb-4 flex justify-between text-sm text-[#2B1D0E]/80">
        <span>Shipping</span>
        {shippingCost === 0 ? (
          <span className="font-semibold text-[#1F3D2B]">FREE</span>
        ) : (
          <span>Rs. {shippingCost}</span>
        )}
      </div>

      {shippingCost > 0 && (
        <div className="mb-4 rounded-xl bg-[#fff9ef] p-3">
          <div className="mb-2 flex items-center gap-2 text-sm text-[#2B1D0E]/80">
            <Truck className="h-4 w-4 text-[#1F3D2B]" />
            <span>Add Rs. {(shippingThreshold - total).toLocaleString()} more for free shipping</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#E6A817]/25">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((total / shippingThreshold) * 100, 100)}%` }}
              className="h-full rounded-full bg-[#1F3D2B]"
            />
          </div>
        </div>
      )}

      <div className="mb-6 border-t border-[#E6A817]/15 pt-4">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-[#2B1D0E]">Total</span>
          <span className="font-display text-2xl font-bold text-[#2B1D0E]">Rs. {finalTotal.toLocaleString()}</span>
        </div>
        <p className="mt-1 text-xs text-[#2B1D0E]/55">(Taxes included)</p>
      </div>

      <Button
        asChild
        className="group relative h-14 w-full overflow-hidden rounded-2xl bg-[#E6A817] text-base font-bold text-[#2B1D0E] shadow-lg transition-transform hover:scale-[1.01] hover:bg-[#d89c14]"
        size="lg"
      >
        <Link to="/checkout" className="flex items-center justify-center gap-2">
          <span>Checkout</span>
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Button>

      <div className="mt-6 border-t border-[#E6A817]/15 pt-6">
        <div className="flex items-center gap-2 text-sm text-[#2B1D0E]/70">
          <Shield className="h-4 w-4 shrink-0 text-[#1F3D2B]" />
          <span>Secure payments</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['UPI', 'Card', 'Netbanking'].map((method) => (
            <div
              key={method}
              className={cn(
                'flex h-8 min-w-[3.5rem] items-center justify-center rounded-lg border border-[#E6A817]/25',
                'bg-[#fffaf2] px-2 text-[10px] font-semibold uppercase tracking-wide text-[#2B1D0E]/80',
              )}
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

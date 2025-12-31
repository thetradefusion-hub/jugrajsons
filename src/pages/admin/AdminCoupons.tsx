import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Copy, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters'),
  description: z.string().min(5, 'Description required'),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(1, 'Discount value required'),
  minPurchase: z.number().min(0, 'Minimum purchase must be 0 or more'),
  maxDiscount: z.number().optional(),
  validFrom: z.string(),
  validUntil: z.string(),
  usageLimit: z.number().optional(),
  isActive: z.boolean(),
  applicableTo: z.enum(['all', 'category', 'product']),
});

type CouponFormData = z.infer<typeof couponSchema>;

interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicableTo: 'all' | 'category' | 'product';
}

const AdminCoupons = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      discountType: 'percentage',
      applicableTo: 'all',
      isActive: true,
      minPurchase: 0,
    },
  });

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return;

    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchCoupons();
  }, [user, isLoading, navigate]);

  const fetchCoupons = async () => {
    try {
      const response = await api.get('/coupons');
      setCoupons(response.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch coupons',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CouponFormData) => {
    try {
      const couponData = {
        ...data,
        code: data.code.toUpperCase().trim(),
        discountValue: Number(data.discountValue),
        minPurchase: Number(data.minPurchase),
        maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : undefined,
        usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined,
        validFrom: new Date(data.validFrom),
        validUntil: new Date(data.validUntil),
      };

      if (editingCoupon) {
        await api.put(`/coupons/${editingCoupon._id}`, couponData);
        toast({
          title: 'Success',
          description: 'Coupon updated successfully',
        });
      } else {
        await api.post('/coupons', couponData);
        toast({
          title: 'Success',
          description: 'Coupon created successfully',
        });
      }

      setIsDialogOpen(false);
      reset();
      setEditingCoupon(null);
      fetchCoupons();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save coupon',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await api.delete(`/coupons/${id}`);
      toast({
        title: 'Success',
        description: 'Coupon deleted successfully',
      });
      fetchCoupons();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete coupon',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    reset({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase,
      maxDiscount: coupon.maxDiscount,
      validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
      validUntil: new Date(coupon.validUntil).toISOString().split('T')[0],
      usageLimit: coupon.usageLimit,
      isActive: coupon.isActive,
      applicableTo: coupon.applicableTo,
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingCoupon(null);
    reset({
      discountType: 'percentage',
      applicableTo: 'all',
      isActive: true,
      minPurchase: 0,
    });
    setIsDialogOpen(true);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied!',
      description: 'Coupon code copied to clipboard',
    });
  };

  const isCouponValid = (coupon: Coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);
    return (
      coupon.isActive &&
      now >= validFrom &&
      now <= validUntil &&
      (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit)
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-section-spacing">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="admin-heading-1">Coupon Management</h1>
            <p className="admin-description">Manage discount coupons and offers</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </DialogTitle>
                <DialogDescription>
                  {editingCoupon
                    ? 'Update coupon details'
                    : 'Create a new discount coupon'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Coupon Code *</Label>
                    <Input
                      id="code"
                      {...register('code')}
                      placeholder="SAVE20"
                      className="uppercase"
                    />
                    {errors.code && (
                      <p className="text-sm text-destructive">{errors.code.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountType">Discount Type *</Label>
                    <Select
                      value={watch('discountType')}
                      onValueChange={(value: 'percentage' | 'fixed') =>
                        setValue('discountType', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    {...register('description')}
                    placeholder="20% off on all products"
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">
                      Discount Value * ({watch('discountType') === 'percentage' ? '%' : '₹'})
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      {...register('discountValue', { valueAsNumber: true })}
                      placeholder={watch('discountType') === 'percentage' ? '20' : '100'}
                    />
                    {errors.discountValue && (
                      <p className="text-sm text-destructive">{errors.discountValue.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minPurchase">Minimum Purchase (₹) *</Label>
                    <Input
                      id="minPurchase"
                      type="number"
                      {...register('minPurchase', { valueAsNumber: true })}
                      placeholder="500"
                    />
                    {errors.minPurchase && (
                      <p className="text-sm text-destructive">{errors.minPurchase.message}</p>
                    )}
                  </div>
                </div>

                {watch('discountType') === 'percentage' && (
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscount">Max Discount (₹) - Optional</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      {...register('maxDiscount', { valueAsNumber: true })}
                      placeholder="500"
                    />
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validFrom">Valid From *</Label>
                    <Input
                      id="validFrom"
                      type="date"
                      {...register('validFrom')}
                    />
                    {errors.validFrom && (
                      <p className="text-sm text-destructive">{errors.validFrom.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Valid Until *</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      {...register('validUntil')}
                    />
                    {errors.validUntil && (
                      <p className="text-sm text-destructive">{errors.validUntil.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Usage Limit - Optional</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      {...register('usageLimit', { valueAsNumber: true })}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="applicableTo">Applicable To *</Label>
                    <Select
                      value={watch('applicableTo')}
                      onValueChange={(value: 'all' | 'category' | 'product') =>
                        setValue('applicableTo', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Products</SelectItem>
                        <SelectItem value="category">Specific Categories</SelectItem>
                        <SelectItem value="product">Specific Products</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={watch('isActive')}
                    onChange={(e) => setValue('isActive', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Active
                  </Label>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      reset();
                      setEditingCoupon(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-2 border-orange-500 shadow-xl">
          <CardHeader>
            <CardTitle>All Coupons ({coupons.length})</CardTitle>
            <CardDescription>Manage discount coupons and promotional offers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Min Purchase</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No coupons found
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons.map((coupon) => (
                    <TableRow key={coupon._id}>
                      <TableCell className="font-mono font-semibold">
                        <div className="flex items-center gap-2">
                          {coupon.code}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyCode(coupon.code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{coupon.description}</TableCell>
                      <TableCell>
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                        {coupon.maxDiscount && (
                          <span className="admin-body-small block">
                            (Max ₹{coupon.maxDiscount})
                          </span>
                        )}
                      </TableCell>
                      <TableCell>₹{coupon.minPurchase}</TableCell>
                      <TableCell>
                        {new Date(coupon.validUntil).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {coupon.usedCount}
                        {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                      </TableCell>
                      <TableCell>
                        {isCouponValid(coupon) ? (
                          <Badge className="bg-emerald-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(coupon)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(coupon._id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCoupons;


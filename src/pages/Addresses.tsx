import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, Edit, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import SEO from '@/components/seo/SEO';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const addressSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Pincode must be 6 digits'),
  isDefault: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface Address {
  _id?: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const Addresses = () => {
  const navigate = useNavigate();
  const { isAuthenticated, updateUser } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchAddresses();
  }, [isAuthenticated, navigate]);

  const fetchAddresses = async () => {
    try {
      // Get user data which includes addresses
      const response = await api.get('/auth/me');
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AddressFormData) => {
    try {
      const addressData: Address = {
        ...data,
        isDefault: data.isDefault || false,
      };

      if (editingAddress?._id) {
        // Update existing address
        const updatedAddresses = addresses.map(addr =>
          addr._id === editingAddress._id
            ? { ...addressData, _id: editingAddress._id }
            : editingAddress.isDefault && addressData.isDefault
            ? { ...addr, isDefault: false }
            : addr
        );
        
        await api.put(`/auth/me`, {
          addresses: updatedAddresses,
        });
        toast({
          title: 'Success',
          description: 'Address updated successfully',
        });
      } else {
        // Add new address
        const newAddresses = addressData.isDefault
          ? [{ ...addressData }, ...addresses.map(addr => ({ ...addr, isDefault: false }))]
          : [...addresses, addressData];

        await api.put(`/auth/me`, {
          addresses: newAddresses,
        });
        toast({
          title: 'Success',
          description: 'Address added successfully',
        });
      }

      setIsDialogOpen(false);
      reset();
      setEditingAddress(null);
      fetchAddresses();
      if (updateUser) {
        const userResponse = await api.get('/auth/me');
        updateUser(userResponse.data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save address',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
      await api.put(`/auth/me`, {
        addresses: updatedAddresses,
      });
      toast({
        title: 'Success',
        description: 'Address deleted successfully',
      });
      fetchAddresses();
      const userResponse = await api.get('/auth/me');
      updateUser(userResponse.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete address',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    reset({
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    reset();
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <>
        <SEO title="Saved Addresses" />
        <main className="container-custom py-8">
          <div className="text-center">Loading...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO title="Saved Addresses" />
      <main className="container-custom py-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Saved Addresses</h1>
              <p className="text-muted-foreground">Manage your delivery addresses</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </DialogTitle>
                <DialogDescription>
                  {editingAddress
                    ? 'Update your address information'
                    : 'Add a new delivery address'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" {...register('name')} placeholder="John Doe" />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" {...register('phone')} placeholder="9876543210" />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    {...register('addressLine1')}
                    placeholder="House/Flat No., Building Name"
                  />
                  {errors.addressLine1 && (
                    <p className="text-sm text-destructive">{errors.addressLine1.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                  <Input
                    id="addressLine2"
                    {...register('addressLine2')}
                    placeholder="Street, Area, Landmark"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" {...register('city')} placeholder="Mumbai" />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" {...register('state')} placeholder="Maharashtra" />
                    {errors.state && (
                      <p className="text-sm text-destructive">{errors.state.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input id="pincode" {...register('pincode')} placeholder="400001" />
                    {errors.pincode && (
                      <p className="text-sm text-destructive">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={watch('isDefault')}
                    onChange={(e) => setValue('isDefault', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="isDefault" className="cursor-pointer">
                    Set as default address
                  </Label>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      reset();
                      setEditingAddress(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAddress ? 'Update Address' : 'Add Address'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {addresses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
              <p className="text-muted-foreground mb-4">
                Add an address to make checkout faster
              </p>
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <Card key={address._id || Math.random()} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {address.name}
                      </CardTitle>
                      {address.isDefault && (
                        <Badge className="mt-2 bg-emerald-500">Default</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-muted-foreground">Phone: {address.phone}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => address._id && handleDelete(address._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Addresses;


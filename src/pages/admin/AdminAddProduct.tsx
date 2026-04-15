import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().min(5, 'Short description required'),
  price: z.number().min(1, 'Price must be greater than 0'),
  originalPrice: z.number().min(1, 'Original price required'),
  stockCount: z.number().min(0, 'Stock count must be 0 or more'),
  inStock: z.boolean(),
  isBestseller: z.boolean(),
  isNew: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

const AdminAddProduct = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>(['']);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
  }, [user, authLoading, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      inStock: true,
      isBestseller: false,
      isNew: false,
      stockCount: 0,
      price: 0,
      originalPrice: 0,
    },
  });

  const addImageField = () => {
    setImages([...images, '']);
  };

  const removeImageField = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      // Filter out empty image URLs
      const validImages = images.filter(img => img.trim() !== '');
      
      if (validImages.length === 0) {
        toast({
          title: 'Warning',
          description: 'Please add at least one product image',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Required backend fields that are hidden from the form
      const defaultCategory = 'raw-honey';
      const defaultProductType = 'Honey';
      const generatedSku = `JSH-${Date.now()}`;
      const allConcerns = [defaultCategory];
      
      const productData = {
        ...data,
        category: defaultCategory,
        productType: defaultProductType,
        sku: generatedSku,
        ingredients: [],
        benefits: [],
        usage: '',
        whoShouldUse: [],
        concern: allConcerns,
        tags: [],
        images: validImages,
        discount: data.originalPrice > data.price 
          ? Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100)
          : 0,
        rating: 0,
        reviewCount: 0,
      };

      await api.post('/products', productData);
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
      navigate('/admin/products');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create product',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Product</h1>
            <p className="text-muted-foreground">Create a new product for your store</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input id="name" {...register('name')} placeholder="Enter product name" />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input id="slug" {...register('slug')} placeholder="product-slug" />
                    {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description *</Label>
                    <Input id="shortDescription" {...register('shortDescription')} placeholder="Brief description" />
                    {errors.shortDescription && <p className="text-sm text-destructive">{errors.shortDescription.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Full Description *</Label>
                    <Textarea id="description" {...register('description')} rows={4} placeholder="Detailed product description" />
                    {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                  </div>

                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Stock</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (Rs.) *</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        {...register('price', { valueAsNumber: true })} 
                        placeholder="1000" 
                      />
                      {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Original Price (Rs.) *</Label>
                      <Input 
                        id="originalPrice" 
                        type="number" 
                        {...register('originalPrice', { valueAsNumber: true })} 
                        placeholder="1200" 
                      />
                      {errors.originalPrice && <p className="text-sm text-destructive">{errors.originalPrice.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stockCount">Stock Count *</Label>
                    <Input 
                      id="stockCount" 
                      type="number" 
                      {...register('stockCount', { valueAsNumber: true })} 
                      placeholder="100" 
                    />
                    {errors.stockCount && <p className="text-sm text-destructive">{errors.stockCount.message}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="inStock">In Stock</Label>
                    <Switch 
                      id="inStock" 
                      checked={watch('inStock')} 
                      onCheckedChange={(checked) => setValue('inStock', checked)} 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {images.map((image, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`image-${index}`}>
                            Image {index + 1} URL {index === 0 && <span className="text-destructive">*</span>}
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id={`image-${index}`}
                              type="url"
                              value={image}
                              onChange={(e) => updateImage(index, e.target.value)}
                              placeholder="https://example.com/image.jpg"
                              className="flex-1"
                            />
                            {images.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeImageField(index)}
                                className="shrink-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          {image && (
                            <div className="mt-2">
                              <img
                                src={image}
                                alt={`Preview ${index + 1}`}
                                className="w-20 h-20 object-cover rounded border border-gray-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addImageField}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Image
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add image URLs (one per line). First image will be the main product image.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Flags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isBestseller">Mark as Bestseller</Label>
                    <Switch 
                      id="isBestseller" 
                      checked={watch('isBestseller')} 
                      onCheckedChange={(checked) => setValue('isBestseller', checked)} 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isNew">Mark as New</Label>
                    <Switch 
                      id="isNew" 
                      checked={watch('isNew')} 
                      onCheckedChange={(checked) => setValue('isNew', checked)} 
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Creating...' : 'Create Product'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminAddProduct;


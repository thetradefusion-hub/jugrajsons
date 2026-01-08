import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { concerns } from '@/data/products';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().min(5, 'Short description required'),
  price: z.number().min(1, 'Price must be greater than 0'),
  originalPrice: z.number().min(1, 'Original price required'),
  category: z.string().min(1, 'Category required'),
  productType: z.string().min(1, 'Product type required'),
  sku: z.string().min(1, 'SKU required'),
  stockCount: z.number().min(0, 'Stock count must be 0 or more'),
  inStock: z.boolean(),
  isBestseller: z.boolean(),
  isNew: z.boolean(),
  ingredients: z.string(),
  benefits: z.string(),
  usage: z.string(),
  whoShouldUse: z.string(),
  concern: z.string(),
  tags: z.string(),
});

type ProductFormData = z.infer<typeof productSchema>;

const AdminEditProduct = () => {
  const { id } = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
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
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/admin/products`);
        const product = response.data.find((p: any) => p._id === id);
        if (product) {
          reset({
            name: product.name,
            slug: product.slug,
            description: product.description,
            shortDescription: product.shortDescription,
            price: product.price,
            originalPrice: product.originalPrice,
            category: product.category,
            productType: product.productType,
            sku: product.sku,
            stockCount: product.stockCount,
            inStock: product.inStock,
            isBestseller: product.isBestseller,
            isNew: product.isNew,
            ingredients: product.ingredients?.join(', ') || '',
            benefits: product.benefits?.join(', ') || '',
            usage: product.usage || '',
            whoShouldUse: product.whoShouldUse?.join(', ') || '',
            concern: product.concern?.join(', ') || '',
            tags: product.tags?.join(', ') || '',
          });
          // Set images from product
          setImages(product.images && product.images.length > 0 ? product.images : ['']);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load product',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, reset, toast]);

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

      const productData = {
        ...data,
        ingredients: data.ingredients.split(',').map(i => i.trim()).filter(Boolean),
        benefits: data.benefits.split(',').map(b => b.trim()).filter(Boolean),
        whoShouldUse: data.whoShouldUse.split(',').map(w => w.trim()).filter(Boolean),
        concern: data.concern.split(',').map(c => c.trim()).filter(Boolean),
        tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
        images: validImages,
        discount: data.originalPrice > data.price 
          ? Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100)
          : 0,
      };

      await api.put(`/products/${id}`, productData);
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      navigate('/admin/products');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update product',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground">Update product information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input id="name" {...register('name')} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input id="slug" {...register('slug')} />
                    {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description *</Label>
                    <Input id="shortDescription" {...register('shortDescription')} />
                    {errors.shortDescription && <p className="text-sm text-destructive">{errors.shortDescription.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Full Description *</Label>
                    <Textarea id="description" {...register('description')} rows={4} />
                    {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Health Concern (Category) *</Label>
                      <Select
                        value={watch('category') || ''}
                        onValueChange={(value) => setValue('category', value, { shouldValidate: true })}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select Health Concern" />
                        </SelectTrigger>
                        <SelectContent>
                          {concerns.map((concern) => (
                            <SelectItem key={concern.id} value={concern.slug}>
                              {concern.icon} {concern.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productType">Product Type *</Label>
                      <Input id="productType" {...register('productType')} />
                      {errors.productType && <p className="text-sm text-destructive">{errors.productType.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input id="sku" {...register('sku')} />
                    {errors.sku && <p className="text-sm text-destructive">{errors.sku.message}</p>}
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
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input id="price" type="number" {...register('price', { valueAsNumber: true })} />
                      {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Original Price (₹) *</Label>
                      <Input id="originalPrice" type="number" {...register('originalPrice', { valueAsNumber: true })} />
                      {errors.originalPrice && <p className="text-sm text-destructive">{errors.originalPrice.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stockCount">Stock Count *</Label>
                    <Input id="stockCount" type="number" {...register('stockCount', { valueAsNumber: true })} />
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

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
                    <Textarea id="ingredients" {...register('ingredients')} rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benefits">Benefits (comma separated)</Label>
                    <Textarea id="benefits" {...register('benefits')} rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usage">Usage Instructions</Label>
                    <Textarea id="usage" {...register('usage')} rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whoShouldUse">Who Should Use (comma separated)</Label>
                    <Textarea id="whoShouldUse" {...register('whoShouldUse')} rows={2} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="concern">Additional Health Concerns (comma separated, optional)</Label>
                    <Input id="concern" {...register('concern')} />
                    <p className="text-xs text-muted-foreground">Add additional concerns if product addresses multiple health issues</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" {...register('tags')} />
                  </div>
                </CardContent>
              </Card>

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
                  {isLoading ? 'Updating...' : 'Update Product'}
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

export default AdminEditProduct;


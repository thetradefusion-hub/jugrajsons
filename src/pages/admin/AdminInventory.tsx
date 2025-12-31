import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, AlertTriangle, TrendingDown, CheckCircle2, 
  RefreshCw, Download, Filter, Search, Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Product {
  _id: string;
  name: string;
  slug: string;
  stockCount: number;
  inStock: boolean;
  category: string;
  price: number;
  sku: string;
}

const AdminInventory = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newStockCount, setNewStockCount] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchProducts();
  }, [user, isLoading, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/inventory');
      setProducts(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!selectedProduct) return;
    try {
      await api.put(`/admin/products/${selectedProduct._id}/stock`, {
        stockCount: newStockCount,
      });
      toast({
        title: 'Success',
        description: 'Stock updated successfully',
      });
      setIsEditDialogOpen(false);
      fetchProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update stock',
        variant: 'destructive',
      });
    }
  };

  const handleBulkUpdate = async (action: 'increase' | 'decrease', value: number) => {
    try {
      const updates = products
        .filter(p => {
          if (stockFilter === 'low' && p.stockCount >= 10) return false;
          if (stockFilter === 'out' && p.stockCount > 0) return false;
          return true;
        })
        .map(p => ({
          id: p._id,
          stockCount: action === 'increase' 
            ? p.stockCount + value 
            : Math.max(0, p.stockCount - value),
        }));

      await api.put('/admin/products/bulk-stock', { updates });

      toast({
        title: 'Success',
        description: `Updated ${updates.length} products`,
      });
      fetchProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update products',
        variant: 'destructive',
      });
    }
  };

  const lowStockProducts = products.filter(p => p.stockCount < 10 && p.stockCount > 0);
  const outOfStockProducts = products.filter(p => p.stockCount === 0);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock = 
      stockFilter === 'all' ||
      (stockFilter === 'low' && p.stockCount < 10 && p.stockCount > 0) ||
      (stockFilter === 'out' && p.stockCount === 0) ||
      (stockFilter === 'in' && p.stockCount >= 10);
    return matchesSearch && matchesStock;
  });

  const handleExport = () => {
    const csv = [
      ['Product Name', 'SKU', 'Category', 'Stock Count', 'Status'].join(','),
      ...filteredProducts.map(p => [
        p.name,
        p.sku,
        p.category,
        p.stockCount,
        p.inStock ? 'In Stock' : 'Out of Stock'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading inventory...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-section-spacing">
        <div className="space-y-2">
          <h1 className="admin-heading-1">Inventory Management</h1>
          <p className="admin-description">Manage product stock and inventory levels</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="admin-stat-value">{products.length}</div>
                  <div className="admin-stat-label mt-2">Total Products</div>
                </div>
                <Package className="h-9 w-9 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="admin-stat-value text-amber-600">{lowStockProducts.length}</div>
                  <div className="admin-stat-label mt-2">Low Stock</div>
                </div>
                <AlertTriangle className="h-9 w-9 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="admin-stat-value text-red-600">{outOfStockProducts.length}</div>
                  <div className="admin-stat-label mt-2">Out of Stock</div>
                </div>
                <TrendingDown className="h-9 w-9 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="admin-stat-value text-emerald-600">
                    {products.filter(p => p.stockCount >= 10).length}
                  </div>
                  <div className="admin-stat-label mt-2">In Stock</div>
                </div>
                <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="border-2 border-emerald-500 shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="admin-card-title">Product Inventory</CardTitle>
                <CardDescription className="admin-card-description">
                  Showing {filteredProducts.length} of {products.length} products
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" onClick={fetchProducts}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="low">Low Stock (&lt;10)</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                  <SelectItem value="in">In Stock (≥10)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={product.stockCount < 10 ? 'text-amber-600 font-semibold' : ''}>
                              {product.stockCount}
                            </span>
                            {product.stockCount < 10 && product.stockCount > 0 && (
                              <Badge variant="outline" className="border-amber-500 text-amber-600">
                                Low
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={product.inStock ? 'default' : 'destructive'}
                            className={product.inStock ? 'bg-emerald-500' : ''}
                          >
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setNewStockCount(product.stockCount);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
          <Card className="border-2 border-blue-500 shadow-xl">
            <CardHeader>
              <CardTitle className="admin-card-title">Bulk Stock Update</CardTitle>
              <CardDescription className="admin-card-description">Update multiple products at once</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleBulkUpdate('increase', 10)}
                  disabled={stockFilter === 'all'}
                >
                  Add 10 to Selected
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkUpdate('increase', 50)}
                  disabled={stockFilter === 'all'}
                >
                  Add 50 to Selected
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkUpdate('decrease', 5)}
                  disabled={stockFilter === 'all'}
                >
                  Remove 5 from Selected
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Stock Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
            <DialogDescription>
              Update stock count for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Stock Count</Label>
              <Input
                type="number"
                value={newStockCount}
                onChange={(e) => setNewStockCount(parseInt(e.target.value) || 0)}
                min={0}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStock}>
              Update Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminInventory;


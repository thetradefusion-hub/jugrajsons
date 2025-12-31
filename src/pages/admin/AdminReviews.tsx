import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Search, Filter, Trash2, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Review {
  _id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const AdminReviews = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchReviews();
  }, [user, isLoading, navigate, statusFilter]);

  const fetchReviews = async () => {
    try {
      const params: any = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response = await api.get('/reviews', { params });
      // Backend already transforms the data, so use it directly
      const reviewsData = response.data.map((review: any) => ({
        _id: review._id,
        productId: review.productId || '',
        productName: review.productName || 'Unknown Product',
        userId: review.userId || '',
        userName: review.userName || 'Unknown User',
        rating: review.rating,
        comment: review.comment,
        status: review.status,
        createdAt: review.createdAt,
      }));
      setReviews(reviewsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch reviews',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/reviews/${reviewId}/status`, { status });
      setReviews(reviews.map(r => r._id === reviewId ? { ...r, status } : r));
      toast({
        title: 'Success',
        description: `Review ${status} successfully`,
      });
      fetchReviews();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update review status',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter(r => r._id !== reviewId));
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
      fetchReviews();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.status === 'approved').length;
  const rejectedCount = reviews.filter(r => r.status === 'rejected').length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading reviews...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-section-spacing">
        <div className="space-y-2">
          <h1 className="admin-heading-1">Product Reviews</h1>
          <p className="admin-description">Manage and moderate customer reviews</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-2 border-purple-500 shadow-lg">
            <CardContent className="p-5">
              <div className="admin-stat-value">{reviews.length}</div>
              <div className="admin-stat-label mt-2">Total Reviews</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-500 shadow-lg bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="p-5">
              <div className="admin-stat-value text-amber-600">{pendingCount}</div>
              <div className="admin-stat-label mt-2">Pending</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-emerald-500 shadow-lg bg-emerald-50 dark:bg-emerald-950/20">
            <CardContent className="p-5">
              <div className="admin-stat-value text-emerald-600">{approvedCount}</div>
              <div className="admin-stat-label mt-2">Approved</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-red-500 shadow-lg bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-5">
              <div className="admin-stat-value text-red-600">{rejectedCount}</div>
              <div className="admin-stat-label mt-2">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-2 border-purple-500 shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="admin-card-title">All Reviews</CardTitle>
                <CardDescription className="admin-card-description">
                  Showing {filteredReviews.length} of {reviews.length} reviews
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product, customer, or comment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No reviews found
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <Card key={review._id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{review.productName}</h3>
                              <p className="admin-body-small">
                                by {review.userName} • {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              variant={
                                review.status === 'approved' ? 'default' :
                                review.status === 'rejected' ? 'destructive' : 'outline'
                              }
                            >
                              {review.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                            <span className="text-sm font-medium">{review.rating}/5</span>
                          </div>
                          <p className="text-sm">{review.comment}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedReview(review);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {review.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(review._id, 'approved')}
                                className="text-emerald-600 hover:text-emerald-700"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(review._id, 'rejected')}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(review._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Review Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Review for {selectedReview?.productName}
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div>
                <Label>Customer</Label>
                <p className="font-medium">{selectedReview.userName}</p>
              </div>
              <div>
                <Label>Rating</Label>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < selectedReview.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                  <span className="font-medium">{selectedReview.rating}/5</span>
                </div>
              </div>
              <div>
                <Label>Comment</Label>
                <Textarea value={selectedReview.comment} readOnly className="min-h-[100px]" />
              </div>
              <div>
                <Label>Status</Label>
                <Badge
                  variant={
                    selectedReview.status === 'approved' ? 'default' :
                    selectedReview.status === 'rejected' ? 'destructive' : 'outline'
                  }
                >
                  {selectedReview.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminReviews;


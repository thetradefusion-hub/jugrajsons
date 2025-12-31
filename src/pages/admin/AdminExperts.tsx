import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Filter, Star, Phone, Mail, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const expertSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  specialization: z.string().min(1, 'Specialization required'),
  experience: z.number().min(0, 'Experience must be 0 or more'),
  qualification: z.string(),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  languages: z.string(),
  consultationFee: z.number().min(0, 'Consultation fee must be 0 or more'),
  specialties: z.string(),
  available: z.boolean(),
  isActive: z.boolean(),
});

type ExpertFormData = z.infer<typeof expertSchema>;

interface Expert {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  qualification: string[];
  bio: string;
  image: string;
  languages: string[];
  available: boolean;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  totalConsultations: number;
  specialties: string[];
  availableSlots: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  isActive: boolean;
}

const AdminExperts = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ExpertFormData>({
    resolver: zodResolver(expertSchema),
    defaultValues: {
      available: true,
      isActive: true,
      experience: 0,
      consultationFee: 0,
    },
  });

  useEffect(() => {
    if (isLoading) return;

    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchExperts();
  }, [user, isLoading, navigate]);

  const fetchExperts = async () => {
    try {
      const response = await api.get('/experts');
      setExperts(response.data);
    } catch (error) {
      console.error('Error fetching experts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch experts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ExpertFormData) => {
    try {
      const expertData = {
        ...data,
        qualification: data.qualification.split(',').map(q => q.trim()).filter(Boolean),
        languages: data.languages.split(',').map(l => l.trim()).filter(Boolean),
        specialties: data.specialties.split(',').map(s => s.trim()).filter(Boolean),
        experience: Number(data.experience),
        consultationFee: Number(data.consultationFee),
        image: data.image || '',
      };

      if (editingExpert) {
        await api.put(`/experts/${editingExpert._id}`, expertData);
        toast({
          title: 'Success',
          description: 'Expert updated successfully',
        });
      } else {
        await api.post('/experts', expertData);
        toast({
          title: 'Success',
          description: 'Expert created successfully',
        });
      }

      setIsDialogOpen(false);
      reset();
      setEditingExpert(null);
      fetchExperts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save expert',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expert?')) return;

    try {
      await api.delete(`/experts/${id}`);
      toast({
        title: 'Success',
        description: 'Expert deleted successfully',
      });
      fetchExperts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete expert',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (expert: Expert) => {
    setEditingExpert(expert);
    reset({
      name: expert.name,
      email: expert.email,
      phone: expert.phone,
      specialization: expert.specialization,
      experience: expert.experience,
      qualification: expert.qualification?.join(', ') || '',
      bio: expert.bio,
      image: expert.image || '',
      languages: expert.languages?.join(', ') || '',
      consultationFee: expert.consultationFee,
      specialties: expert.specialties?.join(', ') || '',
      available: expert.available,
      isActive: expert.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setEditingExpert(null);
    reset({
      available: true,
      isActive: true,
      experience: 0,
      consultationFee: 0,
    });
    setIsDialogOpen(true);
  };

  const filteredExperts = experts.filter((expert) =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Experts Management</h1>
            <p className="text-muted-foreground">Manage Ayurvedic experts and doctors</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Expert
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingExpert ? 'Edit Expert' : 'Add New Expert'}</DialogTitle>
                <DialogDescription>
                  {editingExpert ? 'Update expert information' : 'Add a new expert to the system'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" {...register('name')} placeholder="Dr. Rajesh Sharma" />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" {...register('email')} placeholder="doctor@example.com" />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" {...register('phone')} placeholder="+91 9876543210" />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization *</Label>
                    <Input id="specialization" {...register('specialization')} placeholder="Ayurvedic Physician" />
                    {errors.specialization && <p className="text-sm text-destructive">{errors.specialization.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (Years) *</Label>
                    <Input id="experience" type="number" {...register('experience', { valueAsNumber: true })} placeholder="15" />
                    {errors.experience && <p className="text-sm text-destructive">{errors.experience.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultationFee">Consultation Fee (₹) *</Label>
                    <Input id="consultationFee" type="number" {...register('consultationFee', { valueAsNumber: true })} placeholder="500" />
                    {errors.consultationFee && <p className="text-sm text-destructive">{errors.consultationFee.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualifications (comma separated)</Label>
                  <Input id="qualification" {...register('qualification')} placeholder="BAMS, MD Ayurveda" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialties">Specialties (comma separated)</Label>
                  <Input id="specialties" {...register('specialties')} placeholder="Digestive Health, Skin Care, Immunity" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languages">Languages (comma separated)</Label>
                  <Input id="languages" {...register('languages')} placeholder="Hindi, English, Gujarati" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input id="image" {...register('image')} placeholder="https://example.com/image.jpg" />
                  {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea id="bio" {...register('bio')} rows={4} placeholder="Expert bio and background..." />
                  {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="available"
                      checked={watch('available')}
                      onCheckedChange={(checked) => setValue('available', checked)}
                    />
                    <Label htmlFor="available">Available for Consultation</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="isActive"
                      checked={watch('isActive')}
                      onCheckedChange={(checked) => setValue('isActive', checked)}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingExpert ? 'Update' : 'Create'} Expert</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Experts</CardTitle>
                <CardDescription>Manage and view all Ayurvedic experts</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search experts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredExperts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No experts found</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Expert</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Consultations</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExperts.map((expert) => (
                      <TableRow key={expert._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={expert.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face"}
                              alt={expert.name}
                              className="w-12 h-12 rounded-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face";
                              }}
                            />
                            <div>
                              <div className="font-medium">{expert.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                {expert.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{expert.specialization}</TableCell>
                        <TableCell>{expert.experience}+ Years</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {expert.rating.toFixed(1)}
                          </div>
                        </TableCell>
                        <TableCell>{expert.totalConsultations || 0}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant={expert.available ? "default" : "secondary"}>
                              {expert.available ? "Available" : "Unavailable"}
                            </Badge>
                            <Badge variant={expert.isActive ? "outline" : "destructive"}>
                              {expert.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(expert)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(expert._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminExperts;


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, Phone, MessageCircle, User, CheckCircle2, XCircle, AlertCircle, Search, Filter, Eye, DollarSign } from 'lucide-react';
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
import { format } from 'date-fns';

interface Appointment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  expert: {
    _id: string;
    name: string;
    specialization: string;
    image: string;
    phone: string;
    email: string;
  };
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  consultationType: 'video' | 'audio' | 'chat' | 'in-person';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  notes: string;
  fee: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

const AdminAppointments = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'refunded'>('pending');
  const [fee, setFee] = useState<number>(0);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchAppointments();
  }, [user, isLoading, navigate, statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Fetch all appointments using admin endpoint
      const response = await api.get('/appointments/all');
      console.log('Fetched appointments:', response.data);
      setAppointments(response.data || []);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      console.error('Error response:', error.response?.data);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch appointments',
        variant: 'destructive',
      });
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      setUpdating(true);
      await api.put(`/appointments/${appointmentId}`, {
        status: newStatus,
        notes: notes || undefined,
        paymentStatus: paymentStatus,
        fee: fee,
      });
      
      toast({
        title: 'Success',
        description: `Appointment updated successfully`,
      });
      
      setIsDialogOpen(false);
      setSelectedAppointment(null);
      setNotes('');
      setPaymentStatus('pending');
      setFee(0);
      fetchAppointments();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update appointment',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNotes(appointment.notes || '');
    setPaymentStatus(appointment.paymentStatus);
    setFee(appointment.fee || 0);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: 'secondary' as const, icon: AlertCircle, label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { variant: 'default' as const, icon: CheckCircle2, label: 'Confirmed', color: 'bg-green-100 text-green-800' },
      completed: { variant: 'default' as const, icon: CheckCircle2, label: 'Completed', color: 'bg-blue-100 text-blue-800' },
      cancelled: { variant: 'destructive' as const, icon: XCircle, label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    };
    return variants[status] || variants.pending;
  };

  const getConsultationIcon = (type: string) => {
    const icons: Record<string, any> = {
      video: Video,
      audio: Phone,
      chat: MessageCircle,
      'in-person': User,
    };
    return icons[type] || Video;
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = 
      appointment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading appointments...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Appointments Management</h1>
            <p className="text-muted-foreground">Manage all user appointments with experts</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user name, expert name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Appointments ({filteredAppointments.length})</CardTitle>
            <CardDescription>View and manage all appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">No appointments found</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Expert</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appointment) => {
                      const statusInfo = getStatusBadge(appointment.status);
                      const ConsultationIcon = getConsultationIcon(appointment.consultationType);
                      
                      // Safely parse appointment date
                      let appointmentDateTime: Date;
                      let isValidDate = false;
                      try {
                        const dateStr = appointment.appointmentDate;
                        const timeStr = appointment.appointmentTime || '00:00';
                        if (dateStr && dateStr.includes('T')) {
                          appointmentDateTime = new Date(dateStr);
                        } else if (dateStr) {
                          appointmentDateTime = new Date(`${dateStr}T${timeStr}`);
                        } else {
                          appointmentDateTime = new Date();
                        }
                        isValidDate = !isNaN(appointmentDateTime.getTime());
                      } catch {
                        appointmentDateTime = new Date();
                        isValidDate = false;
                      }

                      return (
                        <TableRow key={appointment._id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{appointment.user.name}</div>
                              <div className="text-sm text-muted-foreground">{appointment.user.email}</div>
                              <div className="text-xs text-muted-foreground">{appointment.user.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <img
                                src={appointment.expert.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face"}
                                alt={appointment.expert.name}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face";
                                }}
                              />
                              <div>
                                <div className="font-medium">{appointment.expert.name}</div>
                                <div className="text-xs text-muted-foreground">{appointment.expert.specialization}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">
                                {isValidDate 
                                  ? format(appointmentDateTime, 'MMM d, yyyy')
                                  : new Date(appointment.appointmentDate).toLocaleDateString()
                                }
                              </div>
                              <div className="text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {appointment.appointmentTime} ({appointment.duration} min)
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <ConsultationIcon className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm capitalize">{appointment.consultationType}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusInfo.variant} className={statusInfo.color}>
                              <statusInfo.icon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">Rs. {appointment.fee || 0}</div>
                              <Badge variant={appointment.paymentStatus === 'paid' ? 'default' : 'secondary'} className="text-xs">
                                {appointment.paymentStatus}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(appointment)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/chat/${appointment.expert._id}?user=${appointment.user._id}`)}
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Chat
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appointment Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>View and update appointment information</DialogDescription>
            </DialogHeader>
            
            {selectedAppointment && (
              <div className="space-y-6">
                {/* User & Expert Info */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">User Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">Name</Label>
                          <p className="font-medium">{selectedAppointment.user.name}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Email</Label>
                          <p className="text-sm">{selectedAppointment.user.email}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Phone</Label>
                          <p className="text-sm">{selectedAppointment.user.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Expert Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={selectedAppointment.expert.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face"}
                          alt={selectedAppointment.expert.name}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face";
                          }}
                        />
                        <div>
                          <p className="font-medium">{selectedAppointment.expert.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedAppointment.expert.specialization}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Appointment Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Appointment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Date</Label>
                        <p className="font-medium">
                          {(() => {
                            try {
                              const date = new Date(selectedAppointment.appointmentDate);
                              const isValid = !isNaN(date.getTime());
                              return isValid ? format(date, 'EEEE, MMMM d, yyyy') : date.toLocaleDateString();
                            } catch {
                              return selectedAppointment.appointmentDate;
                            }
                          })()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Time</Label>
                        <p className="font-medium">{selectedAppointment.appointmentTime} ({selectedAppointment.duration} min)</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Type</Label>
                        <p className="font-medium capitalize">{selectedAppointment.consultationType}</p>
                      </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Fee</Label>
                      <p className="font-medium">Rs. {selectedAppointment.fee || 0}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Payment Status</Label>
                      <Badge 
                        variant={selectedAppointment.paymentStatus === 'paid' ? 'default' : selectedAppointment.paymentStatus === 'refunded' ? 'destructive' : 'secondary'}
                        className="mt-1"
                      >
                        {selectedAppointment.paymentStatus.charAt(0).toUpperCase() + selectedAppointment.paymentStatus.slice(1)}
                      </Badge>
                    </div>
                  </div>
                    
                    {selectedAppointment.reason && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Reason</Label>
                        <p className="text-sm mt-1">{selectedAppointment.reason}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Status Update */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Update Appointment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Appointment Status</Label>
                      <Select
                        value={selectedAppointment.status}
                        onValueChange={(value) => {
                          setSelectedAppointment({ ...selectedAppointment, status: value as any });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Consultation Fee (Rs. )</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="number"
                            value={fee}
                            onChange={(e) => setFee(Number(e.target.value))}
                            className="pl-9"
                            min="0"
                            step="0.01"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Payment Status</Label>
                        <Select
                          value={paymentStatus}
                          onValueChange={(value) => setPaymentStatus(value as 'pending' | 'paid' | 'refunded')}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes about this appointment..."
                        rows={4}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-1">Payment Information:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>Fee: Rs. {fee || 0}</li>
                            <li>Status: {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}</li>
                            {paymentStatus === 'paid' && fee > 0 && (
                              <li className="text-green-600 font-medium">✓ Payment received</li>
                            )}
                            {paymentStatus === 'refunded' && (
                              <li className="text-orange-600 font-medium">⚠ Refund processed</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(selectedAppointment._id, selectedAppointment.status)}
                        disabled={updating}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {updating ? 'Updating...' : 'Update Appointment'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminAppointments;


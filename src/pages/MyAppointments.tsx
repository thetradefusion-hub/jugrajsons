import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, Phone, MessageCircle, User, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/seo/SEO';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

interface Appointment {
  _id: string;
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
  fee: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

const MyAppointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/appointments');
      return;
    }
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/appointments/my-appointments');
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load appointments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await api.put(`/appointments/${appointmentId}/cancel`);
      toast({
        title: 'Success',
        description: 'Appointment cancelled successfully',
      });
      fetchAppointments();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to cancel appointment',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: 'secondary' as const, icon: AlertCircle, label: 'Pending' },
      confirmed: { variant: 'default' as const, icon: CheckCircle2, label: 'Confirmed' },
      completed: { variant: 'default' as const, icon: CheckCircle2, label: 'Completed' },
      cancelled: { variant: 'destructive' as const, icon: XCircle, label: 'Cancelled' },
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

  if (loading) {
    return (
      <>
        <SEO title="My Appointments" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted-foreground">Loading appointments...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="My Appointments" />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white px-4 pt-8 pb-12 rounded-b-3xl">
          <h1 className="text-3xl font-bold font-display mb-2">My Appointments</h1>
          <p className="text-base opacity-95">Manage your consultations with experts</p>
        </div>

        <div className="container-custom px-4 -mt-6 relative z-10">
          {appointments.length === 0 ? (
            <Card className="shadow-xl">
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No Appointments</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't booked any appointments yet
                </p>
                <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  <Link to="/expert">Book Appointment</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment, index) => {
                const statusInfo = getStatusBadge(appointment.status);
                const ConsultationIcon = getConsultationIcon(appointment.consultationType);
                
                // Safely parse the appointment date
                let appointmentDateTime: Date;
                let isValidDate = false;
                
                try {
                  const dateStr = appointment.appointmentDate;
                  const timeStr = appointment.appointmentTime || '00:00';
                  
                  if (!dateStr) {
                    throw new Error('Date string is empty');
                  }
                  
                  // Try parsing the date
                  if (dateStr.includes('T')) {
                    appointmentDateTime = new Date(dateStr);
                  } else if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    // Format: YYYY-MM-DD
                    appointmentDateTime = new Date(`${dateStr}T${timeStr}`);
                  } else {
                    // Try parsing as-is
                    appointmentDateTime = new Date(dateStr);
                  }
                  
                  // Validate the date
                  isValidDate = !isNaN(appointmentDateTime.getTime());
                  
                  if (!isValidDate) {
                    throw new Error('Invalid date');
                  }
                } catch (error) {
                  // Fallback: try to parse just the date part
                  console.error('Error parsing appointment date:', error, appointment.appointmentDate);
                  try {
                    const dateOnly = appointment.appointmentDate.split('T')[0];
                    appointmentDateTime = new Date(dateOnly);
                    isValidDate = !isNaN(appointmentDateTime.getTime());
                  } catch {
                    appointmentDateTime = new Date();
                    isValidDate = false;
                  }
                }

                return (
                  <motion.div
                    key={appointment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 border-emerald-100">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <img
                            src={appointment.expert.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face"}
                            alt={appointment.expert.name}
                            className="w-20 h-20 rounded-xl object-cover border-2 border-emerald-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face";
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold mb-1">{appointment.expert.name}</h3>
                                <p className="text-sm text-muted-foreground">{appointment.expert.specialization}</p>
                              </div>
                              <Badge variant={statusInfo.variant}>
                                <statusInfo.icon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {isValidDate 
                                    ? format(appointmentDateTime, 'EEEE, MMMM d, yyyy')
                                    : appointment.appointmentDate 
                                      ? new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                                          weekday: 'long', 
                                          year: 'numeric', 
                                          month: 'long', 
                                          day: 'numeric' 
                                        })
                                      : 'Date not available'
                                  }
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {appointment.appointmentTime} ({appointment.duration} min)
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <ConsultationIcon className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium capitalize">{appointment.consultationType} Consultation</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium text-emerald-600">
                                  Fee: {appointment.fee ? `Rs. ${appointment.fee}` : 'Free'}
                                </span>
                                <Badge variant={appointment.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                                  {appointment.paymentStatus}
                                </Badge>
                              </div>
                            </div>

                            {appointment.reason && (
                              <div className="bg-emerald-50 rounded-lg p-3 mb-4">
                                <p className="text-sm text-emerald-900">
                                  <span className="font-semibold">Reason: </span>
                                  {appointment.reason}
                                </p>
                              </div>
                            )}

                            <div className="flex gap-2">
                              {appointment.status === 'pending' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancel(appointment._id)}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                              )}
                              {appointment.status === 'confirmed' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/chat/${appointment.expert._id}`)}
                                  >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Chat
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.location.href = `tel:${appointment.expert.phone}`}
                                  >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/expert`)}
                              >
                                View Expert
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyAppointments;


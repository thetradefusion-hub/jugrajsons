import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, Phone, MessageCircle, User, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/seo/SEO';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface Expert {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  image: string;
  consultationFee: number;
  available: boolean;
  bio: string;
  phone: string;
  email: string;
}

const BookAppointment = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    consultationType: 'video' as 'video' | 'audio' | 'chat' | 'in-person',
    reason: '',
    duration: 30,
  });

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  ];

  useEffect(() => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to book an appointment',
        variant: 'destructive',
      });
      navigate('/login?redirect=/book-appointment/' + expertId);
      return;
    }

    if (expertId) {
      fetchExpert();
    }
  }, [expertId, user]);

  const fetchExpert = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/experts/${expertId}`);
      setExpert(response.data);
    } catch (error) {
      console.error('Error fetching expert:', error);
      toast({
        title: 'Error',
        description: 'Failed to load expert details',
        variant: 'destructive',
      });
      navigate('/expert');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to book an appointment',
        variant: 'destructive',
      });
      navigate('/login?redirect=/book-appointment/' + expertId);
      return;
    }

    if (!formData.appointmentDate || !formData.appointmentTime) {
      toast({
        title: 'Validation Error',
        description: 'Please select date and time',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/appointments', {
        expertId,
        ...formData,
      });

      toast({
        title: 'Appointment Booked!',
        description: `Your appointment with ${expert?.name} has been booked successfully`,
      });

      navigate('/appointments');
    } catch (error: any) {
      toast({
        title: 'Booking Failed',
        description: error.response?.data?.message || 'Failed to book appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Tomorrow onwards
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 days from now
    return maxDate.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <>
        <SEO title="Book Appointment" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </>
    );
  }

  if (!expert) {
    return (
      <>
        <SEO title="Expert Not Found" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Expert Not Found</h1>
            <Button asChild>
              <Link to="/expert">Back to Experts</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title={`Book Appointment with ${expert.name}`} />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white px-4 pt-8 pb-12 rounded-b-3xl relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/expert')}
              className="mb-4 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold font-display mb-2">Book Appointment</h1>
            <p className="text-base opacity-95">Schedule a consultation with our expert</p>
          </div>
        </div>

        <div className="container-custom px-4 -mt-6 relative z-10">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Expert Info Card */}
            <div className="md:col-span-1">
              <Card className="shadow-xl border-2 border-emerald-200 sticky top-4">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <img
                      src={expert.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face"}
                      alt={expert.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-emerald-200 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face";
                      }}
                    />
                    <h2 className="text-2xl font-bold mb-1">{expert.name}</h2>
                    <p className="text-muted-foreground mb-2">{expert.specialization}</p>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                      {expert.experience}+ Years Experience
                    </Badge>
                  </div>

                  {expert.bio && (
                    <p className="text-sm text-muted-foreground mb-4 text-center">{expert.bio}</p>
                  )}

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Consultation Fee</span>
                      <span className="font-bold text-lg text-emerald-600">
                        {expert.consultationFee ? `Rs. ${expert.consultationFee}` : 'Free'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`w-3 h-3 rounded-full ${expert.available ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={expert.available ? 'text-green-600' : 'text-red-600'}>
                        {expert.available ? 'Available Now' : 'Currently Unavailable'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <div className="md:col-span-2">
              <Card className="shadow-xl border-2 border-emerald-200">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="consultationType" className="text-base font-semibold mb-3 block">
                        Consultation Type *
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { value: 'video', label: 'Video Call', icon: Video },
                          { value: 'audio', label: 'Audio Call', icon: Phone },
                          { value: 'chat', label: 'Chat', icon: MessageCircle },
                          { value: 'in-person', label: 'In-Person', icon: User },
                        ].map((type) => {
                          const Icon = type.icon;
                          return (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, consultationType: type.value as any })}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                formData.consultationType === type.value
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                  : 'border-gray-200 hover:border-emerald-300'
                              }`}
                            >
                              <Icon className="w-6 h-6 mx-auto mb-2" />
                              <span className="text-sm font-medium">{type.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="appointmentDate" className="text-base font-semibold">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Select Date *
                        </Label>
                        <Input
                          id="appointmentDate"
                          type="date"
                          required
                          min={getMinDate()}
                          max={getMaxDate()}
                          value={formData.appointmentDate}
                          onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="appointmentTime" className="text-base font-semibold">
                          <Clock className="w-4 h-4 inline mr-2" />
                          Select Time *
                        </Label>
                        <Select
                          value={formData.appointmentTime}
                          onValueChange={(value) => setFormData({ ...formData, appointmentTime: value })}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Choose time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-base font-semibold">
                        Duration (minutes)
                      </Label>
                      <Select
                        value={formData.duration.toString()}
                        onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason" className="text-base font-semibold">
                        Reason for Consultation *
                      </Label>
                      <Textarea
                        id="reason"
                        required
                        rows={4}
                        placeholder="Please describe your health concern or reason for consultation..."
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        className="resize-none"
                      />
                    </div>

                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-emerald-900 mb-1">What to Expect</h4>
                          <ul className="text-sm text-emerald-800 space-y-1">
                            <li>• Personalized Ayurvedic consultation</li>
                            <li>• Natural remedy recommendations</li>
                            <li>• Follow-up support included</li>
                            <li>• {expert.consultationFee > 0 ? `Fee: Rs. ${expert.consultationFee}` : 'Free consultation'}</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700"
                      disabled={submitting || !expert.available}
                    >
                      {submitting ? (
                        'Booking...'
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Confirm Appointment
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookAppointment;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MessageCircle, Calendar, Star, Award, Clock, CheckCircle2, Search, Filter, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SEO from "@/components/seo/SEO";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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

const benefits = [
  { icon: CheckCircle2, text: "100% Natural Remedies" },
  { icon: Clock, text: "24/7 Availability" },
  { icon: Award, text: "Certified Experts" },
  { icon: Star, text: "Personalized Care" },
];

const Expert = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchExperts();
  }, [specializationFilter, availabilityFilter]);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (specializationFilter !== "all") {
        params.specialization = specializationFilter;
      }
      
      if (availabilityFilter === "available") {
        params.available = "true";
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await api.get("/experts", { params });
      setExperts(response.data || []);
    } catch (error) {
      console.error("Error fetching experts:", error);
      toast({
        title: "Error",
        description: "Failed to load experts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchExperts();
  };

  const filteredExperts = experts.filter((expert) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        expert.name.toLowerCase().includes(query) ||
        expert.specialization.toLowerCase().includes(query) ||
        expert.specialties.some((s) => s.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const specializations = Array.from(new Set(experts.map((e) => e.specialization)));

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleChat = (expertId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to chat with experts",
        variant: "destructive",
      });
      navigate('/login?redirect=/chat/' + expertId);
      return;
    }
    navigate(`/chat/${expertId}`);
  };

  const handleBookAppointment = (expertId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book an appointment",
        variant: "destructive",
      });
      navigate('/login?redirect=/book-appointment/' + expertId);
      return;
    }
    navigate(`/book-appointment/${expertId}`);
  };
  return (
    <>
      <SEO
        title="Consult Ayurvedic Expert | Atharva Health Solutions"
        description="Get personalized Ayurvedic consultation from certified experts"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 pb-24">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white px-4 pt-8 pb-12 rounded-b-3xl relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold font-display mb-2 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-amber-300" />
                Ayurvedic Experts
              </h1>
              <p className="text-base opacity-95 max-w-2xl">
                Consult with certified Ayurvedic doctors for personalized health solutions and natural remedies
              </p>
              
              {/* Benefits Pills */}
              <div className="flex flex-wrap gap-2 mt-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30"
                  >
                    <benefit.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-4 -mt-6 relative z-10">
          <Card className="shadow-xl border-2 border-emerald-200">
            <CardContent className="p-4 space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search experts by name or specialization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} size="default">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specializations</SelectItem>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Experts</SelectItem>
                    <SelectItem value="available">Available Now</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expert List */}
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display">
              Our Experts
              {filteredExperts.length > 0 && (
                <span className="text-lg text-muted-foreground font-normal ml-2">
                  ({filteredExperts.length})
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-muted-foreground">Loading experts...</div>
            </div>
          ) : filteredExperts.length > 0 ? (
            <div className="space-y-4">
              {filteredExperts.map((expert, index) => (
                <motion.div
                  key={expert._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card className="overflow-hidden border-2 hover:border-emerald-300 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        <div className="relative">
                          <img
                            src={expert.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face"}
                            alt={expert.name}
                            className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face";
                            }}
                          />
                          {expert.available && (
                            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-3 border-white rounded-full shadow-lg" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-foreground">{expert.name}</h3>
                              <p className="text-sm text-muted-foreground font-medium">{expert.specialization}</p>
                              {expert.specialties && expert.specialties.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {expert.specialties.slice(0, 3).map((specialty, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {specialty}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-bold text-yellow-700">{expert.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          
                          {expert.bio && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{expert.bio}</p>
                          )}
                          
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              {expert.experience}+ Years
                            </span>
                            <span>{expert.totalConsultations || 0}+ Consultations</span>
                            {expert.languages && expert.languages.length > 0 && (
                              <span className="flex items-center gap-1">
                                {expert.languages.slice(0, 2).join(", ")}
                              </span>
                            )}
                          </div>

                          {expert.consultationFee > 0 && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                                Rs. {expert.consultationFee} per consultation
                              </Badge>
                            </div>
                          )}
                          
                          <div className="flex gap-2 mt-4">
                            <Button 
                              size="sm" 
                              className="flex-1 h-9 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => handleBookAppointment(expert._id)}
                            >
                              <Calendar className="w-4 h-4 mr-1.5" />
                              Book Appointment
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 h-9 text-sm rounded-lg"
                              onClick={() => handleChat(expert._id)}
                            >
                              <MessageCircle className="w-4 h-4 mr-1.5" />
                              Chat
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-9 px-3 rounded-lg"
                              onClick={() => handleCall(expert.phone)}
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground text-lg">No experts found</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Enhanced CTA Banner */}
        <div className="px-4 mt-8 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 border-4 border-amber-400 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-foreground">
                      Free First Consultation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get your first consultation absolutely free with our expert doctors
                    </p>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  onClick={() => {
                    if (!user) {
                      toast({
                        title: "Login Required",
                        description: "Please login to book a consultation",
                        variant: "destructive",
                      });
                      navigate('/login?redirect=/expert');
                    } else if (filteredExperts.length > 0) {
                      handleBookAppointment(filteredExperts[0]._id);
                    }
                  }}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Free Consultation Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Expert;

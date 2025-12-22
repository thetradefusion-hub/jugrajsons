import { Phone, MessageCircle, Calendar, Star, Award, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/seo/SEO";

const experts = [
  {
    id: 1,
    name: "Dr. Rajesh Sharma",
    specialization: "Ayurvedic Physician",
    experience: "15+ Years",
    rating: 4.9,
    consultations: 5000,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
    available: true,
    languages: ["Hindi", "English"],
  },
  {
    id: 2,
    name: "Dr. Priya Patel",
    specialization: "Panchakarma Expert",
    experience: "12+ Years",
    rating: 4.8,
    consultations: 3500,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    available: true,
    languages: ["Hindi", "English", "Gujarati"],
  },
  {
    id: 3,
    name: "Dr. Anil Kumar",
    specialization: "Skin & Hair Specialist",
    experience: "10+ Years",
    rating: 4.7,
    consultations: 2800,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face",
    available: false,
    languages: ["Hindi", "English"],
  },
];

const benefits = [
  { icon: CheckCircle2, text: "100% Natural Remedies" },
  { icon: Clock, text: "24/7 Availability" },
  { icon: Award, text: "Certified Experts" },
  { icon: Star, text: "Personalized Care" },
];

const Expert = () => {
  return (
    <>
      <SEO
        title="Consult Ayurvedic Expert | Atharva Health Solutions"
        description="Get personalized Ayurvedic consultation from certified experts"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-ayurveda-cream to-background pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-4 pt-6 pb-8 rounded-b-3xl">
          <h1 className="text-2xl font-bold font-display mb-2">
            Ayurvedic Experts
          </h1>
          <p className="text-sm opacity-90">
            Consult with certified Ayurvedic doctors for personalized health solutions
          </p>
          
          {/* Benefits Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5"
              >
                <benefit.icon className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 -mt-4">
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-auto py-3 flex-col gap-1.5 rounded-xl">
                  <Phone className="w-5 h-5" />
                  <span className="text-xs">Call Now</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex-col gap-1.5 rounded-xl border-primary/30">
                  <Calendar className="w-5 h-5" />
                  <span className="text-xs">Book Appointment</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expert List */}
        <div className="px-4 mt-6">
          <h2 className="text-lg font-semibold mb-4">Our Experts</h2>
          <div className="space-y-4">
            {experts.map((expert) => (
              <Card key={expert.id} className="overflow-hidden border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={expert.image}
                        alt={expert.name}
                        className="w-20 h-20 rounded-2xl object-cover"
                      />
                      {expert.available && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{expert.name}</h3>
                          <p className="text-xs text-muted-foreground">{expert.specialization}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium text-yellow-700">{expert.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          {expert.experience}
                        </span>
                        <span>{expert.consultations}+ consultations</span>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1 h-8 text-xs rounded-lg">
                          <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                          Chat
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs rounded-lg">
                          <Phone className="w-3.5 h-3.5 mr-1.5" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="px-4 mt-6">
          <Card className="bg-gradient-to-r from-ayurveda-gold/20 to-ayurveda-cream border-ayurveda-gold/30">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-1">
                Free First Consultation
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Get your first consultation absolutely free with our expert doctors
              </p>
              <Button size="sm" className="w-full">
                Book Free Consultation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Expert;

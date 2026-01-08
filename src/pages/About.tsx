import { motion } from 'framer-motion';
import { 
  Leaf, Heart, Award, Users, Shield, Target, Sparkles, CheckCircle2,
  TrendingUp, Clock, Globe, Mail, Phone, MapPin, Star, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SEO from '@/components/seo/SEO';

const About = () => {
  const values = [
    {
      icon: Leaf,
      title: '100% Natural',
      description: 'All our products are made from pure, natural ingredients sourced from trusted suppliers.',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    },
    {
      icon: Shield,
      title: 'GMP Certified',
      description: 'Manufactured in GMP-certified facilities ensuring the highest quality standards.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your health and satisfaction are our top priorities. We care about your wellness journey.',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20',
    },
    {
      icon: Award,
      title: 'Expert Formulated',
      description: 'Products developed by certified Ayurvedic experts with decades of experience.',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    },
  ];

  const stats = [
    { icon: Users, value: '1M+', label: 'Happy Customers', color: 'text-blue-600' },
    { icon: Award, value: '50+', label: 'Years Experience', color: 'text-amber-600' },
    { icon: CheckCircle2, value: '100%', label: 'Natural Products', color: 'text-emerald-600' },
    { icon: Star, value: '4.8', label: 'Average Rating', color: 'text-purple-600' },
  ];

  const milestones = [
    {
      year: '1970s',
      title: 'Foundation',
      description: 'Started with a vision to bring authentic Ayurveda to modern wellness.',
    },
    {
      year: '1990s',
      title: 'Expansion',
      description: 'Expanded product range and established GMP-certified manufacturing facilities.',
    },
    {
      year: '2010s',
      title: 'Digital Transformation',
      description: 'Launched online platform to reach customers nationwide.',
    },
    {
      year: '2020s',
      title: 'Innovation',
      description: 'Introduced expert consultation services and AI-powered health recommendations.',
    },
  ];

  const team = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Chief Ayurvedic Expert',
      expertise: '30+ years in Ayurvedic medicine',
      image: '👩‍⚕️',
    },
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Head of Research',
      expertise: 'Pharmaceutical research & development',
      image: '👨‍🔬',
    },
    {
      name: 'Dr. Anjali Patel',
      role: 'Quality Assurance',
      expertise: 'GMP compliance & quality control',
      image: '👩‍💼',
    },
  ];

  return (
    <>
      <SEO 
        title="About Us - Atharva Health Solutions"
        description="Learn about Atharva Health Solutions - 50+ years of Ayurvedic expertise, 100% natural products, GMP certified, and trusted by millions."
      />
      <main className="pb-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-green-950/30 py-16 md:py-24">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                Our Story
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                About Atharva Health Solutions
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Bringing the ancient wisdom of Ayurveda to modern wellness. For over 50 years, we've been 
                dedicated to providing authentic, natural health solutions that transform lives.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="container-custom py-16">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    To make authentic Ayurvedic wellness accessible to everyone. We believe in the power of 
                    natural healing and are committed to providing high-quality, scientifically-backed products 
                    that support your health journey.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    To become India's most trusted Ayurvedic wellness brand, recognized globally for our 
                    commitment to authenticity, quality, and customer care. We envision a world where 
                    natural healing is the first choice for wellness.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-muted/50 py-16">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="container-custom py-16">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-full ${value.bgColor} flex items-center justify-center mb-4`}>
                      <value.icon className={`w-6 h-6 ${value.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
                <p className="text-muted-foreground">
                  A legacy of excellence spanning over five decades
                </p>
              </div>
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 * index }}
                    className="flex gap-6"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      {index < milestones.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <Badge variant="outline" className="mb-2">{milestone.year}</Badge>
                      <h3 className="font-semibold text-lg mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="container-custom py-16">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Our Expert Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated professionals behind Atharva Health Solutions
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-6xl mb-4">{member.image}</div>
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-xs text-muted-foreground">{member.expertise}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="bg-muted/50 py-16">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Certifications & Quality</h2>
              <p className="text-muted-foreground">
                We maintain the highest standards in quality and safety
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">GMP Certified</h3>
                  <p className="text-sm text-muted-foreground">
                    Good Manufacturing Practices certified facilities
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Award className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">ISO Certified</h3>
                  <p className="text-sm text-muted-foreground">
                    International quality management standards
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">100% Natural</h3>
                  <p className="text-sm text-muted-foreground">
                    Pure, organic ingredients, no artificial additives
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container-custom py-16">
          <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0">
            <CardContent className="p-12 text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Join Our Wellness Journey
              </h2>
              <p className="text-emerald-50 mb-8 max-w-2xl mx-auto">
                Experience the power of authentic Ayurveda. Start your wellness journey with us today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/products">Explore Products</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  <Link to="/expert">Consult Expert</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Info */}
        <section className="bg-muted/50 py-16">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground">
                We'd love to hear from you
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <a href="tel:+919669361290" className="text-primary hover:underline">
                    09669361290
                  </a>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <a href="mailto:support@atharvahealthsolutions.com" className="text-primary hover:underline">
                    support@atharvahealthsolutions.com
                  </a>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-sm text-muted-foreground">
                    Atharva Health Solution, Dunda Seoni<br />
                    Seoni, Madhya Pradesh – 480661, India
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;


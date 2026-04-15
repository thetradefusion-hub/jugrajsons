import { motion } from 'framer-motion';
import { 
  Newspaper, Mail, Phone, Download, FileText, Calendar,
  Image, Video, Users, Award, TrendingUp, Globe, MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/seo/SEO';

const Press = () => {
  const pressReleases = [
    {
      id: 1,
      title: "Jugraj Son's Hive Launches New Raw Honey Collection",
      date: 'January 15, 2025',
      category: 'Product Launch',
      description: 'Company introduces a premium range of pure raw natural honey for modern consumers.',
    },
    {
      id: 2,
      title: 'Partnership with Leading Beekeeping Partners Announced',
      date: 'December 10, 2024',
      category: 'Partnership',
      description: 'Strategic collaboration with trusted beekeepers to improve sourcing and quality consistency.',
    },
    {
      id: 3,
      title: 'Quality Standards Upgraded Across Packaging Operations',
      date: 'November 5, 2024',
      category: 'Certification',
      description: 'Company strengthens hygiene and quality checks to ensure purity in every honey batch.',
    },
  ];

  const mediaKit = [
    {
      icon: Image,
      title: 'Company Logo',
      description: 'High-resolution logo files in various formats',
      download: '/assets/press/logo.zip',
    },
    {
      icon: Image,
      title: 'Product Images',
      description: 'Professional product photography',
      download: '/assets/press/products.zip',
    },
    {
      icon: FileText,
      title: 'Company Fact Sheet',
      description: "Key information about Jugraj Son's Hive",
      download: '/assets/press/fact-sheet.pdf',
    },
    {
      icon: Image,
      title: 'Team Photos',
      description: 'Executive and team member photos',
      download: '/assets/press/team.zip',
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: 'Press Inquiries',
      content: 'press@jugrajsonshive.com',
      link: 'mailto:press@jugrajsonshive.com',
    },
    {
      icon: Phone,
      title: 'Media Contact',
      content: '09669361290',
      link: 'tel:+919669361290',
    },
    {
      icon: MapPin,
      title: 'Address',
      content: "Jugraj Son's Hive, India",
      link: 'https://maps.google.com',
    },
    {
      icon: Globe,
      title: 'Website',
      content: 'https://jugrajsonshive.com',
      link: 'https://jugrajsonshive.com',
    },
  ];

  return (
    <>
      <SEO 
        title="Press & Media - Jugraj Son's Hive"
        description="Press releases, media kit, and contact information for journalists and media professionals covering Jugraj Son's Hive."
      />
      <main className="pb-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/30 dark:via-gray-950/30 dark:to-zinc-950/30 py-12 md:py-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Newspaper className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">
                Press & Media
              </h1>
              <p className="text-lg text-muted-foreground">
                Latest news, press releases, and media resources
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container-custom py-12">
          {/* Press Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Media Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{info.title}</h3>
                          <a
                            href={info.link}
                            className="text-primary hover:underline"
                          >
                            {info.content}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Press Releases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Press Releases</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {pressReleases.map((release, index) => (
                <motion.div
                  key={release.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="h-full border-2 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{release.category}</Badge>
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-lg">{release.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {release.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                        <Calendar className="w-3 h-3" />
                        <span>{release.date}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Media Kit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Media Kit</h2>
              <p className="text-muted-foreground">Download resources for media use</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mediaKit.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Card className="h-full border-2 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-base">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {item.description}
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Company Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  About Jugraj Son's Hive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Company Overview
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Jugraj Son's Hive is a leading provider of pure raw natural honey.
                      We combine trusted sourcing with modern quality processes to deliver high-quality honey
                      for today's health-conscious consumers.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Our mission is to make authentic raw honey accessible to everyone while maintaining
                      the highest standards of quality, purity, and transparency.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      Key Highlights
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span>Purity-first Packaging Standards</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        <span>100% Pure Raw Natural Honey</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span>Trusted Beekeeper Network</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        <span>Nationwide Delivery</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Facts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">2020</div>
                    <p className="text-sm text-muted-foreground">Founded</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">100+</div>
                    <p className="text-sm text-muted-foreground">Products</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                    <p className="text-sm text-muted-foreground">Happy Customers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">4.8</div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Press;


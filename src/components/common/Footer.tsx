import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Leaf,
  CreditCard,
  Shield,
  Truck
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { concerns, productTypes } from '@/data/products';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = () => {
    // Scroll to top when clicking any footer link
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  const footerLinks = {
    shop: [
      { label: 'All Products', href: '/products' },
      { label: 'Bestsellers', href: '/products?tag=bestseller' },
      { label: 'New Arrivals', href: '/products?tag=new' },
      { label: 'Combo Packs', href: '/products?category=combos' },
      { label: 'Gift Cards', href: '/gift-cards' },
    ],
    health: concerns.slice(0, 5).map(c => ({
      label: c.name,
      href: `/products?concern=${c.slug}`
    })),
    support: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns Policy', href: '/returns' },
      { label: 'Track Order', href: '/track-order' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Story', href: '/our-story' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms and Conditions', href: '/terms' },
      { label: 'Press', href: '/press' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  ];

  const trustBadges = [
    { icon: Shield, text: 'GMP Certified' },
    { icon: Leaf, text: '100% Ayurvedic' },
    { icon: Truck, text: 'Free Shipping' },
    { icon: CreditCard, text: 'Secure Payment' },
  ];

  return (
    <footer className="bg-ayurveda-green-dark text-primary-foreground">
      {/* Trust Badges */}
      <div className="border-b border-primary-foreground/10">
        <div className="container-custom py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge) => (
              <div key={badge.text} className="flex items-center justify-center gap-2">
                <badge.icon className="w-5 h-5 text-ayurveda-gold" />
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-primary-foreground/10">
        <div className="container-custom py-10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl font-semibold mb-2">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-primary-foreground/70 mb-6">
              Get exclusive offers, wellness tips, and new product updates delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-ayurveda-gold"
              />
              <Button className="bg-ayurveda-gold hover:bg-ayurveda-gold-light text-ayurveda-brown font-semibold whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-ayurveda-gold" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold leading-tight">
                  Atharva
                </h2>
                <p className="text-xs text-primary-foreground/60 -mt-1">Health Solutions</p>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/70 mb-6 max-w-xs">
              Bringing the ancient wisdom of Ayurveda to modern wellness. 
              100% natural, scientifically formulated health solutions.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <a href="tel:+919669361290" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Phone className="w-4 h-4" />
                09669361290
              </a>
              <a href="mailto:support@atharvahealthsolutions.com" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Mail className="w-4 h-4" />
                support@atharvahealthsolutions.com
              </a>
              <a href="http://atharvahealthsolutions.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <span className="w-4 h-4 text-center">🌐</span>
                atharvahealthsolutions.com
              </a>
              <div className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Atharva Health Solution, Dunda Seoni, Seoni, Madhya Pradesh – 480661, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-ayurveda-gold hover:text-ayurveda-brown transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    onClick={handleLinkClick}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Health Concerns */}
          <div>
            <h4 className="font-semibold mb-4">Health Concerns</h4>
            <ul className="space-y-2">
              {footerLinks.health.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    onClick={handleLinkClick}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    onClick={handleLinkClick}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    onClick={handleLinkClick}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p>© {currentYear} Atharva Health Solutions. All rights reserved.</p>
              <p className="text-xs">
                Website Developed by{' '}
                <a 
                  href="https://rknagpureweb.vercel.app" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors font-medium underline"
                >
                  Rakesh Nagpure
                </a>{' '}
                <a 
                  href="tel:+917581982414" 
                  className="hover:text-primary-foreground transition-colors"
                >
                  7581982414
                </a>
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/privacy" onClick={handleLinkClick} className="hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" onClick={handleLinkClick} className="hover:text-primary-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/refund-policy" onClick={handleLinkClick} className="hover:text-primary-foreground transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

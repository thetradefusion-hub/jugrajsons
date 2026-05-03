import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin, ShieldCheck, Leaf, TestTube2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const year = new Date().getFullYear();
  const logoSrc = '/WhatsApp%20Image%202026-03-21%20at%203.15.06%20PM.jpeg';

  const quickLinks = [
    { label: 'Shop All Honey', href: '/products' },
    { label: 'About Us', href: '/about' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Contact', href: '/contact' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Returns', href: '/returns' },
    { label: 'Shipping', href: '/shipping' },
  ];

  return (
    <footer className="border-t border-[#E6A817]/20 bg-[#2B1D0E] text-[#F5E9D7]">
      <div className="border-b border-[#E6A817]/20">
        <div className="container-custom grid gap-4 py-6 md:grid-cols-3">
          <div className="flex items-center gap-2 rounded-xl bg-[#F5E9D7]/5 px-4 py-3 text-sm">
            <Leaf className="h-4 w-4 text-[#E6A817]" />
            100% Raw and Natural
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#F5E9D7]/5 px-4 py-3 text-sm">
            <ShieldCheck className="h-4 w-4 text-[#E6A817]" />
            No Added Sugar
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#F5E9D7]/5 px-4 py-3 text-sm">
            <TestTube2 className="h-4 w-4 text-[#E6A817]" />
            Purity Focused Batches
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <img src={logoSrc} alt="Jugraj Son's Hive" className="h-12 w-12 rounded-xl object-cover ring-1 ring-[#E6A817]/35" />
              <h3 className="font-display text-2xl">Jugraj Son&apos;s Hive</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#F5E9D7]/80">
              Premium raw forest honey brand from India. Asli shahad ka taste, seedha source se.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-[#E6A817] hover:opacity-90"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
          </div>

          <div>
            <h4 className="font-display text-lg">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-[#F5E9D7]/80 hover:text-[#E6A817]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-[#F5E9D7]/80 hover:text-[#E6A817]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg">Stay Connected</h4>
            <div className="mt-3 space-y-2 text-sm text-[#F5E9D7]/85">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#E6A817]" /> 9826124108</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#E6A817]" /> connect@jugrajsonshive.com</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#E6A817]" /> India</p>
            </div>
            <div className="mt-4">
              <p className="mb-2 text-xs uppercase tracking-wider text-[#F5E9D7]/60">Get updates</p>
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email"
                  className="h-10 border-[#E6A817]/30 bg-[#F5E9D7]/10 text-[#F5E9D7] placeholder:text-[#F5E9D7]/50"
                />
                <Button className="h-10 bg-[#E6A817] px-4 text-[#2B1D0E] hover:bg-[#d79c15]">
                  Join
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#E6A817]/20">
        <div className="container-custom py-4 text-center text-xs text-[#F5E9D7]/70">
          © {year} Jugraj Son&apos;s Hive. Premium Raw Forest Honey.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/seo/SEO';
import { cn } from '@/lib/utils';

const MAPS_SHORT_URL = 'https://maps.app.goo.gl/sBUffs9sdixwZGvV8?g_st=awb';
const ADDRESS_FULL =
  'Subhash Nagar, Dheemartola, Budhi, Balaghat, Madhya Pradesh 481001';
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_FULL)}&output=embed&z=15`;

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

type ContactInfoItem = {
  icon: typeof Phone;
  title: string;
  content: string;
  detail?: string;
  link: string | null;
  description: string;
};

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Message Sent!',
        description: 'Thank you for contacting us. We will get back to you soon.',
      });

      reset();
    } catch (error: unknown) {
      const msg =
        error && typeof error === 'object' && 'response' in error
          ? String((error as { response?: { data?: { message?: string } } }).response?.data?.message)
          : '';
      toast({
        title: 'Error',
        description: msg || 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo: ContactInfoItem[] = [
    {
      icon: Phone,
      title: 'Phone',
      content: '9826124108',
      link: 'tel:+919826124108',
      description: 'Mon–Sat, 9 AM – 7 PM',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'connect@jugrajsonshive.com',
      link: 'mailto:connect@jugrajsonshive.com',
      description: 'We reply within 24 hours',
    },
    {
      icon: MapPin,
      title: 'Address',
      content: "Jugraj Son's Hive",
      detail: ADDRESS_FULL,
      link: MAPS_SHORT_URL,
      description: 'Open in Google Maps for directions',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Monday – Saturday',
      link: null,
      description: '9:00 AM – 7:00 PM IST',
    },
  ];

  const quickLinks = [
    { label: 'Order Support', href: '/orders' },
    { label: 'Product Inquiry', href: '/products' },
    { label: 'FAQs', href: '/faqs' },
  ];

  const cardSurface = cn(
    'rounded-2xl border border-[#E6A817]/25 bg-white shadow-[0_10px_28px_rgba(43,29,14,0.06)]',
    'md:rounded-3xl',
  );

  return (
    <>
      <SEO
        title="Contact Us - Jugraj Son's Hive"
        description="Get in touch with Jugraj Son's Hive — Balaghat, Madhya Pradesh. Product inquiries, order support, and bulk raw honey."
      />
      <main className="min-h-screen overflow-x-hidden bg-[#F5E9D7] pb-24 text-[#2B1D0E] md:pb-12">
        <section className="relative isolate overflow-hidden border-b border-[#E6A817]/20 bg-gradient-to-br from-[#F5E9D7] via-[#fff8ed] to-[#f0e1cb]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background:radial-gradient(circle_at_1px_1px,#1F3D2B_1px,transparent_0)] [background-size:22px_22px]" />
          <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-[#E6A817]/20 blur-3xl" />
          <div className="container-custom relative py-8 md:py-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mx-auto max-w-2xl text-center"
            >
              <Badge className="border-0 bg-[#2B1D0E] px-3 py-1 text-[10px] text-[#F5E9D7] md:text-xs">
                Jugraj Son&apos;s Hive
              </Badge>
              <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-[#2B1D0E] md:text-4xl lg:text-[2.5rem]">
                Contact Us
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[#2B1D0E]/75 md:text-base">
                Sawal ho, order support chahiye ho, ya bulk inquiry — hum yahin hain. Message bhejiye, jald jawab
                denge.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container-custom py-8 md:py-10">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
            <div className="lg:col-span-2">
              <Card className={cn(cardSurface, 'border-2 border-[#E6A817]/20')}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-display text-xl text-[#2B1D0E] md:text-2xl">
                    <MessageSquare className="h-5 w-5 text-[#1F3D2B]" />
                    Send us a message
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[#2B1D0E]/80">
                          Full name *
                        </Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          {...register('name')}
                          className={cn(
                            'rounded-xl border-[#E6A817]/30 bg-white/90 text-[#2B1D0E] placeholder:text-[#2B1D0E]/40',
                            errors.name && 'border-destructive',
                          )}
                        />
                        {errors.name && (
                          <p className="flex items-center gap-1 text-sm text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#2B1D0E]/80">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          {...register('email')}
                          className={cn(
                            'rounded-xl border-[#E6A817]/30 bg-white/90 text-[#2B1D0E] placeholder:text-[#2B1D0E]/40',
                            errors.email && 'border-destructive',
                          )}
                        />
                        {errors.email && (
                          <p className="flex items-center gap-1 text-sm text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-[#2B1D0E]/80">
                          Phone *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="9826124108"
                          {...register('phone')}
                          className={cn(
                            'rounded-xl border-[#E6A817]/30 bg-white/90 text-[#2B1D0E] placeholder:text-[#2B1D0E]/40',
                            errors.phone && 'border-destructive',
                          )}
                        />
                        {errors.phone && (
                          <p className="flex items-center gap-1 text-sm text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-[#2B1D0E]/80">
                          Subject *
                        </Label>
                        <Input
                          id="subject"
                          placeholder="Product inquiry"
                          {...register('subject')}
                          className={cn(
                            'rounded-xl border-[#E6A817]/30 bg-white/90 text-[#2B1D0E] placeholder:text-[#2B1D0E]/40',
                            errors.subject && 'border-destructive',
                          )}
                        />
                        {errors.subject && (
                          <p className="flex items-center gap-1 text-sm text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            {errors.subject.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-[#2B1D0E]/80">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help..."
                        rows={6}
                        {...register('message')}
                        className={cn(
                          'rounded-xl border-[#E6A817]/30 bg-white/90 text-[#2B1D0E] placeholder:text-[#2B1D0E]/40',
                          errors.message && 'border-destructive',
                        )}
                      />
                      {errors.message && (
                        <p className="flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full rounded-full bg-[#E6A817] font-semibold text-[#2B1D0E] shadow-md hover:bg-[#d89c14]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-5">
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * index }}
                  >
                    <Card className={cn(cardSurface, 'transition-shadow hover:shadow-[0_14px_32px_rgba(43,29,14,0.09)]')}>
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1F3D2B]/10">
                            <info.icon className="h-5 w-5 text-[#1F3D2B]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-display font-semibold text-[#2B1D0E]">{info.title}</h3>
                            {info.link ? (
                              <a
                                href={info.link}
                                target={info.link.startsWith('http') ? '_blank' : undefined}
                                rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="mt-1 block text-sm font-medium text-[#1F3D2B] underline-offset-4 hover:underline"
                              >
                                <span className="block">{info.content}</span>
                                {info.detail ? (
                                  <span className="mt-1 block text-xs font-normal leading-snug text-[#2B1D0E]/80">
                                    {info.detail}
                                  </span>
                                ) : null}
                              </a>
                            ) : (
                              <p className="mt-1 text-sm font-medium text-[#2B1D0E]">{info.content}</p>
                            )}
                            <p className="mt-1 text-xs text-[#2B1D0E]/60">{info.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className={cn(cardSurface)}>
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-base text-[#2B1D0E]">Quick links</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {quickLinks.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.href}
                          className="flex items-center gap-2 text-sm text-[#1F3D2B] underline-offset-4 hover:underline"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#E6A817]" />
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-2 border-[#E6A817]/30 bg-[#fff9ef] md:rounded-3xl">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1F3D2B]" />
                    <div>
                      <h3 className="font-display font-semibold text-[#2B1D0E]">Quick response</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#2B1D0E]/75">
                        Business days par aksar 24 ghante ke andar jawab. Jaldi ke liye seedha call karein.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-10 md:mt-12">
            <Card className={cn(cardSurface, 'border-2 border-[#E6A817]/20')}>
              <CardHeader className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center gap-2 font-display text-xl text-[#2B1D0E] md:text-2xl">
                  <MapPin className="h-5 w-5 text-[#1F3D2B]" />
                  Find us
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full shrink-0 rounded-full border-[#E6A817]/40 bg-white text-[#2B1D0E] hover:bg-[#fff9ef] sm:w-auto"
                  asChild
                >
                  <a href={MAPS_SHORT_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in Google Maps
                  </a>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-[#2B1D0E]/80">
                  <span className="font-semibold text-[#2B1D0E]">Address:</span> {ADDRESS_FULL}
                </p>
                <div className="overflow-hidden rounded-2xl border border-[#E6A817]/25 bg-[#fffaf2] shadow-inner">
                  <iframe
                    title="Jugraj Son's Hive — Balaghat"
                    src={MAP_EMBED_SRC}
                    className="aspect-[16/10] min-h-[220px] w-full sm:min-h-[280px] md:aspect-video"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;

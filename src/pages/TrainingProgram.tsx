import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/seo/SEO';
import { TrainingGallery } from '@/components/training/TrainingGallery';

const highlights = [
  { title: 'हाथों से सीखें', text: 'बीहाइव, फ्रेम और मधुमक्खी क्लस्टर पर सीधा प्रैक्टिकल' },
  { title: 'सुरक्षा पहले', text: 'सूट, वेल, ग्लव्स और सुरक्षित हैंडलिंग तकनीक' },
  { title: 'व्यावसायिक सेटअप', text: 'बी बॉक्स, अपियरी लेआउट और उत्पादन प्रबंधन' },
  { title: 'मार्गदर्शन', text: 'अनुभवी ट्रेनर्स के साथ फील्ड विज़िट और सेशन' },
];

const TrainingProgram = () => {
  return (
    <>
      <SEO
        title="Beekeeping Training Program — Jugraj Son's Hive"
        description="मधुमक्खी पालन प्रशिक्षण कार्यक्रम — व्यावहारिक फील्ड ट्रेनिंग, बीहाइव हैंडलिंग और व्यावसायिक अपियरी सेटअप।"
      />
      <main className="min-h-screen overflow-x-hidden bg-[#F5E9D7] pb-24 text-[#2B1D0E] md:pb-12">
        <section className="relative isolate overflow-hidden border-b border-[#E6A817]/20 bg-gradient-to-br from-[#F5E9D7] via-[#fff8ed] to-[#f0e1cb]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background:radial-gradient(circle_at_1px_1px,#1F3D2B_1px,transparent_0)] [background-size:22px_22px]" />
          <div className="container-custom relative py-8 md:py-12">
            <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-[#2B1D0E]/65 md:text-sm">
              <Link to="/" className="hover:text-[#1F3D2B]">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
              <span className="font-medium text-[#2B1D0E]">Training Program</span>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mx-auto max-w-3xl text-center"
            >
              <Badge className="border-0 bg-[#1F3D2B] px-3 py-1 text-[10px] text-[#F5E9D7] md:text-xs">
                मधुमक्खी पालन प्रशिक्षण
              </Badge>
              <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-[#2B1D0E] md:text-4xl lg:text-[2.75rem]">
                Beekeeping Training Program
              </h1>
              <p className="font-devanagari mt-3 text-sm leading-relaxed text-[#2B1D0E]/75 md:text-base" lang="hi">
                जुगराज संस हाइव के साथ मैदान पर मधुमक्खी पालन सीखें — थ्योरी से ज़्यादा हाथों-हाथ अनुभव।
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-[#E6A817] px-6 font-semibold text-[#2B1D0E] hover:bg-[#d89c14]"
                >
                  <a href="tel:+919826124108">
                    <Phone className="mr-2 h-4 w-4" />
                    Enquire: 9826124108
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-[#1F3D2B]/35 bg-white/80 text-[#1F3D2B] hover:bg-[#fff9ef]"
                >
                  <Link to="/services/beekeeping-training">
                    Training service <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-8 md:py-10">
          <div className="container-custom">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <Card className="h-full rounded-2xl border border-[#E6A817]/20 bg-white/90">
                    <CardContent className="p-4 md:p-5">
                      <h3 className="font-display text-lg font-semibold text-[#2B1D0E]" lang="hi">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#2B1D0E]/72" lang="hi">
                        {item.text}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <TrainingGallery />

        <section className="border-t border-[#E6A817]/15 py-10 md:py-12">
          <div className="container-custom text-center">
            <p className="text-sm text-[#2B1D0E]/75 md:text-base" lang="hi">
              प्रशिक्षण में भाग लेने या बैच की जानकारी के लिए संपर्क करें।
            </p>
            <Button asChild size="lg" className="mt-5 rounded-full bg-[#1F3D2B] text-[#F5E9D7] hover:bg-[#2a523c]">
              <Link to="/contact">
                Contact us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default TrainingProgram;

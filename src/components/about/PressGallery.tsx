import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';

/** Newspaper clipping images from /public — builds trust on About Us */
const CLIPPINGS: { src: string; alt: string }[] = [
  {
    src: '/1.jpeg',
    alt: 'समाचार पत्र कतरन — लोकेश गजाम व जुगराज संस हाइव पर मधुमक्खी पालन की सफलता',
  },
  {
    src: '/2.jpeg',
    alt: 'हिंदी समाचार पत्र में फीचर — इंजीनियरिंग के बाद शुद्ध शहद और प्रकृति से जुड़ाव',
  },
  {
    src: '/3.jpeg',
    alt: 'अखबार रिपोर्ट — मधुमक्खी पालन, उत्पादन और जुगराज संस हाइव ब्रांड',
  },
  {
    src: '/4.jpeg',
    alt: 'चिल्लौद व बालाघाट समाचार — लोकेश गजाम की प्रेरणादायक उद्यमिता कहानी',
  },
  {
    src: '/5.jpeg',
    alt: 'पत्रिका में प्रकाशित — ग्रामीण मधुमक्खी पालन और शुद्ध शहद',
  },
  {
    src: '/6.jpeg',
    alt: 'समाचार कवरेज — इंजीनियरिंग के बाद मधुमक्खी पालन में करियर',
  },
  {
    src: '/7.jpeg',
    alt: 'भास्कर समाचार — शुद्ध शहद उद्यम व मधुमक्खी पालन की सफलता',
  },
  {
    src: '/8.jpeg',
    alt: 'प्रेस फीचर — जुगराज संस हाइव, शुद्ध शहद व जैविक खेती संबंधी रिपोर्ट',
  },
];

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.4, delay: Math.min(i * 0.05, 0.35) },
});

export function PressGallery() {
  return (
    <section className="relative border-y border-[#E6A817]/15 bg-white py-10 md:py-14">
      <div className="container-custom">
        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-[#E6A817]/30 bg-[#fff9ef] px-3 py-1 text-xs font-medium text-[#2B1D0E]/80">
            <Newspaper className="h-3.5 w-3.5 text-[#1F3D2B]" aria-hidden />
            <span lang="hi">समाचार व विश्वास</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[#2B1D0E] md:text-3xl" lang="hi">
            अखबारों में दर्ज हमारी कहानी
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#2B1D0E]/72 md:text-base" lang="hi">
            स्थानीय व क्षेत्रीय समाचार पत्रों ने बालाघाट, चंद्रपुर व आसपास की मधुमक्खी पालन यात्रा को कवर किया है। ये कतरनें साबित करती हैं कि{' '}
            <span className="font-semibold text-[#2B1D0E]/90">Jugraj Son&apos;s Hive</span> सिर्फ एक ब्रांड नहीं — एक सच्ची, जमीन से जुड़ी पहल है।
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {CLIPPINGS.map((item, i) => (
            <motion.figure
              key={item.src}
              {...fadeUp(i)}
              className="group overflow-hidden rounded-2xl border border-[#E6A817]/20 bg-[#faf8f5] shadow-[0_8px_24px_rgba(43,29,14,0.06)] transition-all duration-300 hover:border-[#E6A817]/40 hover:shadow-[0_14px_32px_rgba(43,29,14,0.1)]"
            >
              <a
                href={item.src}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E6A817] focus-visible:ring-offset-2"
                aria-label={`पूर्ण आकार में खोलें — ${item.alt}`}
              >
                <div className="aspect-[4/5] w-full sm:aspect-[3/4] md:aspect-[4/5]">
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain object-center p-1.5 transition-transform duration-300 group-hover:scale-[1.02] sm:p-2"
                  />
                </div>
                <figcaption className="border-t border-[#E6A817]/15 bg-white/90 px-2 py-2 text-center">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#2B1D0E]/45">
                    प्रेस कवरेज · {i + 1}/8
                  </span>
                </figcaption>
              </a>
            </motion.figure>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-[#2B1D0E]/55 md:text-sm" lang="hi">
          फोटो पर टैप करके मूल आकार में नई टैब में खोल सकते हैं। ये सभी सार्वजनिक समाचार प्रकाशनों से संबंधित कतरनें हैं।
        </p>
      </div>
    </section>
  );
}

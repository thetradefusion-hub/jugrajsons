import { motion } from 'framer-motion';
import { GraduationCap, Video } from 'lucide-react';
import { trainingProgramPhotos, trainingProgramVideos } from '@/data/trainingProgram';

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.4, delay: Math.min(i * 0.05, 0.35) },
});

export function TrainingGallery() {
  return (
    <section className="relative border-y border-[#E6A817]/15 bg-white py-10 md:py-14">
      <div className="container-custom">
        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-[#E6A817]/30 bg-[#fff9ef] px-3 py-1 text-xs font-medium text-[#2B1D0E]/80">
            <GraduationCap className="h-3.5 w-3.5 text-[#1F3D2B]" aria-hidden />
            <span lang="hi">फील्ड ट्रेनिंग</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[#2B1D0E] md:text-3xl" lang="hi">
            प्रशिक्षण के झलकियाँ
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#2B1D0E]/72 md:text-base" lang="hi">
            वीडियो और फोटो — बीहाइव हैंडलिंग, सुरक्षा गियर और व्यावसायिक सेटअप मैदान पर।
          </p>
        </div>

        <div className="mb-10 md:mb-12">
          <div className="mb-5 flex items-center justify-center gap-2 text-sm font-medium text-[#2B1D0E]/80">
            <Video className="h-4 w-4 text-[#1F3D2B]" aria-hidden />
            <span lang="hi">प्रशिक्षण वीडियो</span>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {trainingProgramVideos.map((video, i) => (
              <motion.figure
                key={video.src}
                {...fadeUp(i)}
                className="overflow-hidden rounded-2xl border border-[#E6A817]/25 bg-[#faf8f5] shadow-[0_8px_24px_rgba(43,29,14,0.06)]"
              >
                <video
                  src={encodeURI(video.src)}
                  controls
                  playsInline
                  preload="metadata"
                  className="block h-auto w-full max-h-[min(85vh,720px)] bg-black object-contain"
                  aria-label={video.title}
                />
                <figcaption className="px-4 py-3 text-center text-sm font-medium text-[#2B1D0E]/80" lang="hi">
                  {video.title}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>

        <div className="mb-5 text-center text-sm font-medium text-[#2B1D0E]/80" lang="hi">
          प्रशिक्षण फोटो
        </div>
        <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:gap-5">
          {trainingProgramPhotos.map((item, i) => (
            <motion.figure
              key={item.src}
              {...fadeUp(i + trainingProgramVideos.length)}
              className="overflow-hidden rounded-2xl border border-[#E6A817]/20 bg-[#faf8f5] shadow-[0_8px_24px_rgba(43,29,14,0.06)]"
            >
              <a
                href={encodeURI(item.src)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E6A817] focus-visible:ring-offset-2"
                aria-label={`पूर्ण आकार में खोलें — ${item.alt}`}
              >
                <img
                  src={encodeURI(item.src)}
                  alt={item.alt}
                  className="block h-auto w-full max-w-full object-contain"
                  loading="lazy"
                />
              </a>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

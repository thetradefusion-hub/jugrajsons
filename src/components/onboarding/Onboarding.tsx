import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Shield, Heart, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    icon: Leaf,
    title: "Pure Ayurvedic Products",
    description: "Discover 100% natural remedies crafted from ancient Vedic wisdom for modern wellness",
    gradient: "from-emerald-500 to-teal-600",
    bgPattern: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)",
  },
  {
    icon: Shield,
    title: "Certified & Trusted",
    description: "GMP certified manufacturing with quality tested ingredients you can trust",
    gradient: "from-amber-500 to-orange-600",
    bgPattern: "radial-gradient(circle at 70% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)",
  },
  {
    icon: Heart,
    title: "Expert Consultations",
    description: "Connect with certified Ayurvedic doctors for personalized health guidance",
    gradient: "from-rose-500 to-pink-600",
    bgPattern: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)",
  },
  {
    icon: Sparkles,
    title: "Start Your Journey",
    description: "Join millions who trust Atharva Health for their wellness needs",
    gradient: "from-violet-500 to-purple-600",
    bgPattern: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)",
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col"
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} flex flex-col`}
          style={{ backgroundImage: slide.bgPattern }}
        >
          {/* Skip button */}
          <div className="flex justify-end p-4 pt-6">
            <Button
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10"
              onClick={onComplete}
            >
              Skip
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center text-white">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-2xl"
            >
              <Icon className="w-16 h-16 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold font-display mb-4"
            >
              {slide.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-white/90 max-w-sm"
            >
              {slide.description}
            </motion.p>
          </div>

          {/* Bottom section */}
          <div className="p-8 pb-12">
            {/* Dots */}
            <div className="flex justify-center gap-2 mb-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 bg-white"
                      : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            {/* Action button */}
            <Button
              onClick={nextSlide}
              className="w-full h-14 bg-white text-gray-900 hover:bg-white/90 text-lg font-semibold rounded-2xl shadow-lg"
            >
              {currentSlide === slides.length - 1 ? (
                <>
                  Get Started <Sparkles className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Continue <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Onboarding;

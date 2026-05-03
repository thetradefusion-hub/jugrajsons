import { motion } from 'framer-motion';

/**
 * Full-screen intro shown on storefront load. Uses /logo1.png — dark backdrop matches premium gold-on-black artwork.
 */
export function BrandPreloader() {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label="Jugraj Son's Hive loading"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-b from-[#060504] via-[#0f0d0a] to-[#060504]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% 42%, rgba(230, 168, 23, 0.14) 0%, transparent 58%)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[1] flex flex-col items-center px-6"
      >
        <motion.img
          src="/logo1.png"
          alt="Jugraj Son's Hive Honey — logo"
          draggable={false}
          className="mx-auto h-auto w-[min(88vw,360px)] max-w-[400px] select-none object-contain drop-shadow-[0_4px_48px_rgba(230,168,23,0.22)]"
          animate={{
            scale: [1, 1.045, 1],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 flex gap-1"
          aria-hidden
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[#E6A817]"
              animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1, 0.85] }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                delay: i * 0.18,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </motion.div>
      <span className="sr-only">Loading website…</span>
    </motion.div>
  );
}

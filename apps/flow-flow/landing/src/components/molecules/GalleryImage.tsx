import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface GalleryImageProps {
  src: string;
  alt: string;
  index?: number;
}

export function GalleryImage({ src, alt, index = 0 }: GalleryImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        'group relative aspect-square overflow-hidden rounded-lg bg-neutral-800',
      )}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
}

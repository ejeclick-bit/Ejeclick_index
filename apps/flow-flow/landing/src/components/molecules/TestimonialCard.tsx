import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  index?: number;
}

export function TestimonialCard({ quote, author, role, index = 0 }: TestimonialCardProps) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={cn(
        'relative rounded-xl border border-neutral-800 bg-brand-surface p-6',
      )}
    >
      <svg className="mb-3 h-6 w-6 text-brand-gold/40" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      <blockquote className="text-sm leading-relaxed text-neutral-300">
        {quote}
      </blockquote>
      <figcaption className="mt-4 border-t border-neutral-800 pt-4">
        <div className="font-medium text-white">{author}</div>
        {role && <div className="text-xs text-neutral-500">{role}</div>}
      </figcaption>
    </motion.figure>
  );
}

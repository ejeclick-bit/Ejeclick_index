import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  price: string;
  index?: number;
}

export function ServiceCard({ icon, title, description, price, index = 0 }: ServiceCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'group relative rounded-xl border border-neutral-800 bg-brand-surface p-6 transition-all duration-300',
        'hover:border-brand-gold/40 hover:shadow-lg hover:shadow-brand-gold/5',
      )}
    >
      <span className="mb-4 block text-3xl">{icon}</span>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-neutral-400">{description}</p>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-md bg-brand-gold/10 px-3 py-1 text-sm font-medium text-brand-gold-light">
          {price}
        </span>
      </div>
    </motion.article>
  );
}

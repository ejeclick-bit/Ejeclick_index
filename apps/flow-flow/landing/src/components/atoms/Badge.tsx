import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'outline';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'gold', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wider uppercase',
          variant === 'gold' && 'bg-brand-gold/15 text-brand-gold-light',
          variant === 'outline' && 'border border-brand-gold/30 text-brand-gold-light',
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);
Badge.displayName = 'Badge';

export { Badge };

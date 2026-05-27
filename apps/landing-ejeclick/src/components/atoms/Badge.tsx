import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glow' | 'outline';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors focus:outline-none";
    
    const variants = {
      default: "bg-bg-elevated text-text-primary border border-white/10",
      glow: "bg-accent-primary/10 text-accent-primary border border-accent-primary/20 shadow-[0_0_10px_hsla(217,91%,60%,0.2)]",
      outline: "text-text-primary border border-white/20"
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Badge.displayName = "Badge";

export { Badge };

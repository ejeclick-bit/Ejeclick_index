import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glowOnHover?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glowOnHover = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-card overflow-hidden",
          glowOnHover ? "hover:border-accent-primary/30 hover:shadow-glow-primary" : "",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };

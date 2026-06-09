import { type AnchorHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { type LucideIcon } from 'lucide-react';

export interface SocialLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: LucideIcon;
  label: string;
}

export function SocialLink({ icon: Icon, label, className, ...props }: SocialLinkProps) {
  return (
    <a
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 text-text-secondary transition-all hover:bg-foreground/10 hover:text-accent-primary hover:shadow-glow-primary hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-accent-primary",
        className
      )}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}

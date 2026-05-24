import { type HTMLAttributes, type ElementType, createElement } from 'react';
import { cn } from '@/utils/cn';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' | 'lead';
  gradient?: boolean;
}

export function Typography({
  className,
  as,
  variant = 'p',
  gradient = false,
  children,
  ...props
}: TypographyProps) {
  const Component = (as || (['h1', 'h2', 'h3', 'h4'].includes(variant) ? variant : 'p')) as ElementType;

  const variants = {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    h4: "scroll-m-20 text-xl font-semibold tracking-tight",
    p: "leading-7 text-text-secondary",
    small: "text-sm font-medium leading-none text-text-muted",
    lead: "text-xl text-text-secondary",
  };

  return createElement(
    Component,
    { className: cn(variants[variant], gradient && "text-gradient", className), ...props },
    children,
  );
}

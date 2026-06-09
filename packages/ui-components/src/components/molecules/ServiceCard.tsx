import { Typography } from '../atoms/Typography';
import { GlassCard } from '../molecules/GlassCard';
import { cn } from '../../utils/cn';

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: any;
  colSpan?: 1 | 2;
  highlightColor?: 'primary' | 'secondary' | 'tertiary';
  price?: string;
}

export function ServiceCard({
  title,
  description,
  icon: Icon,
  colSpan = 1,
  highlightColor = 'primary',
  price,
}: ServiceCardProps) {
  
  const colorMap = {
    primary: "text-accent-primary bg-accent-primary/10",
    secondary: "text-accent-secondary bg-accent-secondary/10",
    tertiary: "text-accent-tertiary bg-accent-tertiary/10",
  };

  return (
    <GlassCard 
      className={cn(
        "flex flex-col p-8 h-full",
        colSpan === 2 && "md:col-span-2"
      )}
    >
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", colorMap[highlightColor])}>
        <Icon className="w-7 h-7" />
      </div>
      <Typography variant="h3" className="mb-3 text-foreground">
        {title}
      </Typography>
      <Typography className="text-text-secondary leading-relaxed flex-grow">
        {description}
      </Typography>
      {price && (
        <div className="mt-6 pt-6 border-t border-white/5 font-semibold text-accent-primary">
          {price}
        </div>
      )}
    </GlassCard>
  );
}

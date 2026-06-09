import { motion } from 'framer-motion';
import { Typography } from '@ejeclick/ui-components';
import { GlassCard } from '@ejeclick/ui-components';
import { Check, X } from 'lucide-react';

const metrics = [
  { value: "< 2.4s", label: "Tiempo de Carga (LCP)" },
  { value: "95+", label: "Lighthouse Score" },
  { value: "7 Días", label: "Tiempo de Lanzamiento" },
];

export function SocialProofSection() {
  return (
    <section id="casos" className="py-24 relative w-full z-10 bg-bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="text-center py-10" glowOnHover={false}>
                <Typography variant="h2" className="text-gradient text-5xl mb-2">
                  {metric.value}
                </Typography>
                <Typography className="text-text-secondary font-medium uppercase tracking-wider text-sm">
                  {metric.label}
                </Typography>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Typography variant="h2" className="text-foreground mb-4">
              Por qué <span className="text-gradient">EjeClick</span>
            </Typography>
          </div>

          <GlassCard className="p-0 overflow-hidden" glowOnHover={false}>
            <div role="table" aria-label="Comparativa EjeClick vs Agencias Tradicionales">
              <div role="row" className="grid grid-cols-2 bg-foreground/5 border-b border-white/10">
                <div role="columnheader" className="p-6 text-center">
                  <Typography className="font-semibold text-text-secondary text-lg">Agencias Tradicionales</Typography>
                </div>
                <div role="columnheader" className="p-6 text-center bg-accent-primary/10">
                  <Typography className="font-bold text-accent-primary text-lg">EjeClick</Typography>
                </div>
              </div>

              <div role="rowgroup" className="divide-y divide-white/5">
                {[
                  { label: "Tiempo de entrega", bad: "Semanas o Meses", good: "Menos de 7 días" },
                  { label: "Performance Web", bad: "Lento y sobrecargado", good: "Score >95 garantizado" },
                  { label: "Diseño y UX", bad: "Plantillas genéricas", good: "Premium & Custom UI" },
                  { label: "Transparencia", bad: "Costos ocultos", good: "Suscripciones Claras" },
                ].map((row, i) => (
                  <div key={i} role="row" className="grid grid-cols-2 relative">
                    <div role="cell" className="p-6 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3">
                      <X className="w-5 h-5 text-red-500 shrink-0" aria-hidden="true" />
                      <Typography className="text-text-muted text-sm sm:text-base text-center sm:text-left">{row.bad}</Typography>
                    </div>
                    <div role="cell" className="p-6 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 bg-accent-primary/5">
                      <Check className="w-5 h-5 text-accent-primary shrink-0" aria-hidden="true" />
                      <Typography className="text-foreground font-medium text-sm sm:text-base text-center sm:text-left">{row.good}</Typography>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

      </div>
    </section>
  );
}

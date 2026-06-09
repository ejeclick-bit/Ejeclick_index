import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@ejeclick/ui-components';
import { Button } from '@ejeclick/ui-components';
import { Badge } from '@ejeclick/ui-components';
import { scrollToSection } from '@/utils/lenis';

const Scene3D = lazy(() =>
  import('@/components/three/Scene3D').then((m) => ({ default: m.Scene3D }))
);

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 h-full min-h-[calc(100vh-8rem)]">
        
        {/* Left: Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge variant="glow" className="mb-6">
              <span className="mr-2">🚀</span> +50 negocios digitalizados
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl"
          >
            <Typography variant="h1" className="mb-6 text-left">
              Tu negocio local en Internet, <span className="text-gradient">vendiendo en automático.</span>
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl"
          >
            <Typography variant="lead" className="mb-10 text-left">
              Llevamos tecnología real a pequeñas empresas para que vendan y envíen en automático. Sin tecnicismos, sin promesas falsas, solo herramientas que funcionan.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 items-start"
          >
            <Button size="lg" variant="primary" onClick={() => scrollToSection('#contacto')}>
              Digitalizar mi Negocio
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToSection('#servicios')}>
              Ver Demo Interactiva
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 flex items-center gap-2 text-sm font-medium text-text-muted"
          >
            <svg className="w-4 h-4 text-accent-primary" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Sin contratos forzosos
            <span className="mx-2" aria-hidden="true">•</span>
            <svg className="w-4 h-4 text-accent-primary" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Diagnóstico inicial gratuito
          </motion.div>
        </div>

        {/* Right: 3D Scene */}
        <div className="relative w-full lg:w-1/2 h-[400px] lg:h-[500px] xl:h-[600px] z-10 glass-card rounded-3xl border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent pointer-events-none" />
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </div>

      </div>
      
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-bg-primary to-transparent z-10 pointer-events-none" />
    </section>
  );
}

import { motion } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Scene3D } from '@/components/three/Scene3D';

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-20 pb-16">
      {/* 3D Scene Layer (Behind everything) */}
      <Scene3D />

      {/* Aurora Background (Handled globally in App or Layout, but we ensure the container is transparent) */}
      
      {/* Content Overlay */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pointer-events-none">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="pointer-events-auto"
        >
          <Badge variant="glow" className="mb-6">
            <span className="mr-2">🚀</span> +50 negocios digitalizados
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl pointer-events-auto"
        >
          <Typography variant="h1" className="mb-6">
            Tu negocio local en Internet, <span className="text-gradient">vendiendo en automático.</span>
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl pointer-events-auto"
        >
          <Typography variant="lead" className="mb-10">
            Diseñamos tu web profesional y activamos tus campañas en menos de 7 días. Elevamos microempresas a estándares de Silicon Valley.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 items-center pointer-events-auto"
        >
          <Button size="lg" variant="primary">
            Digitalizar mi Negocio
          </Button>
          <Button size="lg" variant="outline">
            Ver Demo Interactiva
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 flex items-center gap-2 text-sm font-medium text-text-muted pointer-events-auto"
        >
          <svg className="w-4 h-4 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Sin contratos forzosos
          <span className="mx-2">•</span>
          <svg className="w-4 h-4 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Diagnóstico inicial gratuito
        </motion.div>
      </div>
      
      {/* Bottom Gradient overlay to blend with next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-bg-primary to-transparent z-10" />
    </section>
  );
}

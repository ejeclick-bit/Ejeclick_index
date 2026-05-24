import { motion } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { Search, PenTool, Code2, Rocket } from 'lucide-react';

const steps = [
  {
    title: "Diagnóstico y Estrategia",
    description: "Analizamos tu negocio, competencia y objetivos. Definimos la arquitectura persuasiva exacta para tu caso.",
    icon: Search,
  },
  {
    title: "Diseño UI/UX",
    description: "Creamos prototipos visuales (Atomic Design) con estética premium de Silicon Valley, orientados 100% a la conversión.",
    icon: PenTool,
  },
  {
    title: "Desarrollo y Código",
    description: "Construimos el frontend y backend usando React, Vite y FastAPI. Optimizamos para que cargue en menos de 2.4s.",
    icon: Code2,
  },
  {
    title: "Lanzamiento y Optimización",
    description: "Desplegamos tu landing page, configuramos analíticas y comenzamos a capturar leads en tiempo real.",
    icon: Rocket,
  },
];

export function ProcessSection() {
  return (
    <section id="proceso" className="py-24 relative w-full z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Typography variant="h2" className="text-white mb-4">
            Proceso de Trabajo <span className="text-gradient">Iterativo</span>
          </Typography>
          <Typography variant="lead" className="text-text-secondary">
            Nuestra metodología probada para transformar ideas en plataformas digitales de alto rendimiento en tiempo récord.
          </Typography>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/10 transform md:-translate-x-1/2" aria-hidden="true" />

          <ol className="space-y-12" role="list">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <li key={index} className="relative flex flex-col md:flex-row items-start md:items-center w-full">
                  {/* Left Side (Empty on odd, Content on even) */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: isEven ? 1 : 0, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`hidden md:block w-1/2 pr-12 text-right ${!isEven && 'invisible'}`}
                    aria-hidden={!isEven}
                  >
                    {isEven && (
                      <>
                        <Typography variant="h3" className="text-white mb-2">{step.title}</Typography>
                        <Typography className="text-text-secondary">{step.description}</Typography>
                      </>
                    )}
                  </motion.div>

                  {/* Center Node */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-bg-card border-4 border-bg-primary z-10 shadow-glow-primary">
                    <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Right Side (Content on odd, Empty on even) */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`w-full md:w-1/2 pl-24 md:pl-12 ${isEven && 'md:invisible'}`}
                  >
                    {/* Mobile content always visible */}
                    <div className="md:hidden" aria-hidden={isEven ? undefined : undefined}>
                      <Typography variant="h3" className="text-white mb-2 text-xl">{step.title}</Typography>
                      <Typography className="text-text-secondary">{step.description}</Typography>
                    </div>

                    {/* Desktop right content */}
                    <div className="hidden md:block" aria-hidden={!isEven ? undefined : true}>
                      {!isEven && (
                        <>
                          <Typography variant="h3" className="text-white mb-2">{step.title}</Typography>
                          <Typography className="text-text-secondary">{step.description}</Typography>
                        </>
                      )}
                    </div>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>

      </div>
    </section>
  );
}

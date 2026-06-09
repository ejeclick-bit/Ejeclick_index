import { motion } from 'framer-motion';
import { Code2, Megaphone, MonitorSmartphone, Rocket, Headphones } from 'lucide-react';
import { Typography } from '@ejeclick/ui-components';
import { ServiceCard } from '@ejeclick/ui-components';

const services = [
  {
    title: "Diseño & Desarrollo Web",
    description: "Sitios web rápidos, responsivos y escalables diseñados para convertir visitantes en clientes. Tecnología real, sin rodeos.",
    icon: Code2,
    colSpan: 2 as const,
    highlightColor: "primary" as const,
  },
  {
    title: "SEO Local",
    description: "Domina las búsquedas en tu ciudad. Hacemos que tu negocio aparezca primero cuando tus clientes te buscan en Google Maps.",
    icon: MonitorSmartphone,
    colSpan: 1 as const,
    highlightColor: "secondary" as const,
  },
  {
    title: "Marketing Digital",
    description: "Campañas de alto rendimiento en Meta y Google Ads, segmentadas quirúrgicamente para tu audiencia ideal.",
    icon: Megaphone,
    colSpan: 1 as const,
    highlightColor: "tertiary" as const,
  },
  {
    title: "Soporte Técnico 24/7",
    description: "Nos encargamos del mantenimiento, hosting y seguridad para que tú solo te preocupes por vender.",
    icon: Headphones,
    colSpan: 1 as const,
    highlightColor: "secondary" as const,
  },
  {
    title: "Landing Pages CRO",
    description: "Páginas de aterrizaje diseñadas con neuromarketing y pruebas A/B para maximizar tu tasa de conversión.",
    icon: Rocket,
    colSpan: 1 as const,
    highlightColor: "primary" as const,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export function ServicesGrid() {
  return (
    <section id="servicios" className="py-24 w-full relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Typography variant="h2" className="text-foreground mb-4 text-4xl">
            Soluciones Tecnológicas de <span className="text-gradient">Alto Impacto</span>
          </Typography>
          <Typography variant="lead" className="text-text-secondary">
            Todo lo que tu negocio necesita para dominar el ecosistema digital, estructurado en un servicio integral.
          </Typography>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className={service.colSpan === 2 ? "md:col-span-2" : "col-span-1"}
            >
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

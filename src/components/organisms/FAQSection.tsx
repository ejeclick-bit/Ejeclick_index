import { Typography } from '@/components/atoms/Typography';
import { AccordionItem } from '@/components/molecules/AccordionItem';

const faqs = [
  {
    question: "¿Cuánto tiempo toma desarrollar la landing page?",
    answer: "Nuestro proceso iterativo nos permite entregar tu landing page de alta conversión en menos de 7 días hábiles, asumiendo que contamos con tu feedback a tiempo durante la fase de diseño."
  },
  {
    question: "¿Tengo que firmar un contrato forzoso a largo plazo?",
    answer: "No. En EjeClick no creemos en atar a nuestros clientes con contratos forzosos. Trabajamos por resultados y proyectos. Si estás contento con el servicio, te quedarás."
  },
  {
    question: "¿Qué incluye el soporte técnico 24/7?",
    answer: "El soporte incluye el hosting de alto rendimiento, renovaciones de dominio, actualizaciones de seguridad, respaldos diarios y asistencia técnica para cualquier eventualidad que sufra el sitio."
  },
  {
    question: "¿El diseño funcionará bien en celulares?",
    answer: "Absolutamente. Desarrollamos bajo el estándar 'Mobile-First', dado que más del 80% del tráfico actual proviene de smartphones. Tu sitio estará hiper-optimizado para móviles."
  },
  {
    question: "¿Cómo hacen para asegurar un Lighthouse Score >95?",
    answer: "Utilizamos un stack moderno (React + Vite) en lugar de constructores pesados (como WordPress/Elementor). Comprimimos recursos agresivamente (WebP) y usamos animaciones de hardware acelerado."
  }
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 relative w-full z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Typography variant="h2" className="text-white mb-4">
            Preguntas Frecuentes
          </Typography>
          <Typography variant="lead" className="text-text-secondary">
            Resolvemos tus dudas principales sobre cómo trabajamos.
          </Typography>
        </div>

        <div className="max-w-3xl mx-auto glass-card p-6 md:p-8">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              question={faq.question} 
              answer={faq.answer} 
              defaultOpen={index === 0}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

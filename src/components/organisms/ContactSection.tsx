import { useState } from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { FormField } from '@/components/molecules/FormField';
import { GlassCard } from '@/components/molecules/GlassCard';

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simular el envío por ahora
    setTimeout(() => {
      setIsSubmitting(false);
      alert("¡Gracias! Te contactaremos en menos de 24 horas.");
    }, 1500);
  };

  return (
    <section id="contacto" className="py-24 relative w-full z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left: Copy */}
          <div className="w-full lg:w-1/2">
            <Typography variant="h2" className="text-white mb-6">
              El primer paso hacia tu <span className="text-gradient">transformación digital</span>
            </Typography>
            <Typography variant="lead" className="text-text-secondary mb-8">
              Completa el formulario y recibe un diagnóstico gratuito de tu presencia digital actual. Sin compromisos.
            </Typography>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-primary/10 text-accent-primary">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <Typography variant="h4" className="text-white text-base">Respuesta Rápida</Typography>
                  <Typography className="text-text-muted text-sm">En menos de 24 horas hábiles</Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full lg:w-1/2">
            <GlassCard className="p-8" glowOnHover={false}>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <FormField 
                  label="Nombre Completo" 
                  type="text" 
                  placeholder="Ej. Juan Pérez" 
                  required 
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField 
                    label="Correo Electrónico" 
                    type="email" 
                    placeholder="juan@correo.com" 
                    required 
                  />
                  <FormField 
                    label="WhatsApp" 
                    type="tel" 
                    placeholder="+57 300 000 0000" 
                    required 
                  />
                </div>
                
                <FormField 
                  label="Tipo de Negocio o Emprendimiento" 
                  type="text" 
                  placeholder="Ej. Clínica Dental, Restaurante, Agencia..." 
                  required 
                />

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  className="w-full mt-2"
                  isLoading={isSubmitting}
                >
                  Solicitar Diagnóstico Gratuito
                </Button>
                
                <Typography className="text-xs text-center text-text-muted mt-2">
                  Tus datos están seguros. No enviamos spam.
                </Typography>
              </form>
            </GlassCard>
          </div>

        </div>

      </div>
    </section>
  );
}

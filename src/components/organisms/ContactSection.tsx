import { useState } from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { FormField } from '@/components/molecules/FormField';
import { GlassCard } from '@/components/molecules/GlassCard';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

interface FormData {
  name: string;
  email: string;
  whatsapp: string;
  business_type: string;
}

const initialForm: FormData = {
  name: '',
  email: '',
  whatsapp: '',
  business_type: '',
};

export function ContactSection() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status !== 'idle') setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail?.[0]?.msg || err.detail || 'Error al enviar el formulario');
      }

      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-24 relative w-full z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          
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

          <div className="w-full lg:w-1/2">
            <GlassCard className="p-8" glowOnHover={false}>
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <FormField
                  label="Nombre Completo"
                  name="name"
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    placeholder="juan@correo.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <FormField
                    label="WhatsApp"
                    name="whatsapp"
                    type="tel"
                    placeholder="+57 300 000 0000"
                    value={form.whatsapp}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <FormField
                  label="Tipo de Negocio o Emprendimiento"
                  name="business_type"
                  type="text"
                  placeholder="Ej. Clínica Dental, Restaurante, Agencia..."
                  value={form.business_type}
                  onChange={handleChange}
                  required
                />

                {status === 'success' && (
                  <div role="alert" className="rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-center">
                    <Typography className="text-green-400 font-medium">
                      ¡Gracias! Te contactaremos en menos de 24 horas.
                    </Typography>
                  </div>
                )}

                {status === 'error' && (
                  <div role="alert" className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-center">
                    <Typography className="text-red-400 font-medium">
                      {errorMessage}
                    </Typography>
                  </div>
                )}

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

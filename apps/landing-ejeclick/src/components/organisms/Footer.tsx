import { Typography } from '@/components/atoms/Typography';
import { SocialLink } from '@/components/molecules/SocialLink';
import { Globe, Briefcase, MessageCircle, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full z-10 border-t border-white/10 bg-bg-secondary/50 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Typography variant="h3" className="font-extrabold tracking-tighter text-white mb-4">
              Eje<span className="text-gradient">Click</span>
            </Typography>
            <Typography className="text-text-secondary max-w-sm mb-6">
              Llevamos tecnología real a pequeñas empresas para que vendan y envíen en automático. Sin tecnicismos, solo herramientas que funcionan.
            </Typography>
            <div className="flex items-center gap-4">
              <SocialLink href="#" icon={Globe} label="Instagram" />
              <SocialLink href="#" icon={Briefcase} label="LinkedIn" />
              <SocialLink href="#" icon={MessageCircle} label="Twitter" />
              <SocialLink href="mailto:hola@ejeclick.com" icon={Mail} label="Email" />
            </div>
          </div>

          <nav aria-label="Servicios">
            <Typography variant="h4" className="text-white text-lg mb-4">Servicios</Typography>
            <ul className="space-y-3">
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">Diseño Web</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">SEO Local</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">Marketing Digital</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">Landing Pages</a></li>
            </ul>
          </nav>

          <nav aria-label="Compañía">
            <Typography variant="h4" className="text-white text-lg mb-4">Compañía</Typography>
            <ul className="space-y-3">
              <li><a href="#proceso" className="text-text-secondary hover:text-accent-primary transition-colors">Proceso</a></li>
              <li><a href="#casos" className="text-text-secondary hover:text-accent-primary transition-colors">Casos de Éxito</a></li>
              <li><a href="#faq" className="text-text-secondary hover:text-accent-primary transition-colors">FAQ</a></li>
              <li><a href="#contacto" className="text-text-secondary hover:text-accent-primary transition-colors">Contacto</a></li>
            </ul>
          </nav>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <Typography className="text-sm text-text-muted">
            &copy; {currentYear} EjeClick. Todos los derechos reservados.
          </Typography>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-text-muted hover:text-white transition-colors">Términos de Servicio</a>
            <a href="#" className="text-sm text-text-muted hover:text-white transition-colors">Política de Privacidad</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}

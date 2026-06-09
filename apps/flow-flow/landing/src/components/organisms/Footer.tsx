import { Container } from '../atoms/Container';
import { useTenant } from '../../lib/tenant';


const socialIcons: Record<string, string> = {
  instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok',
};

export function Footer() {
  const { tenant } = useTenant();
  const t = tenant;
  const social = t?.social || {};

  return (
    <footer className="relative overflow-hidden border-t py-16" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-background)' }}>
      {/* Luz tenue de fondo */}
      <div 
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-40 w-full max-w-2xl rounded-full blur-3xl opacity-10"
        style={{ background: 'var(--theme-accent)' }}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="text-center md:text-left">
            <a href="#" className="inline-flex items-center gap-2 text-xl font-bold tracking-tight no-underline" style={{ color: 'var(--theme-foreground)' }}>
              <span className="text-lg" style={{ color: 'var(--theme-accent)' }}>✦</span> 
              <span className="font-display">{t?.name || 'Barbería'}</span>
            </a>
            <p className="mt-2 max-w-xs text-sm leading-relaxed" style={{ color: 'var(--theme-muted)' }}>
              {t?.description || 'Tradición, estilo y excelencia en cada detalle.'}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 md:items-end">
            <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-foreground)' }}>Síguenos</h4>
            <div className="flex gap-3">
              {Object.entries(social).filter(([, url]) => url).map(([key, url]) => (
                <a 
                  key={key} 
                  href={url as string} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-1"
                  style={{ 
                    borderColor: 'var(--theme-border)', 
                    background: 'var(--theme-card)',
                  }}
                  aria-label={socialIcons[key] || key}
                >
                  <span className="text-sm font-medium transition-colors" style={{ color: 'var(--theme-muted)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-muted)'}>
                    {socialIcons[key] ? socialIcons[key].charAt(0) : key.charAt(0)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center sm:flex sm:items-center sm:justify-between" style={{ borderColor: 'var(--theme-border)' }}>
          <p className="text-xs" style={{ color: 'var(--theme-muted)' }}>
            &copy; {new Date().getFullYear()} {t?.name || 'Barbería'}. Todos los derechos reservados.
          </p>
          <p className="mt-4 text-xs sm:mt-0" style={{ color: 'var(--theme-muted)' }}>
            Powered by <a href="#" className="font-medium hover:underline" style={{ color: 'var(--theme-accent)' }}>EjeClick Flow</a>
          </p>
        </div>
      </Container>
    </footer>
  );
}

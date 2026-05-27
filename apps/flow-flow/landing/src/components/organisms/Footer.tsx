import { Container } from '../atoms/Container';
import { SITE } from '../../lib/data';

const socialIcons: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
};

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-brand-dark py-12">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="text-lg font-bold text-white">
              <span className="text-brand-gold">✦</span> {SITE.name}
            </p>
            <p className="mt-1 text-sm text-neutral-500">{SITE.tagline}</p>
          </div>

          <div className="flex gap-4">
            {Object.entries(SITE.social).map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-neutral-800 px-3 py-2 text-xs text-neutral-400 transition-colors hover:border-brand-gold/40 hover:text-brand-gold-light"
                aria-label={socialIcons[key]}
              >
                {socialIcons[key]}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-800 pt-6 text-center text-xs text-neutral-600">
          &copy; {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  );
}

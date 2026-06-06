import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api, setTenantSlug, type TenantData } from './api';

interface TenantContextType {
  tenant: TenantData | null;
  loading: boolean;
}

const TenantContext = createContext<TenantContextType>({ tenant: null, loading: true });

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('tenant') || undefined;
    api.tenant(slug).then((t) => {
      if (t) {
        setTenantSlug(t.slug);
        
        // Dynamic Title
        document.title = `${t.name} | ${t.tagline}`;
        
        // Dynamic Favicon
        if (t.favicon_url) {
          let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = t.favicon_url;
        }

        const root = document.documentElement;
        Object.entries(t.palette).forEach(([key, value]) => {
          root.style.setProperty(`--brand-${key}`, String(value));
        });
      }
      setTenant(t);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <TenantContext.Provider value={{ tenant, loading: false }}>
      {children}
    </TenantContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTenant() {
  return useContext(TenantContext);
}

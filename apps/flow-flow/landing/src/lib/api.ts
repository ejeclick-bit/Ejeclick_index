export interface Service {
  id: number; name: string; description: string; price: string;
  icon: string; is_active: boolean;
}

export interface GalleryImage {
  id: number; url: string; alt_text: string;
  section_id: number; section_slug: string; section_name: string;
}

export interface Testimonial {
  id: number; quote: string; author: string; role: string; rating: number;
}

export interface Schedule {
  id: number; day_of_week: number; is_active: boolean;
  open_time: string; close_time: string;
}

interface AvailabilityResponse {
  date: string; available: boolean; slots: string[];
}

let _tenantSlug = '';

export function setTenantSlug(slug: string) {
  _tenantSlug = slug;
}

export function getTenantSlug(): string {
  return _tenantSlug;
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {};
  if (_tenantSlug) h['X-Tenant-Slug'] = _tenantSlug;
  return h;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: headers() });
  if (!res.ok) return [] as T;
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  services: () => get<Service[]>('/api/services'),
  schedule: () => get<Schedule[]>('/api/schedule'),
  gallery: (sectionSlug?: string) =>
    get<GalleryImage[]>(`/api/gallery${sectionSlug ? `?section_slug=${sectionSlug}` : ''}`),
  testimonials: () => get<Testimonial[]>('/api/testimonials'),
  availability: (date: string) =>
    fetch(`/api/appointments/availability?date=${date}`, { headers: headers() }).then(r => r.json()) as Promise<AvailabilityResponse>,
  createAppointment: (data: {
    client_name: string; client_phone: string; client_email: string;
    service_id?: number; service_name: string; date: string; time: string;
  }) => post('/api/appointments', data),

  submitTestimonial: (data: { quote: string; author: string; role?: string; rating: number }) => 
    post<Testimonial>('/api/testimonials/public', data),

  cancelAppointment: (id: number, email: string, phone: string) =>
    post<{ id: number; status: string; date: string; time: string }>(
      `/api/appointments/${id}/cancel`,
      { client_email: email, client_phone: phone },
    ),

  searchAppointments: (email: string, phone: string) =>
    post<{ id: number; date: string; time: string; service_name: string; status: string }[]>(
      '/api/appointments/search',
      { client_email: email, client_phone: phone },
    ),

  tenant: (slug?: string) =>
    fetch(`/api/tenant${slug ? `?slug=${slug}` : ''}`, { headers: headers() }).then(r => r.json()) as Promise<TenantData | null>,
};

export interface TenantData {
  id: number; slug: string; name: string; tagline: string;
  description: string; logo_url: string; favicon_url: string;
  hero_image_url: string;  // Imagen de fondo del Hero. Vacía = diseño CSS por defecto
  palette: Record<string, string>;
  whatsapp: string; phone: string; email: string; address: string;
  social: Record<string, string>; is_active: boolean;
}

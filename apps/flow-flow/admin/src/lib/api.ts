const BASE = '';

export class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    let parsedMessage = message;
    try {
      const data = JSON.parse(message);
      parsedMessage = data.detail || data.message || message;
    } catch {
      // Si el servidor devuelve HTML (ej. Nginx 413 Payload Too Large)
      if (status === 413) {
        parsedMessage = 'El archivo es demasiado grande para el servidor (Max 1MB). Usa imágenes más pequeñas.';
      } else {
        parsedMessage = message.length > 100 ? `Error del servidor (${status})` : message;
      }
    }
    super(parsedMessage);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const tenantSlug = localStorage.getItem('tenantSlug') || '';
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(tenantSlug ? { 'X-Tenant-Slug': tenantSlug } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/#/login';
    }
    const text = await res.text().catch(() => 'Error de conexion');
    throw new ApiError(res.status, text || `Error ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  login: (username: string, password: string) =>
    request<{ access_token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getMe: () => request<{ id: number; username: string; name: string; role: string; barbershop_slug?: string }>('/api/auth/me'),

  getDashboard: () =>
    request<{
      today_appointments: number;
      total_services: number;
      pending_appointments: number;
      total_clients: number;
      upcoming_appointments: Appointment[];
    }>('/api/dashboard'),

  listServices: (includeInactive = false) =>
    request<Service[]>(`/api/services?include_inactive=${includeInactive}`),

  createService: (data: Partial<Service>) =>
    request<Service>('/api/services', { method: 'POST', body: JSON.stringify(data) }),

  updateService: (id: number, data: Partial<Service>) =>
    request<Service>(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteService: (id: number) =>
    request<void>(`/api/services/${id}`, { method: 'DELETE' }),

  listAppointments: (status?: string, date?: string) => {
    const params = new URLSearchParams();
    if (status) params.set('status_filter', status);
    if (date) params.set('date_filter', date);
    return request<Appointment[]>(`/api/appointments?${params}`);
  },

  createAppointment: (data: Partial<Appointment>) =>
    request<Appointment>('/api/appointments', { method: 'POST', body: JSON.stringify(data) }),

  updateAppointment: (id: number, data: Partial<Appointment>) =>
    request<Appointment>(`/api/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteAppointment: (id: number) =>
    request<void>(`/api/appointments/${id}`, { method: 'DELETE' }),

  getSchedule: () =>
    request<ScheduleDay[]>('/api/schedule'),

  updateSchedule: (id: number, data: Partial<ScheduleDay>) =>
    request<ScheduleDay>(`/api/schedule/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  listGallery: (sectionSlug?: string) =>
    request<GalleryItem[]>(`/api/gallery${sectionSlug ? `?section_slug=${sectionSlug}` : ''}`),

  uploadImage: async (file: File, altText: string, sectionSlug = 'gallery') => {
    const token = localStorage.getItem('token');
    const tenantSlug = localStorage.getItem('tenantSlug') || '';
    const form = new FormData();
    form.append('file', file);
    form.append('alt_text', altText);
    form.append('section_slug', sectionSlug);
    const res = await fetch(`${BASE}/api/gallery`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(tenantSlug ? { 'X-Tenant-Slug': tenantSlug } : {}),
      },
      body: form,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => 'Error de conexion');
      throw new ApiError(res.status, text);
    }
    return res.json();
  },

  deleteImage: (id: number) => request<void>(`/api/gallery/${id}`, { method: 'DELETE' }),

  reorderImages: (items: { id: number; sort_order: number }[]) => 
    request<void>('/api/gallery/reorder', { method: 'PUT', body: JSON.stringify(items) }),

  listSections: () => request<Section[]>('/api/sections'),

  listBarbershops: () => request<TenantData[]>('/api/admin/barbershops'),
  createBarbershop: (data: {
    slug: string; name: string; tagline?: string;
    admin_username: string; admin_password: string; admin_name: string;
  }) => request<TenantData>('/api/admin/barbershops', { method: 'POST', body: JSON.stringify(data) }),

  listUsers: () => request<UserEntry[]>('/api/users'),
  createUser: (data: { username: string; password: string; name: string; role: string }) =>
    request<UserEntry>('/api/users', { method: 'POST', body: JSON.stringify(data) }),
   updateUser: (id: number, data: { name?: string; is_active?: boolean; role?: string }) =>
     request<UserEntry>(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  listTestimonials: (includeInactive = false) =>
     request<Testimonial[]>(`/api/testimonials?include_inactive=${includeInactive}`),

  createTestimonial: (data: Partial<Testimonial>) =>
    request<Testimonial>('/api/testimonials', { method: 'POST', body: JSON.stringify(data) }),

  updateTestimonial: (id: number, data: Partial<Testimonial>) =>
    request<Testimonial>(`/api/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteTestimonial: (id: number) =>
    request<void>(`/api/testimonials/${id}`, { method: 'DELETE' }),

  listOverrides: (start?: string, end?: string) => {
    const params = new URLSearchParams();
    if (start) params.set('start', start);
    if (end) params.set('end', end);
    return request<DayOverride[]>(`/api/availability/overrides?${params}`);
  },

  saveOverride: (date: string, data: { is_active: boolean; open_time: string; close_time: string; reason: string }) =>
    request<DayOverride>(`/api/availability/overrides/${date}`, { method: 'PUT', body: JSON.stringify({ ...data, date }) }),

  deleteOverride: (date: string) =>
    request<void>(`/api/availability/overrides/${date}`, { method: 'DELETE' }),

  listBlocks: (date?: string) =>
    request<TimeBlock[]>(`/api/availability/blocks${date ? `?date=${date}` : ''}`),

  createBlock: (data: { date: string; start_time: string; end_time: string; reason: string }) =>
    request<TimeBlock>('/api/availability/blocks', { method: 'POST', body: JSON.stringify(data) }),

  deleteBlock: (id: number) =>
    request<void>(`/api/availability/blocks/${id}`, { method: 'DELETE' }),

  getTenant: () => request<TenantData | null>('/api/tenant'),
  saveBranding: (data: Record<string, unknown>) =>
    request<TenantData>('/api/tenant/branding', { method: 'PUT', body: JSON.stringify(data) }),

  uploadHeroImage: async (file: File): Promise<TenantData> => {
    const token = localStorage.getItem('token');
    const tenantSlug = localStorage.getItem('tenantSlug') || '';
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${BASE}/api/tenant/hero-image`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(tenantSlug ? { 'X-Tenant-Slug': tenantSlug } : {}),
      },
      body: form,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => 'Error de conexion');
      throw new ApiError(res.status, text);
    }
    return res.json();
  },

  deleteHeroImage: () =>
    request<TenantData>('/api/tenant/hero-image', { method: 'DELETE' }),

};

export interface Service {
  id: number; name: string; description: string; price: string;
  icon: string; is_active: boolean; sort_order: number;
}

export interface Appointment {
  id: number; client_name: string; client_phone: string;
  client_email: string; service_id: number | null; service_name: string;
  date: string; time: string; status: string; notes: string;
}

export interface ScheduleDay {
  id: number; day_of_week: number; is_active: boolean;
  open_time: string; close_time: string;
}

export interface Testimonial {
  id: number; quote: string; author: string; role: string; rating: number;
  is_active: boolean; sort_order: number;
}

export interface Section {
  id: number; name: string; slug: string; description: string; sort_order: number;
}

export interface GalleryItem {
  id: number; filename: string; alt_text: string;
  section_id: number; section_slug: string; section_name: string;
  url: string; sort_order: number;
}

export interface UserEntry {
  id: number; username: string; name: string; role: string; is_active: boolean;
  barbershop_id?: number;
}

export interface DayOverride {
  id: number; date: string; is_active: boolean;
  open_time: string; close_time: string; reason: string;
}

export interface TimeBlock {
  id: number; date: string; start_time: string; end_time: string;
  reason: string;
}

export interface TenantData {
  id: number; slug: string; name: string; tagline: string;
  description: string; logo_url: string; favicon_url: string;
  hero_image_url: string;  // Imagen de portada del Hero. Vacía = diseño CSS por defecto
  palette: Record<string, string>;
  whatsapp: string; phone: string; email: string; address: string;
  social: Record<string, string>; is_active: boolean;
}

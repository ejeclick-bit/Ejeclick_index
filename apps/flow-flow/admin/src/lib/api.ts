const BASE = '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    if (res.status === 401) localStorage.removeItem('token');
    throw new Error(await res.text());
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

  getMe: () => request<{ id: number; username: string; name: string; role: string }>('/api/auth/me'),

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

  getGallery: () =>
    request<GalleryItem[]>('/api/gallery'),

  uploadImage: async (file: File, altText: string) => {
    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('file', file);
    form.append('alt_text', altText);
    const res = await fetch(`${BASE}/api/gallery`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  deleteImage: (id: number) => request<void>(`/api/gallery/${id}`, { method: 'DELETE' }),
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

export interface GalleryItem {
  id: number; filename: string; alt_text: string;
  url: string; sort_order: number;
}

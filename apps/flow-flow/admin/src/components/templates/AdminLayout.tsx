import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Scissors, Calendar, Clock, Image, MessageCircle, LogOut, ToggleLeft, Palette, Building2, Users, ExternalLink } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn } from '../../utils/cn';

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/servicios', icon: Scissors, label: 'Servicios' },
  { to: '/citas', icon: Calendar, label: 'Citas' },
  { to: '/horarios', icon: Clock, label: 'Horarios' },
  { to: '/galeria', icon: Image, label: 'Galería' },
  { to: '/testimonios', icon: MessageCircle, label: 'Testimonios' },
  { to: '/disponibilidad', icon: ToggleLeft, label: 'Disponibilidad' },
  { to: '/apariencia', icon: Palette, label: 'Apariencia' },
  { to: '/usuarios', icon: Users, label: 'Usuarios' },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isSuperAdmin = user?.role === 'super_admin';
  const isViewingAsAdmin = localStorage.getItem('superAdminViewing') === 'true';
  const showAdminSidebar = !isSuperAdmin || isViewingAsAdmin;

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="flex min-h-screen">
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-[60] rounded-lg border border-neutral-800 bg-brand-card p-2.5 text-neutral-300 hover:text-white transition-colors md:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
      )}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-50 w-60 border-r border-neutral-800 bg-brand-card p-4 flex flex-col transition-transform duration-200',
          'md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div>
            <h1 className="text-lg font-bold text-white">
              <span className="text-brand-gold">✦</span> Flow Flow
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">Panel Admin</p>
          </div>
          <button
            onClick={closeSidebar}
            className="rounded-lg p-1.5 text-neutral-500 hover:text-white transition-colors md:hidden"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {!showAdminSidebar ? (
            <NavLink
              to="/admin-barbershops"
              onClick={closeSidebar}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive ? 'bg-brand-gold/10 text-brand-gold-light font-medium' : 'text-neutral-400 hover:text-white hover:bg-white/5',
                )
              }
            >
              <Building2 size={18} />
              Todas las Barberías
            </NavLink>
          ) : (
            nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    isActive ? 'bg-brand-gold/10 text-brand-gold-light font-medium' : 'text-neutral-400 hover:text-white hover:bg-white/5',
                  )
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))
          )}
        </nav>

        <div className="border-t border-neutral-800 pt-4 mt-4">
          <div className="px-3 mb-3">
            <p className="text-sm text-white">{user?.name}</p>
            <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
          </div>
          {showAdminSidebar && (
            <a
              href={(() => {
                const slug = localStorage.getItem('tenantSlug');
                if (!slug) return '#';
                const host = window.location.hostname;
                if (host === 'localhost' || host.startsWith('192.168') || host.startsWith('127.')) {
                  return `http://${host === 'localhost' ? 'localhost' : host}:3002?tenant=${slug}`;
                }
                return `https://${slug}.ejeclickbarber.com`;
              })()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-brand-gold-light hover:bg-brand-gold/10 transition-colors mb-2"
            >
              <ExternalLink size={18} />
              Ver Landing Page
            </a>
          )}
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className={cn('flex-1 p-8', 'md:ml-60')}>
        <div className="md:hidden h-10" />
        <Outlet />
      </main>
    </div>
  );
}

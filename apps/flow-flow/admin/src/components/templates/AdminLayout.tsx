import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Scissors, Calendar, Clock, Image, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn } from '../../utils/cn';

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/servicios', icon: Scissors, label: 'Servicios' },
  { to: '/citas', icon: Calendar, label: 'Citas' },
  { to: '/horarios', icon: Clock, label: 'Horarios' },
  { to: '/galeria', icon: Image, label: 'Galería' },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 bottom-0 w-60 border-r border-neutral-800 bg-brand-card p-4 flex flex-col z-50">
        <div className="mb-8 px-2">
          <h1 className="text-lg font-bold text-white">
            <span className="text-brand-gold">✦</span> Flow Flow
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">Panel Admin</p>
        </div>

        <nav className="flex-1 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-brand-gold/10 text-brand-gold-light font-medium'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5',
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-neutral-800 pt-4 mt-4">
          <div className="px-3 mb-3">
            <p className="text-sm text-white">{user?.name}</p>
            <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="ml-60 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

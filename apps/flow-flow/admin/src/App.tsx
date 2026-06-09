import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { AdminLayout } from './components/templates/AdminLayout';
import { BackTrap } from './components/atoms/BackTrap';
import { LoginPage } from './components/pages/LoginPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { ServicesPage } from './components/pages/ServicesPage';
import { AppointmentsPage } from './components/pages/AppointmentsPage';
import { SchedulePage } from './components/pages/SchedulePage';
import { GalleryPage } from './components/pages/GalleryPage';
import { TestimonialsPage } from './components/pages/TestimonialsPage';
import { AvailabilityPage } from './components/pages/AvailabilityPage';
import { BrandingPage } from './components/pages/BrandingPage';
import { SuperAdminPage } from './components/pages/SuperAdminPage';
import { UsersPage } from './components/pages/UsersPage';
import { useCursorSpotlight } from './hooks/useCursorSpotlight';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { token } = useAuth();
  useCursorSpotlight();

  return (
    <>
      {/* Spotlight que sigue al cursor — solo desktop (pointer: fine) */}
      <div className="cursor-spotlight" aria-hidden="true" />
      <BackTrap />
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="servicios" element={<ServicesPage />} />
          <Route path="citas" element={<AppointmentsPage />} />
          <Route path="horarios" element={<SchedulePage />} />
          <Route path="galeria" element={<GalleryPage />} />
          <Route path="testimonios" element={<TestimonialsPage />} />
          <Route path="disponibilidad" element={<AvailabilityPage />} />
          <Route path="apariencia" element={<BrandingPage />} />
          <Route path="admin-barbershops" element={<SuperAdminPage />} />
          <Route path="usuarios" element={<UsersPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

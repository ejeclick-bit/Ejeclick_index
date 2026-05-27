import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { AdminLayout } from './components/templates/AdminLayout';
import { LoginPage } from './components/pages/LoginPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { ServicesPage } from './components/pages/ServicesPage';
import { AppointmentsPage } from './components/pages/AppointmentsPage';
import { SchedulePage } from './components/pages/SchedulePage';
import { GalleryPage } from './components/pages/GalleryPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { token } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="servicios" element={<ServicesPage />} />
        <Route path="citas" element={<AppointmentsPage />} />
        <Route path="horarios" element={<SchedulePage />} />
        <Route path="galeria" element={<GalleryPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

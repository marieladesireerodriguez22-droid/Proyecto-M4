import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Mientras Firebase verifica la sesión, mostramos un estado de carga
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando aplicación...</div>;
  }

  // Si no hay usuario autenticado, redirigimos al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizamos la página protegida (Dashboard)
  return <>{children}</>;
};
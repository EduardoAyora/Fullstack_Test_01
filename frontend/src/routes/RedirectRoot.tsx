import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export const RedirectRoot = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/login" replace />;
};
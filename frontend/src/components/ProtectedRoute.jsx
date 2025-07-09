import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MainLayout from './layout/MainLayout';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
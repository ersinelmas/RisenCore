import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MainLayout from './layout/MainLayout';
import LoadingIndicator from './common/LoadingIndicator';
import ErrorBoundary from './common/ErrorBoundary';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingIndicator fullHeight messageKey="common.authenticating" />;
  }

  return isAuthenticated ? (
    <ErrorBoundary>
      <MainLayout />
    </ErrorBoundary>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // This check prevents a flicker where the user is briefly redirected to /login
  // while the token is being verified on initial load.
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // If authenticated, render the child route.
  // The <Outlet /> component from react-router-dom renders the nested child route element.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
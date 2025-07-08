import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is an admin, render the child route. Otherwise, redirect to home.
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
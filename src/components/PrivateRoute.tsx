import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, path }) => {
  const { isAuthenticated, hasPagePermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPagePermission(path)) {
    // Redirect to home page if user doesn't have permission
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

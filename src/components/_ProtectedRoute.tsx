import React, { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import Loader from './Loader';
import { useNavigate } from 'react-router';

const ProtectedComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect only after authentication is checked
    if (isAuthenticated === false) {
      navigate('/login');
    }
  }, []); // Only trigger when isAuthenticated changes

  
  useEffect(() => {
    // Redirect only after authentication is checked
    if (isAuthenticated === false) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]); // Only trigger when isAuthenticated changes

  // Show loading spinner until authentication check is done
  if (loading || isAuthenticated === null) return <Loader />;

  return <>{children}</>;
};

export default ProtectedComponent;

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { getCsrfToken } from '@/utils/csrf';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd'; // Import message from antd
import { API_ENDPOINT } from "@/utils/constants";


interface Profile {
  layout_preference: 'top' | 'side';
  theme_color: string;
  theme_mode: 'light' | 'dark';
  allowed_pages: string[];
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  user_permissions: string[];
  groups: string[];
  profile: Profile;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  setUser: (user: User) => void;
  hasPagePermission: (pagePath: string) => boolean;
  updateProfile: (profileData: Partial<Profile>) => Promise<any>;
}

interface ErrorResponse {
  error?: string;
  message?: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = API_ENDPOINT;

    // Request interceptor for CSRF token
    axios.interceptors.request.use(
      (config) => {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
          config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for handling auth errors
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Skip interceptor for auth-related endpoints to prevent infinite loops
        if (originalRequest.url?.includes('/api/auth/')) {
          return Promise.reject(error);
        }
        
        // If the error is 401 and we haven't tried to verify the session yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Set auth state to false and redirect to login
          setAuthState({
            isAuthenticated: false,
            user: null,
          });
          navigate('/login');
        }
        
        return Promise.reject(error);
      }
    );
  }, [navigate]);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await axios.get('/api/auth/verify/');
        console.log('Session verification response:', response.data);
        setAuthState({
          isAuthenticated: response.data.isAuthenticated,
          user: response.data.user,
        });
      } catch (error) {
        console.error('Session verification failed:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
        });
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  // Periodically verify session
  useEffect(() => {
    let isVerifying = false;
    
    if (authState.isAuthenticated) {
      const interval = setInterval(async () => {
        // Prevent multiple concurrent verification attempts
        if (isVerifying) return;
        
        isVerifying = true;
        try {
          const response = await axios.get('/api/auth/verify/');
          if (!response.data.isAuthenticated) {
            setAuthState({
              isAuthenticated: false,
              user: null,
            });
            navigate('/login');
          }
        } catch (error) {
          // Only log out on network errors or explicit 401s
          //@ts-ignore
          if (!axios.isCancel(error) && (error.response?.status === 401 || !error.response)) {
            console.error('Periodic session verification failed:', error);
            setAuthState({
              isAuthenticated: false,
              user: null,
            });
            navigate('/login');
          }
        } finally {
          isVerifying = false;
        }
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(interval);
    }
  }, [authState.isAuthenticated, navigate]);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login/', {
        username,
        password,
      });

      setAuthState({
        isAuthenticated: true,
        user: response.data.user,
      });

      navigate('/');
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.log('Error:', axiosError);
      const errorMessage = axiosError.response?.data?.error || 'Login failed. Please check your username and password.';
      message.error(errorMessage);
      throw axiosError;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout/');
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const hasPagePermission = (pagePath: string) => {
    // Public pages that don't require authentication
    const publicPages = ['/login', '/register', '/forgot-password'];
    if (publicPages.includes(pagePath)) {
      return true;
    }

    // Must be authenticated beyond this point
    if (!authState.user) {
      return false;
    }

    // Must have a valid profile and allowed_pages array
    if (!authState.user.profile?.allowed_pages || !Array.isArray(authState.user.profile.allowed_pages)) {
      return false;
    }

    // Check if user has access to this page
    return authState.user.profile.allowed_pages.includes(pagePath);
  };

  const setUser = (user: User) => {
    setAuthState(prev => ({
      ...prev,
      user,
      isAuthenticated: true,
    }));
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      const response = await axios.patch('/api/auth/profile/', profileData);
      setAuthState(prev => ({
        ...prev,
        user: response.data.user
      }));
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        loading,
        setUser,
        hasPagePermission,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

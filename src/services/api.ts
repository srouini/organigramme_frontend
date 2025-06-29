import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.4:8888/api/auth/',
  withCredentials: true, // Important for sending cookies
});

// Function to get CSRF token from cookies
function getCsrfToken(): string {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue || '';
}

// Add request interceptor to include CSRF token
api.interceptors.request.use((config) => {
  // Only add CSRF token for non-GET requests
  if (config.method !== 'get') {
    config.headers['X-CSRFToken'] = getCsrfToken();
  }
  return config;
});

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth/login/', { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/user/');
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getUsers = async () => {
  try {
    const response = await api.get('/auth/users/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;

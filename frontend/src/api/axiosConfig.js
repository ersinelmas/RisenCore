import axios from 'axios';
import toast from 'react-hot-toast';
import i18n from '../i18n';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith('/auth/');
    const status = error.response?.status;

    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      // Cross-cutting authorization failure — most call sites don't special-case this,
      // so surface it globally rather than relying on every catch block to handle it.
      toast.error(i18n.t('common.forbidden'));
    } else if (!error.response) {
      // No response at all: timeout (ECONNABORTED) or the server/network is unreachable.
      // Call-site catch blocks read error.response.data.message, so a plain network
      // failure would otherwise fall through to a misleading business-error message.
      toast.error(i18n.t('common.networkError'));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
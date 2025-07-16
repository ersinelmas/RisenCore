import apiClient from '../api/axiosConfig';

const API_URL = '/auth/';

const login = (username, password) => {
  return apiClient.post(API_URL + 'login', {
    username,
    password,
  });
};

const register = (userData) => {
    return apiClient.post(API_URL + 'register', userData);
};

const authService = {
  login,
  register,
};

export default authService;
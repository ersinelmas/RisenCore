import apiClient from '../api/axiosConfig'; 

const API_URL = '/auth/';

const login = (username, password) => {
  return apiClient.post(API_URL + 'login', {
    username,
    password,
  });
};

const register = (firstName, lastName, username, email, password) => {
    return apiClient.post(API_URL + 'register', {
        firstName,
        lastName,
        username,
        email,
        password
    });
};

const authService = {
  login,
  register,
};

export default authService;
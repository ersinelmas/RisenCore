import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/'; // Backend API URL

const login = (username, password) => {
  return axios.post(API_URL + 'login', {
    username,
    password,
  });
};

const register = (username, email, password) => {
    return axios.post(API_URL + 'register', {
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
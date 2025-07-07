import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const initializeAuth = useCallback(() => {
    const tokenInStorage = localStorage.getItem('token');
    if (tokenInStorage) {
      try {
        const decodedToken = jwtDecode(tokenInStorage);
        // Check if the token is expired
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser({
            username: decodedToken.sub,
            roles: decodedToken.roles || [],
          });
          setToken(tokenInStorage);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Invalid token found, removing from storage.", error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (username, password) => {
    const response = await authService.login(username, password);
    const newToken = response.data.token;
    localStorage.setItem('token', newToken);

    const decodedToken = jwtDecode(newToken);
    setUser({
      username: decodedToken.sub,
      roles: decodedToken.roles || [],
    });
    setToken(newToken);
    return response;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

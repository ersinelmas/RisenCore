import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const processToken = useCallback((tokenToProcess) => {
    try {
      const decodedToken = jwtDecode(tokenToProcess);
      if (decodedToken.exp * 1000 > Date.now()) {
        setUser({
          username: decodedToken.sub,
          email: decodedToken.email,
          roles: decodedToken.roles || [],
        });
        setToken(tokenToProcess);
        return true;
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    return false;
  }, []);

  useEffect(() => {
    const tokenInStorage = localStorage.getItem('token');
    if (tokenInStorage) {
      processToken(tokenInStorage);
    }
    setLoading(false);
  }, [processToken]);

  const login = useCallback(async (username, password) => {
    const response = await authService.login(username, password);
    const newToken = response.data.token;
    localStorage.setItem('token', newToken);
    processToken(newToken);
    return response;
  }, [processToken]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);
  
  const isAdmin = useMemo(() => user?.roles?.includes('ADMIN') || false, [user]);

  const value = useMemo(() => ({
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin,
    loading,
  }), [user, token, loading, login, logout, isAdmin]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
import { createContext, useState, useEffect, useCallback, useMemo} from 'react';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token')); // Lazy initializer
  const [loading, setLoading] = useState(true);

  const initializeAuth = useCallback(() => {
    // No need to get from storage again, use the state
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser({
            username: decodedToken.sub,
            roles: decodedToken.roles || [],
          });
        } else {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Invalid token found, removing from storage.", error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (username, password) => {
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
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);
  
  const isAdmin = useMemo(() => user?.roles?.includes('ROLE_ADMIN') || false, [user]);

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
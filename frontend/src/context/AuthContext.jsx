import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // TODO: Decode token for user info instead of dummy data.
      setUser({ username: 'dummy_user' });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    const response = await authService.login(username, password);
    const { token } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    // TODO: Decode token for user info.
    setUser({ username: username });
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
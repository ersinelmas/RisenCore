import { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import i18n from '../i18n';

// setTimeout delays beyond this silently fire almost immediately in some engines
// (32-bit signed int overflow). JWTs here expire in 24h, but clamp defensively.
const MAX_TIMEOUT_MS = 2_147_483_647;

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const expiryTimerRef = useRef(null);

  const clearExpiryTimer = useCallback(() => {
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
  }, []);

  const logout = useCallback(() => {
    clearExpiryTimer();
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, [clearExpiryTimer]);

  const scheduleExpiryLogout = useCallback((expSeconds) => {
    clearExpiryTimer();
    const msUntilExpiry = expSeconds * 1000 - Date.now();
    expiryTimerRef.current = setTimeout(
      () => {
        logout();
        toast.error(i18n.t('auth.sessionExpired'));
      },
      Math.min(Math.max(msUntilExpiry, 0), MAX_TIMEOUT_MS)
    );
  }, [clearExpiryTimer, logout]);

  const processToken = useCallback((tokenToProcess) => {
    try {
      const decodedToken = jwtDecode(tokenToProcess);
      if (decodedToken.exp * 1000 > Date.now()) {
        setUser({
          username: decodedToken.sub,
          email: decodedToken.email,
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
          roles: decodedToken.roles || [],
        });
        setToken(tokenToProcess);
        scheduleExpiryLogout(decodedToken.exp);
        return true;
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
    clearExpiryTimer();
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    return false;
  }, [scheduleExpiryLogout, clearExpiryTimer]);

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

  useEffect(() => clearExpiryTimer, [clearExpiryTimer]);

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
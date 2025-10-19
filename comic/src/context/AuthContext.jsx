import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import auth from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback((userData) => {
    const { id, username, email, role } = userData;
    localStorage.setItem('userId', id);
    setUser({ id, username, email, role });
  }, []);

  const logout = useCallback(() => {
    auth.logout();
    localStorage.removeItem('userId');
    setUser(null);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await auth.getUser(userId);
          if (response.success && response.data) {
            const { id, username, email, role } = response.data;
            setUser({ id, username, email, role });
          } else {
            logout();
          }
        } catch (error) {
          console.error('User verification failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [logout]);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    getUserRole: () => user?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

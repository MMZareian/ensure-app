/**
 * Authentication Context - Manages user authentication state
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserInfo, LoginResponse } from '../types';

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: (userData: LoginResponse) => void;
  logout: () => void;
  companyId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse stored user info:', error);
        localStorage.removeItem('user_info');
        localStorage.removeItem('auth_token');
      }
    }
  }, []);

  const login = (userData: LoginResponse) => {
    const userInfo: UserInfo = {
      manager_id: userData.manager_id,
      username: userData.username,
      full_name: userData.full_name,
      email: userData.email,
      company_id: userData.company_id,
      company_name: userData.company_name,
      role: userData.role,
    };
    setUser(userInfo);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_info');
    localStorage.removeItem('auth_token');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    companyId: user?.company_id || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

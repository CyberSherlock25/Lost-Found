import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthResponse, User } from '../types';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<String | null>(localStorage.getItem('userRole'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get('/profile')
        .then((res) => {
          setUser(res.data.data);
          setRole(res.data.data.roleName);
          localStorage.setItem('userRole', res.data.data.roleName);
        })
        .catch(() => {
          localStorage.clear();
          setUser(null);
          setRole(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (data: AuthResponse) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userRole', data.role);
    setRole(data.role);

    setUser({
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      universityId: '',
      isActive: true,
      roleId: 0,
      roleName: data.role,
      createdAt: '',
    });

    api.get('/profile').then((res) => {
      setUser(res.data.data);
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: role ? String(role) : null,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

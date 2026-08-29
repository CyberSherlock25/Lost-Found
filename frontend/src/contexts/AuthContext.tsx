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
  const [role, setRole] = useState<string | null>(() => {
    const savedRole = localStorage.getItem('userRole');
    return savedRole ? savedRole : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const cachedUser = localStorage.getItem('user');

    if (cachedUser) {
      try {
        const parsedUser = JSON.parse(cachedUser) as User;
        setUser(parsedUser);
        setRole(parsedUser.roleName || localStorage.getItem('userRole'));
      } catch {
        localStorage.removeItem('user');
      }
    }

    if (token) {
      api.get('/profile')
        .then((res) => {
          const profileUser = res.data.data as User;
          setUser(profileUser);
          setRole(profileUser.roleName);
          localStorage.setItem('userRole', profileUser.roleName);
          localStorage.setItem('user', JSON.stringify(profileUser));
        })
        .catch(() => {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('user');
            setUser(null);
            setRole(null);
          }
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

    const safeUser: User = {
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      universityId: '',
      isActive: true,
      roleId: 0,
      roleName: data.role,
      createdAt: '',
    };

    setRole(data.role);
    setUser(safeUser);
    localStorage.setItem('user', JSON.stringify(safeUser));

    api.get('/profile')
      .then((res) => {
        const profileUser = res.data.data as User;
        setUser(profileUser);
        setRole(profileUser.roleName);
        localStorage.setItem('userRole', profileUser.roleName);
        localStorage.setItem('user', JSON.stringify(profileUser));
      })
      .catch(() => {
        setUser(safeUser);
      });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    setUser(null);
    setRole(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    setRole(updatedUser.roleName);
    localStorage.setItem('userRole', updatedUser.roleName);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: role ? String(role) : null,
        isAuthenticated: !!user || !!localStorage.getItem('accessToken'),
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

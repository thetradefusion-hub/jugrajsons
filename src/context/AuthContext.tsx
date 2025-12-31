import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

export interface User {
  id: string;
  _id?: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role?: 'user' | 'admin';
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  addresses: Address[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
const mockUsers: { email: string; password: string; user: User }[] = [
  {
    email: 'demo@atharva.com',
    password: 'demo123',
    user: {
      id: '1',
      email: 'demo@atharva.com',
      name: 'Demo User',
      phone: '9876543210',
    },
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('atharva-user');
      const savedAddresses = localStorage.getItem('atharva-addresses');
      
      if (token) {
        try {
          // Verify token and get user from backend
          const response = await api.get('/auth/me');
          const userData = response.data;
          const loadedUser = {
            id: userData._id || userData.id,
            _id: userData._id || userData.id,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            avatar: userData.avatar,
            role: userData.role || 'user'
          };
          setUser(loadedUser);
          // Update localStorage with fresh user data
          localStorage.setItem('atharva-user', JSON.stringify(loadedUser));
        } catch (error: any) {
          // Only clear storage if it's a 401 (unauthorized), not network errors
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('atharva-user');
          } else if (savedUser) {
            // If network error but we have saved user, use it temporarily
            try {
              const parsedUser = JSON.parse(savedUser);
              setUser(parsedUser);
            } catch (parseError) {
              console.error('Error parsing saved user:', parseError);
            }
          }
        }
      } else if (savedUser) {
        // No token but saved user exists - load it (might be from previous session)
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error loading user from localStorage:', error);
        }
      }
      
      if (savedAddresses) {
        try {
          setAddresses(JSON.parse(savedAddresses));
        } catch (error) {
          console.error('Error loading addresses from localStorage:', error);
        }
      }
      
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('atharva-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('atharva-user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('atharva-addresses', JSON.stringify(addresses));
  }, [addresses]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, _id, name, email: userEmail, role } = response.data;
      
      localStorage.setItem('token', token);
      
      const user: User = {
        id: _id,
        _id,
        email: userEmail,
        name,
        role: role || 'user'
      };
      
      setUser(user);
      localStorage.setItem('atharva-user', JSON.stringify(user));
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, _id, name: userName, email: userEmail, role } = response.data;
      
      localStorage.setItem('token', token);
      
      const user: User = {
        id: _id,
        _id,
        email: userEmail,
        name: userName,
        role: role || 'user'
      };
      
      setUser(user);
      localStorage.setItem('atharva-user', JSON.stringify(user));
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('atharva-user');
  };

  const updateProfile = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
    };
    
    setAddresses(prev => {
      if (address.isDefault) {
        return [...prev.map(a => ({ ...a, isDefault: false })), newAddress];
      }
      return [...prev, newAddress];
    });
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    setAddresses(prev =>
      prev.map(address => (address.id === id ? { ...address, ...updates } : address))
    );
  };

  const removeAddress = (id: string) => {
    setAddresses(prev => prev.filter(address => address.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev =>
      prev.map(address => ({
        ...address,
        isDefault: address.id === id,
      }))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        addresses,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,
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

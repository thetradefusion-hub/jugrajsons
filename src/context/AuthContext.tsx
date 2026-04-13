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
  /** Mirrored from API for profile completion UI; canonical list is also in context `addresses` */
  addresses?: Address[];
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
  /** Apply full user payload from PUT /auth/me or GET /auth/me (used by Settings / Addresses pages) */
  updateUser: (userData: Record<string, unknown>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
function mapApiAddressesToLocal(raw: unknown[] | undefined): Address[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item: unknown, i: number) => {
    const a = item as Record<string, unknown>;
    return {
      id: a._id != null ? String(a._id) : `addr-${i}`,
      name: String(a.name ?? ''),
      phone: String(a.phone ?? ''),
      addressLine1: String(a.addressLine1 ?? ''),
      addressLine2: a.addressLine2 != null ? String(a.addressLine2) : undefined,
      city: String(a.city ?? ''),
      state: String(a.state ?? ''),
      pincode: String(a.pincode ?? ''),
      isDefault: Boolean(a.isDefault),
    };
  });
}

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
          const response = await api.get('/auth/me');
          const userData = response.data;
          const mappedAddresses = mapApiAddressesToLocal(userData.addresses);
          const loadedUser: User = {
            id: userData._id || userData.id,
            _id: userData._id || userData.id,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            avatar: userData.avatar,
            role: userData.role || 'user',
            addresses: mappedAddresses,
          };
          setUser(loadedUser);
          setAddresses(mappedAddresses);
          localStorage.setItem('atharva-user', JSON.stringify(loadedUser));
        } catch (error: any) {
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('atharva-user');
            localStorage.removeItem('atharva-addresses');
          } else if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser);
              setUser(parsedUser);
            } catch (parseError) {
              console.error('Error parsing saved user:', parseError);
            }
            if (savedAddresses) {
              try {
                setAddresses(JSON.parse(savedAddresses));
              } catch {
                /* ignore */
              }
            }
          }
        }
      } else if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error loading user from localStorage:', error);
        }
        if (savedAddresses) {
          try {
            setAddresses(JSON.parse(savedAddresses));
          } catch (error) {
            console.error('Error loading addresses from localStorage:', error);
          }
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

      try {
        const me = await api.get('/auth/me');
        const userData = me.data;
        const mappedAddresses = mapApiAddressesToLocal(userData.addresses);
        const fullUser: User = {
          id: userData._id || _id,
          _id: userData._id || _id,
          email: userData.email || userEmail,
          name: userData.name || name,
          phone: userData.phone,
          avatar: userData.avatar,
          role: userData.role || role || 'user',
          addresses: mappedAddresses,
        };
        setUser(fullUser);
        setAddresses(mappedAddresses);
        localStorage.setItem('atharva-user', JSON.stringify(fullUser));
      } catch {
        const minimal: User = {
          id: _id,
          _id,
          email: userEmail,
          name,
          role: role || 'user',
        };
        setUser(minimal);
        setAddresses([]);
        localStorage.setItem('atharva-user', JSON.stringify(minimal));
      }
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, _id, name: userName, email: userEmail, role } = response.data;

      localStorage.setItem('token', token);

      try {
        const me = await api.get('/auth/me');
        const userData = me.data;
        const mappedAddresses = mapApiAddressesToLocal(userData.addresses);
        const fullUser: User = {
          id: userData._id || _id,
          _id: userData._id || _id,
          email: userData.email || userEmail,
          name: userData.name || userName,
          phone: userData.phone,
          avatar: userData.avatar,
          role: userData.role || role || 'user',
          addresses: mappedAddresses,
        };
        setUser(fullUser);
        setAddresses(mappedAddresses);
        localStorage.setItem('atharva-user', JSON.stringify(fullUser));
      } catch {
        const minimal: User = {
          id: _id,
          _id,
          email: userEmail,
          name: userName,
          role: role || 'user',
        };
        setUser(minimal);
        setAddresses([]);
        localStorage.setItem('atharva-user', JSON.stringify(minimal));
      }
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setAddresses([]);
    localStorage.removeItem('token');
    localStorage.removeItem('atharva-user');
    localStorage.removeItem('atharva-addresses');
  };

  const updateProfile = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const updateUser = (userData: Record<string, unknown>) => {
    const u = userData as {
      _id?: string;
      id?: string;
      name?: string;
      email?: string;
      phone?: string;
      avatar?: string;
      role?: string;
      addresses?: unknown[];
    };
    const id = String(u._id || u.id || '');
    if (!id) return;

    const mappedAddresses =
      u.addresses !== undefined ? mapApiAddressesToLocal(u.addresses as unknown[]) : null;

    setUser((prev) => {
      const base = prev ?? {
        id,
        _id: u._id,
        email: u.email ?? '',
        name: u.name ?? '',
        role: 'user' as const,
      };
      return {
        ...base,
        id,
        _id: u._id ?? base._id,
        name: u.name ?? base.name,
        email: u.email ?? base.email,
        phone: u.phone !== undefined ? u.phone : base.phone,
        avatar: u.avatar !== undefined ? u.avatar : base.avatar,
        role: (u.role as 'user' | 'admin' | undefined) ?? base.role ?? 'user',
        addresses: mappedAddresses !== null ? mappedAddresses : base.addresses,
      };
    });

    if (mappedAddresses !== null) {
      setAddresses(mappedAddresses);
    }

    const stored = {
      id,
      _id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      avatar: u.avatar,
      role: u.role || 'user',
      addresses: mappedAddresses ?? undefined,
    };
    localStorage.setItem('atharva-user', JSON.stringify(stored));
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
        updateUser,
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

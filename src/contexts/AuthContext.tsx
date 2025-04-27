
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Types
export type UserRole = 'admin' | 'law-firm';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firmName?: string;
  firmSlug?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firmName: string, firmSlug: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

// Mock data for demo purposes (would connect to a backend in production)
const ADMIN_EMAIL = 'perezarranzjavier@gmail.com';
const ADMIN_PASSWORD = 'perezarranzjavier';

const mockUsers: User[] = [
  {
    id: '1',
    email: ADMIN_EMAIL,
    role: 'admin',
  },
  {
    id: '2',
    email: 'demo@lawfirm.com',
    role: 'law-firm',
    firmName: 'Demo Law Firm',
    firmSlug: 'demo',
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for saved user on load
  useEffect(() => {
    const savedUser = localStorage.getItem('lawUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('lawUser');
      }
    }
    setLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('lawUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('lawUser');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Admin login
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = mockUsers.find(u => u.email === ADMIN_EMAIL);
        if (adminUser) {
          setUser(adminUser);
          navigate('/manage');
          toast.success('Welcome, Admin!');
          return;
        }
      }

      // Regular user login
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        if (foundUser.firmSlug) {
          navigate(`/${foundUser.firmSlug}/back/leads`);
        }
        toast.success(`Welcome back, ${foundUser.firmName || 'User'}!`);
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firmName: string, firmSlug: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if email already exists
      if (mockUsers.some(u => u.email === email)) {
        toast.error('Email already in use');
        setLoading(false);
        return;
      }

      // Check if slug already exists
      if (mockUsers.some(u => u.firmSlug === firmSlug)) {
        toast.error('Firm URL already in use');
        setLoading(false);
        return;
      }

      // Create new user
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        email,
        role: 'law-firm',
        firmName,
        firmSlug,
      };

      // In a real app, this would be an API call to register the user
      mockUsers.push(newUser);
      setUser(newUser);
      navigate(`/${firmSlug}/back/leads`);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/');
    toast.success('Logged out successfully');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signUp, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

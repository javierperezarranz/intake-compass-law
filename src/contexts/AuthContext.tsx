import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

// Types for our auth context
export type UserRole = 'admin' | 'lawyer';

export interface UserDetails {
  id: string;
  email: string;
  role: UserRole;
  firmName?: string;
  firmSlug?: string;
}

interface AuthContextType {
  user: UserDetails | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firmName: string, firmSlug: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to fetch firm details
  const fetchFirmDetails = async (email: string, maxRetries = 3): Promise<string | null> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { data, error } = await supabase
          .from('firms')
          .select('slug')
          .eq('email', email)
          .single();

        if (error) throw error;
        if (data?.slug) return data.slug;
        
        // If no data found and retries left, wait before next attempt
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return null;
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (currentSession?.user) {
          try {
            await refreshUserDetails(currentSession.user);
          } catch (error) {
            console.error('Error refreshing user details:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          await refreshUserDetails(currentSession.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user details from the database
  const refreshUserDetails = async (authUser: User) => {
    try {
      const { data: lawyerData, error: lawyerError } = await supabase
        .from('lawyers')
        .select(`
          lawyer_id,
          role,
          firms:firm_id (
            name,
            slug
          )
        `)
        .eq('lawyer_id', authUser.id)
        .single();
      
      if (lawyerError) throw lawyerError;
      
      if (lawyerData) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          role: lawyerData.role,
          firmName: lawyerData.firms?.name,
          firmSlug: lawyerData.firms?.slug,
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // User data is fetched in the auth state change listener
        toast.success('Logged in successfully');
        if (email === 'perezarranzjavier@gmail.com') {
          navigate('/manage');
        } else if (data.user) {
          // Get the user's firm slug
          const { data: lawyerData } = await supabase
            .from('lawyers')
            .select(`
              firms:firm_id (
                slug
              )
            `)
            .eq('lawyer_id', data.user.id)
            .single();
            
          if (lawyerData?.firms?.slug) {
            navigate(`/${lawyerData.firms.slug}/back/leads`);
          }
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'An error occurred during login');
      throw error; // Re-throw to handle in the component
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firmName: string, firmSlug: string) => {
    setLoading(true);
    try {
      console.log('Starting signup process for:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firm_name: firmName,
            firm_slug: firmSlug
          }
        }
      });

      if (error) {
        console.error('Signup error from Supabase:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned from signup');
      }

      // Show success message
      toast.success('Account created successfully!');
      
      try {
        // Try to get the firm slug with retries
        const confirmedSlug = await fetchFirmDetails(email);
        
        // Navigate to the dashboard using either the confirmed slug or the provided one
        const targetSlug = confirmedSlug || firmSlug;
        console.log('Navigating to dashboard with slug:', targetSlug);
        navigate(`/${targetSlug}/back/leads`);
      } catch (error) {
        console.error('Error in post-signup process:', error);
        // Fall back to the provided slug if there's an error
        navigate(`/${firmSlug}/back/leads`);
      }
    } catch (error: any) {
      console.error('Signup process error:', error);
      toast.error(error.message || 'An error occurred during signup');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'An error occurred during logout');
      throw error; // Re-throw to handle in the component
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, signUp, logout, isAdmin }}>
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

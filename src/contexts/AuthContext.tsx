
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

  // Helper function to fetch firm details with retries
  const fetchFirmDetails = async (email: string, maxRetries = 5): Promise<{ slug: string; name: string } | null> => {
    let retryCount = 0;
    let delay = 500; // Start with 500ms delay
    
    while (retryCount < maxRetries) {
      try {
        console.log(`Attempt ${retryCount + 1} to fetch firm details for ${email}`);
        const { data, error } = await supabase
          .from('firms')
          .select('slug, name')
          .eq('email', email)
          .single();

        if (error) {
          console.warn(`Attempt ${retryCount + 1} failed:`, error);
          if (retryCount === maxRetries - 1) throw error;
        } else if (data) {
          console.log('Firm details fetched successfully:', data);
          return data;
        } else {
          console.warn(`No firm found for ${email} on attempt ${retryCount + 1}`);
        }
      } catch (error) {
        console.error(`Error in attempt ${retryCount + 1}:`, error);
        if (retryCount === maxRetries - 1) throw error;
      }

      // Exponential backoff with jitter
      const jitter = Math.random() * 300;
      const waitTime = delay + jitter;
      console.log(`Waiting ${Math.round(waitTime)}ms before retry ${retryCount + 1}...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      delay *= 1.5; // Increase delay for next attempt
      retryCount++;
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
          setLoading(false);
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
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
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
      console.log('Refreshing user details for:', authUser.id);
      
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
      
      if (lawyerError) {
        console.error('Error fetching lawyer data:', lawyerError);
        throw lawyerError;
      }
      
      if (lawyerData) {
        const userDetails: UserDetails = {
          id: authUser.id,
          email: authUser.email || '',
          role: lawyerData.role as UserRole,
          firmName: lawyerData.firms?.name,
          firmSlug: lawyerData.firms?.slug,
        };
        
        console.log('User details updated:', userDetails);
        setUser(userDetails);
      } else {
        console.warn('No lawyer data found for user:', authUser.id);
        setUser(null);
      }
    } catch (error) {
      console.error('Error in refreshUserDetails:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error from Supabase:', error);
        throw error;
      }

      if (data.user) {
        toast.success('Logged in successfully');
        
        if (email === 'perezarranzjavier@gmail.com') {
          navigate('/manage');
        } else {
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
            console.log('Navigating to firm dashboard:', lawyerData.firms.slug);
            navigate(`/${lawyerData.firms.slug}/back/leads`);
          } else {
            console.warn('No firm slug found for user, redirecting to home');
            navigate('/');
          }
        }
      }
    } catch (error: any) {
      console.error('Login process error:', error);
      toast.error(error.message || 'An error occurred during login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firmName: string, firmSlug: string) => {
    setLoading(true);
    try {
      console.log('Starting signup process for:', email, 'with firm slug:', firmSlug);
      
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
        console.log('Waiting for firm data to be created...');
        
        // Fetch firm details with retries
        const firmDetails = await fetchFirmDetails(email);
        
        if (firmDetails) {
          console.log('Firm created successfully, navigating to dashboard:', firmDetails.slug);
          navigate(`/${firmDetails.slug}/back/leads`);
        } else {
          console.warn('Unable to fetch firm details after signup, using provided slug');
          navigate(`/${firmSlug}/back/leads`);
        }
      } catch (error) {
        console.error('Error fetching firm details after signup:', error);
        // Fall back to the provided slug
        console.warn('Falling back to provided slug for navigation');
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
      throw error;
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

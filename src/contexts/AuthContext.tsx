
import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, UserDetails } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useFirmDetails } from '@/hooks/useFirmDetails';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { fetchFirmDetails } = useFirmDetails();
  const { user, session, loading, setLoading } = useAuthState();

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
        toast.success('Logged in successfully');
        if (email === 'perezarranzjavier@gmail.com') {
          navigate('/manage');
        } else if (data.user) {
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
      throw error;
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

      toast.success('Account created successfully!');
      
      try {
        const confirmedSlug = await fetchFirmDetails(email);
        const targetSlug = confirmedSlug || firmSlug;
        console.log('Navigating to dashboard with slug:', targetSlug);
        navigate(`/${targetSlug}/back/leads`);
      } catch (error) {
        console.error('Error in post-signup process:', error);
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

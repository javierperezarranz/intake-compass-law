
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserDetails } from '@/types/auth';

export const useAuthState = () => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
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

  return { user, setUser, session, setSession, loading, setLoading };
};

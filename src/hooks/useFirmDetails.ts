
import { supabase } from '@/integrations/supabase/client';

export const useFirmDetails = () => {
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

  return { fetchFirmDetails };
};

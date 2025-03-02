
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';

export interface Insight {
  id: string;
  personality_type: string;
  category: string;
  title: string;
  content: string;
  created_at: string;
}

export function useInsights() {
  const { profile } = useProfile();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.personality_type) {
      setInsights([]);
      setLoading(false);
      return;
    }

    async function fetchInsights() {
      try {
        setLoading(true);
        
        // Get insights for the user's personality type
        const { data, error } = await supabase
          .from('insights')
          .select('*')
          .eq('personality_type', profile.personality_type)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setInsights(data || []);
      } catch (error: any) {
        console.error('Error fetching insights:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, [profile?.personality_type]);

  return { insights, loading, error };
}

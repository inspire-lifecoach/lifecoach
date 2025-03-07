
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface CheckIn {
  id: string;
  question: string;
  context: string;
  created_at: string;
  relevance_type: 'journal' | 'conversation' | 'test-result' | 'date' | 'general';
  responded: boolean;
  user_id: string;
}

export function useCheckIns() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch check-ins
  const fetchCheckIns = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get recent check-ins from the database
      const { data, error } = await supabase
        .from('check_ins')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      // Cast to CheckIn[] type since TypeScript doesn't know about our custom table yet
      setCheckIns(data as unknown as CheckIn[]);
    } catch (error: any) {
      console.error('Error fetching check-ins:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your check-ins.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a check-in as responded
  const markAsResponded = async (checkInId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('check_ins')
        .update({ responded: true } as any)
        .eq('id', checkInId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update the local state
      setCheckIns(prev => 
        prev.map(checkIn => 
          checkIn.id === checkInId ? { ...checkIn, responded: true } : checkIn
        )
      );
    } catch (error: any) {
      console.error('Error marking check-in as responded:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update check-in status.",
      });
    }
  };

  // Generate a new check-in
  const generateCheckIn = async () => {
    if (!user) return;
    
    try {
      // Call the edge function to generate a new check-in
      const { data, error } = await supabase.functions
        .invoke('generate_check_in', {
          body: { user_id: user.id }
        });
      
      if (error) throw error;
      
      // Refresh the check-ins
      fetchCheckIns();
      
      return data;
    } catch (error: any) {
      console.error('Error generating check-in:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate a new check-in.",
      });
    }
  };

  // Load check-ins on component mount
  useEffect(() => {
    if (user) {
      fetchCheckIns();
    }
  }, [user]);

  return {
    checkIns,
    isLoading,
    fetchCheckIns,
    markAsResponded,
    generateCheckIn,
  };
}

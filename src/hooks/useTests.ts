
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface Test {
  id: string;
  name: string;
  description: string | null;
  type: string;
  created_at: string;
}

export function useTests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTests() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('tests')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        setTests(data || []);
      } catch (error: any) {
        console.error('Error fetching tests:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTests();
  }, []);

  return { tests, loading, error };
}

export interface TestResult {
  id: string;
  user_id: string;
  test_id: string;
  result: string;
  result_details: any;
  created_at: string;
  test?: Test;
}

export function useTestResults() {
  const { user } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setResults([]);
      setLoading(false);
      return;
    }

    async function fetchResults() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('user_test_results')
          .select(`
            *,
            test:tests(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setResults(data || []);
      } catch (error: any) {
        console.error('Error fetching test results:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [user]);

  const saveResult = async (test_id: string, result: string, result_details: any = {}) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('user_test_results')
        .upsert({
          user_id: user.id,
          test_id,
          result,
          result_details
        }, { onConflict: 'user_id,test_id' })
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh results
      const { data: updatedResults, error: fetchError } = await supabase
        .from('user_test_results')
        .select(`
          *,
          test:tests(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      setResults(updatedResults || []);
      
      return data;
    } catch (error: any) {
      console.error('Error saving test result:', error);
      setError(error.message);
      return null;
    }
  };

  return { results, loading, error, saveResult };
}

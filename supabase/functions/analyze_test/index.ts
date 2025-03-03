
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestResponse {
  questionId: string;
  answer: string;
}

interface AnalyzeTestRequest {
  userId: string;
  testType: string;
  responses: TestResponse[];
}

interface AnalyzeTestResult {
  personalityType: string;
  traits: {
    dimension: string;
    score: number;
    preference: string;
  }[];
  description: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const requestData: AnalyzeTestRequest = await req.json();
    const { userId, testType, responses } = requestData;

    if (!userId || !testType || !responses || !Array.isArray(responses)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request data' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For this example, we'll mock the AI analysis for MBTI
    // In a real implementation, you'd send this to your AI service
    
    // Simple calculation for demo purposes
    const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    responses.forEach(response => {
      if (response.answer in counts) {
        counts[response.answer as keyof typeof counts]++;
      }
    });
    
    // Determine personality type
    const personalityType = [
      counts.E > counts.I ? 'E' : 'I',
      counts.S > counts.N ? 'S' : 'N',
      counts.T > counts.F ? 'T' : 'F',
      counts.J > counts.P ? 'J' : 'P',
    ].join('');
    
    // Calculate dimension scores (0-100)
    const traits = [
      {
        dimension: 'Extraversion-Introversion',
        score: Math.round((counts.E / (counts.E + counts.I)) * 100),
        preference: counts.E > counts.I ? 'Extraversion' : 'Introversion'
      },
      {
        dimension: 'Sensing-Intuition',
        score: Math.round((counts.S / (counts.S + counts.N)) * 100),
        preference: counts.S > counts.N ? 'Sensing' : 'Intuition'
      },
      {
        dimension: 'Thinking-Feeling',
        score: Math.round((counts.T / (counts.T + counts.F)) * 100),
        preference: counts.T > counts.F ? 'Thinking' : 'Feeling'
      },
      {
        dimension: 'Judging-Perceiving',
        score: Math.round((counts.J / (counts.J + counts.P)) * 100),
        preference: counts.J > counts.P ? 'Judging' : 'Perceiving'
      }
    ];

    // In a real implementation, you'd call your AI service like this:
    /*
    const aiResponse = await fetch('https://ai.inspirecreations.it.com/api/v1/persona/analyze-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('AI_SERVICE_API_KEY')}`
      },
      body: JSON.stringify({
        userId,
        testType,
        responses
      })
    });
    
    const result = await aiResponse.json();
    */

    // Save test result to database
    const { data: test } = await supabase
      .from('tests')
      .select('id')
      .eq('type', testType)
      .single();
    
    if (!test) {
      // If test doesn't exist, create it
      const { data: newTest, error: testError } = await supabase
        .from('tests')
        .insert({ type: testType, name: `${testType.toUpperCase()} Personality Test` })
        .select()
        .single();
        
      if (testError) throw testError;
      test = newTest;
    }

    // Save user's test result
    const { error: resultError } = await supabase
      .from('user_test_results')
      .insert({
        user_id: userId,
        test_id: test.id,
        result: personalityType,
        result_details: {
          traits,
          responses
        }
      });
      
    if (resultError) throw resultError;
    
    // Update the user's profile with their personality type
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ personality_type: personalityType })
      .eq('id', userId);
      
    if (profileError) throw profileError;

    // Create the result object
    const result: AnalyzeTestResult = {
      personalityType,
      traits,
      description: `You are an ${personalityType} type, which means you tend to be ${traits[0].preference}, ${traits[1].preference}, ${traits[2].preference}, and ${traits[3].preference}.`
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing test analysis:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to analyze test' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

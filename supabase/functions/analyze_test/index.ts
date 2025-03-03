
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

    console.log(`Processing ${testType} test with ${responses.length} responses for user ${userId}`);

    // Process different test types
    let result: AnalyzeTestResult;
    
    if (testType === 'mbti' || testType === 'quick') {
      result = analyzeMBTI(responses);
    } else if (testType === 'big5') {
      result = analyzeBig5(responses);
    } else if (testType === 'enneagram') {
      result = analyzeEnneagram(responses);
    } else {
      return new Response(
        JSON.stringify({ error: 'Unsupported test type' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Test result calculated: ${result.personalityType}`);

    // Save test result to database
    const { data: test, error: testQueryError } = await supabase
      .from('tests')
      .select('id')
      .eq('type', testType)
      .single();
    
    if (testQueryError && testQueryError.code !== 'PGRST116') { // PGRST116 is "No rows returned"
      console.error('Error querying for test:', testQueryError);
      throw testQueryError;
    }
    
    let testId;
    
    if (!test) {
      // If test doesn't exist, create it
      const testName = getTestName(testType);
      const { data: newTest, error: testError } = await supabase
        .from('tests')
        .insert({ type: testType, name: testName })
        .select()
        .single();
        
      if (testError) {
        console.error('Error creating test:', testError);
        throw testError;
      }
      testId = newTest.id;
      console.log(`Created new test with ID ${testId}`);
    } else {
      testId = test.id;
      console.log(`Found existing test with ID ${testId}`);
    }

    // Save user's test result
    const { error: resultError } = await supabase
      .from('user_test_results')
      .insert({
        user_id: userId,
        test_id: testId,
        result: result.personalityType,
        result_details: {
          traits: result.traits,
          responses
        }
      });
      
    if (resultError) {
      console.error('Error saving test result:', resultError);
      throw resultError;
    }
    
    console.log(`Saved test result for user ${userId}`);
    
    // Update the user's profile with their personality type if it's MBTI
    if (testType === 'mbti') {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ personality_type: result.personalityType })
        .eq('id', userId);
        
      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }
      console.log(`Updated user profile with personality type ${result.personalityType}`);
    }

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

function getTestName(testType: string): string {
  switch (testType) {
    case 'mbti':
      return 'Myers-Briggs Type Indicator (MBTI)';
    case 'big5':
      return 'Big Five Personality Test';
    case 'enneagram':
      return 'Enneagram Test';
    case 'quick':
      return 'Quick Personality Quiz';
    default:
      return `${testType.toUpperCase()} Personality Test`;
  }
}

function analyzeMBTI(responses: TestResponse[]): AnalyzeTestResult {
  // Count letters to determine personality type
  const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  
  // Count each dimension
  responses.forEach(response => {
    const answer = response.answer;
    if (answer in counts) {
      counts[answer as keyof typeof counts]++;
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
      score: Math.round((counts.E / (counts.E + counts.I || 1)) * 100),
      preference: counts.E > counts.I ? 'Extraversion' : 'Introversion'
    },
    {
      dimension: 'Sensing-Intuition',
      score: Math.round((counts.S / (counts.S + counts.N || 1)) * 100),
      preference: counts.S > counts.N ? 'Sensing' : 'Intuition'
    },
    {
      dimension: 'Thinking-Feeling',
      score: Math.round((counts.T / (counts.T + counts.F || 1)) * 100),
      preference: counts.T > counts.F ? 'Thinking' : 'Feeling'
    },
    {
      dimension: 'Judging-Perceiving',
      score: Math.round((counts.J / (counts.J + counts.P || 1)) * 100),
      preference: counts.J > counts.P ? 'Judging' : 'Perceiving'
    }
  ];

  return {
    personalityType,
    traits,
    description: `You are an ${personalityType} type, which means you tend to be ${traits[0].preference}, ${traits[1].preference}, ${traits[2].preference}, and ${traits[3].preference}.`
  };
}

function analyzeBig5(responses: TestResponse[]): AnalyzeTestResult {
  // Initialize scores for each dimension
  const dimensionScores = {
    O: 0, // Openness
    C: 0, // Conscientiousness
    E: 0, // Extraversion
    A: 0, // Agreeableness
    N: 0, // Neuroticism
    Ocount: 0,
    Ccount: 0,
    Ecount: 0,
    Acount: 0,
    Ncount: 0
  };
  
  // Sum scores for each dimension
  responses.forEach(response => {
    const dimension = response.answer.charAt(0);
    const score = parseInt(response.answer.charAt(1));
    
    if (!isNaN(score)) {
      dimensionScores[dimension as keyof typeof dimensionScores] += score;
      dimensionScores[`${dimension}count` as keyof typeof dimensionScores]++;
    }
  });
  
  // Calculate average scores
  const averageScores = {
    O: Math.round((dimensionScores.O / (dimensionScores.Ocount || 1)) * 20), // Scale to 0-100
    C: Math.round((dimensionScores.C / (dimensionScores.Ccount || 1)) * 20),
    E: Math.round((dimensionScores.E / (dimensionScores.Ecount || 1)) * 20),
    A: Math.round((dimensionScores.A / (dimensionScores.Acount || 1)) * 20),
    N: Math.round((dimensionScores.N / (dimensionScores.Ncount || 1)) * 20)
  };
  
  // Create personality type string (OCEAN-[O]-[C]-[E]-[A]-[N])
  const personalityType = `OCEAN-${averageScores.O}-${averageScores.C}-${averageScores.E}-${averageScores.A}-${averageScores.N}`;
  
  // Generate traits array
  const traits = [
    {
      dimension: 'Openness',
      score: averageScores.O,
      preference: averageScores.O > 70 ? 'High Openness' : averageScores.O > 30 ? 'Moderate Openness' : 'Low Openness'
    },
    {
      dimension: 'Conscientiousness',
      score: averageScores.C,
      preference: averageScores.C > 70 ? 'High Conscientiousness' : averageScores.C > 30 ? 'Moderate Conscientiousness' : 'Low Conscientiousness'
    },
    {
      dimension: 'Extraversion',
      score: averageScores.E,
      preference: averageScores.E > 70 ? 'High Extraversion' : averageScores.E > 30 ? 'Moderate Extraversion' : 'Low Extraversion'
    },
    {
      dimension: 'Agreeableness',
      score: averageScores.A,
      preference: averageScores.A > 70 ? 'High Agreeableness' : averageScores.A > 30 ? 'Moderate Agreeableness' : 'Low Agreeableness'
    },
    {
      dimension: 'Neuroticism',
      score: averageScores.N,
      preference: averageScores.N > 70 ? 'High Neuroticism' : averageScores.N > 30 ? 'Moderate Neuroticism' : 'Low Neuroticism'
    }
  ];
  
  return {
    personalityType,
    traits,
    description: `Your Big Five personality profile shows ${traits[0].preference}, ${traits[1].preference}, ${traits[2].preference}, ${traits[3].preference}, and ${traits[4].preference}.`
  };
}

function analyzeEnneagram(responses: TestResponse[]): AnalyzeTestResult {
  // Count votes for each type
  const typeCounts: Record<string, number> = {};
  
  responses.forEach(response => {
    const type = response.answer;
    if (type !== '0') { // Skip neutral answers
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    }
  });
  
  // Find type with most votes
  let maxVotes = 0;
  let dominantTypes: string[] = [];
  
  Object.entries(typeCounts).forEach(([type, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      dominantTypes = [type];
    } else if (count === maxVotes) {
      dominantTypes.push(type);
    }
  });
  
  // Combine multiple dominant types if needed
  const personalityType = `Type-${dominantTypes.join('/')}`;
  
  // Map type names
  const typeNames: Record<string, string> = {
    '1': 'The Perfectionist',
    '2': 'The Helper',
    '3': 'The Achiever',
    '4': 'The Individualist',
    '5': 'The Investigator',
    '6': 'The Loyalist',
    '7': 'The Enthusiast',
    '8': 'The Challenger',
    '9': 'The Peacemaker'
  };
  
  // Create traits array
  const traits = dominantTypes.map(type => ({
    dimension: `Type ${type}`,
    score: Math.round((typeCounts[type] / responses.length) * 100),
    preference: typeNames[type] || `Type ${type}`
  }));
  
  // Create description
  let description = 'Your dominant Enneagram type is ';
  if (dominantTypes.length === 1) {
    const type = dominantTypes[0];
    description += `Type ${type}: ${typeNames[type]}.`;
  } else {
    description += 'a combination of ' + dominantTypes.map(type => `Type ${type} (${typeNames[type]})`).join(' and ') + '.';
  }
  
  return {
    personalityType,
    traits,
    description
  };
}

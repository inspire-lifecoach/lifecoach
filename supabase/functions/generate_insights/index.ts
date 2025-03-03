
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateInsightsRequest {
  personalityType: string;
  userId?: string;
  areas?: string[];
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
    const requestData: GenerateInsightsRequest = await req.json();
    const { personalityType, userId, areas = ['career', 'relationships', 'personal_growth'] } = requestData;

    if (!personalityType) {
      return new Response(
        JSON.stringify({ error: 'Personality type is required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // In a real implementation, you'd call your AI service here
    // const aiResponse = await fetch('https://ai.inspirecreations.it.com/api/v1/persona/generate-insights', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${Deno.env.get('AI_SERVICE_API_KEY')}`
    //   },
    //   body: JSON.stringify({ personalityType, userId, areas })
    // });
    
    // const result = await aiResponse.json();

    // Mock insights for demonstration
    const mockInsights = {
      personalityType,
      timestamp: new Date().toISOString(),
      insights: [
        {
          category: 'career',
          title: 'Career Development',
          content: `As a ${personalityType}, you thrive in environments that allow for ${personalityType.includes('I') ? 'independent work' : 'collaborative work'} and ${personalityType.includes('N') ? 'creative problem-solving' : 'practical application'}. Consider roles that leverage your ${personalityType.includes('T') ? 'analytical thinking' : 'people skills'} and ${personalityType.includes('J') ? 'organizational abilities' : 'adaptability'}.`
        },
        {
          category: 'relationships',
          title: 'Relationship Dynamics',
          content: `In relationships, your ${personalityType.includes('F') ? 'empathetic nature' : 'logical approach'} can be a strength, but remember to balance it with ${personalityType.includes('F') ? 'setting healthy boundaries' : 'emotional awareness'}. You connect best with people who appreciate your ${personalityType.includes('I') ? 'thoughtful communication' : 'energetic presence'} and respect your need for ${personalityType.includes('J') ? 'structure' : 'spontaneity'}.`
        },
        {
          category: 'personal_growth',
          title: 'Personal Development',
          content: `For continued growth, focus on developing your ${personalityType.includes('S') ? 'big-picture thinking' : 'attention to detail'} and practice ${personalityType.includes('T') ? 'emotional intelligence' : 'objective analysis'} in challenging situations. Your ${personalityType.includes('P') ? 'flexibility' : 'determination'} is a valuable asset that can help you achieve meaningful goals.`
        }
      ]
    };

    // Save insights to database if userId is provided
    if (userId) {
      for (const insight of mockInsights.insights) {
        const { error } = await supabase
          .from('insights')
          .insert({
            personality_type: personalityType,
            category: insight.category,
            title: insight.title,
            content: insight.content
          });
          
        if (error) console.error('Error saving insight:', error);
      }
    }

    return new Response(
      JSON.stringify(mockInsights),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating insights:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to generate insights' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

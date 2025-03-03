
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GetRecommendationsRequest {
  personalityType: string;
  userId?: string;
  categories?: string[];
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
    const requestData: GetRecommendationsRequest = await req.json();
    const { personalityType, userId, categories = ['career', 'personal_growth', 'relationships', 'learning'] } = requestData;

    if (!personalityType) {
      return new Response(
        JSON.stringify({ error: 'Personality type is required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // In a real implementation, you'd call your AI service here
    // const aiResponse = await fetch('https://ai.inspirecreations.it.com/api/v1/persona/recommendations', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${Deno.env.get('AI_SERVICE_API_KEY')}`
    //   },
    //   body: JSON.stringify({ personalityType, userId, categories })
    // });
    
    // const result = await aiResponse.json();

    // Mock recommendations for demonstration
    const mockRecommendations = {
      personalityType,
      timestamp: new Date().toISOString(),
      recommendations: [
        {
          id: '1',
          category: 'career',
          title: 'Career Development Pathways',
          description: `Based on your ${personalityType} personality type, consider exploring careers that allow for ${personalityType.includes('I') ? 'deep focus and independent work' : 'collaboration and social interaction'}. Look for roles where your ${personalityType.includes('N') ? 'vision and creativity' : 'practical skills and attention to detail'} can be fully utilized.`,
          resources: [
            { title: 'Strategic Career Planning', url: 'https://example.com/career', type: 'book' },
            { title: 'Finding Your Professional Niche', url: 'https://example.com/niche', type: 'course' }
          ]
        },
        {
          id: '2',
          category: 'personal_growth',
          title: 'Personal Development Focus Areas',
          description: `Consider working on ${personalityType.includes('T') ? 'emotional intelligence to balance your logical approach' : 'analytical skills to complement your emotional intelligence'}. Developing better ${personalityType.includes('E') ? 'listening skills' : 'self-expression skills'} can help you connect with others more effectively.`,
          resources: [
            { title: `${personalityType.includes('T') ? 'Emotional Intelligence for Analytical Minds' : 'Structured Thinking for Empathetic People'}`, url: 'https://example.com/eq', type: 'book' },
            { title: 'Building Meaningful Connections', url: 'https://example.com/connections', type: 'article' }
          ]
        },
        {
          id: '3',
          category: 'learning',
          title: 'Learning Style Optimization',
          description: `Your personality type tends to excel with ${personalityType.includes('N') ? 'conceptual learning' : 'practical, hands-on learning'}. Consider ${personalityType.includes('J') ? 'structured learning environments' : 'flexible learning environments'} that still allow for ${personalityType.includes('P') ? 'exploration of topics' : 'clear objectives and outcomes'}.`,
          resources: [
            { title: 'Advanced Learning Techniques', url: 'https://example.com/learning', type: 'course' },
            { title: 'The Science of Effective Study', url: 'https://example.com/study', type: 'video' }
          ]
        },
        {
          id: '4',
          category: 'relationships',
          title: 'Relationship Dynamics',
          description: `In relationships, your ${personalityType} type brings ${personalityType.includes('F') ? 'empathy and emotional support' : 'clarity and problem-solving'}. Focus on developing ${personalityType.includes('T') ? 'more patience with others' emotions' : 'more objective assessment of situations'} to enhance your relationships.`,
          resources: [
            { title: 'Understanding Personality in Relationships', url: 'https://example.com/relationships', type: 'book' },
            { title: 'Communication Styles for Different Types', url: 'https://example.com/communication', type: 'article' }
          ]
        }
      ]
    };

    // Filter recommendations by requested categories
    mockRecommendations.recommendations = mockRecommendations.recommendations.filter(
      rec => categories.includes(rec.category)
    );

    // Save recommendations to database if userId is provided
    if (userId) {
      for (const recommendation of mockRecommendations.recommendations) {
        const { error } = await supabase
          .from('recommendations')
          .insert({
            user_id: userId,
            type: recommendation.category,
            title: recommendation.title,
            description: recommendation.description,
            resources: recommendation.resources
          });
          
        if (error) console.error('Error saving recommendation:', error);
      }
    }

    return new Response(
      JSON.stringify(mockRecommendations),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating recommendations:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to generate recommendations' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

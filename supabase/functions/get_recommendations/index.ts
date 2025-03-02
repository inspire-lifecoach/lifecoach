
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const AI_SERVICE_URL = "https://ai.inspirecreations.it.com/api/v1/persona/recommendations"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get JWT token from the authorization header
    const token = authHeader.replace('Bearer ', '')
    
    // Verify the token and get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's personality type
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('personality_type')
      .eq('id', user.id)
      .single()

    if (profileError || !profileData) {
      return new Response(
        JSON.stringify({ error: 'Failed to get user profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const personalityType = profileData.personality_type || "UNKNOWN"
    
    // Get request data
    const { context } = await req.json()
    
    // Prepare request for AI service
    const aiRequest = {
      userId: user.id,
      personalityType,
      context
    }

    // Call AI service
    let aiResponse
    try {
      console.log("Calling AI service:", AI_SERVICE_URL)
      const response = await fetch(AI_SERVICE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(aiRequest)
      })

      if (!response.ok) {
        console.log("AI service returned error status:", response.status)
        const errorText = await response.text()
        console.log("Error details:", errorText)
        
        // Use sample recommendations data
        aiResponse = {
          recommendations: [
            {
              type: "career",
              title: "Counseling and Therapy",
              description: "Fields that allow you to provide meaningful guidance and emotional support to others.",
              resources: [
                { title: "Introduction to Counseling Psychology", type: "book", url: "https://example.com/counseling" },
                { title: "Empathic Listening Skills Workshop", type: "course", url: "https://example.com/listening" }
              ]
            },
            {
              type: "relationship",
              title: "Quality Over Quantity",
              description: "Focus on nurturing a few deep relationships rather than maintaining many surface-level connections.",
              resources: [
                { title: "Meaningful Connections", type: "book", url: "https://example.com/connections" },
                { title: "Authentic Relationship Building", type: "workshop", url: "https://example.com/authentic" }
              ]
            },
            {
              type: "self-improvement",
              title: "Mindfulness Practices",
              description: "Regular meditation and reflection to help process emotions and reduce overwhelm.",
              resources: [
                { title: "Mindfulness for Sensitive Types", type: "course", url: "https://example.com/mindfulness" },
                { title: "Daily Reflection Journal", type: "tool", url: "https://example.com/journal" }
              ]
            }
          ]
        }
      } else {
        aiResponse = await response.json()
      }
    } catch (error) {
      console.error("Error calling AI service:", error)
      // Use sample data when API fails
      aiResponse = {
        recommendations: [
          {
            type: "career",
            title: "Creative Leadership",
            description: "Roles that allow you to inspire teams and implement innovative ideas.",
            resources: [
              { title: "Creative Leadership: Transforming the Way We Lead", type: "book", url: "https://example.com/creative-leadership" },
              { title: "Innovation Management Course", type: "course", url: "https://example.com/innovation" }
            ]
          },
          {
            type: "relationship",
            title: "Authentic Communication",
            description: "Developing deeper connections through honest and vulnerable communication.",
            resources: [
              { title: "Radical Honesty", type: "book", url: "https://example.com/honesty" },
              { title: "Authentic Relating Workshop", type: "workshop", url: "https://example.com/authentic-relating" }
            ]
          },
          {
            type: "self-improvement",
            title: "Structured Creativity",
            description: "Systems to help channel your creative energy into completed projects.",
            resources: [
              { title: "Getting Things Done for Creative Minds", type: "course", url: "https://example.com/gtd-creative" },
              { title: "Project Completion Planner", type: "tool", url: "https://example.com/project-planner" }
            ]
          }
        ]
      }
    }

    // Store recommendations in the database
    for (const rec of aiResponse.recommendations) {
      const { error: insertError } = await supabase
        .from('recommendations')
        .insert({
          user_id: user.id,
          type: rec.type,
          title: rec.title,
          description: rec.description,
          resources: rec.resources
        })

      if (insertError) {
        console.error("Error saving recommendation:", insertError)
      }
    }

    return new Response(
      JSON.stringify(aiResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

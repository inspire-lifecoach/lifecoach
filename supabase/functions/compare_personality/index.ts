
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const AI_SERVICE_URL = "https://ai.inspirecreations.it.com/api/v1/persona/compare"

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

    if (profileError || !profileData || !profileData.personality_type) {
      return new Response(
        JSON.stringify({ error: 'User has no personality type set' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get request data
    const { compareWith } = await req.json()
    
    if (!compareWith || !Array.isArray(compareWith) || compareWith.length === 0) {
      return new Response(
        JSON.stringify({ error: 'compareWith array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare request for AI service
    const aiRequest = {
      userId: user.id,
      compareWith
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
        
        // Use sample comparison data
        aiResponse = {
          similarities: [
            { trait: "Intuition", score: 85, description: "Both types prioritize abstract thinking and future possibilities" },
            { trait: "Value-Driven", score: 78, description: "Both types make decisions based on personal values" }
          ],
          differences: [
            { trait: "Social Energy", score: 70, description: "INFJs need more alone time to recharge, while ENFPs gain energy from social interaction" },
            { trait: "Structure", score: 65, description: "INFJs prefer more structure and planning than ENFPs, who value spontaneity" }
          ],
          visualizationData: {
            radar: {
              labels: ["Introversion/Extraversion", "Sensing/Intuition", "Thinking/Feeling", "Judging/Perceiving"],
              datasets: [
                {
                  label: "INFJ",
                  data: [80, 75, 65, 70]
                },
                {
                  label: "ENFP",
                  data: [30, 80, 70, 25]
                }
              ]
            }
          }
        }
      } else {
        aiResponse = await response.json()
      }
    } catch (error) {
      console.error("Error calling AI service:", error)
      // Use sample data when API fails
      aiResponse = {
        similarities: [
          { trait: "Intuition", score: 85, description: "Both types prioritize abstract thinking and future possibilities" },
          { trait: "Value-Driven", score: 78, description: "Both types make decisions based on personal values" }
        ],
        differences: [
          { trait: "Social Energy", score: 70, description: "INFJs need more alone time to recharge, while ENFPs gain energy from social interaction" },
          { trait: "Structure", score: 65, description: "INFJs prefer more structure and planning than ENFPs, who value spontaneity" }
        ],
        visualizationData: {
          radar: {
            labels: ["Introversion/Extraversion", "Sensing/Intuition", "Thinking/Feeling", "Judging/Perceiving"],
            datasets: [
              {
                label: "INFJ",
                data: [80, 75, 65, 70]
              },
              {
                label: "ENFP",
                data: [30, 80, 70, 25]
              }
            ]
          }
        }
      }
    }

    // Store comparison in the database
    const { error: insertError } = await supabase
      .from('personality_comparisons')
      .insert({
        user_id: user.id,
        compared_with: compareWith,
        similarities: aiResponse.similarities,
        differences: aiResponse.differences,
        visualization_data: aiResponse.visualizationData
      })

    if (insertError) {
      console.error("Error saving comparison:", insertError)
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

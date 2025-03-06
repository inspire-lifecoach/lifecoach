
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    // Get the authorization header
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

    const { user_id } = await req.json()
    
    if (!user_id || user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch the user's data to generate personalized check-ins
    const [journalEntries, testResults, previousCheckIns] = await Promise.all([
      // Get recent journal entries
      supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(10)
        .then(({ data }) => data || []),
      
      // Get test results
      supabase
        .from('user_test_results')
        .select('*')
        .eq('user_id', user_id)
        .then(({ data }) => data || []),
      
      // Get previous check-ins
      supabase
        .from('check_ins')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(5)
        .then(({ data }) => data || [])
    ])

    // Generate a check-in based on available data
    const checkIn = generatePersonalizedCheckIn(journalEntries, testResults, previousCheckIns)
    
    // Save the generated check-in
    const { data: savedCheckIn, error: saveError } = await supabase
      .from('check_ins')
      .insert({
        user_id: user_id,
        question: checkIn.question,
        context: checkIn.context,
        relevance_type: checkIn.relevance_type,
        responded: false
      })
      .select()
      .single()
    
    if (saveError) {
      throw saveError
    }

    return new Response(
      JSON.stringify(savedCheckIn),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Error in generate_check_in:", error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Function to generate personalized check-ins based on user data
function generatePersonalizedCheckIn(journalEntries, testResults, previousCheckIns) {
  // Journal-based check-ins
  if (journalEntries.length > 0) {
    const recentEntry = journalEntries[0]
    const entryDate = new Date(recentEntry.created_at)
    const today = new Date()
    const daysSinceEntry = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 3600 * 24))
    
    // Check if entry is recent (within last 3 days)
    if (daysSinceEntry <= 3) {
      // Extract themes or key words from the entry
      const entryThemes = extractThemesFromContent(recentEntry.content)
      
      // Check if we found any meaningful themes
      if (entryThemes.length > 0) {
        const randomTheme = entryThemes[Math.floor(Math.random() * entryThemes.length)]
        
        // Create a follow-up question based on the theme
        return {
          question: `How are you feeling about ${randomTheme} today?`,
          context: `Based on your journal entry from ${daysSinceEntry === 0 ? 'today' : daysSinceEntry === 1 ? 'yesterday' : `${daysSinceEntry} days ago`}`,
          relevance_type: 'journal'
        }
      }
      
      // If no specific theme was found, ask a general follow-up
      return {
        question: "How have things developed since your last journal entry?",
        context: `Following up on your entry from ${daysSinceEntry === 0 ? 'today' : daysSinceEntry === 1 ? 'yesterday' : `${daysSinceEntry} days ago`}`,
        relevance_type: 'journal'
      }
    }
  }
  
  // Date-based check-ins (special dates, weekends, etc.)
  const today = new Date()
  const dayOfWeek = today.getDay()
  
  // If it's Monday, ask about the weekend
  if (dayOfWeek === 1) {
    return {
      question: "How was your weekend?",
      context: "It's the start of a new week",
      relevance_type: 'date'
    }
  }
  
  // If it's Friday, ask about weekend plans
  if (dayOfWeek === 5) {
    return {
      question: "Any plans for the weekend?",
      context: "The weekend is coming up",
      relevance_type: 'date'
    }
  }
  
  // Test result-based check-ins
  if (testResults.length > 0) {
    const randomTest = testResults[Math.floor(Math.random() * testResults.length)]
    
    return {
      question: `Have you noticed your ${randomTest.result} personality traits influencing your decisions lately?`,
      context: "Based on your personality test results",
      relevance_type: 'test-result'
    }
  }
  
  // General check-ins (if no specific context is available)
  const generalCheckIns = [
    {
      question: "How are you feeling today?",
      context: "Daily check-in",
      relevance_type: 'general'
    },
    {
      question: "What's something you're looking forward to?",
      context: "Exploring your future outlook",
      relevance_type: 'general'
    },
    {
      question: "Have you taken any time for self-care recently?",
      context: "Checking on your wellbeing",
      relevance_type: 'general'
    },
    {
      question: "What's been on your mind lately?",
      context: "General reflection",
      relevance_type: 'general'
    },
    {
      question: "How did you sleep last night?",
      context: "Checking on your rest",
      relevance_type: 'general'
    }
  ]
  
  // If we have previous check-ins, make sure we don't repeat the most recent ones
  if (previousCheckIns.length > 0) {
    const recentQuestions = previousCheckIns.map(ci => ci.question)
    const availableCheckIns = generalCheckIns.filter(ci => !recentQuestions.includes(ci.question))
    
    if (availableCheckIns.length > 0) {
      return availableCheckIns[Math.floor(Math.random() * availableCheckIns.length)]
    }
  }
  
  return generalCheckIns[Math.floor(Math.random() * generalCheckIns.length)]
}

// Helper function to extract themes from content
function extractThemesFromContent(content) {
  const themeKeywords = {
    work: ['work', 'job', 'career', 'office', 'boss', 'colleague', 'meeting'],
    relationships: ['friend', 'partner', 'family', 'relationship', 'date', 'love', 'boyfriend', 'girlfriend', 'spouse', 'marriage'],
    health: ['health', 'exercise', 'workout', 'gym', 'diet', 'sick', 'illness', 'doctor'],
    personal_growth: ['learn', 'growth', 'improve', 'goal', 'achievement', 'progress', 'develop'],
    stress: ['stress', 'anxiety', 'worry', 'pressure', 'overwhelm', 'deadline', 'nervous'],
    celebration: ['celebration', 'party', 'birthday', 'anniversary', 'graduate', 'promotion', 'success'],
    travel: ['travel', 'trip', 'vacation', 'flight', 'journey', 'visit', 'explore'],
    education: ['study', 'class', 'course', 'learn', 'school', 'university', 'college', 'exam', 'test'],
    creativity: ['create', 'art', 'music', 'paint', 'write', 'design', 'craft', 'hobby'],
    finance: ['money', 'finance', 'budget', 'saving', 'expense', 'invest', 'buy', 'purchase']
  }
  
  const foundThemes = []
  const contentLower = content.toLowerCase()
  
  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    if (keywords.some(keyword => contentLower.includes(keyword))) {
      foundThemes.push(theme)
    }
  }
  
  return foundThemes
}

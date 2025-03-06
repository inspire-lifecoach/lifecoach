
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Tag, HeartPulse, Activity, Brain, BookOpen, MessageCircle } from "lucide-react";
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface JournalAnalysisProps {
  entryId: string;
}

interface JournalEntry {
  id: string;
  content: string;
  created_at: string;
  mood: string | null;
  user_id: string;
  entry_type: 'text' | 'voice';
  audio_url: string | null;
}

interface AnalysisData {
  id: string;
  entry_id: string;
  created_at: string;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  } | null;
  themes: string[] | null;
  personality_insights: {
    extraversion_indicators: string;
    conscientiousness_indicators: string;
    openness_indicators: string;
  } | null;
}

const JournalAnalysis: React.FC<JournalAnalysisProps> = ({ entryId }) => {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEntryAndAnalysis() {
      try {
        setIsLoading(true);
        
        // Fetch the entry
        const { data: entryData, error: entryError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('id', entryId)
          .single();
          
        if (entryError) throw entryError;
        
        // Fetch the analysis
        const { data: analysisData, error: analysisError } = await supabase
          .from('journal_analyses')
          .select('*')
          .eq('entry_id', entryId)
          .single();
          
        if (analysisError && analysisError.code !== 'PGRST116') throw analysisError;
        
        setEntry(entryData as JournalEntry);
        setAnalysis(analysisData as AnalysisData);
      } catch (error: any) {
        console.error('Error fetching journal analysis:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEntryAndAnalysis();
  }, [entryId]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const getThemeLabel = (theme: string) => {
    const themeLabels: Record<string, string> = {
      'work': 'Work & Career',
      'relationships': 'Relationships',
      'health': 'Health & Wellness',
      'personal_growth': 'Personal Growth',
      'stress': 'Stress & Anxiety',
      'general': 'General Thoughts'
    };
    
    return themeLabels[theme] || theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  const getThemeColor = (theme: string) => {
    const themeColors: Record<string, string> = {
      'work': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'relationships': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'health': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'personal_growth': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'stress': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      'general': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    };
    
    return themeColors[theme] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  // Generate reflection questions based on themes and sentiment
  const getReflectionQuestions = () => {
    if (!analysis?.themes || !analysis.sentiment) return [];
    
    const questions: string[] = [];
    
    // Add theme-based questions
    analysis.themes.forEach(theme => {
      switch (theme) {
        case 'work':
          questions.push("How does your work environment affect your mental well-being?");
          questions.push("What aspects of your job bring you the most satisfaction?");
          break;
        case 'relationships':
          questions.push("How do your relationships support your personal growth?");
          questions.push("What patterns do you notice in how you connect with others?");
          break;
        case 'health':
          questions.push("How are your daily habits influencing your overall health?");
          questions.push("What small changes could improve your well-being?");
          break;
        case 'personal_growth':
          questions.push("What has been your biggest lesson in personal development recently?");
          questions.push("How are you challenging yourself to grow?");
          break;
        case 'stress':
          questions.push("What coping mechanisms work best for you when feeling overwhelmed?");
          questions.push("How can you create more moments of calm in your daily routine?");
          break;
        default:
          questions.push("What patterns do you notice in your thoughts and feelings?");
          questions.push("How do your daily experiences connect to your values?");
      }
    });
    
    // Add sentiment-based questions
    if (analysis.sentiment.negative > 0.4) {
      questions.push("What factors might be contributing to your challenging emotions?");
      questions.push("How can you show yourself compassion during difficult moments?");
    } else if (analysis.sentiment.positive > 0.6) {
      questions.push("What factors are contributing to your positive state of mind?");
      questions.push("How can you bring these positive elements into other areas of your life?");
    }
    
    // Limit to 3 diverse questions
    return questions.slice(0, 3);
  };
  
  // Generate personalized advice based on analysis
  const getPersonalizedAdvice = () => {
    if (!analysis) return null;
    
    let advice = "";
    
    // Based on themes
    if (analysis.themes && analysis.themes.includes('stress')) {
      advice = "Your entry indicates some stress. Consider practicing a brief mindfulness meditation or taking a short walk outdoors to help reset your nervous system.";
    } else if (analysis.themes && analysis.themes.includes('relationships')) {
      advice = "Relationships seem important in this entry. Remember that healthy communication includes both expressing your needs and actively listening to others.";
    } else if (analysis.themes && analysis.themes.includes('personal_growth')) {
      advice = "Your focus on growth is evident. Consider setting a small, achievable goal this week that aligns with your personal development.";
    } else if (analysis.sentiment && analysis.sentiment.negative > 0.4) {
      advice = "I notice some challenging emotions in your entry. Remember that all feelings are valid and temporary - practicing self-compassion during difficult moments can be helpful.";
    } else if (analysis.sentiment && analysis.sentiment.positive > 0.6) {
      advice = "Your positive outlook shines through. Try to identify what specific factors contributed to these positive feelings so you can intentionally incorporate them more often.";
    } else {
      advice = "Regularly journaling like this helps build self-awareness over time. Consider reviewing past entries periodically to identify patterns in your thoughts and feelings.";
    }
    
    return advice;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-destructive">Error loading analysis: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!entry) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Entry not found</p>
        </CardContent>
      </Card>
    );
  }

  const reflectionQuestions = getReflectionQuestions();
  const personalizedAdvice = getPersonalizedAdvice();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Journal Entry</CardTitle>
          <CardDescription>
            <div className="flex flex-wrap gap-2 mt-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {entry.created_at && formatDate(entry.created_at)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {entry.created_at && formatTime(entry.created_at)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Tag className="h-3.5 w-3.5 mr-1" />
                {entry.entry_type === 'voice' ? 'Voice Entry' : 'Text Entry'}
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md bg-secondary/20">
            <p className="whitespace-pre-wrap">{entry.content}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="insights">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="reflection">Reflection</TabsTrigger>
          <TabsTrigger value="advice">Advice</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="space-y-4 mt-4">
          {analysis ? (
            <>
              {/* Sentiment Analysis */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <HeartPulse className="h-5 w-5 mr-2 text-rose-500" />
                    Emotional Tone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.sentiment ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Positive</span>
                        <span>{Math.round(analysis.sentiment.positive * 100)}%</span>
                      </div>
                      <Progress value={analysis.sentiment.positive * 100} className="h-2 bg-muted" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Neutral</span>
                        <span>{Math.round(analysis.sentiment.neutral * 100)}%</span>
                      </div>
                      <Progress value={analysis.sentiment.neutral * 100} className="h-2 bg-muted" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Negative</span>
                        <span>{Math.round(analysis.sentiment.negative * 100)}%</span>
                      </div>
                      <Progress value={analysis.sentiment.negative * 100} className="h-2 bg-muted" />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Sentiment analysis not available</p>
                  )}
                </CardContent>
              </Card>
              
              {/* Themes */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-indigo-500" />
                    Key Themes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.themes && analysis.themes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {analysis.themes.map((theme, index) => (
                        <Badge key={index} className={getThemeColor(theme)}>
                          {getThemeLabel(theme)}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No specific themes identified</p>
                  )}
                </CardContent>
              </Card>
              
              {/* Personality Insights */}
              {analysis.personality_insights && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-violet-500" />
                      Personality Indicators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium">Extraversion:</span>{' '}
                        <span className="text-muted-foreground">{analysis.personality_insights.extraversion_indicators}</span>
                      </div>
                      <div>
                        <span className="font-medium">Conscientiousness:</span>{' '}
                        <span className="text-muted-foreground">{analysis.personality_insights.conscientiousness_indicators}</span>
                      </div>
                      <div>
                        <span className="font-medium">Openness:</span>{' '}
                        <span className="text-muted-foreground">{analysis.personality_insights.openness_indicators}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">Analysis not yet available for this entry</p>
                <Button className="mt-4" variant="outline">Generate Analysis</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="reflection" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <BookOpen className="h-5 w-5 mr-2 text-cyan-600" />
                Questions for Reflection
              </CardTitle>
              <CardDescription>
                Consider these questions to deepen your self-awareness
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reflectionQuestions.length > 0 ? (
                <ul className="space-y-4">
                  {reflectionQuestions.map((question, index) => (
                    <li key={index} className="p-3 bg-muted/50 rounded-md border">
                      <p className="text-sm">{question}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Complete the analysis to receive reflection questions
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advice" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <MessageCircle className="h-5 w-5 mr-2 text-emerald-600" />
                Personalized Insight
              </CardTitle>
              <CardDescription>
                Based on the themes and patterns in your entry
              </CardDescription>
            </CardHeader>
            <CardContent>
              {personalizedAdvice ? (
                <div className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-lg border border-violet-100 dark:border-violet-900/50">
                  <p className="text-sm">{personalizedAdvice}</p>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Complete the analysis to receive personalized advice
                </p>
              )}
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Would you like to explore this further?</h4>
                <Button className="w-full">
                  Start a conversation with your advisor
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalAnalysis;

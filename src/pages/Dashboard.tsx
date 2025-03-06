
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, BookOpen, LineChart, BrainCircuit, MessageSquare } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTestResults } from '@/hooks/useTests';
import { useProfile } from '@/hooks/useProfile';
import AdvisorInsight from '@/components/AdvisorInsight';
import ProgressBar from '@/components/ProgressBar';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { results, loading } = useTestResults();

  // Get latest test result
  const latestResult = results.length > 0 ? results[0] : null;
  
  // Calculate test stats
  const completedTests = new Set(results.map(r => r.test?.type));
  const totalTests = 4; // MBTI, Big Five, Enneagram, Persona
  const completedCount = completedTests.size;
  const completionPercentage = (completedCount / totalTests) * 100;

  // Generate advisor insights based on user data
  const insights = [
    {
      title: "Reflect on your communication style",
      description: profile?.personality_type?.includes('E') 
        ? "As an extrovert, you gain energy from social interactions. Try to be mindful of giving others space to share their thoughts in conversations."
        : "As an introvert, you process information internally. Consider sharing your thoughts more often with others to avoid misunderstandings.",
      type: 'reflection' as const,
      source: 'test-result' as const
    },
    {
      title: "Practice mindfulness daily",
      description: "Taking just 5 minutes each day to practice mindfulness can help reduce stress and improve your focus. Try incorporating this into your morning routine.",
      type: 'suggestion' as const,
      source: 'interaction' as const
    },
    {
      title: "Express your emotions more openly",
      description: "Your journal entries indicate you tend to internalize your feelings. Challenge yourself to express emotions more directly with trusted friends or family.",
      type: 'challenge' as const,
      source: 'journal' as const
    }
  ];

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {profile?.full_name || 'Friend'}</h1>
          <p className="text-muted-foreground mt-1">
            Your personal growth assistant is here to help you understand yourself better
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-indigo-500" />
                Journal Entries
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-3xl font-bold">3</div>
              <p className="text-sm text-muted-foreground">Entries this week</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" onClick={() => navigate('/journal')}>
                Write today's entry
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BrainCircuit className="mr-2 h-5 w-5 text-violet-500" />
                Personality Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-3xl font-bold">{completedCount}/{totalTests}</div>
              <ProgressBar value={completionPercentage} className="mt-2" />
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" onClick={() => navigate('/tests')}>
                Take next test
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <LineChart className="mr-2 h-5 w-5 text-cyan-500" />
                Insights Generated
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-3xl font-bold">7</div>
              <p className="text-sm text-muted-foreground">Based on your activities</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" onClick={() => navigate('/insights')}>
                View insights
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="advisor" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="advisor">Advisor Insights</TabsTrigger>
            <TabsTrigger value="personality">Your Personality</TabsTrigger>
          </TabsList>
          <TabsContent value="advisor" className="mt-6 space-y-4">
            {insights.map((insight, index) => (
              <AdvisorInsight
                key={index}
                title={insight.title}
                description={insight.description}
                type={insight.type}
                source={insight.source}
              />
            ))}
            <div className="text-center mt-6">
              <Button onClick={() => navigate('/insights')}>
                View All Insights
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="personality" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Personality Profile</CardTitle>
                <CardDescription>
                  {profile?.personality_type 
                    ? `Your primary personality type is ${profile.personality_type}`
                    : "Take a personality test to discover your type"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile?.personality_type ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
                        {profile.personality_type}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {profile.personality_type === 'INTJ' ? 
                          "As an INTJ, you're a strategic thinker with a natural talent for analysis and planning. You value intelligence and competence, and tend to have high standards for yourself and others." :
                          `Your ${profile.personality_type} type influences how you perceive the world and make decisions.`}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Key Strengths:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                        {profile.personality_type === 'INTJ' ? (
                          <>
                            <li>Strategic thinking and planning</li>
                            <li>Independent problem solving</li>
                            <li>Analytical mindset</li>
                            <li>Ability to see the big picture</li>
                          </>
                        ) : (
                          <>
                            <li>Based on your personality type, you have unique strengths</li>
                            <li>Complete more tests to get detailed insights</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      Take a personality test to discover more about yourself
                    </p>
                    <Button onClick={() => navigate('/tests')}>
                      Take a Personality Test
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/profile')}>
                  View Full Profile
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 rounded-lg p-6 border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-start gap-4">
            <div className="bg-white dark:bg-black/20 p-3 rounded-full">
              <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Talk with your personal advisor</h2>
              <p className="text-muted-foreground mb-4">
                Share your thoughts and get personalized guidance based on your personality type and journal entries
              </p>
              <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                Start a conversation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

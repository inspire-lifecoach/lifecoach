
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Users, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import TestTypeCard from '@/components/TestTypeCard';
import ProgressBar from '@/components/ProgressBar';
import { useTests, useTestResults } from '@/hooks/useTests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';

const Tests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { results, loading: resultsLoading } = useTestResults();

  const handleTestClick = (testType: string) => {
    switch(testType) {
      case 'mbti':
        navigate('/mbti-test');
        break;
      case 'mbti-quick':
        navigate('/persona-test?quick=true');
        break;
      case 'big-five':
        navigate('/persona-test?type=big5');
        break;
      case 'enneagram':
        navigate('/persona-test?type=enneagram');
        break;
      default:
        navigate('/tests');
    }
  };

  // Calculate test completion
  const completedTests = new Set(results.map(r => r.test?.type));
  const totalTests = 4; // MBTI, Big Five, Enneagram, Persona
  const completedCount = completedTests.size;
  const completionPercentage = (completedCount / totalTests) * 100;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
            Personality Tests
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover insights about yourself through scientifically backed assessments
          </p>
        </div>

        {user && !resultsLoading && (
          <Card className="mb-8 border border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Your Progress</CardTitle>
              <CardDescription>Track your assessment journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ProgressBar 
                  value={completedCount} 
                  max={totalTests} 
                  showLabels={true}
                  leftLabel={`${completedCount} of ${totalTests} tests completed`}
                  rightLabel={`${Math.round(completionPercentage)}%`}
                />
                
                <p className="text-sm text-muted-foreground">
                  {completedCount === 0 
                    ? "Start your journey by completing your first assessment" 
                    : completedCount === totalTests 
                      ? "Congratulations! You've completed all available assessments" 
                      : "Continue your journey by completing more assessments"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Full Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TestTypeCard 
              title="MBTI Assessment"
              description="Discover which of the 16 personality types matches you best based on how you perceive the world and make decisions"
              icon={<BrainCircuit className="h-5 w-5" />}
              route="/mbti-test"
              time="10-15 mins"
              questions={16}
              variant={completedTests.has('mbti') ? "default" : "highlighted"}
            />
            
            <TestTypeCard 
              title="Big Five Assessment"
              description="Measure your personality across the five dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism"
              icon={<Users className="h-5 w-5" />}
              route="/persona-test?type=big5"
              time="8-10 mins"
              questions={10}
              variant={completedTests.has('big5') ? "default" : "highlighted"}
            />
            
            <TestTypeCard 
              title="Enneagram Assessment"
              description="Identify which of the nine personality types best represents your core motivations, fears, and desires"
              icon={<Heart className="h-5 w-5" />}
              route="/persona-test?type=enneagram"
              time="7-10 mins"
              questions={12}
              variant={completedTests.has('enneagram') ? "default" : "highlighted"}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TestTypeCard 
              title="Quick Personality Quiz"
              description="Get a rapid insight into your personality type with just a few key questions"
              icon={<Sparkles className="h-5 w-5" />}
              route="/persona-test?quick=true"
              time="2 mins"
              questions={4}
            />
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold mb-4">Why Take These Assessments?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-left">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Self-Awareness</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Gain deeper insights into your personality, strengths, and growth areas
                </p>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Personalized Advice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Receive customized recommendations based on your unique personality profile
                </p>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Track Your Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor how your personality evolves over time through journaling and retests
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tests;

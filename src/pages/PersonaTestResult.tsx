
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

interface PersonalityDescription {
  type: string;
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
}

// Sample personality descriptions (would typically come from database)
const personalityDescriptions: Record<string, PersonalityDescription> = {
  'INTJ': {
    type: 'INTJ',
    name: 'The Architect',
    description: 'Imaginative and strategic thinkers, with a plan for everything. Independent and analytical, they drive to achieve their goals and implement their ideas.',
    strengths: ['Strategic', 'Independent', 'Innovative', 'Determined', 'Rational'],
    weaknesses: ['Overly critical', 'Dismissive of emotions', 'Perfectionistic', 'Can be insensitive'],
    careers: ['Scientist', 'Engineer', 'Professor', 'Lawyer', 'Judge']
  },
  'INTP': {
    type: 'INTP',
    name: 'The Logician',
    description: 'Innovative inventors with an unquenchable thirst for knowledge. They enjoy theoretical and abstract concepts, and excel at logical analysis.',
    strengths: ['Analytical', 'Original', 'Open-minded', 'Curious', 'Objective'],
    weaknesses: ['Disconnected', 'Overthinking', 'Difficulty with practical matters', 'Can be insensitive'],
    careers: ['Physicist', 'Mathematician', 'Software Developer', 'Philosopher', 'Researcher']
  },
  'ENTJ': {
    type: 'ENTJ',
    name: 'The Commander',
    description: 'Bold, imaginative, and strong-willed leaders, always finding a way – or making one. Natural leaders who can visualize and implement change.',
    strengths: ['Efficient', 'Energetic', 'Self-confident', 'Strategic', 'Charismatic'],
    weaknesses: ['Impatient', 'Stubborn', 'Arrogant', 'Intolerant', 'Cold and ruthless'],
    careers: ['Executive', 'Entrepreneur', 'Lawyer', 'Consultant', 'Political Leader']
  },
  // Default fallback for any personality type
  'DEFAULT': {
    type: 'Your Personality Type',
    name: 'Unique Individual',
    description: "Your personality type reflects a unique combination of traits that influence how you interact with the world. Your specific strengths and preferences give you a particular perspective that is valuable in many contexts.",
    strengths: ['Unique combination of traits', 'Individual perspective', 'Personal growth potential'],
    weaknesses: ['Areas for development unique to your type'],
    careers: ['Careers aligned with your preferences and strengths']
  }
};

const PersonaTestResult = () => {
  const { personalityType } = useParams<{ personalityType: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get the personality description or use default
  const personalityDescription = personalityDescriptions[personalityType || ''] || personalityDescriptions['DEFAULT'];
  
  // If coming directly to this page, we won't have state, so we need to use the URL parameter
  const resultType = personalityType || (location.state?.personalityType || 'Unknown');
  
  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      
      try {
        // Call the generate insights function
        const response = await supabase.functions.invoke('generate_insights', {
          body: { 
            personalityType: resultType,
            areas: ['career', 'relationships', 'personal_growth']
          }
        });
        
        if (response.error) {
          throw new Error(response.error.message);
        }
        
        setInsights(response.data || null);
      } catch (error) {
        console.error('Error fetching insights:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load detailed insights. Using basic information instead.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInsights();
  }, [resultType, toast]);

  const handleGetRecommendations = () => {
    navigate('/recommendations', { state: { personalityType: resultType } });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
        Your Personality Type: {resultType}
      </h1>
      <h2 className="text-xl mb-6 text-center text-muted-foreground">
        {personalityDescription.name}
      </h2>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About Your Type</CardTitle>
          <CardDescription>Key characteristics and traits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{personalityDescription.description}</p>
          
          <div>
            <h3 className="font-medium mb-2">Strengths:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {personalityDescription.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Areas for Development:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {personalityDescription.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Career Paths That Might Suit You:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {personalityDescription.careers.map((career, index) => (
                <li key={index}>{career}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {insights && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Personalized Insights</CardTitle>
            <CardDescription>AI-generated insights based on your personality type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {insights.insights?.map((insight: any, index: number) => (
              <div key={index}>
                <h3 className="font-medium text-lg mb-2">{insight.title}</h3>
                <p className="text-muted-foreground mb-4">{insight.content}</p>
                {index < insights.insights.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
            
            {isLoading && <p className="text-center text-muted-foreground">Loading insights...</p>}
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="outline" 
          onClick={() => navigate('/tests')}
        >
          Take Another Test
        </Button>
        <Button 
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          onClick={handleGetRecommendations}
        >
          Get Personalized Recommendations
        </Button>
      </div>
    </div>
  );
};

export default PersonaTestResult;

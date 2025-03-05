
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Share2 } from "lucide-react";
import PersonalityComparison from "@/components/personality/PersonalityComparison";
import PersonalRecommendations from "@/components/recommendations/PersonalRecommendations";

const TestResult = () => {
  const { testType, personalityType } = useParams<{ testType: string; personalityType: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resultData, setResultData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!testType || !personalityType) {
      navigate('/tests');
      return;
    }

    // In a real app, this would fetch from an API
    // For demo purposes, we're using mock data
    const mockFetchResult = () => {
      setTimeout(() => {
        // Mock data based on test type
        let data;
        
        if (testType === 'mbti') {
          data = {
            title: `MBTI: ${personalityType}`,
            description: getMBTIDescription(personalityType),
            traits: getMBTITraits(personalityType),
            insights: [
              "You tend to make decisions based on logic rather than emotions",
              "You prefer structured environments and clear expectations",
              "You recharge by spending time alone rather than in social settings"
            ],
            recommendations: [
              "Consider careers that require analytical thinking",
              "Practice communicating your feelings more openly",
              "Balance your planning tendencies with occasional spontaneity"
            ]
          };
        } else if (testType === 'big-five') {
          data = {
            title: `Big Five: ${personalityType}`,
            description: "Your Big Five personality profile provides insights into your core personality dimensions.",
            traits: [
              { name: "Openness", score: 75 },
              { name: "Conscientiousness", score: 82 },
              { name: "Extraversion", score: 45 },
              { name: "Agreeableness", score: 68 },
              { name: "Neuroticism", score: 30 }
            ],
            insights: [
              "You are highly organized and detail-oriented",
              "You're open to new experiences and creative pursuits",
              "You tend to be more reserved in social situations"
            ],
            recommendations: [
              "Leverage your organizational skills in structured work environments",
              "Explore creative hobbies that satisfy your openness",
              "Practice stepping outside your comfort zone socially"
            ]
          };
        } else if (testType === 'enneagram') {
          data = {
            title: `Enneagram Type ${personalityType}`,
            description: getEnneagramDescription(personalityType),
            traits: getEnneagramTraits(personalityType),
            insights: [
              "You have a strong desire for personal growth",
              "You may struggle with certain fears related to your type",
              "Your stress and growth patterns follow predictable paths"
            ],
            recommendations: [
              "Practice mindfulness to become aware of your automatic patterns",
              "Develop self-compassion around your core fears",
              "Connect with others of your same type for support"
            ]
          };
        } else {
          // Default persona data
          data = {
            title: `Persona: ${personalityType}`,
            description: "Your persona test results reveal insights about your personality profile.",
            traits: [
              "Analytical thinking",
              "Creative problem-solving",
              "Detail-oriented"
            ],
            insights: [
              "You approach challenges with logical thinking",
              "You value independence and autonomy",
              "You strive for precision and accuracy"
            ],
            recommendations: [
              "Consider careers that involve systematic analysis",
              "Develop your interpersonal skills to complement your analytical nature",
              "Find creative outlets that leverage your attention to detail"
            ]
          };
        }
        
        setResultData(data);
        setLoading(false);
      }, 1000);
    };

    mockFetchResult();
  }, [testType, personalityType, navigate]);

  const handleShare = () => {
    // In a real app, implement sharing functionality
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied to clipboard",
      description: "Share your test results with friends!",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700"></div>
          <p className="mt-4 text-lg">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
            {resultData.title}
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            {resultData.description}
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Key characteristics of your personality type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Core Traits</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Array.isArray(resultData.traits) ? (
                      resultData.traits.map((trait: any, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-violet-500"></span>
                          {typeof trait === 'object' ? (
                            <span>{trait.name}: {trait.score}%</span>
                          ) : (
                            <span>{trait}</span>
                          )}
                        </li>
                      ))
                    ) : (
                      <p>No traits available</p>
                    )}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Results
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Insights</CardTitle>
                <CardDescription>What your results reveal about you</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {resultData.insights.map((insight: string, index: number) => (
                    <li key={index} className="bg-muted p-4 rounded-lg">
                      <p>{insight}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="compare" className="mt-6">
            <PersonalityComparison testType={testType || 'mbti'} personalityType={personalityType || ''} />
          </TabsContent>
          
          <TabsContent value="recommendations" className="mt-6">
            <PersonalRecommendations personalityType={personalityType || ''} testType={testType || 'mbti'} />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => navigate('/tests')}>
            Back to Tests
          </Button>
          <Button onClick={() => navigate('/insights')}>
            Explore Your Insights
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper functions for type descriptions
function getMBTIDescription(type: string): string {
  const descriptions: Record<string, string> = {
    'INTJ': 'The Architect: Strategic, innovative, and private with a clear vision for the future.',
    'INTP': 'The Logician: Analytical, creative, and adaptable with a focus on exploring ideas.',
    'ENTJ': 'The Commander: Decisive, strategic, and assertive, driving toward efficiency and goals.',
    'ENTP': 'The Debater: Quick-thinking, curious, and intellectually adaptable with a love for ideas.',
    'INFJ': 'The Advocate: Insightful, principled, and creative with a focus on helping others.',
    'INFP': 'The Mediator: Idealistic, empathetic, and creative with strong personal values.',
    'ENFJ': 'The Protagonist: Charismatic, inspiring, and empathetic, focused on others' growth.',
    'ENFP': 'The Campaigner: Enthusiastic, creative, and people-oriented with a love for possibilities.',
    'ISTJ': 'The Logistician: Practical, fact-minded, and reliable with a strong sense of duty.',
    'ISFJ': 'The Defender: Dedicated, warm, and protective with a desire to serve others.',
    'ESTJ': 'The Executive: Organized, practical, and tradition-minded with leadership abilities.',
    'ESFJ': 'The Consul: Caring, social, and popular with a focus on harmony and cooperation.',
    'ISTP': 'The Virtuoso: Versatile, practical, and hands-on with great troubleshooting skills.',
    'ISFP': 'The Adventurer: Flexible, charming, and artistic with a spontaneous approach to life.',
    'ESTP': 'The Entrepreneur: Energetic, perceptive, and bold with a love for action and risk.',
    'ESFP': 'The Entertainer: Spontaneous, energetic, and enthusiastic with a love for the spotlight.'
  };
  
  return descriptions[type] || 'A unique personality type with distinctive characteristics and tendencies.';
}

function getMBTITraits(type: string): string[] {
  const traits: Record<string, string[]> = {
    'INTJ': ['Strategic thinking', 'Independent', 'Analytical', 'Reserved', 'Rational'],
    'INTP': ['Logical analysis', 'Abstract thinking', 'Innovative', 'Independent', 'Adaptable'],
    'ENTJ': ['Decisive leadership', 'Strategic planning', 'Efficiency-focused', 'Direct communication', 'Objective'],
    'ENTP': ['Innovative problem-solving', 'Debate skills', 'Adaptable', 'Intellectually curious', 'Quick-thinking'],
    'INFJ': ['Insightful', 'Principled', 'Idealistic', 'Creative', 'Empathetic'],
    'INFP': ['Value-driven', 'Creative', 'Empathetic', 'Idealistic', 'Adaptable'],
    'ENFJ': ['Charismatic leadership', 'Empathetic', 'Organized', 'People-focused', 'Inspirational'],
    'ENFP': ['Enthusiastic', 'Creative', 'People-oriented', 'Adaptable', 'Curious'],
    'ISTJ': ['Detail-oriented', 'Reliable', 'Practical', 'Organized', 'Traditional'],
    'ISFJ': ['Supportive', 'Detail-conscious', 'Loyal', 'Traditional', 'Practical'],
    'ESTJ': ['Organized', 'Practical', 'Reliable', 'Traditional', 'Direct'],
    'ESFJ': ['Caring', 'Social', 'Organized', 'Traditional', 'Cooperative'],
    'ISTP': ['Adaptable', 'Hands-on', 'Logical', 'Observant', 'Practical'],
    'ISFP': ['Artistic', 'Adaptable', 'Sensitive', 'Loyal', 'Present-focused'],
    'ESTP': ['Action-oriented', 'Adaptable', 'Energetic', 'Practical', 'Present-focused'],
    'ESFP': ['Spontaneous', 'Enthusiastic', 'Friendly', 'Present-focused', 'Practical']
  };
  
  return traits[type] || ['Analytical', 'Independent', 'Creative', 'Logical', 'Adaptable'];
}

function getEnneagramDescription(type: string): string {
  const descriptions: Record<string, string> = {
    '1': 'The Reformer: Principled, purposeful, and self-controlled with a strong sense of right and wrong.',
    '2': 'The Helper: Caring, generous, and people-pleasing with a need to be needed.',
    '3': 'The Achiever: Success-oriented, pragmatic, and adaptable with a drive for achievement.',
    '4': 'The Individualist: Sensitive, expressive, and introspective with a desire for unique identity.',
    '5': 'The Investigator: Innovative, cerebral, and perceptive with a need for knowledge and self-sufficiency.',
    '6': 'The Loyalist: Committed, security-oriented, and engaged with a tendency toward anxiety and suspicion.',
    '7': 'The Enthusiast: Versatile, spontaneous, and busy with a fear of missing out and desire for enjoyment.',
    '8': 'The Challenger: Powerful, dominating, and self-confident with a need for control.',
    '9': 'The Peacemaker: Easygoing, receptive, and reassuring with a desire for harmony and avoiding conflict.'
  };
  
  return descriptions[type] || 'A distinct personality type with unique motivations, fears, and growth patterns.';
}

function getEnneagramTraits(type: string): string[] {
  const traits: Record<string, string[]> = {
    '1': ['Principled', 'Purposeful', 'Self-controlled', 'Perfectionistic', 'Improvement-oriented'],
    '2': ['Helper', 'Caring', 'Interpersonal', 'Generous', 'People-pleasing'],
    '3': ['Achiever', 'Ambitious', 'Adaptable', 'Excelling', 'Image-conscious'],
    '4': ['Individualist', 'Sensitive', 'Expressive', 'Introspective', 'Creative'],
    '5': ['Investigator', 'Innovative', 'Cerebral', 'Private', 'Perceptive'],
    '6': ['Loyalist', 'Committed', 'Security-oriented', 'Engaged', 'Responsible'],
    '7': ['Enthusiast', 'Versatile', 'Spontaneous', 'Productive', 'Optimistic'],
    '8': ['Challenger', 'Powerful', 'Decisive', 'Willful', 'Confrontational'],
    '9': ['Peacemaker', 'Easygoing', 'Receptive', 'Reassuring', 'Agreeable']
  };
  
  return traits[type] || ['Self-aware', 'Growth-oriented', 'Adaptive', 'Pattern-recognizing', 'Introspective'];
}

export default TestResult;

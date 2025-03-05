
import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Chart } from "@/components/ui/chart";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Radar } from 'recharts';
import { Loader2, Share2, Download, BookOpen } from 'lucide-react';

// MBTI type descriptions
const mbtiDescriptions: Record<string, {title: string, description: string}> = {
  'ISTJ': {
    title: 'The Inspector',
    description: 'Practical and fact-minded individuals, whose reliability cannot be doubted. Detailed, careful, and systematic, they have a strong sense of responsibility and work steadily toward their goals.'
  },
  'ISFJ': {
    title: 'The Protector',
    description: 'Quiet, kind, and conscientious. They are committed and steady in meeting their obligations and can be relied on to follow through on tasks with careful attention to detail.'
  },
  'INFJ': {
    title: 'The Counselor',
    description: 'Seek meaning and connection in ideas, relationships, and material possessions. They want to understand what motivates people and are insightful about others.'
  },
  'INTJ': {
    title: 'The Mastermind',
    description: 'Have original minds and great drive for implementing their ideas and achieving their goals. Quickly see patterns and are skeptical, independent, and demanding.'
  },
  'ISTP': {
    title: 'The Craftsman',
    description: 'Tolerant and flexible, quiet observers until a problem appears, then act quickly to find workable solutions. Analyze what makes things work and readily get through large amounts of data to isolate the core of practical problems.'
  },
  'ISFP': {
    title: 'The Composer',
    description: 'Quiet, friendly, sensitive, and kind. Enjoy the present moment, what\'s going on around them. Like to have their own space and to work within their own time frame.'
  },
  'INFP': {
    title: 'The Healer',
    description: 'Idealistic, loyal to their values and to people who are important to them. Want an external life that is congruent with their values.'
  },
  'INTP': {
    title: 'The Architect',
    description: 'Seek to develop logical explanations for everything that interests them. Theoretical and abstract, interested more in ideas than in social interaction.'
  },
  'ESTP': {
    title: 'The Dynamo',
    description: 'Flexible and tolerant, they take a pragmatic approach focused on immediate results. Theories and conceptual explanations bore them - they want to act energetically to solve the problem.'
  },
  'ESFP': {
    title: 'The Performer',
    description: 'Outgoing, friendly, and accepting. Exuberant lovers of life, people, and material comforts. Enjoy working with others to make things happen.'
  },
  'ENFP': {
    title: 'The Champion',
    description: 'Warmly enthusiastic and imaginative. See life as full of possibilities. Make connections between events and information very quickly, and confidently proceed based on the patterns they see.'
  },
  'ENTP': {
    title: 'The Visionary',
    description: 'Quick, ingenious, stimulating, alert, and outspoken. Resourceful in solving new and challenging problems. Adept at generating conceptual possibilities and then analyzing them strategically.'
  },
  'ESTJ': {
    title: 'The Supervisor',
    description: 'Practical, realistic, matter-of-fact. Decisive, quickly move to implement decisions. Organize projects and people to get things done.'
  },
  'ESFJ': {
    title: 'The Provider',
    description: 'Warmhearted, conscientious, and cooperative. Want harmony in their environment, work with determination to establish it.'
  },
  'ENFJ': {
    title: 'The Teacher',
    description: 'Warm, empathetic, responsive, and responsible. Highly attuned to the emotions, needs, and motivations of others. Find potential in everyone, want to help others fulfill their potential.'
  },
  'ENTJ': {
    title: 'The Commander',
    description: 'Frank, decisive, assume leadership readily. Quickly see illogical and inefficient procedures and policies, develop and implement comprehensive systems to solve organizational problems.'
  }
};

// Extract type from enneagram result (e.g., "Type-4" returns "4")
const extractEnneagramType = (result: string): string => {
  const match = result.match(/Type-(\d+)/);
  return match ? match[1] : result;
};

// Enneagram type descriptions
const enneagramDescriptions: Record<string, {title: string, description: string}> = {
  '1': {
    title: 'The Perfectionist',
    description: 'Principled, purposeful, self-controlled, and perfectionistic. They strive to live up to their high ideals and often focus on improvement.'
  },
  '2': {
    title: 'The Helper',
    description: 'Demonstrative, generous, people-pleasing, and possessive. They are driven by a need to be loved and needed, often focusing on relationships.'
  },
  '3': {
    title: 'The Achiever',
    description: 'Success-oriented, pragmatic, adaptive, and excelling. They are driven by a need to be successful and appear valuable to others.'
  },
  '4': {
    title: 'The Individualist',
    description: 'Self-aware, sensitive, reserved, and expressive. They have a strong desire to be unique and find meaning in their experiences.'
  },
  '5': {
    title: 'The Investigator',
    description: 'Intense, cerebral, perceptive, and innovative. They are driven by a need to understand the world and often collect knowledge.'
  },
  '6': {
    title: 'The Loyalist',
    description: 'Engaging, responsible, anxious, and suspicious. They are motivated by a need for security and tend to anticipate problems.'
  },
  '7': {
    title: 'The Enthusiast',
    description: 'Busy, fun-loving, spontaneous, and scattered. They seek experiences that make them feel happy and fulfilled, avoiding pain and discomfort.'
  },
  '8': {
    title: 'The Challenger',
    description: 'Powerful, dominating, self-confident, and confrontational. They desire control over their environment and resist showing vulnerability.'
  },
  '9': {
    title: 'The Peacemaker',
    description: 'Easy-going, self-effacing, receptive, and reassuring. They seek peace and harmony, often avoiding conflict or asserting themselves.'
  }
};

const TestResult = () => {
  const { personalityType } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  
  // Extract state from location, if provided
  const testState = location.state || {};
  const { testType = 'mbti', details = null } = testState;

  useEffect(() => {
    if (!personalityType) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch recommendations
        const { data: recData, error: recError } = await supabase.functions.invoke('get_recommendations', {
          body: { personalityType, categories: ['career', 'relationships', 'learning', 'personal_growth'] }
        });
        
        if (recError) throw recError;
        setRecommendations(recData);
        
        // Fetch insights
        const { data: insightsData, error: insightsError } = await supabase.functions.invoke('generate_insights', {
          body: { personalityType, areas: ['career', 'relationships', 'personal_growth'] }
        });
        
        if (insightsError) throw insightsError;
        setInsights(insightsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your personality insights.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [personalityType, toast]);

  const renderTitle = () => {
    if (testType === 'mbti' || testType === 'quick') {
      return (
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
            {personalityType}
          </h1>
          <h2 className="text-xl">
            {mbtiDescriptions[personalityType as string]?.title || 'Personality Type'}
          </h2>
        </div>
      );
    } else if (testType === 'enneagram') {
      const type = extractEnneagramType(personalityType || '');
      return (
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
            Enneagram Type {type}
          </h1>
          <h2 className="text-xl">
            {enneagramDescriptions[type]?.title || 'Personality Type'}
          </h2>
        </div>
      );
    } else if (testType === 'big5') {
      return (
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
            Big Five Personality
          </h1>
          <h2 className="text-xl">Your OCEAN Profile</h2>
        </div>
      );
    }
    
    return <h1 className="text-3xl font-bold mb-6 text-center">Your Results</h1>;
  };

  const renderDescription = () => {
    if (testType === 'mbti' || testType === 'quick') {
      return (
        <p className="mb-6">
          {mbtiDescriptions[personalityType as string]?.description || 
           'Your personality type reflects your preferences in how you perceive the world and make decisions.'}
        </p>
      );
    } else if (testType === 'enneagram') {
      const type = extractEnneagramType(personalityType || '');
      return (
        <p className="mb-6">
          {enneagramDescriptions[type]?.description || 
           'Your Enneagram type reflects your core motivations, fears, and desires that drive your behavior.'}
        </p>
      );
    } else if (testType === 'big5') {
      if (personalityType && personalityType.startsWith('OCEAN-')) {
        const scores = personalityType.split('-').slice(1).map(Number);
        if (scores.length === 5) {
          return (
            <div className="mb-6">
              <p className="mb-4">Your Big Five personality profile measures five key dimensions:</p>
              <ul className="space-y-2">
                <li><Badge variant="outline" className="mr-2">O: {scores[0]}%</Badge> <strong>Openness to Experience</strong> - {scores[0] > 70 ? 'High: curious and open to new ideas' : scores[0] > 30 ? 'Moderate: balanced between tradition and new experiences' : 'Low: practical and prefer routine'}</li>
                <li><Badge variant="outline" className="mr-2">C: {scores[1]}%</Badge> <strong>Conscientiousness</strong> - {scores[1] > 70 ? 'High: organized and dependable' : scores[1] > 30 ? 'Moderate: balanced between spontaneity and organization' : 'Low: flexible and spontaneous'}</li>
                <li><Badge variant="outline" className="mr-2">E: {scores[2]}%</Badge> <strong>Extraversion</strong> - {scores[2] > 70 ? 'High: outgoing and energetic' : scores[2] > 30 ? 'Moderate: balanced between socializing and alone time' : 'Low: reserved and thoughtful'}</li>
                <li><Badge variant="outline" className="mr-2">A: {scores[3]}%</Badge> <strong>Agreeableness</strong> - {scores[3] > 70 ? 'High: compassionate and cooperative' : scores[3] > 30 ? 'Moderate: balanced between compassion and self-interest' : 'Low: analytical and questioning'}</li>
                <li><Badge variant="outline" className="mr-2">N: {scores[4]}%</Badge> <strong>Neuroticism</strong> - {scores[4] > 70 ? 'High: sensitive to stress' : scores[4] > 30 ? 'Moderate: balanced emotional responses' : 'Low: emotionally stable and resilient'}</li>
              </ul>
            </div>
          );
        }
      }
      return (
        <p className="mb-6">
          The Big Five personality test measures five key dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.
        </p>
      );
    }
    
    return (
      <p className="mb-6">
        Thank you for completing the personality assessment. Your results provide insights into your unique personality traits and tendencies.
      </p>
    );
  };

  const renderTraits = () => {
    if (!details?.traits) return null;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Personality Traits</CardTitle>
          <CardDescription>Key dimensions of your personality profile</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {details.traits.map((trait: any, index: number) => (
              <li key={index} className="flex items-center">
                <div className="w-2/5 font-medium">{trait.dimension}</div>
                <div className="w-3/5">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${trait.score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{trait.preference}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  const renderBig5Chart = () => {
    if (testType !== 'big5' || !personalityType || !personalityType.startsWith('OCEAN-')) return null;
    
    const scores = personalityType.split('-').slice(1).map(Number);
    if (scores.length !== 5) return null;
    
    const data = [
      { subject: 'Openness', A: scores[0], fullMark: 100 },
      { subject: 'Conscientiousness', A: scores[1], fullMark: 100 },
      { subject: 'Extraversion', A: scores[2], fullMark: 100 },
      { subject: 'Agreeableness', A: scores[3], fullMark: 100 },
      { subject: 'Neuroticism', A: scores[4], fullMark: 100 }
    ];
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>OCEAN Profile Visualization</CardTitle>
          <CardDescription>Visual representation of your Big Five traits</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="w-full max-w-md h-80">
            <Chart 
              type="radar" 
              data={data}
              options={{
                series: [{
                  name: 'Your Score',
                  data: scores
                }],
                labels: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']
              }}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderInsights = () => {
    if (!insights || !insights.insights) return (
      <div className="text-center py-8">
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p>Loading insights...</p>
          </div>
        ) : (
          <p>No insights available for this personality type.</p>
        )}
      </div>
    );
    
    return (
      <div className="space-y-4">
        {insights.insights.map((insight: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{insight.title}</CardTitle>
              <CardDescription>{insight.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{insight.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderRecommendations = () => {
    if (!recommendations || !recommendations.recommendations) return (
      <div className="text-center py-8">
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p>Loading recommendations...</p>
          </div>
        ) : (
          <p>No recommendations available for this personality type.</p>
        )}
      </div>
    );
    
    return (
      <div className="space-y-4">
        {recommendations.recommendations.map((rec: any) => (
          <Card key={rec.id}>
            <CardHeader>
              <CardTitle>{rec.title}</CardTitle>
              <CardDescription>{rec.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{rec.description}</p>
              {rec.resources && rec.resources.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Resources</h4>
                  <ul className="space-y-2">
                    {rec.resources.map((resource: any, idx: number) => (
                      <li key={idx} className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-primary" />
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {resource.title} <span className="text-xs text-gray-500">({resource.type})</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const handleTakeAnotherTest = () => {
    navigate('/tests');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {renderTitle()}
        {renderDescription()}
        
        {renderTraits()}
        {renderBig5Chart()}
        
        <Tabs defaultValue="insights" className="w-full mb-8">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="mt-6">
            {renderInsights()}
          </TabsContent>
          
          <TabsContent value="recommendations" className="mt-6">
            {renderRecommendations()}
          </TabsContent>
        </Tabs>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={handleTakeAnotherTest}
            className="flex items-center gap-2"
          >
            Take Another Test
          </Button>
          
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast({ title: "Link copied", description: "Share this with others!" });
            }}
          >
            <Share2 className="h-4 w-4" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResult;

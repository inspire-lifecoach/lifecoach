
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

interface Resource {
  title: string;
  url: string;
  type: 'book' | 'article' | 'video' | 'course';
}

interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  resources?: Resource[];
  user_id?: string;
  created_at?: string;
  type?: string;
}

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [headerText, setHeaderText] = useState('Personalized Recommendations');

  const personalityType = location.state?.personalityType || 'Unknown';
  const testType = location.state?.testType || 'mbti';

  useEffect(() => {
    // Set header text based on test type
    switch (testType) {
      case 'big5':
        setHeaderText('OCEAN Profile Recommendations');
        break;
      case 'enneagram':
        setHeaderText('Enneagram Recommendations');
        break;
      default:
        setHeaderText('Personalized Recommendations');
    }

    fetchRecommendations();
  }, [personalityType, testType, toast]);

  const fetchRecommendations = async () => {
    setIsLoading(true);

    try {
      // Call the get_recommendations function
      const response = await supabase.functions.invoke('get_recommendations', {
        body: { 
          personalityType,
          testType,
          categories: ['career', 'relationships', 'personal_growth', 'learning']
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Ensure the response data is properly typed
      const typedRecommendations = response.data?.recommendations?.map((rec: any) => ({
        id: rec.id,
        category: rec.category,
        title: rec.title,
        description: rec.description,
        resources: Array.isArray(rec.resources) ? rec.resources.map((resource: any) => ({
          title: resource.title,
          url: resource.url,
          type: resource.type as 'book' | 'article' | 'video' | 'course'
        })) : undefined
      })) || [];

      setRecommendations(typedRecommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load recommendations. Please try again later.",
      });
      // Set sample data if the API call fails
      setSampleRecommendations();
    } finally {
      setIsLoading(false);
    }
  };

  const setSampleRecommendations = () => {
    // Create appropriate sample recommendations based on test type
    if (testType === 'big5') {
      setRecommendations([
        {
          id: '1',
          category: 'personal_growth',
          title: 'Developing Your Strengths',
          description: `Based on your OCEAN profile, focusing on your strongest traits while working on areas of improvement can lead to greater personal satisfaction.`,
          resources: [
            { title: 'The Big Five Personality Traits Explained', url: '#', type: 'article' },
            { title: 'Personality Development Strategies', url: '#', type: 'course' }
          ]
        },
        {
          id: '2',
          category: 'career',
          title: 'Career Alignment Strategies',
          description: 'Finding a career that aligns with your personality traits can lead to greater job satisfaction and success.',
          resources: [
            { title: 'Finding Your Ideal Career Path', url: '#', type: 'book' },
            { title: 'Personality-Based Career Coaching', url: '#', type: 'course' }
          ]
        }
      ]);
    } else if (testType === 'enneagram') {
      setRecommendations([
        {
          id: '1',
          category: 'personal_growth',
          title: 'Growth Path for Your Type',
          description: `The Enneagram offers specific growth paths for each type. For your type, focus on developing awareness of your core motivations and fears.`,
          resources: [
            { title: 'The Wisdom of the Enneagram', url: '#', type: 'book' },
            { title: 'Personal Development Through the Enneagram', url: '#', type: 'course' }
          ]
        },
        {
          id: '2',
          category: 'relationships',
          title: 'Relationship Dynamics',
          description: 'Understanding how your Enneagram type interacts with others can improve your relationships.',
          resources: [
            { title: 'The Enneagram in Relationships', url: '#', type: 'book' },
            { title: 'Communication Strategies for Your Type', url: '#', type: 'video' }
          ]
        }
      ]);
    } else {
      // Default MBTI recommendations
      setRecommendations([
        {
          id: '1',
          category: 'career',
          title: 'Career Development Pathways',
          description: `Based on your ${personalityType} personality type, consider exploring careers that allow for strategic thinking and independence. Look for roles where your analytical abilities can be fully utilized.`,
          resources: [
            { title: 'Strategic Career Planning', url: '#', type: 'book' },
            { title: 'Finding Your Professional Niche', url: '#', type: 'course' }
          ]
        },
        {
          id: '2',
          category: 'personal_growth',
          title: 'Personal Development Focus Areas',
          description: 'Consider working on emotional intelligence to balance your logical approach. Developing better communication skills can help you connect with others more effectively.',
          resources: [
            { title: 'Emotional Intelligence for Analytical Minds', url: '#', type: 'book' },
            { title: 'Building Meaningful Connections', url: '#', type: 'article' }
          ]
        },
        {
          id: '3',
          category: 'learning',
          title: 'Learning Style Optimization',
          description: 'Your personality type tends to excel with conceptual learning. Consider structured learning environments that still allow for independent exploration of topics.',
          resources: [
            { title: 'Advanced Learning Techniques', url: '#', type: 'course' },
            { title: 'The Science of Effective Study', url: '#', type: 'video' }
          ]
        }
      ]);
    }
  };

  const handleResourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
        {headerText}
      </h1>
      <h2 className="text-xl mb-6 text-center text-muted-foreground">
        For {personalityType} 
        {testType === 'mbti' && ' Personality Type'}
        {testType === 'enneagram' && ' Enneagram Type'}
        {testType === 'big5' && ' Profile'}
      </h2>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <p className="text-muted-foreground">Loading recommendations...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-muted">
                    {recommendation.category.replace('_', ' ')}
                  </div>
                  <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{recommendation.description}</p>
                
                {recommendation.resources && recommendation.resources.length > 0 && (
                  <div>
                    <h3 className="font-medium text-sm mb-2">Recommended Resources:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {recommendation.resources.map((resource, index) => (
                        <Button 
                          key={index}
                          variant="outline"
                          className="justify-start text-left h-auto py-2"
                          onClick={() => handleResourceClick(resource.url)}
                        >
                          <div className="flex flex-col items-start">
                            <span>{resource.title}</span>
                            <span className="text-xs text-muted-foreground capitalize">{resource.type}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          Back to Results
        </Button>
      </div>
    </div>
  );
};

export default Recommendations;

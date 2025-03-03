import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export interface Resource {
  title: string;
  url: string;
  type: 'book' | 'article' | 'video' | 'course';
}

export interface Recommendation {
  id: string;
  category?: string;
  title: string;
  description: string;
  resources?: Resource[];
  user_id?: string;
  created_at?: string;
  type?: string;
}

const PersonalRecommendations = ({ personalityType }: { personalityType: string }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);

      try {
        // Call the get_recommendations function
        const response = await supabase.functions.invoke('get_recommendations', {
          body: { 
            personalityType,
            categories: ['career', 'relationships', 'personal_growth', 'learning']
          }
        });

        if (response.error) {
          throw new Error(response.error.message);
        }
        
        // Transform the data to match our type
        const typedRecommendations = response.data?.recommendations?.map((rec: any) => ({
          id: rec.id,
          category: rec.category,
          title: rec.title,
          description: rec.description,
          resources: Array.isArray(rec.resources) ? rec.resources.map((resource: any) => ({
            title: resource.title,
            url: resource.url,
            type: resource.type as 'book' | 'article' | 'video' | 'course'
          })) : undefined,
          user_id: rec.user_id,
          created_at: rec.created_at,
          type: rec.type
        })) as Recommendation[];

        setRecommendations(typedRecommendations || []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load recommendations. Please try again later.",
        });
        // Set sample data if the API call fails
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [personalityType, toast]);

  const handleResourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading recommendations...</p>
      ) : (
        recommendations.map((recommendation) => (
          <Card key={recommendation.id}>
            <CardHeader>
              <CardTitle>{recommendation.title}</CardTitle>
              <CardDescription>{recommendation.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {recommendation.resources && (
                <ul>
                  {recommendation.resources.map((resource, index) => (
                    <li key={index}>
                      <Button variant="link" onClick={() => handleResourceClick(resource.url)}>
                        {resource.title} ({resource.type})
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default PersonalRecommendations;

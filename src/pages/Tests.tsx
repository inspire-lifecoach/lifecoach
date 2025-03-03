
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const personalityTests = [
  {
    id: 'mbti',
    title: 'Myers-Briggs Type Indicator (MBTI)',
    description: 'The Myers-Briggs Type Indicator is a personality assessment that categorizes individuals into 16 distinct personality types based on four dimensions: Introversion/Extraversion, Sensing/Intuition, Thinking/Feeling, and Judging/Perceiving.',
    duration: '10-15 minutes',
    path: '/persona-test'
  },
  {
    id: 'big5',
    title: 'Big Five Personality Test',
    description: 'The Big Five personality traits model measures five key dimensions of personality: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism (OCEAN).',
    duration: '8-12 minutes',
    path: '/persona-test?type=big5'
  },
  {
    id: 'enneagram',
    title: 'Enneagram Test',
    description: 'The Enneagram is a personality system that describes nine distinct personality types and their interrelationships, providing insights into core motivations and fears.',
    duration: '10-15 minutes',
    path: '/persona-test?type=enneagram'
  }
];

const Tests = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
          Personality Tests
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Discover your true self through our scientifically validated personality assessments
        </p>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="quick">Quick Tests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {personalityTests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <CardTitle>{test.title}</CardTitle>
                  <CardDescription>Duration: {test.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{test.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate(test.path)}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  >
                    Take this test
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="popular" className="space-y-6">
            {personalityTests.slice(0, 2).map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <CardTitle>{test.title}</CardTitle>
                  <CardDescription>Duration: {test.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{test.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate(test.path)}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  >
                    Take this test
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="quick" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Personality Quiz</CardTitle>
                <CardDescription>Duration: 3-5 minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <p>A simplified version of the MBTI that gives you quick insights into your personality type with just a few questions.</p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate('/persona-test?quick=true')}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                  Take this test
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Tests;

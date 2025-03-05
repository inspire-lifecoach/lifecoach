
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, BrainCircuit, Users, Heart } from "lucide-react";

const Tests = () => {
  const navigate = useNavigate();

  const handleTestClick = (testType: string) => {
    switch(testType) {
      case 'mbti':
        navigate('/mbti-test');
        break;
      case 'big-five':
        // For demo purposes, navigate directly to a sample result
        navigate('/test-result/big-five/sample');
        break;
      case 'enneagram':
        // For demo purposes, navigate directly to a sample result
        navigate('/test-result/enneagram/4');
        break;
      case 'persona':
        navigate('/persona-test');
        break;
      default:
        navigate('/tests');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
            Personality Tests
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover insights about yourself through our scientifically backed assessments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MBTI Test Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>MBTI Test</CardTitle>
                  <CardDescription>Myers-Briggs Type Indicator</CardDescription>
                </div>
                <div className="bg-violet-100 p-2 rounded-full">
                  <BrainCircuit className="h-6 w-6 text-violet-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                Discover your personality type among 16 different types based on how you perceive the world and make decisions.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs bg-violet-100 text-violet-800 px-2.5 py-0.5 rounded-full">93 questions</span>
                <span className="text-xs bg-violet-100 text-violet-800 px-2.5 py-0.5 rounded-full">~15 minutes</span>
                <span className="text-xs bg-violet-100 text-violet-800 px-2.5 py-0.5 rounded-full">Detailed report</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleTestClick('mbti')}
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Take this test
              </Button>
            </CardFooter>
          </Card>

          {/* Big Five Test Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Big Five Test</CardTitle>
                  <CardDescription>Five Factor Model</CardDescription>
                </div>
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                Measure your personality across the five dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">60 questions</span>
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">~10 minutes</span>
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">Visual results</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleTestClick('big-five')}
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Take this test
              </Button>
            </CardFooter>
          </Card>

          {/* Enneagram Test Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Enneagram Test</CardTitle>
                  <CardDescription>Nine Personality Types</CardDescription>
                </div>
                <div className="bg-pink-100 p-2 rounded-full">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                Identify which of the nine personality types best represents your core motivations, fears, and desires.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs bg-pink-100 text-pink-800 px-2.5 py-0.5 rounded-full">45 questions</span>
                <span className="text-xs bg-pink-100 text-pink-800 px-2.5 py-0.5 rounded-full">~8 minutes</span>
                <span className="text-xs bg-pink-100 text-pink-800 px-2.5 py-0.5 rounded-full">Growth paths</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleTestClick('enneagram')}
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Take this test
              </Button>
            </CardFooter>
          </Card>

          {/* Persona Test Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Persona Test</CardTitle>
                  <CardDescription>Custom Personality Analysis</CardDescription>
                </div>
                <div className="bg-amber-100 p-2 rounded-full">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                Our proprietary assessment examines your personality traits across multiple dimensions for a comprehensive profile.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">25 questions</span>
                <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">~5 minutes</span>
                <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">Quick insights</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleTestClick('persona')}
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Take this test
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tests;

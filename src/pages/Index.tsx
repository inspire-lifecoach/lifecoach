
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BrainCircuit, Heart, Users } from "lucide-react";
import Hero from '@/components/Hero';
import TestTypeCard from '@/components/TestTypeCard';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4">
      <Hero />
      
      <div className="max-w-4xl mx-auto mt-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Discover Yourself</h2>
          <p className="text-muted-foreground mt-2">Explore our personality assessments to gain insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <TestTypeCard 
            title="MBTI Assessment"
            description="Discover which of the 16 personality types matches you best"
            icon={<BrainCircuit className="h-5 w-5" />}
            route="/mbti-test"
            time="10-15 mins"
            questions={16}
            variant="highlighted"
          />
          
          <TestTypeCard 
            title="Quick Personality Quiz"
            description="Get a quick insight into your personality type"
            icon={<BrainCircuit className="h-5 w-5" />}
            route="/persona-test?quick=true"
            time="2 mins"
            questions={4}
          />
          
          <TestTypeCard 
            title="Big Five Assessment"
            description="Measure your personality across five key dimensions"
            icon={<Users className="h-5 w-5" />}
            route="/persona-test?type=big5"
            time="8-10 mins"
            questions={10}
          />
          
          <TestTypeCard 
            title="Enneagram Assessment"
            description="Identify your core motivations and behavior patterns"
            icon={<Heart className="h-5 w-5" />}
            route="/persona-test?type=enneagram"
            time="7-10 mins"
            questions={12}
          />
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={() => navigate('/tests')} 
            variant="outline" 
            className="px-8"
          >
            View All Tests
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

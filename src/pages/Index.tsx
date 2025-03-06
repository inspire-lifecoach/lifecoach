
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Hero from '@/components/Hero';
import TestTypeCard from '@/components/TestTypeCard';
import { BookOpen, BrainCircuit, PuzzlePiece, LineChart } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Test Types Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Explore Our Personality Tests</h2>
            <p className="text-muted-foreground mt-2">
              Discover different aspects of your personality through our scientifically backed assessments
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <TestTypeCard 
              title="MBTI Test"
              description="Discover your Myers-Briggs personality type"
              icon={<BrainCircuit className="h-6 w-6" />}
              route="/mbti-test"
              questions={8}
              variant="highlighted"
            />
            
            <TestTypeCard 
              title="Enneagram"
              description="Uncover your core motivations and fears"
              icon={<PuzzlePiece className="h-6 w-6" />}
              route="/persona-test"
              questions={9}
            />
            
            <TestTypeCard 
              title="Big Five"
              description="Evaluate your five major personality traits"
              icon={<LineChart className="h-6 w-6" />}
              route="/persona-test"
              questions={15}
            />
          </div>
          
          <div className="flex justify-center mt-10">
            <Button 
              variant="outline" 
              onClick={() => navigate('/tests')} 
              className="gap-2"
            >
              View All Tests
              <BookOpen className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Choose Our Platform</h2>
            <p className="text-muted-foreground mt-2">
              We provide comprehensive tools to help you understand yourself better
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Scientific Approach</h3>
              <p className="text-muted-foreground">
                All our tests are based on established psychological theories and research
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Insights</h3>
              <p className="text-muted-foreground">
                Get comprehensive analysis of your results with actionable insights
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Growth</h3>
              <p className="text-muted-foreground">
                Receive tailored recommendations for personal and professional development
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl overflow-hidden shadow-lg">
            <div className="p-8 md:p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to discover your true self?</h2>
              <p className="text-white/80 mb-6">
                Sign up today to unlock your full potential with premium insights and personalized recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/auth')} 
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-white/90"
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/upgrade')} 
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Explore Premium
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;


import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.025] pointer-events-none"></div>
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
            Discover Your True Self
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Take our scientifically backed personality tests and gain insights into who you are, how you work, and what drives your decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/tests')} 
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              Take a Test <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/insights')}
            >
              Explore Insights
            </Button>
          </div>
          
          <div className="pt-8 flex justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex flex-col items-center">
              <strong className="text-2xl font-bold text-gray-800 dark:text-gray-100">5+</strong>
              <span>Test Types</span>
            </div>
            <div className="flex flex-col items-center">
              <strong className="text-2xl font-bold text-gray-800 dark:text-gray-100">100K+</strong>
              <span>Users</span>
            </div>
            <div className="flex flex-col items-center">
              <strong className="text-2xl font-bold text-gray-800 dark:text-gray-100">99%</strong>
              <span>Accuracy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

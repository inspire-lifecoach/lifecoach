
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

// Define question and answer types
interface Question {
  id: number;
  text: string;
  options: {
    value: string;
    text: string;
  }[];
}

// Sample persona test questions - typically these would come from the database
const personaTestQuestions: Question[] = [
  {
    id: 1,
    text: "In social situations, you generally prefer to:",
    options: [
      { value: "E", text: "Interact with many people, including strangers" },
      { value: "I", text: "Interact with a few people you know well" },
    ],
  },
  {
    id: 2,
    text: "You tend to focus on:",
    options: [
      { value: "S", text: "Facts and concrete details" },
      { value: "N", text: "Concepts and abstract ideas" },
    ],
  },
  {
    id: 3,
    text: "When making decisions, you typically consider:",
    options: [
      { value: "T", text: "Objective analysis and logical reasoning" },
      { value: "F", text: "Personal values and how others will be affected" },
    ],
  },
  {
    id: 4,
    text: "Which approach describes you better:",
    options: [
      { value: "J", text: "Planning ahead and being organized" },
      { value: "P", text: "Being flexible and spontaneous" },
    ],
  },
  {
    id: 5,
    text: "When working on a project, you prefer to:",
    options: [
      { value: "E", text: "Discuss ideas with others before starting" },
      { value: "I", text: "Think through ideas on your own before sharing" },
    ],
  },
  {
    id: 6,
    text: "You are more interested in:",
    options: [
      { value: "S", text: "What is happening now, practical applications" },
      { value: "N", text: "What could happen in the future, possibilities" },
    ],
  },
  {
    id: 7,
    text: "In conflicts, you tend to:",
    options: [
      { value: "T", text: "Focus on what is fair and just" },
      { value: "F", text: "Focus on how everyone feels" },
    ],
  },
  {
    id: 8,
    text: "You prefer environments that are:",
    options: [
      { value: "J", text: "Structured and predictable" },
      { value: "P", text: "Flexible and adaptable" },
    ],
  },
];

const PersonaTest = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: value
    }));
    
    // Auto advance to next question
    if (currentQuestionIndex < personaTestQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < personaTestQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const calculatePersonalityType = () => {
    // Count letters to determine personality type
    const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    // Count each dimension
    Object.values(answers).forEach(answer => {
      counts[answer as keyof typeof counts]++;
    });
    
    // Determine the dominant trait in each dimension
    const personalityType = [
      counts.E > counts.I ? 'E' : 'I',
      counts.S > counts.N ? 'S' : 'N',
      counts.T > counts.F ? 'T' : 'F',
      counts.J > counts.P ? 'J' : 'P',
    ].join('');
    
    return personalityType;
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < personaTestQuestions.length) {
      toast({
        variant: "destructive",
        title: "Please answer all questions",
        description: "You need to complete all questions before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate personality type
      const personalityType = calculatePersonalityType();
      
      // Save test result using the analyze_test edge function
      const response = await supabase.functions.invoke('analyze_test', {
        body: {
          userId: user?.id,
          testType: 'mbti',
          responses: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer
          }))
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Navigate to results page
      navigate(`/test-result/${personalityType}`, { 
        state: { 
          personalityType,
          details: response.data 
        } 
      });
      
    } catch (error) {
      console.error('Error submitting test:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem submitting your test. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = personaTestQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / personaTestQuestions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Personality Assessment</h1>
      <p className="text-center text-muted-foreground mb-8">
        Discover your personality type with this short assessment
      </p>
      
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Question {currentQuestionIndex + 1} of {personaTestQuestions.length}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
          <CardDescription>Select the option that best describes you</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={answers[currentQuestionIndex] || ""}
            onValueChange={handleAnswer}
            className="space-y-4"
          >
            {currentQuestion.options.map((option) => (
              <div key={option.value} className="flex items-start space-x-2 p-3 rounded-md border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex < personaTestQuestions.length - 1 ? (
            <Button 
              onClick={handleNext}
              disabled={!answers[currentQuestionIndex]}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !answers[currentQuestionIndex]}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              {isSubmitting ? "Analyzing..." : "Submit"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PersonaTest;

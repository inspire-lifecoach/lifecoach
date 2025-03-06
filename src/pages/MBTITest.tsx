import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const questions = [
  {
    id: 1,
    text: "When meeting new people, you typically:",
    options: [
      { value: "E", text: "Initiate conversations and introduce yourself" },
      { value: "I", text: "Wait for others to approach you" }
    ],
    category: "EI" // Extraversion vs. Introversion
  },
  {
    id: 2,
    text: "When solving problems, you prefer to:",
    options: [
      { value: "S", text: "Focus on concrete facts and details" },
      { value: "N", text: "Think about abstract concepts and possibilities" }
    ],
    category: "SN" // Sensing vs. Intuition
  },
  {
    id: 3,
    text: "When making decisions, you tend to:",
    options: [
      { value: "T", text: "Analyze objectively and consider logical consequences" },
      { value: "F", text: "Consider people's feelings and values" }
    ],
    category: "TF" // Thinking vs. Feeling
  },
  {
    id: 4,
    text: "When planning your day, you typically:",
    options: [
      { value: "J", text: "Create a schedule and prefer to stick to it" },
      { value: "P", text: "Keep your options open and adapt as needed" }
    ],
    category: "JP" // Judging vs. Perceiving
  },
  {
    id: 5,
    text: "When reading a book, you pay more attention to:",
    options: [
      { value: "S", text: "Specific details and what actually happens" },
      { value: "N", text: "The meaning behind events and what could happen" }
    ],
    category: "SN"
  },
  {
    id: 6,
    text: "In a group discussion, you tend to:",
    options: [
      { value: "E", text: "Speak up frequently and think out loud" },
      { value: "I", text: "Listen more than you speak and process internally" }
    ],
    category: "EI"
  },
  {
    id: 7,
    text: "When giving feedback, you typically:",
    options: [
      { value: "T", text: "Focus on being honest and direct, even if it might hurt feelings" },
      { value: "F", text: "Focus on being tactful and supportive, even if you have to soften the truth" }
    ],
    category: "TF"
  },
  {
    id: 8,
    text: "When starting a project, you prefer to:",
    options: [
      { value: "J", text: "Plan everything in advance with clear milestones" },
      { value: "P", text: "Figure things out as you go and adjust your approach" }
    ],
    category: "JP"
  }
];

const MBTITest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (selectedOption) {
      // Save answer
      setAnswers({
        ...answers,
        [currentQuestion]: selectedOption
      });
      
      // Move to next question or finish
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null); // Clear selection for next question
      } else {
        handleSubmit();
      }
    } else {
      toast({
        variant: "destructive",
        title: "Please select an answer",
        description: "You must select an option to continue.",
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1] || null);
    }
  };

  const calculateResult = () => {
    const scores = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    };
    
    // Count answers for each dimension
    Object.values(answers).forEach((answer) => {
      if (answer in scores) {
        scores[answer as keyof typeof scores]++;
      }
    });
    
    // Determine type for each dimension
    const E_I = scores.E > scores.I ? 'E' : 'I';
    const S_N = scores.S > scores.N ? 'S' : 'N';
    const T_F = scores.T > scores.F ? 'T' : 'F';
    const J_P = scores.J > scores.P ? 'J' : 'P';
    
    // Combine to form MBTI type
    return E_I + S_N + T_F + J_P;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Calculate result
      const result = calculateResult();

      if (user) {
        // Save test result using the analyze_test edge function
        const response = await supabase.functions.invoke('analyze_test', {
          body: {
            userId: user.id,
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

        navigate(`/test-result/mbti/${result}`, { 
          state: { 
            personalityType: result,
            testType: 'mbti',
            details: response.data 
          } 
        });
      } else {
        toast({
          title: "Login required to save results",
          description: "Your results will be shown but not saved to your profile."
        });
        navigate(`/test-result/mbti/${result}`, { 
          state: { 
            personalityType: result,
            testType: 'mbti'
          } 
        });
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem submitting your test. Your results will still be shown.",
      });
      // Still navigate to results page even if saving failed
      navigate(`/test-result/mbti/${calculateResult()}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
            MBTI Personality Test
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Discover your unique personality type
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question {currentQuestion + 1}</CardTitle>
            <CardDescription>{question.text}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedOption || ""} 
              onValueChange={setSelectedOption}
              className="space-y-4"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 border rounded-md hover:bg-muted">
                  <RadioGroupItem value={option.value} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
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
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button 
              onClick={handleNext}
              disabled={isSubmitting || !selectedOption}
            >
              {currentQuestion < questions.length - 1 ? "Next" : isSubmitting ? "Processing..." : "See Results"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MBTITest;

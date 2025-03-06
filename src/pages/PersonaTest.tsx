
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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
  testType?: string;
}

// MBTI test questions
const mbtiQuestions: Question[] = [
  {
    id: 1,
    text: "In social situations, you generally prefer to:",
    options: [
      { value: "E", text: "Interact with many people, including strangers" },
      { value: "I", text: "Interact with a few people you know well" },
    ],
    testType: "mbti"
  },
  {
    id: 2,
    text: "You tend to focus on:",
    options: [
      { value: "S", text: "Facts and concrete details" },
      { value: "N", text: "Concepts and abstract ideas" },
    ],
    testType: "mbti"
  },
  {
    id: 3,
    text: "When making decisions, you typically consider:",
    options: [
      { value: "T", text: "Objective analysis and logical reasoning" },
      { value: "F", text: "Personal values and how others will be affected" },
    ],
    testType: "mbti"
  },
  {
    id: 4,
    text: "Which approach describes you better:",
    options: [
      { value: "J", text: "Planning ahead and being organized" },
      { value: "P", text: "Being flexible and spontaneous" },
    ],
    testType: "mbti"
  },
  {
    id: 5,
    text: "When working on a project, you prefer to:",
    options: [
      { value: "E", text: "Discuss ideas with others before starting" },
      { value: "I", text: "Think through ideas on your own before sharing" },
    ],
    testType: "mbti"
  },
  {
    id: 6,
    text: "You are more interested in:",
    options: [
      { value: "S", text: "What is happening now, practical applications" },
      { value: "N", text: "What could happen in the future, possibilities" },
    ],
    testType: "mbti"
  },
  {
    id: 7,
    text: "In conflicts, you tend to:",
    options: [
      { value: "T", text: "Focus on what is fair and just" },
      { value: "F", text: "Focus on how everyone feels" },
    ],
    testType: "mbti"
  },
  {
    id: 8,
    text: "You prefer environments that are:",
    options: [
      { value: "J", text: "Structured and predictable" },
      { value: "P", text: "Flexible and adaptable" },
    ],
    testType: "mbti"
  },
];

// Big Five personality test questions
const big5Questions: Question[] = [
  {
    id: 1,
    text: "I see myself as someone who is talkative",
    options: [
      { value: "E5", text: "Strongly Agree" },
      { value: "E4", text: "Agree" },
      { value: "E3", text: "Neutral" },
      { value: "E2", text: "Disagree" },
      { value: "E1", text: "Strongly Disagree" },
    ],
    testType: "big5"
  },
  {
    id: 2,
    text: "I see myself as someone who tends to find fault with others",
    options: [
      { value: "A1", text: "Strongly Agree" },
      { value: "A2", text: "Agree" },
      { value: "A3", text: "Neutral" },
      { value: "A4", text: "Disagree" },
      { value: "A5", text: "Strongly Disagree" },
    ],
    testType: "big5"
  },
  {
    id: 3,
    text: "I see myself as someone who does a thorough job",
    options: [
      { value: "C5", text: "Strongly Agree" },
      { value: "C4", text: "Agree" },
      { value: "C3", text: "Neutral" },
      { value: "C2", text: "Disagree" },
      { value: "C1", text: "Strongly Disagree" },
    ],
    testType: "big5"
  },
  {
    id: 4,
    text: "I see myself as someone who gets nervous easily",
    options: [
      { value: "N5", text: "Strongly Agree" },
      { value: "N4", text: "Agree" },
      { value: "N3", text: "Neutral" },
      { value: "N2", text: "Disagree" },
      { value: "N1", text: "Strongly Disagree" },
    ],
    testType: "big5"
  },
  {
    id: 5,
    text: "I see myself as someone who has an active imagination",
    options: [
      { value: "O5", text: "Strongly Agree" },
      { value: "O4", text: "Agree" },
      { value: "O3", text: "Neutral" },
      { value: "O2", text: "Disagree" },
      { value: "O1", text: "Strongly Disagree" },
    ],
    testType: "big5"
  },
];

// Enneagram test questions
const enneagramQuestions: Question[] = [
  {
    id: 1,
    text: "I have been romantic and imaginative",
    options: [
      { value: "4", text: "Very much like me" },
      { value: "0", text: "Somewhat like me" },
      { value: "0", text: "Not like me" },
    ],
    testType: "enneagram"
  },
  {
    id: 2,
    text: "I have been pragmatic and down to earth",
    options: [
      { value: "6", text: "Very much like me" },
      { value: "0", text: "Somewhat like me" },
      { value: "0", text: "Not like me" },
    ],
    testType: "enneagram"
  },
  {
    id: 3,
    text: "I have tended to take on confrontations",
    options: [
      { value: "8", text: "Very much like me" },
      { value: "0", text: "Somewhat like me" },
      { value: "0", text: "Not like me" },
    ],
    testType: "enneagram"
  },
  {
    id: 4,
    text: "I have typically been cooperative and tried to maintain harmony",
    options: [
      { value: "9", text: "Very much like me" },
      { value: "0", text: "Somewhat like me" },
      { value: "0", text: "Not like me" },
    ],
    testType: "enneagram"
  },
  {
    id: 5,
    text: "I have been self-disciplined and in control",
    options: [
      { value: "1", text: "Very much like me" },
      { value: "0", text: "Somewhat like me" },
      { value: "0", text: "Not like me" },
    ],
    testType: "enneagram"
  },
  {
    id: 6,
    text: "I have been full of enthusiasm and energy",
    options: [
      { value: "7", text: "Very much like me" },
      { value: "0", text: "Somewhat like me" },
      { value: "0", text: "Not like me" },
    ],
    testType: "enneagram"
  },
];

// Quick personality quiz questions
const quickQuizQuestions: Question[] = [
  {
    id: 1,
    text: "Do you prefer being around people or spending time alone?",
    options: [
      { value: "E", text: "I get energized by being around people" },
      { value: "I", text: "I need alone time to recharge" },
    ],
    testType: "quick"
  },
  {
    id: 2,
    text: "How do you process information?",
    options: [
      { value: "S", text: "I focus on concrete facts and details" },
      { value: "N", text: "I focus on patterns and possibilities" },
    ],
    testType: "quick"
  },
  {
    id: 3,
    text: "How do you make decisions?",
    options: [
      { value: "T", text: "I make decisions based on logic and analysis" },
      { value: "F", text: "I consider people's feelings and values" },
    ],
    testType: "quick"
  },
  {
    id: 4,
    text: "How do you approach life?",
    options: [
      { value: "J", text: "I prefer structure, planning, and organization" },
      { value: "P", text: "I prefer flexibility, spontaneity, and keeping options open" },
    ],
    testType: "quick"
  },
];

const PersonaTest = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [testType, setTestType] = useState('mbti');
  const [testQuestions, setTestQuestions] = useState<Question[]>(mbtiQuestions);
  const [testTitle, setTestTitle] = useState('Myers-Briggs Type Indicator (MBTI)');
  const [testDescription, setTestDescription] = useState('Discover your personality type with this assessment');

  useEffect(() => {
    // Get test type from URL parameters
    const type = searchParams.get('type') || 'mbti';
    const isQuick = searchParams.get('quick') === 'true';
    
    if (isQuick) {
      setTestType('quick');
      setTestQuestions(quickQuizQuestions);
      setTestTitle('Quick Personality Quiz');
      setTestDescription('Get a quick insight into your personality type');
    } else {
      setTestType(type);
      switch (type) {
        case 'big5':
          setTestQuestions(big5Questions);
          setTestTitle('Big Five Personality Test');
          setTestDescription('Measure the five key dimensions of your personality');
          break;
        case 'enneagram':
          setTestQuestions(enneagramQuestions);
          setTestTitle('Enneagram Test');
          setTestDescription('Discover your dominant Enneagram type');
          break;
        default:
          setTestQuestions(mbtiQuestions);
          setTestTitle('Myers-Briggs Type Indicator (MBTI)');
          setTestDescription('Discover your personality type with this assessment');
      }
    }
  }, [searchParams]);

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: value
    }));
    
    // Auto advance to next question
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const calculateResult = () => {
    switch (testType) {
      case 'mbti':
      case 'quick':
        return calculateMBTIResult();
      case 'big5':
        return calculateBig5Result();
      case 'enneagram':
        return calculateEnneagramResult();
      default:
        return 'UNKNOWN';
    }
  };

  const calculateMBTIResult = () => {
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

  const calculateBig5Result = () => {
    // Initialize scores for each dimension
    const scores = { 
      O: 0, // Openness
      C: 0, // Conscientiousness
      E: 0, // Extraversion
      A: 0, // Agreeableness
      N: 0  // Neuroticism
    };
    
    // Calculate scores for each dimension
    Object.values(answers).forEach(answer => {
      const dimension = answer.charAt(0);
      const score = parseInt(answer.charAt(1));
      if (dimension in scores) {
        scores[dimension as keyof typeof scores] += score;
      }
    });
    
    // Normalize scores (assuming 5 questions per dimension, max 5 points each)
    const maxPossible = 5;
    const normalized = {
      O: Math.round((scores.O / maxPossible) * 100),
      C: Math.round((scores.C / maxPossible) * 100),
      E: Math.round((scores.E / maxPossible) * 100),
      A: Math.round((scores.A / maxPossible) * 100),
      N: Math.round((scores.N / maxPossible) * 100)
    };
    
    // Return the OCEAN profile
    return `OCEAN-${normalized.O}-${normalized.C}-${normalized.E}-${normalized.A}-${normalized.N}`;
  };

  const calculateEnneagramResult = () => {
    // Count votes for each type
    const typeCounts: Record<string, number> = {};
    
    Object.values(answers).forEach(answer => {
      if (answer !== '0') { // Skip if not a specific type vote
        typeCounts[answer] = (typeCounts[answer] || 0) + 1;
      }
    });
    
    // Find the type(s) with the most votes
    let maxVotes = 0;
    let dominantTypes: string[] = [];
    
    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        dominantTypes = [type];
      } else if (count === maxVotes) {
        dominantTypes.push(type);
      }
    });
    
    // If there are multiple dominant types, join them
    return `Type-${dominantTypes.join('/')}`;
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < testQuestions.length) {
      toast({
        variant: "destructive",
        title: "Please answer all questions",
        description: "You need to complete all questions before submitting.",
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Login required",
        description: "You need to be logged in to save your test results. Your results will still be shown but won't be saved.",
      });
      // Calculate result but don't save it
      const result = calculateResult();
      navigate(`/test-result/${testType}/${result}`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate personality type based on test type
      const result = calculateResult();
      
      // Save test result using the analyze_test edge function
      const response = await supabase.functions.invoke('analyze_test', {
        body: {
          userId: user.id,
          testType: testType,
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
      navigate(`/test-result/${testType}/${result}`, { 
        state: { 
          personalityType: result,
          testType: testType,
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

  const currentQuestion = testQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / testQuestions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">{testTitle}</h1>
      <p className="text-center text-muted-foreground mb-8">
        {testDescription}
      </p>
      
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Question {currentQuestionIndex + 1} of {testQuestions.length}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion?.text}</CardTitle>
          <CardDescription>Select the option that best describes you</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={answers[currentQuestionIndex] || ""}
            onValueChange={handleAnswer}
            className="space-y-4"
          >
            {currentQuestion?.options.map((option) => (
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
          
          {currentQuestionIndex < testQuestions.length - 1 ? (
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

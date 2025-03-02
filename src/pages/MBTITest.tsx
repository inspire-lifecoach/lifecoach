
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTestResults } from "@/hooks/useTests";
import { toast } from "sonner";

// Sample questions for MBTI test
const questions = [
  {
    id: 1,
    text: "At a party, you:",
    options: [
      { value: "E", text: "Interact with many, including strangers" },
      { value: "I", text: "Interact with a few, known to you" }
    ]
  },
  {
    id: 2,
    text: "You are more:",
    options: [
      { value: "S", text: "Realistic than speculative" },
      { value: "N", text: "Speculative than realistic" }
    ]
  },
  {
    id: 3,
    text: "Is it worse to:",
    options: [
      { value: "T", text: "Have your head in the clouds" },
      { value: "F", text: "Be in a rut" }
    ]
  },
  {
    id: 4,
    text: "You are more impressed by:",
    options: [
      { value: "T", text: "Principles" },
      { value: "F", text: "Emotions" }
    ]
  },
  {
    id: 5,
    text: "You are drawn more to:",
    options: [
      { value: "J", text: "The structured and scheduled" },
      { value: "P", text: "The unstructured and unplanned" }
    ]
  },
  {
    id: 6,
    text: "You prefer to work:",
    options: [
      { value: "J", text: "To deadlines" },
      { value: "P", text: "Just whenever" }
    ]
  },
  {
    id: 7,
    text: "You tend to choose:",
    options: [
      { value: "S", text: "Carefully" },
      { value: "N", text: "Impulsively" }
    ]
  },
  {
    id: 8,
    text: "At parties, you generally:",
    options: [
      { value: "E", text: "Stay late, with increasing energy" },
      { value: "I", text: "Leave early, with decreased energy" }
    ]
  },
  {
    id: 9,
    text: "You are more attracted to:",
    options: [
      { value: "S", text: "Sensible people" },
      { value: "N", text: "Creative people" }
    ]
  },
  {
    id: 10,
    text: "You are more interested in:",
    options: [
      { value: "S", text: "What is actual" },
      { value: "N", text: "What is possible" }
    ]
  },
  {
    id: 11,
    text: "In judging others, you are more swayed by:",
    options: [
      { value: "T", text: "Laws than circumstances" },
      { value: "F", text: "Circumstances than laws" }
    ]
  },
  {
    id: 12,
    text: "In approaching others, you are usually more:",
    options: [
      { value: "J", text: "Deliberate than spontaneous" },
      { value: "P", text: "Spontaneous than deliberate" }
    ]
  }
];

const MBTITest = () => {
  const navigate = useNavigate();
  const { saveResult } = useTestResults();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };
  
  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const calculateResults = () => {
    const counts = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    };
    
    Object.values(answers).forEach(answer => {
      counts[answer as keyof typeof counts]++;
    });
    
    const result = [
      counts.E > counts.I ? 'E' : 'I',
      counts.S > counts.N ? 'S' : 'N',
      counts.T > counts.F ? 'T' : 'F',
      counts.J > counts.P ? 'J' : 'P'
    ].join('');
    
    return result;
  };
  
  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    
    setIsSubmitting(true);
    const mbtiResult = calculateResults();
    
    // Find the test id for MBTI
    const testId = "d2d94fed-4a40-45b4-a9f6-aa3fa2167ad5"; // This should be fetched from the database or API
    
    await saveResult(testId, mbtiResult, {
      answers,
      letterCounts: {
        E: answers ? Object.values(answers).filter(a => a === 'E').length : 0,
        I: answers ? Object.values(answers).filter(a => a === 'I').length : 0,
        S: answers ? Object.values(answers).filter(a => a === 'S').length : 0,
        N: answers ? Object.values(answers).filter(a => a === 'N').length : 0,
        T: answers ? Object.values(answers).filter(a => a === 'T').length : 0,
        F: answers ? Object.values(answers).filter(a => a === 'F').length : 0,
        J: answers ? Object.values(answers).filter(a => a === 'J').length : 0,
        P: answers ? Object.values(answers).filter(a => a === 'P').length : 0,
      }
    });
    
    setIsSubmitting(false);
    navigate("/tests/mbti/result");
  };
  
  const progress = ((Object.keys(answers).length) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/tests")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tests
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Myers-Briggs Type Indicator (MBTI)</CardTitle>
            <CardDescription>
              Answer the following questions honestly based on your preferences and behaviors.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="py-4">
              <h3 className="text-xl font-medium mb-6">{questions[currentQuestion].text}</h3>
              
              <RadioGroup 
                value={answers[currentQuestion] || ""}
                onValueChange={handleAnswer}
                className="space-y-4"
              >
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-base cursor-pointer">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            {currentQuestion < questions.length - 1 ? (
              <Button 
                onClick={goToNextQuestion}
                disabled={!answers[currentQuestion]}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(answers).length < questions.length}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MBTITest;

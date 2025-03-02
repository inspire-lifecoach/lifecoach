
import { useTests, useTestResults } from "@/hooks/useTests";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

const Tests = () => {
  const { tests, loading } = useTests();
  const { results } = useTestResults();
  const navigate = useNavigate();
  
  // Check if a test has been taken
  const hasCompletedTest = (testId: string) => {
    return results.some(result => result.test_id === testId);
  };
  
  // Get the result for a test
  const getTestResult = (testId: string) => {
    return results.find(result => result.test_id === testId)?.result;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personality Tests</h1>
          <p className="text-gray-600">
            Discover your true self through scientifically designed assessments that reveal your unique personality traits, 
            preferences, and behavioral patterns.
          </p>
        </div>
        
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {tests.map((test) => (
              <Card key={test.id} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle>{test.name}</CardTitle>
                        {hasCompletedTest(test.id) && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        {test.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {test.type === 'mbti' && (
                        <div className="space-y-4">
                          <p>
                            The Myers-Briggs Type Indicator (MBTI) is one of the most popular personality assessments, categorizing people into 16 distinct types based on four dichotomies:
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li><span className="font-medium">Extraversion (E) vs. Introversion (I):</span> Where you focus your attention and get your energy</li>
                            <li><span className="font-medium">Sensing (S) vs. Intuition (N):</span> How you take in information</li>
                            <li><span className="font-medium">Thinking (T) vs. Feeling (F):</span> How you make decisions</li>
                            <li><span className="font-medium">Judging (J) vs. Perceiving (P):</span> How you deal with the outer world</li>
                          </ul>
                          <p className="text-sm text-gray-600">Estimated time: 15-20 minutes</p>
                        </div>
                      )}
                      
                      {test.type === 'big_five' && (
                        <div className="space-y-4">
                          <p>
                            The Big Five personality test measures your traits across five dimensions, often referred to as OCEAN:
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li><span className="font-medium">Openness:</span> Your receptiveness to new ideas and experiences</li>
                            <li><span className="font-medium">Conscientiousness:</span> Your tendency to be organized, disciplined, and achievement-oriented</li>
                            <li><span className="font-medium">Extraversion:</span> Your sociability and enthusiasm for the external world</li>
                            <li><span className="font-medium">Agreeableness:</span> Your tendency to be compassionate and cooperative</li>
                            <li><span className="font-medium">Neuroticism:</span> Your tendency to experience negative emotions</li>
                          </ul>
                          <p className="text-sm text-gray-600">Estimated time: 10-15 minutes</p>
                        </div>
                      )}
                      
                      {test.type === 'enneagram' && (
                        <div className="space-y-4">
                          <p>
                            The Enneagram identifies nine interconnected personality types, each with distinct motivations, fears, and patterns of behavior:
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li><span className="font-medium">Type 1:</span> The Reformer - Principled, purposeful, self-controlled</li>
                            <li><span className="font-medium">Type 2:</span> The Helper - Generous, people-pleasing, possessive</li>
                            <li><span className="font-medium">Type 3:</span> The Achiever - Adaptable, excelling, driven</li>
                            <li><span className="font-medium">Type 4:</span> The Individualist - Expressive, dramatic, self-absorbed</li>
                            <li><span className="font-medium">Type 5:</span> The Investigator - Perceptive, innovative, isolated</li>
                            <li><span className="font-medium">Type 6:</span> The Loyalist - Engaging, responsible, anxious</li>
                            <li><span className="font-medium">Type 7:</span> The Enthusiast - Spontaneous, versatile, scattered</li>
                            <li><span className="font-medium">Type 8:</span> The Challenger - Self-confident, decisive, confrontational</li>
                            <li><span className="font-medium">Type 9:</span> The Peacemaker - Receptive, reassuring, complacent</li>
                          </ul>
                          <p className="text-sm text-gray-600">Estimated time: 20-25 minutes</p>
                        </div>
                      )}
                    </CardContent>
                  </div>
                  
                  <div className="md:border-l border-gray-100 flex flex-col justify-center p-6 bg-gradient-to-br from-violet-50 to-indigo-50">
                    <div className="text-center space-y-4">
                      {hasCompletedTest(test.id) ? (
                        <>
                          <div>
                            <p className="text-gray-600 mb-2">Your Result</p>
                            <p className="text-2xl font-bold text-violet-700">{getTestResult(test.id)}</p>
                          </div>
                          <div className="space-y-2">
                            <Button 
                              className="w-full"
                              onClick={() => navigate(`/tests/${test.type}/result`)}
                            >
                              View Details
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => navigate(`/tests/${test.type}`)}
                            >
                              Retake Test
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2 mb-4">
                            <p className="text-gray-600">Haven't taken this test yet?</p>
                            <p className="text-sm">Discover new insights about yourself</p>
                          </div>
                          <Button 
                            className="w-full"
                            onClick={() => navigate(`/tests/${test.type}`)}
                          >
                            Start Test
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tests;

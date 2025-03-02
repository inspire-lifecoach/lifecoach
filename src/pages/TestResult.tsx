
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Share2, Download, BookOpen } from "lucide-react";
import { useTestResults } from "@/hooks/useTests";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// MBTI type descriptions
const mbtiDescriptions: Record<string, { title: string, description: string }> = {
  "INTJ": {
    title: "The Architect",
    description: "INTJs are analytical problem-solvers, eager to improve systems and processes with their innovative ideas. They have a talent for seeing possibilities for improvement, whether at work, at home, or in themselves. They're independent, creative, and lifelong learners."
  },
  "INTP": {
    title: "The Logician",
    description: "INTPs are innovative inventors with an unquenchable thirst for knowledge. They value truth, logic, and depth in their quest to understand how the universe works. They're well-suited to careers requiring deep intellectual exploration, analysis, and theoretical creativity."
  },
  "ENTJ": {
    title: "The Commander",
    description: "ENTJs are strategic leaders, motivated to organize change. They're quick to see inefficiency and conceptualize new solutions, and enjoy developing long-range plans to accomplish their vision. They excel in logical reasoning and are usually articulate communicators."
  },
  "ENTP": {
    title: "The Debater",
    description: "ENTPs are flexible, creative thinkers who enjoy understanding and analyzing the world around them. They're typically enthusiastic innovators, driven by possibilities, adventure, and spontaneity. Their ability to rapidly grasp complex concepts and patterns makes them skilled problem-solvers."
  },
  "INFJ": {
    title: "The Advocate",
    description: "INFJs are creative, insightful, and principled. They seek meaning and connection in their work, relationships, and interests. With a natural orientation toward the future, they're often drawn to social causes and making a positive impact on individuals and society."
  },
  "INFP": {
    title: "The Mediator",
    description: "INFPs are imaginative idealists, guided by their core values and beliefs. They're curious and imaginative, often exploring creative outlets like poetry, music, or art. Though quiet and reserved, they can become passionate advocates for their causes."
  },
  "ENFJ": {
    title: "The Protagonist",
    description: "ENFJs are people-focused organizers, driven by a desire to help others. They're naturally drawn to leadership roles and are skilled at motivating and inspiring others to achieve their potential. They enjoy creating harmony in their environment."
  },
  "ENFP": {
    title: "The Campaigner",
    description: "ENFPs are enthusiastic, creative, and sociable free spirits who find joy in possibilities and potential. Highly perceptive about people, they can identify someone's motivations and make connections between seemingly disparate events, people, or ideas."
  },
  "ISTJ": {
    title: "The Logistician",
    description: "ISTJs are practical, fact-minded individuals who value tradition, reliability, and maintaining order. They excel at creating and maintaining systems to keep things running smoothly. Their strong organizational skills and attention to detail make them invaluable in many settings."
  },
  "ISFJ": {
    title: "The Defender",
    description: "ISFJs are warm, dedicated caretakers who thrive on helping others in tangible ways. They excel at anticipating others' needs and creating systems to prevent future problems. With a strong work ethic and attention to detail, they're reliable, conscientious contributors."
  },
  "ESTJ": {
    title: "The Executive",
    description: "ESTJs are practical, realistic organizers who value tradition and security. They enjoy executing plans and reaching goals efficiently. They're direct communicators who value honesty and commitment. Their ability to organize resources and implement processes makes them effective leaders."
  },
  "ESFJ": {
    title: "The Consul",
    description: "ESFJs are warmhearted, conscientious, and cooperative. They value connections with others and work hard to create harmony in their environment. With a focus on maintaining traditions and relationships, they're responsive to others' needs and excellent at creating a sense of belonging."
  },
  "ISTP": {
    title: "The Virtuoso",
    description: "ISTPs are practical problem-solvers who enjoy understanding how things work. They excel at hands-on activities and often have an affinity for tools, machinery, and craftsmanship. Independent and adaptive, they're good in a crisis and enjoy variety and action."
  },
  "ISFP": {
    title: "The Adventurer",
    description: "ISFPs are gentle, sensitive, and nurturing individuals who enjoy living in the present moment. They value their freedom and have a strong aesthetic sense. Often artistic, they express themselves through action rather than words. They're loyal to their values and to the people who matter to them."
  },
  "ESTP": {
    title: "The Entrepreneur",
    description: "ESTPs are energetic, adaptable, and action-oriented. They excel at solving practical problems and are often skilled negotiators. With a pragmatic approach to life, they enjoy variety, spontaneity, and the excitement of new experiences."
  },
  "ESFP": {
    title: "The Entertainer",
    description: "ESFPs are vibrant, enthusiastic, and spontaneous individuals who enjoy living in the moment. They're outgoing and sociable, often bringing a sense of fun to any environment. With a practical approach to problem-solving, they focus on immediate results rather than long-term implications."
  }
};

const TestResult = () => {
  const navigate = useNavigate();
  const { testType } = useParams<{ testType: string }>();
  const { results, loading } = useTestResults();
  const [result, setResult] = useState<any>(null);
  
  useEffect(() => {
    if (!loading && results.length > 0) {
      // Find the result for the current test type
      const testResult = results.find(r => r.test?.type === testType);
      if (testResult) {
        setResult(testResult);
      } else {
        // Redirect if no result found
        navigate(`/tests/${testType}`);
      }
    }
  }, [loading, results, testType, navigate]);

  if (loading || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/tests")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tests
        </Button>
        
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl md:text-3xl">Your Personality Type: {result.result}</CardTitle>
            <CardDescription className="text-gray-100">
              {testType === 'mbti' && mbtiDescriptions[result.result]?.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 px-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="traits">Key Traits</TabsTrigger>
                <TabsTrigger value="growth">Growth Areas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                {testType === 'mbti' && (
                  <>
                    <p className="text-lg">{mbtiDescriptions[result.result]?.description}</p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mt-6">
                      <h3 className="text-lg font-medium mb-3">Your Type Breakdown</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium">Extraversion (E) vs. Introversion (I)</p>
                          <p className="text-gray-600">{result.result.includes('E') ? 'You gain energy from social interaction and the external world.' : 'You gain energy from time alone and internal reflection.'}</p>
                        </div>
                        <div>
                          <p className="font-medium">Sensing (S) vs. Intuition (N)</p>
                          <p className="text-gray-600">{result.result.includes('S') ? 'You focus on concrete details and present realities.' : 'You focus on patterns, possibilities, and future potential.'}</p>
                        </div>
                        <div>
                          <p className="font-medium">Thinking (T) vs. Feeling (F)</p>
                          <p className="text-gray-600">{result.result.includes('T') ? 'You make decisions based on logic and objective analysis.' : 'You make decisions based on values and interpersonal considerations.'}</p>
                        </div>
                        <div>
                          <p className="font-medium">Judging (J) vs. Perceiving (P)</p>
                          <p className="text-gray-600">{result.result.includes('J') ? 'You prefer structure, planning, and resolution.' : 'You prefer flexibility, spontaneity, and keeping options open.'}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="traits" className="space-y-4">
                <h3 className="text-xl font-medium mb-3">Strengths</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {testType === 'mbti' && result.result === 'INTJ' && (
                    <>
                      <li>Strategic thinking and long-term planning</li>
                      <li>Independent and self-sufficient</li>
                      <li>Analytical problem-solving</li>
                      <li>Ability to recognize patterns and develop innovative solutions</li>
                      <li>Committed to constant improvement</li>
                    </>
                  )}
                  {/* More strength lists for other types would go here */}
                </ul>
                
                <h3 className="text-xl font-medium mb-3 mt-6">Communication Style</h3>
                <p>
                  {testType === 'mbti' && result.result === 'INTJ' && 
                    "You tend to communicate directly and logically, preferring substantive discussions over small talk. You value precision in language and may become impatient with redundancy or emotional appeals. In conversations, you're more interested in exchanging ideas and solving problems than in social niceties."
                  }
                  {/* More communication style descriptions for other types would go here */}
                </p>
                
                <h3 className="text-xl font-medium mb-3 mt-6">Workplace Habits</h3>
                <p>
                  {testType === 'mbti' && result.result === 'INTJ' && 
                    "You thrive in environments that value competence and allow for independent work. You excel at developing systems and strategies, particularly those requiring long-term vision. You prefer clear objectives with the freedom to determine how to accomplish them. You may struggle with micromanagement or environments that prioritize tradition over innovation."
                  }
                  {/* More workplace habits descriptions for other types would go here */}
                </p>
              </TabsContent>
              
              <TabsContent value="growth" className="space-y-4">
                <h3 className="text-xl font-medium mb-3">Growth Opportunities</h3>
                <p>
                  {testType === 'mbti' && result.result === 'INTJ' && 
                    "As an INTJ, your growth path involves developing your emotional intelligence and interpersonal skills. While your analytical strengths serve you well, balancing them with greater empathy and patience for others' perspectives can enhance your effectiveness in teams and relationships."
                  }
                  {/* More growth opportunities for other types would go here */}
                </p>
                
                <div className="bg-violet-50 p-4 rounded-lg mt-4">
                  <h4 className="font-medium mb-2">Practices for Personal Development</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {testType === 'mbti' && result.result === 'INTJ' && (
                      <>
                        <li>Practice active listening without immediately planning your response</li>
                        <li>Acknowledge and validate others' emotions, even when they seem illogical to you</li>
                        <li>Share your thought process with others to avoid appearing aloof or unapproachable</li>
                        <li>Develop patience for processes that require collaboration and consensus</li>
                        <li>Take time to recognize and appreciate the contributions of team members</li>
                      </>
                    )}
                    {/* More development practices for other types would go here */}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 justify-between">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Result
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
            <Button onClick={() => navigate('/insights')}>
              <BookOpen className="h-4 w-4 mr-2" />
              Explore Insights
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TestResult;

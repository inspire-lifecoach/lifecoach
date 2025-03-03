
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for insights
const personalityInsights = [
  {
    id: 1,
    title: 'Communication Style',
    content: 'You tend to communicate in a direct and logical manner. You prefer facts and clear information over emotional appeals. In group settings, you may sometimes appear reserved, but when discussing topics you're knowledgeable about, you become much more engaged and articulate.',
    category: 'relationships'
  },
  {
    id: 2,
    title: 'Work Environment',
    content: 'You thrive in environments that offer intellectual challenges and autonomy. You prefer to work independently but can collaborate effectively when the team respects expertise and logical thinking. You may struggle in highly emotional or chaotic workplaces that lack structure or clear objectives.',
    category: 'career'
  },
  {
    id: 3,
    title: 'Decision Making',
    content: 'Your decision-making process is predominantly analytical. You carefully weigh options based on logical consequences rather than emotional impact. While this leads to well-reasoned decisions, you might sometimes overlook how your choices affect others emotionally.',
    category: 'personal_growth'
  },
  {
    id: 4,
    title: 'Stress Response',
    content: 'Under stress, you tend to withdraw and seek solitude to process your thoughts. Your typical response is to analyze the problem extensively, sometimes leading to overthinking. Learning to incorporate mindfulness practices can help balance your analytical tendencies during stressful periods.',
    category: 'wellbeing'
  }
];

const strengthsData = [
  { trait: 'Analytical Thinking', score: 85 },
  { trait: 'Problem Solving', score: 90 },
  { trait: 'Independence', score: 75 },
  { trait: 'Strategic Planning', score: 80 },
  { trait: 'Adaptability', score: 65 },
  { trait: 'Emotional Intelligence', score: 60 },
];

const categoryColors = {
  relationships: 'bg-blue-100 text-blue-800',
  career: 'bg-green-100 text-green-800',
  personal_growth: 'bg-purple-100 text-purple-800',
  wellbeing: 'bg-amber-100 text-amber-800'
};

const Insights = () => {
  const [activeTab, setActiveTab] = useState('personality');

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
        Your Personal Insights
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Discover deeper understanding about your personality and behavior patterns
      </p>

      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="personality">Personality</TabsTrigger>
            <TabsTrigger value="strengths">Strengths & Areas for Growth</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personality" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Personality Type: INTJ</CardTitle>
                <CardDescription>The Architect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  INTJs are analytical problem-solvers, eager to improve systems and processes with their innovative ideas. They have a talent for seeing possibilities for improvement, whether at work, at home, or in themselves.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h3 className="font-medium mb-2">Core Traits:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Strategic thinker</li>
                      <li>Independent</li>
                      <li>Analytical</li>
                      <li>Reserved</li>
                      <li>Rational</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Typical Challenges:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>May appear aloof or detached</li>
                      <li>Perfectionist tendencies</li>
                      <li>Difficulty with emotional expression</li>
                      <li>Impatience with inefficiency</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 gap-6">
              {personalityInsights.map((insight) => (
                <Card key={insight.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${categoryColors[insight.category as keyof typeof categoryColors]}`}>
                        {insight.category.replace('_', ' ')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{insight.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="strengths">
            <Card>
              <CardHeader>
                <CardTitle>Your Strengths Profile</CardTitle>
                <CardDescription>Based on your personality assessment and journal entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 w-full mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={strengthsData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="trait" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#8884d8" barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-3">Key Strengths</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-2 mr-2"></span>
                        <div>
                          <span className="font-medium">Analytical Thinking</span>
                          <p className="text-sm text-muted-foreground">You excel at breaking down complex problems into manageable parts.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-2 mr-2"></span>
                        <div>
                          <span className="font-medium">Problem Solving</span>
                          <p className="text-sm text-muted-foreground">You naturally find innovative solutions to difficult challenges.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-2 mr-2"></span>
                        <div>
                          <span className="font-medium">Strategic Planning</span>
                          <p className="text-sm text-muted-foreground">You have a gift for long-term vision and planning.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-3">Growth Opportunities</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-2 mr-2"></span>
                        <div>
                          <span className="font-medium">Emotional Intelligence</span>
                          <p className="text-sm text-muted-foreground">Developing greater awareness of your own and others' emotions.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-2 mr-2"></span>
                        <div>
                          <span className="font-medium">Adaptability</span>
                          <p className="text-sm text-muted-foreground">Becoming more comfortable with unexpected changes and uncertainty.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-2 mr-2"></span>
                        <div>
                          <span className="font-medium">Active Listening</span>
                          <p className="text-sm text-muted-foreground">Improving your ability to truly hear others' perspectives.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Download Full Strengths Report</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Recommendations</CardTitle>
                  <CardDescription>Based on your personality type and strengths</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-3">Career Development</h3>
                    <p className="mb-3">Your analytical nature and strategic thinking make you well-suited for roles that require problem-solving and long-term planning.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button variant="outline" className="justify-start">
                        <div className="text-left">
                          <div className="font-medium">Strategic Leadership Course</div>
                          <div className="text-xs text-muted-foreground">6-week online program</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <div className="text-left">
                          <div className="font-medium">Systems Analysis Workshop</div>
                          <div className="text-xs text-muted-foreground">Interactive learning</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-lg mb-3">Relationship Building</h3>
                    <p className="mb-3">Working on your emotional intelligence can help strengthen both personal and professional relationships.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button variant="outline" className="justify-start">
                        <div className="text-left">
                          <div className="font-medium">Active Listening Practice</div>
                          <div className="text-xs text-muted-foreground">Daily exercises</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <div className="text-left">
                          <div className="font-medium">Emotional Intelligence Book</div>
                          <div className="text-xs text-muted-foreground">Recommended reading</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-lg mb-3">Personal Growth</h3>
                    <p className="mb-3">Balance your analytical strengths with activities that encourage flexibility and emotional awareness.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button variant="outline" className="justify-start">
                        <div className="text-left">
                          <div className="font-medium">Mindfulness Meditation</div>
                          <div className="text-xs text-muted-foreground">10 minutes daily</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <div className="text-left">
                          <div className="font-medium">Improv Workshop</div>
                          <div className="text-xs text-muted-foreground">Adaptability training</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                    Get Complete Recommendation Plan
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Insights;


import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useTestResults } from "@/hooks/useTests";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, BookOpenIcon, BarChart3Icon, ScrollTextIcon } from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { results, loading: resultsLoading } = useTestResults();
  const navigate = useNavigate();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile?.full_name || user?.email}</h1>
            <p className="text-gray-600 mt-1">
              {profile?.personality_type 
                ? `Your personality type: ${profile.personality_type}` 
                : "Take a test to discover your personality type"}
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/profile")}
            >
              Edit Profile
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BookOpenIcon className="h-5 w-5 mr-2 text-violet-500" />
                    Personality Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profileLoading ? (
                    <div className="h-24 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
                    </div>
                  ) : profile?.personality_type ? (
                    <div>
                      <p className="text-2xl font-semibold text-center my-4">{profile.personality_type}</p>
                      <p className="text-gray-600 text-sm">{profile.bio || "Add a bio to your profile to describe yourself."}</p>
                    </div>
                  ) : (
                    <div className="h-24 flex flex-col items-center justify-center gap-2">
                      <p className="text-gray-600 text-center">No personality type yet</p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate("/tests")}
                      >
                        Take a test
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ScrollTextIcon className="h-5 w-5 mr-2 text-violet-500" />
                    Recent Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {resultsLoading ? (
                    <div className="h-24 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
                    </div>
                  ) : results.length > 0 ? (
                    <ul className="space-y-2">
                      {results.slice(0, 3).map((result) => (
                        <li key={result.id} className="text-sm">
                          <div className="font-medium">{result.test?.name}: {result.result}</div>
                          <div className="text-gray-500 text-xs">{formatDate(result.created_at)}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="h-24 flex flex-col items-center justify-center gap-2">
                      <p className="text-gray-600 text-center">No tests taken yet</p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate("/tests")}
                      >
                        Take your first test
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3Icon className="h-5 w-5 mr-2 text-violet-500" />
                    Suggested Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile?.personality_type ? (
                    <ul className="space-y-2">
                      <li className="text-sm">
                        <div className="font-medium">Relationship Compatibility</div>
                        <div className="text-gray-500 text-xs">Learn which types complement yours</div>
                      </li>
                      <li className="text-sm">
                        <div className="font-medium">Career Guidance</div>
                        <div className="text-gray-500 text-xs">Discover ideal careers for your type</div>
                      </li>
                      <li className="text-sm">
                        <div className="font-medium">Communication Style</div>
                        <div className="text-gray-500 text-xs">Tips for effective interactions</div>
                      </li>
                    </ul>
                  ) : (
                    <div className="h-24 flex items-center justify-center text-gray-600 text-center">
                      Take a personality test to get personalized insights
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate("/insights")}
                  >
                    View All Insights
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tests">
            <Card>
              <CardHeader>
                <CardTitle>Personality Tests</CardTitle>
                <CardDescription>
                  Discover different aspects of your personality through our scientifically designed assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Myers-Briggs Type Indicator</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Discover your preferences in how you perceive the world and make decisions
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate("/tests/mbti")}
                      >
                        Start Test
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Big Five</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Measure your personality across five core dimensions
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate("/tests/big-five")}
                      >
                        Start Test
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Enneagram</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Identify your core personality type among nine interconnected types
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate("/tests/enneagram")}
                      >
                        Start Test
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Insights</CardTitle>
                <CardDescription>
                  Understand yourself better with insights tailored to your personality type
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile?.personality_type ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Relationships</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-md">Communication Style</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600">
                              Learn how your personality type influences your communication style and get tips for more effective interactions.
                            </p>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => navigate("/insights/relationships/communication")}
                            >
                              Read More
                            </Button>
                          </CardFooter>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-md">Compatibility</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600">
                              Discover which personality types are most compatible with yours and why.
                            </p>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => navigate("/insights/relationships/compatibility")}
                            >
                              Read More
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Career</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-md">Ideal Career Paths</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600">
                              Explore career options that align with your natural strengths and preferences.
                            </p>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => navigate("/insights/career/paths")}
                            >
                              Read More
                            </Button>
                          </CardFooter>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-md">Work Environment</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600">
                              Learn about the work environments and conditions where you're most likely to thrive.
                            </p>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => navigate("/insights/career/environment")}
                            >
                              Read More
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center gap-4">
                    <p className="text-gray-600 text-center">
                      Take a personality test to unlock personalized insights
                    </p>
                    <Button 
                      onClick={() => navigate("/tests")}
                    >
                      Take a Test
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Your Journey</CardTitle>
                <CardDescription>
                  Track your personal growth and development
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Test History</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {results.map((result) => (
                              <tr key={result.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.test?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.result}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(result.created_at)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Personal Growth Plan</h3>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-gray-600 mb-4">
                            Based on your personality type, we've created a personalized growth plan to help you develop your strengths and manage your challenges.
                          </p>
                          <Button onClick={() => navigate("/growth-plan")}>
                            View Growth Plan
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center gap-4">
                    <p className="text-gray-600 text-center">
                      Take a personality test to start tracking your progress
                    </p>
                    <Button 
                      onClick={() => navigate("/tests")}
                    >
                      Take a Test
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;

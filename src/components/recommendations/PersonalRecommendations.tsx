
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Book, Briefcase, Heart, Sparkles, RefreshCw, Loader2, ExternalLink } from "lucide-react";

interface Resource {
  title: string;
  type: string;
  url?: string;
}

interface Recommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  resources: Resource[];
  created_at: string;
}

const PersonalRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("recommendations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setRecommendations(data || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to load recommendations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshRecommendations = async () => {
    setIsRefreshing(true);
    try {
      const session = await supabase.auth.getSession();
      const response = await fetch(`${window.location.origin}/api/get_recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.data.session?.access_token}`
        },
        body: JSON.stringify({ context: { source: "dashboard" } })
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      await fetchRecommendations();
      
      toast({
        title: "Success",
        description: "Recommendations refreshed successfully",
      });
    } catch (error) {
      console.error("Error refreshing recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to refresh recommendations",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'career':
        return <Briefcase className="h-5 w-5" />;
      case 'relationship':
        return <Heart className="h-5 w-5" />;
      case 'self-improvement':
        return <Sparkles className="h-5 w-5" />;
      default:
        return <Book className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'career':
        return 'bg-blue-100 text-blue-800';
      case 'relationship':
        return 'bg-pink-100 text-pink-800';
      case 'self-improvement':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRecommendations = activeTab === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type.toLowerCase() === activeTab.toLowerCase());

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Personalized Recommendations</CardTitle>
            <CardDescription>
              Based on your personality type and journal entries
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshRecommendations}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="career" className="flex-1">Career</TabsTrigger>
            <TabsTrigger value="relationship" className="flex-1">Relationships</TabsTrigger>
            <TabsTrigger value="self-improvement" className="flex-1">Self-Improvement</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-gray-500">Loading recommendations...</p>
              </div>
            ) : filteredRecommendations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No recommendations available</p>
                <Button 
                  onClick={refreshRecommendations}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? "Generating..." : "Generate Recommendations"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecommendations.map((rec) => (
                  <div key={rec.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getTypeColor(rec.type)} flex-shrink-0`}>
                        {getTypeIcon(rec.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-lg font-medium">{rec.title}</h3>
                          <Badge className={getTypeColor(rec.type)}>
                            {rec.type}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{rec.description}</p>
                        
                        {rec.resources && rec.resources.length > 0 && (
                          <div className="space-y-2 mt-2">
                            <h4 className="text-sm font-medium">Resources</h4>
                            {rec.resources.map((resource, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm border-l-2 border-gray-200 pl-3">
                                <Badge variant="outline" className="px-2 py-0 h-5">
                                  {resource.type}
                                </Badge>
                                {resource.url ? (
                                  <a 
                                    href={resource.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    {resource.title}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                ) : (
                                  <span>{resource.title}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonalRecommendations;

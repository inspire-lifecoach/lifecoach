
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from "recharts";
import { Loader2 } from "lucide-react";

interface Trait {
  trait: string;
  score: number;
  description: string;
}

interface ComparisonResult {
  similarities: Trait[];
  differences: Trait[];
  visualizationData: {
    radar: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
      }[];
    };
  };
}

const mbtiTypes = [
  "INFJ", "INFP", "INTJ", "INTP",
  "ISFJ", "ISFP", "ISTJ", "ISTP",
  "ENFJ", "ENFP", "ENTJ", "ENTP",
  "ESFJ", "ESFP", "ESTJ", "ESTP"
];

const PersonalityComparison = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("similarities");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const { toast } = useToast();

  const handleAddType = (type: string) => {
    if (!selectedTypes.includes(type) && selectedTypes.length < 3) {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleRemoveType = (type: string) => {
    setSelectedTypes(selectedTypes.filter(t => t !== type));
  };

  const handleCompare = async () => {
    if (selectedTypes.length < 1) {
      toast({
        title: "Selection Required",
        description: "Please select at least one personality type to compare with.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const session = await supabase.auth.getSession();
      const response = await fetch(`${window.location.origin}/api/compare_personality`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.data.session?.access_token}`
        },
        body: JSON.stringify({ compareWith: selectedTypes })
      });

      if (!response.ok) {
        throw new Error("Failed to compare personality types");
      }

      const result = await response.json();
      setComparisonResult(result);
    } catch (error) {
      console.error("Error comparing personality types:", error);
      toast({
        title: "Error",
        description: "Failed to compare personality types. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Transform the radar data for Recharts
  const getRadarData = () => {
    if (!comparisonResult) return [];

    const { labels, datasets } = comparisonResult.visualizationData.radar;
    
    return labels.map((label, i) => {
      const dataPoint = { name: label };
      datasets.forEach(ds => {
        dataPoint[ds.label] = ds.data[i];
      });
      return dataPoint;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personality Type Comparison</CardTitle>
        <CardDescription>
          Compare your personality type with other MBTI types to understand similarities and differences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Select types to compare with your personality type:</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTypes.map(type => (
                <Badge key={type} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {type}
                  <button 
                    className="ml-1 text-blue-800 hover:text-blue-900" 
                    onClick={() => handleRemoveType(type)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Select onValueChange={handleAddType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Add type..." />
                </SelectTrigger>
                <SelectContent>
                  {mbtiTypes.map(type => (
                    <SelectItem 
                      key={type} 
                      value={type}
                      disabled={selectedTypes.includes(type)}
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCompare} disabled={isLoading || selectedTypes.length === 0}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Comparing...
                  </>
                ) : (
                  "Compare"
                )}
              </Button>
            </div>
          </div>

          {comparisonResult && (
            <div className="pt-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="visualization" className="flex-1">Visualization</TabsTrigger>
                  <TabsTrigger value="similarities" className="flex-1">Similarities</TabsTrigger>
                  <TabsTrigger value="differences" className="flex-1">Differences</TabsTrigger>
                </TabsList>
                
                <TabsContent value="visualization" className="pt-4">
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={getRadarData()}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        {comparisonResult.visualizationData.radar.datasets.map((dataset, index) => (
                          <Radar
                            key={dataset.label}
                            name={dataset.label}
                            dataKey={dataset.label}
                            stroke={index === 0 ? "#3b82f6" : "#ec4899"}
                            fill={index === 0 ? "#3b82f6" : "#ec4899"}
                            fillOpacity={0.2}
                          />
                        ))}
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="similarities" className="space-y-4 pt-4">
                  {comparisonResult.similarities.map((trait, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-green-50">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium">{trait.trait}</h4>
                        <Badge className="bg-green-100 text-green-800">
                          Score: {trait.score}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{trait.description}</p>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="differences" className="space-y-4 pt-4">
                  {comparisonResult.differences.map((trait, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-red-50">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium">{trait.trait}</h4>
                        <Badge className="bg-red-100 text-red-800">
                          Score: {trait.score}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{trait.description}</p>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalityComparison;

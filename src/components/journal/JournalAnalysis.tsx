
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface Sentiment {
  positive: number;
  neutral: number;
  negative: number;
}

interface PersonalityInsights {
  extraversion_indicators: string;
  conscientiousness_indicators: string;
  openness_indicators: string;
}

interface JournalAnalysisData {
  id: string;
  entry_id: string;
  sentiment: Sentiment;
  themes: string[];
  personality_insights: PersonalityInsights;
  created_at: string;
}

interface JournalAnalysisProps {
  entryId: string;
}

const JournalAnalysis = ({ entryId }: JournalAnalysisProps) => {
  const [analysis, setAnalysis] = useState<JournalAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Call our edge function to get analysis
        const session = await supabase.auth.getSession();
        const response = await fetch(
          `${window.location.origin}/api/journal_operations/get-analysis?entry_id=${entryId}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${session.data.session?.access_token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch analysis");
        }

        const data = await response.json();
        setAnalysis(data);
      } catch (error) {
        console.error("Error fetching analysis:", error);
        setError("Failed to load analysis. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [entryId]);

  if (isLoading) {
    return (
      <Card className="bg-gray-50 border-t border-gray-200">
        <CardContent className="p-4">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !analysis) {
    return (
      <Card className="bg-gray-50 border-t border-gray-200">
        <CardContent className="p-4">
          <p className="text-red-500">{error || "No analysis available."}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-50 border-t border-gray-200">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Sentiment Analysis</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Positive</span>
                <span>{Math.round(analysis.sentiment.positive * 100)}%</span>
              </div>
              <Progress value={analysis.sentiment.positive * 100} className="h-2 bg-gray-200" />
              
              <div className="flex justify-between text-xs mb-1">
                <span>Neutral</span>
                <span>{Math.round(analysis.sentiment.neutral * 100)}%</span>
              </div>
              <Progress value={analysis.sentiment.neutral * 100} className="h-2 bg-gray-200" />
              
              <div className="flex justify-between text-xs mb-1">
                <span>Negative</span>
                <span>{Math.round(analysis.sentiment.negative * 100)}%</span>
              </div>
              <Progress value={analysis.sentiment.negative * 100} className="h-2 bg-gray-200" />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Detected Themes</h4>
            <div className="flex flex-wrap gap-1">
              {analysis.themes.map((theme, index) => (
                <Badge key={index} variant="outline" className="bg-white">
                  {theme.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Personality Insights</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="border rounded p-2 bg-white">
                <div className="text-xs text-gray-500">Extraversion</div>
                <div className="font-medium capitalize">{analysis.personality_insights.extraversion_indicators}</div>
              </div>
              <div className="border rounded p-2 bg-white">
                <div className="text-xs text-gray-500">Conscientiousness</div>
                <div className="font-medium capitalize">{analysis.personality_insights.conscientiousness_indicators}</div>
              </div>
              <div className="border rounded p-2 bg-white">
                <div className="text-xs text-gray-500">Openness</div>
                <div className="font-medium capitalize">{analysis.personality_insights.openness_indicators}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalAnalysis;

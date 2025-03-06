
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInsights } from "@/hooks/useInsights";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import AdvisorInsight from '@/components/AdvisorInsight';
import CheckInList from '@/components/advisor/CheckInList';
import { useCheckIns } from '@/hooks/useCheckIns';

const Insights = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { insights, isLoading: insightsLoading } = useInsights(profile?.personality_type);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("insights");
  const { 
    checkIns, 
    isLoading: checkInsLoading, 
    fetchCheckIns, 
    markAsResponded, 
    generateCheckIn 
  } = useCheckIns();

  useEffect(() => {
    if (!profile?.personality_type && !insightsLoading && user) {
      toast({
        title: "Take a personality test",
        description: "Complete a personality test to receive personalized insights.",
        action: (
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/tests"}>
            Take a test
          </Button>
        ),
      });
    }
  }, [profile, insightsLoading, user]);

  // Handle check-in response
  const handleCheckInResponse = async (checkInId: string, response: string) => {
    try {
      if (!user) return;
      
      // Save the response
      const { error } = await supabase
        .from('check_in_responses')
        .insert({
          check_in_id: checkInId,
          user_id: user.id,
          response
        });
      
      if (error) throw error;
      
      // Mark the check-in as responded
      await markAsResponded(checkInId);
      
      toast({
        title: "Response submitted",
        description: "Your response has been saved.",
      });
    } catch (error: any) {
      console.error('Error saving response:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your response.",
      });
    }
  };

  // Handle generating a new check-in
  const handleGenerateCheckIn = async () => {
    const result = await generateCheckIn();
    
    if (result) {
      toast({
        title: "New check-in created",
        description: "A new personal check-in has been generated for you.",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Personal Insights</h1>
        
        <Tabs defaultValue="insights" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="insights">Personality Insights</TabsTrigger>
            <TabsTrigger value="check-ins">Personal Check-ins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="mt-6">
            {insightsLoading ? (
              <Card>
                <CardHeader>
                  <CardTitle>Loading insights...</CardTitle>
                  <CardDescription>Please wait while we fetch your personalized insights.</CardDescription>
                </CardHeader>
              </Card>
            ) : !profile?.personality_type ? (
              <Card>
                <CardHeader>
                  <CardTitle>Take a personality test</CardTitle>
                  <CardDescription>Complete a personality test to receive personalized insights.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => window.location.href = "/tests"}>
                    Go to tests
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.slice(0, 6).map((insight) => (
                    <AdvisorInsight
                      key={insight.id}
                      title={insight.title}
                      description={insight.content}
                      type={insight.category as any}
                      source="test-result"
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="check-ins" className="mt-6">
            <CheckInList
              checkIns={checkIns}
              isLoading={checkInsLoading}
              onRespond={handleCheckInResponse}
              onRefresh={fetchCheckIns}
              onGenerate={handleGenerateCheckIn}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Insights;

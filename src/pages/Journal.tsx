
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Mic, Send, Loader2 } from "lucide-react";
import JournalEntryList from "@/components/journal/JournalEntryList";
import VoiceRecorder from "@/components/journal/VoiceRecorder";
import { formatDistanceToNow } from "date-fns";

interface JournalEntry {
  id: string;
  content: string;
  created_at: string;
  mood: string;
  entry_type: 'text' | 'voice';
  audio_url?: string;
  user_id: string;
}

const Journal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [journalContent, setJournalContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      // We need to ensure the entry_type is either 'text' or 'voice'
      const typedEntries = data?.map(entry => ({
        ...entry,
        entry_type: entry.entry_type as 'text' | 'voice'
      })) || [];
      
      setEntries(typedEntries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTextEntry = async () => {
    if (!journalContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Call our edge function
      const response = await fetch(`${window.location.origin}/api/journal_operations/create-entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ content: journalContent })
      });

      if (!response.ok) {
        throw new Error("Failed to create journal entry");
      }

      const newEntry = await response.json();
      
      setEntries(prev => [newEntry, ...prev]);
      setJournalContent("");
      toast({
        title: "Success",
        description: "Journal entry saved",
      });
    } catch (error) {
      console.error("Error creating journal entry:", error);
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoiceEntry = async (audioBlob: Blob) => {
    setIsSubmitting(true);
    try {
      // Create form data with the audio file
      const formData = new FormData();
      formData.append("audio_file", audioBlob, "recording.webm");
      
      // Call our edge function
      const response = await fetch(`${window.location.origin}/api/process_voice_journal`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Failed to process voice journal");
      }

      const result = await response.json();
      
      // Add the new entry to the list
      const newEntry: JournalEntry = {
        id: result.entry.id,
        content: result.entry.content,
        created_at: result.entry.date,
        mood: result.entry.mood,
        entry_type: 'voice',
        audio_url: result.entry.audio_url
      };
      
      setEntries(prev => [newEntry, ...prev]);
      toast({
        title: "Success",
        description: "Voice journal processed and saved",
      });
    } catch (error) {
      console.error("Error processing voice journal:", error);
      toast({
        title: "Error",
        description: "Failed to process voice journal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Personal Journal</h1>
      
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>New Entry</CardTitle>
              <CardDescription>Record your thoughts and reflections</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="text" className="flex-1">Text</TabsTrigger>
                  <TabsTrigger value="voice" className="flex-1">Voice</TabsTrigger>
                </TabsList>
                
                <TabsContent value="text">
                  <Textarea 
                    placeholder="What's on your mind today?"
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                    className="min-h-[200px]"
                  />
                </TabsContent>
                
                <TabsContent value="voice">
                  <VoiceRecorder onRecordingComplete={handleVoiceEntry} />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              {activeTab === "text" && (
                <Button 
                  onClick={handleSubmitTextEntry} 
                  disabled={isSubmitting || !journalContent.trim()}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Save Entry
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Journal Entries</CardTitle>
              <CardDescription>Review your past entries</CardDescription>
            </CardHeader>
            <CardContent>
              <JournalEntryList 
                entries={entries} 
                isLoading={isLoading} 
                onRefresh={fetchEntries}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Journal;

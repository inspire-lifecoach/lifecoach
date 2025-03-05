
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import JournalEntryList from '@/components/journal/JournalEntryList';
import JournalAnalysis from '@/components/journal/JournalAnalysis';
import VoiceRecorder from '@/components/journal/VoiceRecorder';

export interface JournalEntry {
  id: string;
  content: string;
  created_at: string;
  mood: string | null;
  entry_type: 'text' | 'voice';
  audio_url: string | null;
  user_id: string;
}

const Journal = () => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('write');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch journal entries on component mount
  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform the data to ensure entry_type is strictly 'text' or 'voice'
      const typedEntries = data?.map(entry => ({
        ...entry,
        entry_type: (entry.entry_type === 'voice' ? 'voice' : 'text') as 'text' | 'voice'
      })) || [];
      
      setEntries(typedEntries);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your journal entries.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          content,
          mood,
          user_id: user.id,
          entry_type: 'text'
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh entries list
      fetchEntries();

      // Clear form
      setContent('');
      setMood('neutral');
      setActiveTab('list');

      toast({
        title: "Journal Entry Saved",
        description: "Your journal entry has been successfully saved.",
      });
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your journal entry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEntryClick = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setActiveTab('analysis');
  };

  const handleClearSelection = () => {
    setSelectedEntry(null);
    setActiveTab('list');
  };

  const handleVoiceEntryComplete = async (audioBlob: Blob, transcript: string) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Upload audio file to storage
      const fileName = `voice-entry-${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('journal_audio')
        .upload(fileName, audioBlob);
        
      if (uploadError) throw uploadError;
      
      // Get the URL for the uploaded file
      const { data: urlData } = await supabase.storage
        .from('journal_audio')
        .getPublicUrl(fileName);
        
      const audioUrl = urlData?.publicUrl;
      
      // Create the journal entry with the voice transcript and audio URL
      const { data: entryData, error: entryError } = await supabase
        .from('journal_entries')
        .insert({
          content: transcript,
          mood: 'neutral', // Default mood for voice entries
          entry_type: 'voice',
          audio_url: audioUrl,
          user_id: user.id
        })
        .select()
        .single();
        
      if (entryError) throw entryError;
      
      // Refresh entries list
      fetchEntries();
      
      toast({
        title: "Voice Entry Saved",
        description: "Your voice journal entry has been recorded and transcribed.",
      });
    } catch (error) {
      console.error('Error saving voice entry:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your voice entry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Journal</h1>

        <Tabs defaultValue="write" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="write">Write Entry</TabsTrigger>
            <TabsTrigger value="list">View Entries</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!selectedEntry}>Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="write" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Entry</CardTitle>
                <CardDescription>Write down your thoughts and feelings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="entry">Entry</Label>
                  <Textarea 
                    id="entry"
                    placeholder="Write your journal entry here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="mood">Mood</Label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger id="mood">
                      <SelectValue placeholder="Select a mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="happy">Happy</SelectItem>
                      <SelectItem value="sad">Sad</SelectItem>
                      <SelectItem value="excited">Excited</SelectItem>
                      <SelectItem value="nervous">Nervous</SelectItem>
                      <SelectItem value="angry">Angry</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="ml-auto"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !content}
                >
                  {isSubmitting ? 'Submitting...' : 'Save Entry'}
                </Button>
              </CardFooter>
            </Card>
            
            <VoiceRecorder onRecordingComplete={handleVoiceEntryComplete} />
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            <JournalEntryList 
              entries={entries}
              isLoading={isLoading}
              onEntryClick={handleEntryClick}
              onRefresh={fetchEntries}
            />
          </TabsContent>
          
          <TabsContent value="analysis" className="mt-6">
            {selectedEntry ? (
              <JournalAnalysis 
                entryId={selectedEntry.id}
              />
            ) : (
              <p>No entry selected. Please select an entry to view its analysis.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Journal;


import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Play, RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { JournalEntry } from '@/pages/Journal';

interface JournalEntryListProps {
  entries: JournalEntry[];
  isLoading: boolean;
  onEntryClick: (entry: JournalEntry) => void;
  onRefresh: () => void;
}

const JournalEntryList: React.FC<JournalEntryListProps> = ({ 
  entries, 
  isLoading, 
  onEntryClick,
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredEntries = entries.filter(entry => 
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatEntryDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'PPP');
  };

  const getMoodEmoji = (mood: string | null) => {
    if (!mood) return '😐';
    
    switch (mood.toLowerCase()) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'excited': return '😃';
      case 'nervous': return '😰';
      case 'angry': return '😠';
      case 'neutral': return '😐';
      default: return '😐';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="icon" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <p>Loading your journal entries...</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <Card className="border border-dashed">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No journal entries found.</p>
            {entries.length > 0 && searchTerm ? (
              <p className="text-sm">Try a different search term.</p>
            ) : (
              <p className="text-sm">Write your first entry to get started.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[500px]">
          <div className="space-y-4 pr-4">
            {filteredEntries.map((entry) => (
              <Card 
                key={entry.id} 
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => onEntryClick(entry)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">
                        {formatEntryDate(entry.created_at || '')}
                      </CardTitle>
                      <CardDescription>
                        {entry.entry_type === 'voice' ? 'Voice Entry' : 'Text Entry'}
                      </CardDescription>
                    </div>
                    <div className="text-2xl">
                      {getMoodEmoji(entry.mood)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm line-clamp-3">
                    {entry.content}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 pb-2 justify-between">
                  {entry.entry_type === 'voice' && entry.audio_url && (
                    <Button variant="ghost" size="sm" className="p-0 h-auto" asChild>
                      <a href={entry.audio_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <Play className="h-4 w-4 mr-1" />
                        <span className="text-xs">Play audio</span>
                      </a>
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm" className="ml-auto h-auto p-0">
                    <Sparkles className="h-4 w-4 mr-1" />
                    <span className="text-xs">Get insights</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default JournalEntryList;

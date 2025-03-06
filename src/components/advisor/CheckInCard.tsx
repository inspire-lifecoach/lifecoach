
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MessageCircle, PenLine } from "lucide-react";
import { format } from 'date-fns';
import { CheckIn } from '@/hooks/useCheckIns';

interface CheckInCardProps {
  checkIn: CheckIn;
  onRespond: (checkInId: string, response: string) => void;
  className?: string;
}

const CheckInCard: React.FC<CheckInCardProps> = ({ 
  checkIn, 
  onRespond,
  className = '' 
}) => {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!response.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onRespond(checkIn.id, response);
      setResponse('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContextIcon = () => {
    switch (checkIn.relevance_type) {
      case 'journal':
        return <PenLine className="h-4 w-4 mr-1" />;
      case 'conversation':
        return <MessageCircle className="h-4 w-4 mr-1" />;
      case 'date':
        return <Calendar className="h-4 w-4 mr-1" />;
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <Card className={`${className} border border-border/50 hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-start justify-between">
          <span>{checkIn.question}</span>
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          {getContextIcon()}
          <span>{checkIn.context}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        {!checkIn.responded && (
          <Textarea
            placeholder="Write your response..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="mt-2"
          />
        )}
      </CardContent>
      
      {!checkIn.responded && (
        <CardFooter className="pt-0 justify-end">
          <Button 
            size="sm" 
            onClick={handleSubmit}
            disabled={isSubmitting || !response.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Respond'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CheckInCard;

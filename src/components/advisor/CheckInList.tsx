
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquarePlus, RefreshCw } from "lucide-react";
import CheckInCard from './CheckInCard';
import { CheckIn } from '@/hooks/useCheckIns';

interface CheckInListProps {
  checkIns: CheckIn[];
  isLoading: boolean;
  onRespond: (checkInId: string, response: string) => void;
  onRefresh: () => void;
  onGenerate: () => void;
  className?: string;
}

const CheckInList: React.FC<CheckInListProps> = ({ 
  checkIns, 
  isLoading, 
  onRespond, 
  onRefresh,
  onGenerate,
  className = '' 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Personal Check-ins</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={onGenerate}
          >
            <MessageSquarePlus className="h-4 w-4 mr-1" />
            New Check-in
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Loading your check-ins...</p>
        </div>
      ) : checkIns.length === 0 ? (
        <div className="py-8 text-center border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">No check-ins available.</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onGenerate}
          >
            Generate a new check-in
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {checkIns.map((checkIn) => (
            <CheckInCard
              key={checkIn.id}
              checkIn={checkIn}
              onRespond={onRespond}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckInList;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, HeartHandshake, Sparkles, Brain, MessageCircle, Clock } from "lucide-react";

interface AdvisorInsightProps {
  title: string;
  description: string;
  type: 'reflection' | 'suggestion' | 'challenge' | 'growth';
  source?: 'journal' | 'test-result' | 'interaction' | 'check-in';
  date?: string;
}

const AdvisorInsight: React.FC<AdvisorInsightProps> = ({
  title,
  description,
  type,
  source = 'interaction',
  date
}) => {
  // Define type-specific styles and icons
  const typeConfig = {
    reflection: {
      icon: <BookOpen className="h-5 w-5" />,
      badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      label: "Reflection"
    },
    suggestion: {
      icon: <HeartHandshake className="h-5 w-5" />,
      badgeClass: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      label: "Suggestion"
    },
    challenge: {
      icon: <Brain className="h-5 w-5" />,
      badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      label: "Challenge"
    },
    growth: {
      icon: <Sparkles className="h-5 w-5" />,
      badgeClass: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      label: "Growth Opportunity"
    }
  };

  // Define source badges
  const sourceConfig = {
    'journal': { text: "Based on your journal", icon: <BookOpen className="h-3 w-3 mr-1" /> },
    'test-result': { text: "Based on your personality", icon: <Brain className="h-3 w-3 mr-1" /> },
    'interaction': { text: "Based on our conversation", icon: <MessageCircle className="h-3 w-3 mr-1" /> },
    'check-in': { text: "From your check-in", icon: <Clock className="h-3 w-3 mr-1" /> }
  };

  const { icon, badgeClass, label } = typeConfig[type];
  const sourceInfo = sourceConfig[source];

  return (
    <Card className="border border-border/50 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${badgeClass.split(' ').slice(0, 2).join(' ')}`}>
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="flex items-center">
                {sourceInfo.icon}
                <span>{sourceInfo.text}</span>
                {date && <span className="ml-1 text-xs">• {date}</span>}
              </CardDescription>
            </div>
          </div>
          <Badge className={badgeClass}>{label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default AdvisorInsight;

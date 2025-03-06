
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, HeartHandshake, Sparkles, Brain } from "lucide-react";

interface AdvisorInsightProps {
  title: string;
  description: string;
  type: 'reflection' | 'suggestion' | 'challenge' | 'growth';
  source?: 'journal' | 'test-result' | 'interaction';
}

const AdvisorInsight: React.FC<AdvisorInsightProps> = ({
  title,
  description,
  type,
  source = 'interaction'
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
    'journal': "Based on your journal",
    'test-result': "Based on your personality",
    'interaction': "Based on our conversation"
  };

  const { icon, badgeClass, label } = typeConfig[type];

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
              <CardDescription>{sourceConfig[source]}</CardDescription>
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

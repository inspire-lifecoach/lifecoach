
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TestTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  time?: string;
  questions?: number;
  variant?: "default" | "highlighted";
}

const TestTypeCard = ({
  title,
  description,
  icon,
  route,
  time = "5-10 mins",
  questions = 8,
  variant = "default"
}: TestTypeCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-md",
      variant === "highlighted" && "border-primary/50 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20"
    )}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-muted-foreground">
          <div>Duration: {time}</div>
          <div>{questions} questions</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate(route)} 
          className="w-full"
          variant={variant === "highlighted" ? "default" : "outline"}
        >
          Take Test
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestTypeCard;

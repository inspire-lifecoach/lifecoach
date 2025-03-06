
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabels?: boolean;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
  labelClassName?: string;
}

const ProgressBar = ({
  value,
  max = 100,
  showLabels = false,
  leftLabel,
  rightLabel,
  className,
  labelClassName
}: ProgressBarProps) => {
  const normalizedValue = (value / max) * 100;
  
  return (
    <div className="space-y-2">
      {showLabels && (
        <div className={cn("flex justify-between text-sm", labelClassName)}>
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
      <Progress value={normalizedValue} className={cn("h-2", className)} />
    </div>
  );
};

export default ProgressBar;

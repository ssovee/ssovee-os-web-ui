import React from "react";
import { cn } from "../utils/helpers";

export interface ProgressProps {
  value: number; // 0-100
  max?: number;
  variant?: "default" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = "default",
  size = "md",
  showLabel = false,
  animated = false,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantClasses = {
    default: "bg-brand-color",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
  };

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const labelSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div
            className={cn(
              "w-full bg-surface-3 rounded-[6px] overflow-hidden",
              sizeClasses[size]
            )}
          >
            <div
              className={cn(
                "h-full rounded-[6px] transition-all duration-300",
                variantClasses[variant],
                animated && "animate-pulse"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        {showLabel && (
          <span className={cn("text-neutral-400 font-medium", labelSizeClasses[size])}>
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default Progress;

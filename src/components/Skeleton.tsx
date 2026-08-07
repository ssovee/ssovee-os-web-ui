import React from "react";
import { cn } from "../utils/helpers";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "avatar" | "image" | "card" | "rect";
  lines?: number;
  lineClassName?: string;
  animate?: boolean;
}

const basePulseClasses =
  "bg-surface-1/35 dark:bg-surface-3/20 rounded-md overflow-hidden";

const lineWidths = ["w-full", "w-11/12", "w-4/5", "w-3/5"];

const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  lines = 3,
  lineClassName,
  className,
  animate = true,
  ...props
}) => {
  const pulseClasses = animate ? "animate-pulse" : "";

  if (variant === "avatar") {
    return (
      <div
        className={cn(basePulseClasses, pulseClasses, "rounded-full h-10 w-10", className)}
        aria-hidden="true"
        {...props}
      />
    );
  }

  if (variant === "image") {
    return (
      <div
        className={cn(basePulseClasses, pulseClasses, "h-40 w-full", className)}
        aria-hidden="true"
        {...props}
      />
    );
  }

  if (variant === "rect") {
    return (
      <div
        className={cn(basePulseClasses, pulseClasses, "h-12 w-full", className)}
        aria-hidden="true"
        {...props}
      />
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "w-full rounded-xl border border-surface-1/40 bg-secondary/60 p-4",
          className,
        )}
        aria-hidden="true"
        {...props}
      >
        <div className="flex items-center gap-3">
          <div className={cn(basePulseClasses, pulseClasses, "h-10 w-10 rounded-full")} />
          <div className="flex-1 space-y-2">
            <div className={cn(basePulseClasses, pulseClasses, "h-3 w-1/3 rounded")} />
            <div className={cn(basePulseClasses, pulseClasses, "h-3 w-1/4 rounded")} />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {Array.from({ length: Math.max(lines, 2) }).map((_, index) => (
            <div
              key={`card-line-${index}`}
              className={cn(
                basePulseClasses,
                pulseClasses,
                "h-3 rounded",
                lineWidths[index % lineWidths.length],
                lineClassName,
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("w-full space-y-2", className)}
      aria-hidden="true"
      {...props}
    >
      {Array.from({ length: Math.max(lines, 1) }).map((_, index) => (
        <div
          key={`text-line-${index}`}
          className={cn(
            basePulseClasses,
            pulseClasses,
            "h-3 rounded",
            lineWidths[index % lineWidths.length],
            lineClassName,
          )}
        />
      ))}
    </div>
  );
};

export default Skeleton;

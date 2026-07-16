import React from "react";
import { cn } from "../utils/helpers";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "dotted";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  variant = "solid",
  size = "md",
  className,
}) => {
  const variantClasses = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
  };

  const sizeClasses = {
    sm: orientation === "horizontal" ? "border-t" : "border-l",
    md: orientation === "horizontal" ? "border-t-2" : "border-l-2",
    lg: orientation === "horizontal" ? "border-t-4" : "border-l-4",
  };

  const orientationClasses = {
    horizontal: "w-full",
    vertical: "h-full",
  };

  return (
    <div
      className={cn(
        "border-surface-1",
        variantClasses[variant],
        sizeClasses[size],
        orientationClasses[orientation],
        className
      )}
    />
  );
};

export default Divider;

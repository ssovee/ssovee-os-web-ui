import React from "react";
import { cn } from "../utils/helpers";
import ImageWithPlaceholder from "./ImageWithPlaceholder";

export interface LoadingProps {
  variant?: "spinner" | "dots" | "pulse" | "image";
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  variant = "image",
  size = "md",
  text = "Loading...",
  fullScreen = false,
  className,
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const renderSpinner = () => (
    <div className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", sizeClasses[size])} />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      <div className={cn("animate-bounce rounded-full bg-current", sizeClasses[size])} style={{ animationDelay: "0ms" }} />
      <div className={cn("animate-bounce rounded-full bg-current", sizeClasses[size])} style={{ animationDelay: "150ms" }} />
      <div className={cn("animate-bounce rounded-full bg-current", sizeClasses[size])} style={{ animationDelay: "300ms" }} />
    </div>
  );

  const renderPulse = () => (
    <div className={cn("animate-pulse rounded-full bg-current", sizeClasses[size])} />
  );

  const imageSizes = {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
  };

  const renderImage = () => (
    <ImageWithPlaceholder
      src="/app-assets/Loader.gif"
      alt="Loader"
      width={imageSizes[size]}
      height={imageSizes[size]}
      className={sizeClasses[size]}
    />
  );

  const renderLoader = () => {
    switch (variant) {
      case "spinner":
        return renderSpinner();
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      case "image":
      default:
        return renderImage();
    }
  };

  const content = (
    <div className={cn("flex flex-col justify-center items-center", className)}>
      {renderLoader()}
      {text && (
        <div className={cn("mt-2 text-neutral-500", textSizeClasses[size])}>
          {text}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-primary/50 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;

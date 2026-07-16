import React, { useState, useCallback } from "react";
import { cn } from "../utils/helpers";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
  className?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  fallback,
  className,
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderFallback = () => {
    if (fallback) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-surface-3 text-neutral-400 font-medium">
          {getInitials(fallback)}
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-full h-full bg-surface-3 text-neutral-400">
        <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  };

  // Use a callback to avoid unnecessary re-renders
  const handleImgError = useCallback(() => {
    setImgError(true);
  }, []);

  // Check if src is a non-empty string
  const isSrcAvailable = typeof src === "string" && src.trim() !== "";

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-surface-3",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      {isSrcAvailable && !imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src as string}
          alt={alt}
          className="object-cover"
          sizes={
            size === "sm"
              ? "32px"
              : size === "md"
              ? "40px"
              : size === "lg"
              ? "48px"
              : "64px"
          }
          onError={handleImgError}
        />
      ) : (
        renderFallback()
      )}
    </div>
  );
};

export default Avatar;

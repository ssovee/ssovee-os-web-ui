import React from "react";
import { cn } from "../utils/helpers";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "full";
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      rounded = "md",
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: "bg-surface-3 text-neutral-400",
      primary: "bg-brand-color text-neutral-500 dark:text-white",
      success: "bg-green-500 text-white",
      warning: "bg-yellow-500 text-white",
      danger: "bg-red-500 text-white",
      info: "bg-blue-500 text-white",
    };

    const sizeClasses = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-sm",
      lg: "px-3 py-1.5 text-base",
    };

    const roundedClasses = {
      sm: "rounded-[6px]",
      md: "rounded-[6px]",
      lg: "rounded-[6px]",
      full: "rounded-full",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium",
          variantClasses[variant],
          sizeClasses[size],
          roundedClasses[rounded],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;

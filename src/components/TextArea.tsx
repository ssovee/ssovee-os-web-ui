import React from "react";
import { cn } from "../utils/helpers";
import Typography from "./Typography";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "filled" | "outline";
  size?: "sm" | "md" | "lg";
  error?: string;
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      error,
      label,
      helperText,
      fullWidth = false,
      resize = "vertical",
      ...props
    },
    ref
  ) => {
    const baseClasses = "transition-all duration-200 focus:outline-none placeholder:text-neutral-300 rounded-[6px]";
    
    const variantClasses = {
      default: "bg-primary text-neutral-500 border border-surface-1 placeholder:text-neutral-300 dark:placeholder:text-[#d7e1ef] focus:border-brand-color focus:ring-1 focus:ring-brand-color/50",
      filled: "bg-surface-4 text-neutral-500 border border-surface-4 focus:border-brand-color focus:ring-1 focus:ring-brand-color/50",
      outline: "bg-transparent text-neutral-500 border border-surface-1 placeholder:text-neutral-300 dark:placeholder:text-[#d7e1ef] focus:border-brand-color focus:ring-1 focus:ring-brand-color/50",
    };

    const sizeClasses = {
      sm: "px-2 py-1 text-sm",
      md: "px-3 py-2 text-base",
      lg: "px-4 py-3 text-lg",
    };

    const resizeClasses = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    const widthClasses = fullWidth ? "w-full" : "";

    return (
      <div className={cn("flex flex-col", fullWidth && "w-full")}>
        {label && (
          <label className="text-sm font-medium text-neutral-500 mb-1">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            resizeClasses[resize],
            widthClasses,
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
            className
          )}
          {...props}
        />
        
        {(error || helperText) && (
          <div className="mt-1">
            {error && (
              <Typography variant="p" className="text-xs text-red-500">{error}</Typography>
            )}
            {helperText && !error && (
              <Typography variant="p" className="text-xs text-neutral-400">{helperText}</Typography>
            )}
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;

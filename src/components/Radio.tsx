import React from "react";
import { cn } from "../utils/helpers";
import Typography from "./Typography";

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled";
  error?: string;
  helperText?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      label,
      size = "md",
      variant = "default",
      error,
      helperText,
      ...props
    },
    ref
  ) => {
    const baseClasses = "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer rounded-[6px]";
    
    const variantClasses = {
      default: "bg-primary border border-surface-1 focus:border-brand-color focus:ring-brand-color/50 checked:bg-brand-color checked:border-brand-color",
      filled: "bg-surface-4 border border-surface-4 focus:border-brand-color focus:ring-brand-color/50 checked:bg-brand-color checked:border-brand-color",
    };

    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return (
      <div className="flex flex-col">
        <div className="flex items-start gap-2">
          <div className="relative">
            <input
              ref={ref}
              type="radio"
              className={cn(
                baseClasses,
                variantClasses[variant],
                sizeClasses[size],
                "appearance-none",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
                className
              )}
              {...props}
            />
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-1/2 h-1/2 bg-white rounded-full opacity-0 checked:opacity-100" />
            </div>
          </div>
          
          {label && (
            <label className="text-sm text-neutral-400 cursor-pointer select-none">
              {label}
            </label>
          )}
        </div>
        
        {(error || helperText) && (
          <div className="mt-1 ml-6">
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

Radio.displayName = "Radio";

export default Radio;

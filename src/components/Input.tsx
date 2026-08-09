import React from "react";
import { cn } from "../utils/helpers";
import { ArrowCircleRightIcon } from "@phosphor-icons/react";
import Typography from "./Typography";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: "default" | "filled" | "outline";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showSubmitButton?: boolean;
  onSubmit?: () => void;
  error?: string;
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      leftIcon,
      rightIcon,
      showSubmitButton = false,
      onSubmit,
      error,
      label,
      helperText,
      fullWidth = false,
      onKeyUp,
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
      sm: "h-8 px-2 text-sm",
      md: "h-10 px-3 text-base",
      lg: "h-12 px-4 text-lg",
    };

    const widthClasses = fullWidth ? "w-full" : "";

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSubmit) {
        onSubmit();
      }
      onKeyUp?.(e);
    };

    return (
      <div className={cn("flex flex-col", fullWidth && "w-full")}>
        {label && (
          <label className="text-sm font-medium text-neutral-500 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-[#d7e1ef]">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              baseClasses,
              variantClasses[variant],
              sizeClasses[size],
              widthClasses,
              leftIcon ? "pl-10" : "",
              (rightIcon || showSubmitButton) ? "pr-10" : "",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
              className
            )}
            onKeyUp={handleKeyUp}
            {...props}
          />
          
          {rightIcon && !showSubmitButton && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-[#d7e1ef]">
              {rightIcon}
            </div>
          )}
          
          {showSubmitButton && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={props.disabled || props.readOnly || !onSubmit}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 transition-colors hover:text-neutral-400 dark:text-[#d7e1ef] dark:hover:text-[#d7e1ef] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Submit input"
            >
              <ArrowCircleRightIcon size={20} />
            </button>
          )}
        </div>
        
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

Input.displayName = "Input";

export default Input;

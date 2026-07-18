import React from "react";
import { cn } from "../utils/helpers";
import { CheckIcon } from "@phosphor-icons/react";
import Typography from "./Typography";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  variant?: "default" | "filled";
  size?: "sm" | "md" | "lg";
  error?: string;
  label?: React.ReactNode;
  helperText?: string;
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      error,
      label,
      helperText,
      indeterminate = false,
      checked,
      onChange,
      disabled,
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
              type="checkbox"
              className={cn(
                baseClasses,
                variantClasses[variant],
                sizeClasses[size],
                "appearance-none",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
                className
              )}
              defaultChecked={checked}
              onChange={onChange}
              disabled={disabled}
              {...props}
            />
            
            {(checked || indeterminate) && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CheckIcon
                  size={size === "sm" ? 12 : size === "md" ? 16 : 20}
                  className="text-white"
                  weight={indeterminate ? "bold" : "regular"}
                />
              </div>
            )}
          </div>
          
          {label && (
            <label
              className={cn(
                "text-sm text-neutral-400 select-none",
                disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              )}
            >
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

Checkbox.displayName = "Checkbox";

export default Checkbox;

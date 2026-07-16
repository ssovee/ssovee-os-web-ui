import React from "react";
import { cn } from "../utils/helpers";
import Typography from "./Typography";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  variant?: "default" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      checked,
      onChange,
      variant = "default",
      size = "md",
      disabled = false,
      label,
      helperText,
      fullWidth = false,
    },
    ref
  ) => {
    const baseClasses = "flex items-center rounded-full cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variantClasses = {
      default: "focus:ring-brand-color/50",
      success: "focus:ring-green-500/50",
      warning: "focus:ring-yellow-500/50",
      danger: "focus:ring-red-500/50",
    };

    const toggleClasses = {
      default: checked ? "bg-brand-color" : "bg-gray-500",
      success: checked ? "bg-green-500" : "bg-gray-500",
      warning: checked ? "bg-yellow-500" : "bg-gray-500",
      danger: checked ? "bg-red-500" : "bg-gray-500",
    };

    const sizeClasses = {
      sm: "w-8 h-4 px-0.5",
      md: "w-10 h-5 px-0.5",
      lg: "w-12 h-6 px-1",
    };

    const thumbSizeClasses = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    const thumbTransformClasses = {
      sm: checked ? "translate-x-4" : "translate-x-0",
      md: checked ? "translate-x-5" : "translate-x-0",
      lg: checked ? "translate-x-6" : "translate-x-0",
    };

    const widthClasses = fullWidth ? "w-full" : "";

    const handleClick = () => {
      if (!disabled) {
        onChange(!checked);
      }
    };

    return (
      <div className={cn("flex flex-col", fullWidth && "w-full")}>
        <div className={cn("flex items-center gap-2", fullWidth && "w-full")}>
          <button
            ref={ref}
            type="button"
            className={cn(
              baseClasses,
              variantClasses[variant],
              toggleClasses[variant],
              sizeClasses[size],
              widthClasses,
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleClick}
            disabled={disabled}
            role="switch"
            aria-checked={checked}
          >
            <div
              className={cn(
                "bg-white rounded-full shadow-md transform transition-transform duration-300",
                thumbSizeClasses[size],
                thumbTransformClasses[size]
              )}
            />
          </button>
          
          {label && (
            <span className="text-sm text-neutral-500 cursor-pointer select-none" onClick={handleClick}>
              {label}
            </span>
          )}
        </div>
        
        {helperText && (
          <div className="mt-1 ml-12">
            <Typography variant="p" className="text-xs text-neutral-400">{helperText}</Typography>
          </div>
        )}
      </div>
    );
  }
);

Toggle.displayName = "Toggle";

export default Toggle;

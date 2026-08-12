import React from "react";
import { cn } from "../utils/helpers";
import { CaretDownIcon } from "@phosphor-icons/react";
import Typography from "./Typography";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size'> {
  options: SelectOption[];
  variant?: "default" | "filled" | "outline";
  size?: "sm" | "md" | "lg";
  error?: string;
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options,
      variant = "default",
      size = "md",
      error,
      label,
      helperText,
      fullWidth = false,
      onChange,
      placeholder,
      value,
      ...props
    },
    ref
  ) => {
    const baseClasses = "transition-all duration-200 focus:outline-none appearance-none cursor-pointer rounded-[6px]";
    
    const variantClasses = {
      default: "bg-primary border border-surface-1 focus:border-brand-color focus:ring-1 focus:ring-brand-color/50",
      filled: "bg-surface-4 border border-surface-4 focus:border-brand-color focus:ring-1 focus:ring-brand-color/50",
      outline: "bg-transparent border border-surface-1 focus:border-brand-color focus:ring-1 focus:ring-brand-color/50",
    };

    const sizeClasses = {
      sm: "h-8 px-2 text-sm",
      md: "h-10 px-3 text-base",
      lg: "h-12 px-4 text-lg",
    };

    const widthClasses = fullWidth ? "w-full" : "";

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className={cn("flex flex-col", fullWidth && "w-full")}>
        {label && (
          <label className="text-sm font-medium text-neutral-500 dark:text-white mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              baseClasses,
              variantClasses[variant],
              sizeClasses[size],
              widthClasses,
              "pr-10 text-black placeholder:text-black dark:text-white dark:placeholder:text-white",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
              className
            )}
            value={value}
            onChange={handleChange}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          <CaretDownIcon
            size={16}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none"
          />
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

Select.displayName = "Select";

export default Select;

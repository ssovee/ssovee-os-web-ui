import React from "react";
import { cn } from "../utils/helpers";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success"
    | "filled"
    | "text";
  tone?: "primary" | "neutral" | "success" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: "sm" | "md" | "lg" | "full";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      tone = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      rounded = "lg",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantClasses = {
      primary: "bg-brand-color text-white hover:bg-brand-color/90 active:bg-brand-color/80 focus-visible:ring-brand-color/50 shadow-sm hover:shadow-md active:shadow-none disabled:bg-brand-color/50 disabled:text-white/80",
      secondary: "bg-surface-3 text-neutral-500 hover:bg-surface-4 active:bg-surface-4 focus-visible:ring-surface-3/50 border border-surface-4 shadow-sm hover:shadow-md active:shadow-none disabled:bg-surface-3/50",
      outline: "bg-transparent text-neutral-400 border border-surface-1 hover:bg-surface-1 active:bg-surface-1 focus-visible:ring-surface-1/50",
      ghost: "bg-transparent text-neutral-400 hover:bg-surface-1 active:bg-surface-1 focus-visible:ring-surface-1/50",
      danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-600 focus-visible:ring-red-500/50 shadow-sm hover:shadow-md active:shadow-none disabled:bg-red-500/50",
      success: "bg-green-500 text-white hover:bg-green-600 active:bg-green-600 focus-visible:ring-green-500/50 shadow-sm hover:shadow-md active:shadow-none disabled:bg-green-500/50",
      filled: "",
      text: "",
    } as Record<Required<ButtonProps>["variant"], string>;

    const filledToneClasses = {
      primary: "bg-brand-color text-white hover:bg-brand-color/90 active:bg-brand-color/80 focus-visible:ring-brand-color/50 shadow-sm hover:shadow-md active:shadow-none disabled:bg-brand-color/50 disabled:text-white/80",
      neutral: "bg-surface-3 text-neutral-700 hover:text-neutral-700 active:text-neutral-700 hover:bg-surface-4 active:bg-surface-4 border border-surface-1 focus-visible:ring-surface-3/50 shadow-sm hover:shadow-md active:shadow-none disabled:bg-surface-3/50",
      success: "bg-green-500 text-white hover:bg-green-600 active:bg-green-600 focus-visible:ring-green-500/50 shadow-sm hover:shadow-md active:shadow-none disabled:bg-green-500/50",
      danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-600 focus-visible:ring-red-500/50 shadow-sm hover:shadow-md active:shadow-none disabled:bg-red-500/50",
    } as const;

    const textToneClasses = {
      primary: "bg-transparent text-brand-color hover:text-brand-color/90 active:text-brand-color/80 hover:underline underline-offset-2 focus-visible:ring-brand-color/30",
      neutral: "bg-transparent text-neutral-400 hover:text-neutral-300 active:text-neutral-300 focus-visible:ring-surface-1/50",
      success: "bg-transparent text-green-600 hover:text-green-700 active:text-green-700 focus-visible:ring-green-500/30",
      danger: "bg-transparent text-red-600 hover:text-red-700 active:text-red-700 focus-visible:ring-red-500/30",
    } as const;

    const sizeClasses = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-5 text-lg",
      xl: "h-14 px-6 text-xl",
    };

    const roundedClasses = {
      sm: "rounded-[6px]",
      md: "rounded-[6px]",
      lg: "rounded-[6px]",
      full: "rounded-full",
    };

    const widthClasses = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variant === "filled"
            ? filledToneClasses[tone]
            : variant === "text"
            ? textToneClasses[tone]
            : variantClasses[variant],
          sizeClasses[size],
          roundedClasses[rounded],
          widthClasses,
          className
        )}
        data-variant={variant}
        data-tone={tone}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

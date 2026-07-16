import React from "react";
import { cn } from "../utils/helpers";

type Variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
type Weight = "thin" | "extralight" | "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold" | "black";
type Color = "neutral-100" | "neutral-200" | "neutral-300" | "neutral-400" | "neutral-500" | "neutral-600" | "neutral-700" | "neutral-800" | "neutral-900" | "brand-color" | "red-500" | "green-500" | "blue-500" | "yellow-500";

export interface TypographyProps {
  as?: Variant;
  variant?: Variant;
  size?: Size;
  weight?: Weight;
  color?: Color;
  className?: string;
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  as,
  variant = "p",
  size,
  weight,
  color,
  className,
  children,
}) => {
  const Component = as || variant;

  const sizeClasses: Record<Size, string> = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
  };

  const weightClasses: Record<Weight, string> = {
    thin: "font-thin",
    extralight: "font-extralight",
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
    black: "font-black",
  };

  const colorClasses: Record<Color, string> = {
    "neutral-100": "text-neutral-100",
    "neutral-200": "text-neutral-200",
    "neutral-300": "text-neutral-300",
    "neutral-400": "text-neutral-400",
    "neutral-500": "text-neutral-500",
    "neutral-600": "text-neutral-600",
    "neutral-700": "text-neutral-700",
    "neutral-800": "text-neutral-800",
    "neutral-900": "text-neutral-900",
    "brand-color": "text-brand-color",
    "red-500": "text-red-500",
    "green-500": "text-green-500",
    "blue-500": "text-blue-500",
    "yellow-500": "text-yellow-500",
  };

  const classes = cn(
    size && sizeClasses[size],
    weight && weightClasses[weight],
    color && colorClasses[color],
    className
  );

  return <Component className={classes}>{children}</Component>;
};

export default Typography;

import React from "react";
import { cn } from "../utils/helpers";
import { CheckCircleIcon, InfoIcon, WarningIcon, XIcon } from "@phosphor-icons/react";
import Typography from "./Typography";

export interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  variant?: "default" | "filled" | "outline";
  className?: string;
  children?: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
  showCloseButton = false,
  variant = "default",
  className,
  children,
}) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircleIcon size={20} className="text-green-500" />;
      case "error":
        return <WarningIcon size={20} className="text-red-500" />;
      case "warning":
        return <WarningIcon size={20} className="text-yellow-500" />;
      case "info":
        return <InfoIcon size={20} className="text-blue-500" />;
      default:
        return <InfoIcon size={20} className="text-blue-500" />;
    }
  };

  const getTypeClasses = () => {
    switch (type) {
      case "success":
        return {
          default: "bg-green-50 border-green-200 text-green-800",
          filled: "bg-green-500 text-white",
          outline: "bg-transparent border-green-500 text-green-700",
        };
      case "error":
        return {
          default: "bg-red-50 border-red-200 text-red-800",
          filled: "bg-red-500 text-white",
          outline: "bg-transparent border-red-500 text-red-700",
        };
      case "warning":
        return {
          default: "bg-yellow-50 border-yellow-200 text-yellow-800",
          filled: "bg-yellow-500 text-white",
          outline: "bg-transparent border-yellow-500 text-yellow-700",
        };
      case "info":
        return {
          default: "bg-blue-50 border-blue-200 text-blue-800",
          filled: "bg-blue-500 text-white",
          outline: "bg-transparent border-blue-500 text-blue-700",
        };
      default:
        return {
          default: "bg-blue-50 border-blue-200 text-blue-800",
          filled: "bg-blue-500 text-white",
          outline: "bg-transparent border-blue-500 text-blue-700",
        };
    }
  };

  const typeClasses = getTypeClasses()[variant];

  return (
    <div
      className={cn(
        "rounded-[6px] border p-4",
        typeClasses,
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <Typography variant="h4" className="text-sm font-medium mb-1">
              {title}
            </Typography>
          )}
          {message && (
            <Typography variant="p" className="text-sm leading-relaxed">
              {message}
            </Typography>
          )}
          {children}
        </div>

        {/* Close Button */}
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-2 text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            <XIcon size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;

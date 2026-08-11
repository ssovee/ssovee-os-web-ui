import React, { useEffect, useState } from "react";
import { cn } from "../utils/helpers";
import { CheckCircleIcon, InfoIcon, WarningIcon, XIcon } from "@phosphor-icons/react";
import Typography from "./Typography";

export interface ToastProps {
  heading?: string;
  message: string;
  type: "error" | "success" | "info" | "warning";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
  showCloseButton?: boolean;
  className?: string;
}

const Toast: React.FC<ToastProps> = ({
  heading,
  message,
  type,
  isVisible,
  onClose,
  duration = 5000,
  position = "bottom-left",
  showCloseButton = true,
  className,
}) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      let timer: ReturnType<typeof setTimeout> | null = null;
      if (type !== "error" && duration > 0) {
        timer = setTimeout(() => {
          setIsShowing(false);
          setTimeout(onClose, 300);
        }, duration);
      }

      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, [isVisible, type, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "error":
        return <WarningIcon size={20} className="text-red-500" />;
      case "success":
        return <CheckCircleIcon size={20} className="text-green-500" />;
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
      case "error":
        return "border-l-red-500 bg-red-50";
      case "success":
        return "border-l-green-500 bg-green-50";
      case "warning":
        return "border-l-yellow-500 bg-yellow-50 dark:text-[#121316]";
      case "info":
        return "border-l-blue-500 bg-blue-50";
      default:
        return "border-l-blue-500 bg-blue-50";
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "top-center":
        return "top-4 left-1/2 transform -translate-x-1/2";
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      default:
        return "bottom-4 left-4";
    }
  };

  const handleClose = () => {
    setIsShowing(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={cn(
        "fixed z-50 transform transition-all duration-300",
        getPositionClasses(),
        isShowing ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      )}
    >
      <div
        className={cn(
          "w-80 max-w-sm bg-secondary rounded-[6px] shadow-lg border-l-4 p-4",
          getTypeClasses(),
          className
        )}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {heading && (
              <Typography
                variant="h4"
                className={cn(
                  "text-sm font-medium mb-1",
                  type === "warning"
                    ? "text-neutral-700 dark:text-[#121316]"
                    : "text-neutral-700"
                )}
              >
                {heading}
              </Typography>
            )}
            <Typography
              variant="p"
              className={cn(
                "text-sm leading-relaxed",
                type === "warning"
                  ? "text-neutral-600 dark:text-[#121316]"
                  : "text-neutral-600"
              )}
            >
              {message}
            </Typography>
          </div>

          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 ml-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toast;

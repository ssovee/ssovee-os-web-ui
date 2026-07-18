import React, { useState, useRef, useEffect } from "react";
import { cn } from "../utils/helpers";
import { CaretDownIcon } from "@phosphor-icons/react";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  variant?: "default" | "filled" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  trigger?: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  variant = "default",
  size = "md",
  disabled = false,
  className,
  trigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option: DropdownOption) => {
    if (!option.disabled) {
      onChange?.(option.value);
      setIsOpen(false);
    }
  };

  const baseClasses = "transition-all duration-200 focus:outline-none cursor-pointer rounded-[6px]";
  
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

  return (
    <div ref={dropdownRef} className="">
      {trigger ? (
        <div
          onClick={handleToggle}
          className={cn(disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer")}
          aria-disabled={disabled}
        >
          {trigger}
        </div>
      ) : (
        <button
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            "w-full flex items-center justify-between pr-8",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <span className={selectedOption ? "text-neutral-500" : "text-neutral-300"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <CaretDownIcon
            size={16}
            className={cn(
              "text-neutral-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-secondary border border-surface-1 rounded-[6px] shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className={cn(
                "px-3 py-2 cursor-pointer transition-colors duration-200 flex items-center gap-2",
                option.value === value && "bg-brand-color text-neutral-500",
                !option.disabled && "hover:bg-surface-3",
                option.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {option.icon && <span>{option.icon}</span>}
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

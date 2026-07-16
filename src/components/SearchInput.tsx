import React, { useImperativeHandle, useRef, useCallback, useEffect } from "react";
import { cn } from "../utils/helpers";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import useShortcutFormatter from "../hooks/useShortcutFormatter";

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  onSearch?: (value: string) => void;
  placeholder?: string;
  variant?: "default" | "filled" | "outline";
  size?: "sm" | "md" | "lg";
  showClearButton?: boolean;
  className?: string;
  enableKeyboardShortcuts?: boolean;
  isActive?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      onSearch,
      placeholder = "Search...",
      variant = "default",
      size = "md",
      showClearButton = true,
      className,
      value,
      onChange,
      enableKeyboardShortcuts = false,
      isActive = true,
      ...props
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = React.useState(value || "");
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    const { addShortcutListener, removeShortcutListener, formatKeys, getShortcutByCommand } = useShortcutFormatter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchValue(newValue);
      onChange?.(e);
      onSearch?.(newValue);
    };

    const handleClear = useCallback(() => {
      setSearchValue("");
      onSearch?.("");
      // Create a synthetic event for onChange
      const syntheticEvent = {
        target: { value: "" }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    }, [onChange, onSearch]);

    useEffect(() => {
      if (!enableKeyboardShortcuts || !isActive) return;

      const handleFocusSearch = (e?: KeyboardEvent) => {
        e?.preventDefault();
        inputRef.current?.focus();
      };

      const handleClearShortcut = (e?: KeyboardEvent) => {
        e?.preventDefault();
        handleClear();
        inputRef.current?.blur();
      };

      addShortcutListener("focus_search", handleFocusSearch);
      addShortcutListener("escape_button_action", handleClearShortcut);

      return () => {
        removeShortcutListener("focus_search", handleFocusSearch);
        removeShortcutListener("escape_button_action", handleClearShortcut);
      };
    }, [enableKeyboardShortcuts, isActive, handleClear, addShortcutListener, removeShortcutListener]);

    const displayPlaceholder = enableKeyboardShortcuts
      ? `${placeholder} (${formatKeys(getShortcutByCommand("focus_search"))})`
      : placeholder;

    const baseClasses = "transition-all duration-200 focus:outline-none placeholder:text-neutral-300 rounded-[6px]";

    const variantClasses = {
      default: "bg-primary border border-surface-1 focus:border-brand-color focus:ring-1 focus:ring-brand-color/50",
      filled: "bg-surface-4 border border-surface-4 focus:border-brand-color focus:ring-1 focus:ring-brand-color/50",
      outline: "bg-transparent border border-surface-1 focus:border-brand-color focus:ring-1 focus:ring-brand-color/50",
    };

    const sizeClasses = {
      sm: "h-8 px-2 pl-8 text-sm",
      md: "h-10 px-3 pl-10 text-base",
      lg: "h-12 px-4 pl-12 text-lg",
    };

    const iconSizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return (
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
          <MagnifyingGlassIcon className={iconSizeClasses[size]} />
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder={displayPlaceholder}
          value={searchValue}
          onChange={handleChange}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            showClearButton && searchValue ? "pr-10" : "",
            className
          )}
          {...props}
        />

        {/* Clear Button */}
        {showClearButton && searchValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;

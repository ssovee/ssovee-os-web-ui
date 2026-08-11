import React, { useImperativeHandle, useRef, useCallback, useEffect } from "react";
import { cn } from "../utils/helpers";
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
      style,
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

    useEffect(() => {
      setSearchValue(value ?? "");
    }, [value]);

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

    const baseClasses = "transition-all duration-200 focus:outline-none rounded-[6px]";

    const variantClasses = {
      default: "bg-primary input-text-default border border-surface-1 focus:border-brand-color focus:ring-1 focus:ring-brand-color/50 placeholder-light placeholder-default",
      filled: "bg-surface-4 input-text-filled border border-surface-4 focus:border-brand-color focus:ring-1 focus:ring-brand-color/50 placeholder-light placeholder-filled",
      outline: "bg-transparent input-text-outline border border-surface-1 focus:border-brand-color focus:ring-1 focus:ring-brand-color/50 placeholder-light placeholder-outline",
    };

    const sizeClasses = {
      sm: "h-8 text-sm leading-tight",
      md: "h-10 text-base leading-tight",
      lg: "h-12 text-lg leading-tight",
    };

    const iconSizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const iconPixelSizes = {
      sm: 16,
      md: 18,
      lg: 20,
    };

    const iconPositionClasses = {
      sm: "left-2.5",
      md: "left-3",
      lg: "left-3.5",
    };

    const inputPaddings = {
      sm: { left: "2.25rem", right: "0.5rem" },
      md: { left: "2.75rem", right: "0.75rem" },
      lg: { left: "3rem", right: "1rem" },
    };

    return (
      <div className="relative w-full min-w-0">
        {/* Search Icon */}
        <div
          className={cn(
            "pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 text-neutral-400",
            iconPositionClasses[size]
          )}
        >
          <svg
            className={cn("block shrink-0", iconSizeClasses[size])}
            width={iconPixelSizes[size]}
            height={iconPixelSizes[size]}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20L16.65 16.65" />
          </svg>
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
            "w-full min-w-0",
            sizeClasses[size],
            className,
          )}
          style={{
            paddingLeft: inputPaddings[size].left,
            paddingRight: showClearButton && searchValue ? "2.5rem" : inputPaddings[size].right,
            ...style,
          }}
          {...props}
        />

        {/* Clear Button */}
        {showClearButton && searchValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Clear search"
            type="button"
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

import React from "react";
import { cn } from "../utils/helpers";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline";
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  size = "md",
  variant = "default",
  className,
}) => {
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - halfVisible);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push("...");
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      onPageChange(page);
    }
  };

  const sizeClasses = {
    sm: "h-8 px-2 text-sm",
    md: "h-10 px-3 text-base",
    lg: "h-12 px-4 text-lg",
  };

  const variantClasses = {
    default: "bg-primary border border-surface-1 hover:bg-surface-3",
    outline: "bg-transparent border border-surface-1 hover:bg-surface-3",
  };

  const activeClasses = {
    default: "bg-brand-color text-neutral-500 border-brand-color",
    outline: "bg-brand-color text-neutral-500 border-brand-color",
  };

  const renderPageButton = (page: number | string, index: number) => {
    if (page === "...") {
      return (
        <span
          key={`ellipsis-${index}`}
          className={cn(
            "flex items-center justify-center",
            sizeClasses[size],
            "text-neutral-400"
          )}
        >
          ...
        </span>
      );
    }

    const isActive = page === currentPage;

    return (
      <button
        key={page}
        onClick={() => handlePageClick(page)}
        className={cn(
          "flex items-center justify-center font-medium transition-all duration-200 rounded-[6px]",
          sizeClasses[size],
          variantClasses[variant],
          isActive ? activeClasses[variant] : "text-neutral-400",
          !isActive && "hover:text-neutral-500"
        )}
      >
        {page}
      </button>
    );
  };

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {/* First Page */}
      {showFirstLast && currentPage > 1 && (
        <button
          onClick={() => onPageChange(1)}
          className={cn(
            "flex items-center justify-center font-medium transition-all duration-200 rounded-[6px]",
            sizeClasses[size],
            variantClasses[variant],
            "text-neutral-400 hover:text-neutral-500"
          )}
        >
          First
        </button>
      )}

      {/* Previous Page */}
      {showPrevNext && currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className={cn(
            "flex items-center justify-center font-medium transition-all duration-200 rounded-[6px]",
            sizeClasses[size],
            variantClasses[variant],
            "text-neutral-400 hover:text-neutral-500"
          )}
        >
          <CaretLeftIcon size={16} />
        </button>
      )}

      {/* Page Numbers */}
      {getVisiblePages().map((page, index) => renderPageButton(page, index))}

      {/* Next Page */}
      {showPrevNext && currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className={cn(
            "flex items-center justify-center font-medium transition-all duration-200 rounded-[6px]",
            sizeClasses[size],
            variantClasses[variant],
            "text-neutral-400 hover:text-neutral-500"
          )}
        >
          <CaretRightIcon size={16} />
        </button>
      )}

      {/* Last Page */}
      {showFirstLast && currentPage < totalPages && (
        <button
          onClick={() => onPageChange(totalPages)}
          className={cn(
            "flex items-center justify-center font-medium transition-all duration-200 rounded-[6px]",
            sizeClasses[size],
            variantClasses[variant],
            "text-neutral-400 hover:text-neutral-500"
          )}
        >
          Last
        </button>
      )}
    </div>
  );
};

export default Pagination;

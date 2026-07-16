import React, { useRef } from "react";
import { cn } from "../utils/helpers";
import { UploadIcon } from "@phosphor-icons/react";
import Typography from "./Typography";

export interface FileUploadProps {
  onFileSelect?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  variant?: "default" | "filled" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  dragAndDrop?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept,
  multiple = false,
  maxSize,
  variant = "default",
  size = "md",
  disabled = false,
  className,
  children,
  dragAndDrop = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    
    // Validate file size
    if (maxSize) {
      const validFiles = fileArray.filter(file => file.size <= maxSize);
      if (validFiles.length !== fileArray.length) {
        console.warn("Some files were too large and were skipped");
      }
      onFileSelect?.(validFiles);
    } else {
      onFileSelect?.(fileArray);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragAndDrop && !disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (dragAndDrop && !disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

      const baseClasses = "transition-all duration-200 focus:outline-none cursor-pointer rounded-[6px]";
  
  const variantClasses = {
    default: "bg-primary border border-surface-1 focus:border-brand-color focus:ring-1 focus:ring-brand-color/50",
    filled: "bg-surface-4 border border-surface-4 focus:border-brand-color focus:ring-1 focus:ring-brand-color/50",
    outline: "bg-transparent border border-surface-1 focus:border-brand-color focus:ring-1 focus:ring-brand-color/50",
  };

  const sizeClasses = {
    sm: "h-20 px-3 text-sm",
    md: "h-24 px-4 text-base",
    lg: "h-32 px-6 text-lg",
  };

  const defaultContent = (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <UploadIcon size={24} className="text-neutral-400 mb-2" />
      <Typography variant="p" className="text-sm text-neutral-400">
        {dragAndDrop ? "Drag and drop files here" : "Click to upload files"}
      </Typography>
      {accept && (
        <Typography variant="p" className="text-xs text-neutral-300 mt-1">
          Accepted: {accept}
        </Typography>
      )}
    </div>
  );

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        "w-full rounded-[6px] border-2 border-dashed flex items-center justify-center",
        isDragOver && "border-brand-color bg-brand-color/10",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
      {children || defaultContent}
    </div>
  );
};

export default FileUpload;

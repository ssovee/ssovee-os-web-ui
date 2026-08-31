import React, { useEffect, useId, useRef } from "react";
import "tinymce/tinymce";
import "tinymce/icons/default/icons";
import "tinymce/themes/silver";
import "tinymce/models/dom/model";
import "tinymce/skins/ui/oxide/skin.css";
import "tinymce/skins/ui/oxide/content.css";
import "tinymce/skins/content/default/content.css";
import { cn } from "../utils/helpers";
import Typography from "./Typography";

export interface RichEditorProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  height?: string;
  menubar?: boolean | string;
  toolbar?: string;
  className?: string;
  plugins?: string[];
}

const DEFAULT_PLUGINS = [
  "advlist",
  "autolink",
  "lists",
  "link",
  "image",
  "charmap",
  "preview",
  "anchor",
  "searchreplace",
  "visualblocks",
  "code",
  "fullscreen",
  "insertdatetime",
  "media",
  "table",
  "wordcount",
];

const DEFAULT_TOOLBAR =
  "undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist outdent indent | link image media | code fullscreen";

const RichEditor = React.forwardRef<HTMLDivElement, RichEditorProps>(
  (
    {
      value = "",
      onChange,
      label,
      helperText,
      error,
      fullWidth = false,
      height = "220px",
      menubar = false,
      toolbar = DEFAULT_TOOLBAR,
      className,
      plugins = DEFAULT_PLUGINS,
      disabled = false,
      placeholder,
      rows,
      ...props
    },
    ref
  ) => {
    const editorId = useId().replace(/:/g, "");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const hasTinymce = typeof window !== "undefined" && Boolean((window as any).tinymce);

    useEffect(() => {
      if (typeof window === "undefined" || !textareaRef.current || !(window as any).tinymce) {
        return;
      }

      const tinymceApi = (window as any).tinymce;
      const existingEditor = tinymceApi.get(editorId);

      if (existingEditor) {
        existingEditor.remove();
      }

      tinymceApi.init({
        target: textareaRef.current,
        selector: undefined,
        skin: "oxide",
        content_css: "default",
        height,
        menubar,
        toolbar,
        plugins,
        statusbar: false,
        resize: false,
        branding: false,
        promotion: false,
        placeholder,
        readonly: disabled,
        content_style: "body { font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif; font-size: 14px; line-height: 1.6; }",
        setup: (editor: any) => {
          editor.on("init", () => {
            editor.setContent(value ?? "");
          });

          editor.on("input change keyup", () => {
            onChange?.(editor.getContent());
          });
        },
      });

      return () => {
        const activeEditor = tinymceApi.get(editorId);
        activeEditor?.remove();
      };
    }, [disabled, editorId, height, menubar, onChange, placeholder, plugins, toolbar, value]);

    useEffect(() => {
      const tinymceApi = (window as any)?.tinymce;
      const activeEditor = tinymceApi?.get(editorId);

      if (activeEditor && activeEditor.getContent() !== (value ?? "")) {
        activeEditor.setContent(value ?? "");
      }
    }, [editorId, value]);

    const fallbackTextArea = (
      <textarea
        ref={textareaRef}
        id={editorId}
        value={value}
        onChange={(event) => onChange?.(event.currentTarget.value)}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows ?? 7}
        aria-label={label ?? props["aria-label"] ?? "Rich text editor"}
        className={cn(
          "w-full min-h-[200px] rounded-[6px] border border-surface-1 bg-primary px-3 py-2 text-base text-neutral-700 transition-all duration-200 focus:border-brand-color focus:outline-none focus:ring-1 focus:ring-brand-color/50 placeholder:text-neutral-400",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
          disabled && "cursor-not-allowed opacity-60",
          fullWidth && "w-full"
        )}
        {...props}
      />
    );

    return (
      <div ref={ref} className={cn("flex flex-col gap-1", fullWidth && "w-full", className)}>
        {label && (
          <label className="text-sm font-medium text-neutral-500 dark:text-white" htmlFor={editorId}>
            {label}
          </label>
        )}

        <div
          className={cn(
            "overflow-hidden rounded-[6px] border border-surface-1 bg-white transition-all duration-200",
            fullWidth && "w-full",
            error && "border-red-500"
          )}
          style={{ minHeight: height }}
        >
          {hasTinymce ? (
            <textarea
              ref={textareaRef}
              id={editorId}
              defaultValue={value}
              aria-label={label ?? props["aria-label"] ?? "Rich text editor"}
              disabled={disabled}
              style={{ display: "none" }}
              {...props}
            />
          ) : (
            fallbackTextArea
          )}
        </div>

        {(error || helperText) && (
          <div className="mt-1">
            {error && (
              <Typography variant="p" className="text-xs text-red-500">
                {error}
              </Typography>
            )}
            {helperText && !error && (
              <Typography variant="p" className="text-xs text-neutral-400">
                {helperText}
              </Typography>
            )}
          </div>
        )}
      </div>
    );
  }
);

RichEditor.displayName = "RichEditor";

export default RichEditor;

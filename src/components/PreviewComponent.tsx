import React from "react";
import { cn } from "../utils/helpers";

export interface PreviewComponentProps {
  fileName: string;
  base64: string;
  className?: string;
}

type PreviewType = "image" | "pdf" | "text" | "json" | "unsupported";

const imageExtensions = /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i;
const textExtensions = /\.(css|csv|html?|js|jsx|md|mjs|ts|tsx|txt|xml|yaml|yml)$/i;

const getPreviewType = (fileName: string): PreviewType => {
  if (/\.pdf$/i.test(fileName)) return "pdf";
  if (/\.json$/i.test(fileName)) return "json";
  if (imageExtensions.test(fileName)) return "image";
  if (textExtensions.test(fileName) || !fileName.includes(".")) return "text";
  return "unsupported";
};

const getMimeType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    avif: "image/avif",
    bmp: "image/bmp",
    gif: "image/gif",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    svg: "image/svg+xml",
    webp: "image/webp",
    pdf: "application/pdf",
  };

  return mimeTypes[extension ?? ""] ?? "application/octet-stream";
};

const toDataUrl = (base64: string, fileName: string) => {
  if (base64.trim().startsWith("data:")) return base64;
  return `data:${getMimeType(fileName)};base64,${base64}`;
};

const decodeBase64 = (base64: string) => {
  const value = base64.includes(",") ? base64.slice(base64.indexOf(",") + 1) : base64;
  const bytes = Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const PreviewComponent: React.FC<PreviewComponentProps> = ({ fileName, base64, className }) => {
  const previewType = getPreviewType(fileName);
  const dataUrl = toDataUrl(base64, fileName);

  if (previewType === "image") {
    return (
      <div className={cn("flex h-full min-h-48 w-full items-center justify-center overflow-auto", className)}>
        <img src={dataUrl} alt={fileName} className="max-h-full max-w-full object-contain" />
      </div>
    );
  }

  if (previewType === "pdf") {
    return <iframe title={fileName} src={dataUrl} className={cn("h-full min-h-96 w-full border-0", className)} />;
  }

  if (previewType === "text" || previewType === "json") {
    let content: string;
    try {
      content = decodeBase64(base64);
      if (previewType === "json") {
        content = JSON.stringify(JSON.parse(content), null, 2);
      }
    } catch {
      content = "Unable to preview this file.";
    }

    return (
      <pre className={cn("h-full min-h-48 w-full overflow-auto whitespace-pre-wrap break-words p-4 text-left", className)}>
        <code>{content}</code>
      </pre>
    );
  }

  return (
    <div className={cn("flex min-h-48 items-center justify-center p-4 text-center", className)}>
      <p>Preview is not available for {fileName}.</p>
    </div>
  );
};

export { PreviewComponent };
export default PreviewComponent;
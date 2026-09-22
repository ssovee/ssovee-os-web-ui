import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { cn } from "../utils/helpers";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export interface PreviewComponentProps {
  fileName: string;
  base64: string;
  className?: string;
}

type PreviewType = "image" | "pdf" | "text" | "json" | "audio" | "video" | "unsupported";

const imageExtensions = /\.(avif|bmp|gif|heic|jpe?g|png|svg|tiff?|webp)$/i;
const textExtensions = /\.(c|cc|conf|cpp|css|csv|env|h|hpp|html?|ini|java|js|jsx|log|md|mjs|php|py|rb|rs|sh|sql|swift|ts|tsx|txt|xml|yaml|yml)$/i;
const audioExtensions = /\.(aac|flac|m4a|mp3|ogg|wav|weba)$/i;
const videoExtensions = /\.(avi|m4v|mkv|mov|mp4|mpeg|ogv|webm|wmv)$/i;

const getPreviewType = (fileName: string): PreviewType => {
  if (/\.pdf$/i.test(fileName)) return "pdf";
  if (/\.json$/i.test(fileName)) return "json";
  if (imageExtensions.test(fileName)) return "image";
  if (audioExtensions.test(fileName)) return "audio";
  if (videoExtensions.test(fileName)) return "video";
  if (textExtensions.test(fileName) || !fileName.includes(".")) return "text";
  return "unsupported";
};

const getMimeType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    avif: "image/avif",
    bmp: "image/bmp",
    gif: "image/gif",
    heic: "image/heic",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    svg: "image/svg+xml",
    tif: "image/tiff",
    tiff: "image/tiff",
    webp: "image/webp",
    pdf: "application/pdf",
    aac: "audio/aac",
    flac: "audio/flac",
    m4a: "audio/mp4",
    mp3: "audio/mpeg",
    ogg: "audio/ogg",
    wav: "audio/wav",
    weba: "audio/webm",
    avi: "video/x-msvideo",
    m4v: "video/mp4",
    mkv: "video/x-matroska",
    mov: "video/quicktime",
    mp4: "video/mp4",
    mpeg: "video/mpeg",
    ogv: "video/ogg",
    webm: "video/webm",
    wmv: "video/x-ms-wmv",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    zip: "application/zip",
    "7z": "application/x-7z-compressed",
    rar: "application/vnd.rar",
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

const toPdfBytes = (base64: string) => {
  const value = base64.includes(",") ? base64.slice(base64.indexOf(",") + 1) : base64;
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
};

const PreviewComponent: React.FC<PreviewComponentProps> = ({ fileName, base64, className }) => {
  const previewType = getPreviewType(fileName);
  const dataUrl = toDataUrl(base64, fileName);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [pdfError, setPdfError] = useState(false);

  if (previewType === "image") {
    return (
      <div className={cn("flex h-full min-h-48 w-full items-center justify-center overflow-auto", className)}>
        <img src={dataUrl} alt={fileName} className="max-h-full max-w-full object-contain" />
      </div>
    );
  }

  if (previewType === "pdf") {
    return (
      <div className={cn("flex min-h-96 flex-col items-center overflow-auto p-3", className)}>
        {pdfError ? (
          <p>Unable to render {fileName}. The PDF may be invalid or corrupted.</p>
        ) : (
          <Document
            file={{ data: toPdfBytes(base64) }}
            loading={<p>Loading {fileName}...</p>}
            error={<p>Unable to render {fileName}. The PDF may be invalid or corrupted.</p>}
            onLoadSuccess={({ numPages }) => {
              setPageCount(numPages);
              setPdfError(false);
            }}
            onLoadError={() => setPdfError(true)}
            className="flex w-full flex-col items-center"
          >
            {pageCount !== null &&
              Array.from({ length: pageCount }, (_, index) => (
                <Page
                  key={`${fileName}-${index + 1}`}
                  pageNumber={index + 1}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className="mb-3 max-w-full shadow-sm"
                />
              ))}
          </Document>
        )}
      </div>
    );
  }

  if (previewType === "audio") {
    return <audio controls src={dataUrl} className={cn("w-full", className)} />;
  }

  if (previewType === "video") {
    return <video controls src={dataUrl} className={cn("max-h-full max-w-full", className)} />;
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
      <p>Preview is not available for {fileName}. This file format is not supported.</p>
    </div>
  );
};

export { PreviewComponent };
export default PreviewComponent;
import React, { useEffect, useRef, useState } from "react";
import { cn } from "../utils/helpers";

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
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [pdfState, setPdfState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (previewType !== "pdf" || !pdfContainerRef.current) return;

    let cancelled = false;
    const container = pdfContainerRef.current;
    setPdfState("loading");
    container.replaceChildren();

    import("pdfjs-dist/legacy/build/pdf.mjs")
      .then(async ({ getDocument }) => {
        const pdf = await getDocument({ data: toPdfBytes(base64) }).promise;

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (cancelled) return;

          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.35 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) throw new Error("Canvas is not supported");

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.setAttribute("aria-label", `${fileName}, page ${pageNumber}`);
          canvas.className = "mb-3 max-w-full shadow-sm";
          container.appendChild(canvas);
          await page.render({ canvas, canvasContext: context, viewport }).promise;
        }

        if (!cancelled) setPdfState("ready");
      })
      .catch(() => {
        if (!cancelled) setPdfState("error");
      });

    return () => {
      cancelled = true;
      container.replaceChildren();
    };
  }, [base64, fileName, previewType]);

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
        {pdfState === "loading" && <p>Loading {fileName}...</p>}
        {pdfState === "error" && <p className="mb-3">Unable to render this PDF.</p>}
        <div ref={pdfContainerRef} className="flex w-full flex-col items-center" />
        <a href={dataUrl} download={fileName} className="mt-3">
          Download {fileName}
        </a>
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
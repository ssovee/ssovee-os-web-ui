import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { cn } from "../utils/helpers";
import type { PdfPreviewProps } from "./PdfPreview";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("./pdf.worker.min.mjs", import.meta.url).toString();

const base64ToUint8Array = (base64: string) => {
  const value = base64.includes(",") ? base64.slice(base64.indexOf(",") + 1) : base64;
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
};

const PdfPreviewBrowser: React.FC<PdfPreviewProps> = ({ base64, fileName, className }) => {
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState<string>();
  const [pageWidth, setPageWidth] = useState(900);

  useEffect(() => {
    const updatePageWidth = () => setPageWidth(Math.min(900, Math.max(320, window.innerWidth - 48)));
    updatePageWidth();
    window.addEventListener("resize", updatePageWidth);
    return () => window.removeEventListener("resize", updatePageWidth);
  }, []);

  let pdfData: Uint8Array;
  try {
    pdfData = base64ToUint8Array(base64);
  } catch {
    pdfData = new Uint8Array();
  }

  return (
    <div className={cn("h-full min-h-96 w-full overflow-auto bg-muted/30", className)}>
      <Document
        file={{ data: pdfData }}
        suspense={false}
        onLoadSuccess={({ numPages: loadedPages }) => {
          setNumPages(loadedPages);
          setError(undefined);
        }}
        onLoadError={(loadError) => {
          console.error("PDF preview error:", loadError);
          setError(`Unable to preview ${fileName}`);
        }}
        loading={<div className="flex min-h-96 items-center justify-center">Loading PDF...</div>}
        error={<div className="flex min-h-96 items-center justify-center">{error ?? "Unable to preview this PDF."}</div>}
      >
        <div className="flex flex-col items-center gap-4 p-4">
          {Array.from({ length: numPages }, (_, index) => (
            <div key={`page_${index + 1}`} className="overflow-hidden rounded-lg bg-white shadow-sm">
              <Page pageNumber={index + 1} renderTextLayer renderAnnotationLayer width={pageWidth} />
            </div>
          ))}
        </div>
      </Document>
    </div>
  );
};

export default PdfPreviewBrowser;
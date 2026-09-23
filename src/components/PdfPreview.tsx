import React, { useEffect, useState } from "react";
import { cn } from "../utils/helpers";

export interface PdfPreviewProps {
  base64: string;
  fileName: string;
  className?: string;
}

const PdfPreview: React.FC<PdfPreviewProps> = (props) => {
  const [BrowserPreview, setBrowserPreview] = useState<React.ComponentType<PdfPreviewProps>>();

  useEffect(() => {
    void import("./PdfPreviewBrowser").then(({ default: component }) => setBrowserPreview(() => component));
  }, []);

  if (!BrowserPreview) {
    return <div className={cn("flex min-h-96 items-center justify-center", props.className)}>Loading PDF...</div>;
  }

  return <BrowserPreview {...props} />;
};

export { PdfPreview };
export default PdfPreview;
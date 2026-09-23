export interface OfficePreviewProps {
  base64: string;
  fileName: string;
  className?: string;
}

import React, { useEffect, useState } from "react";
import { cn } from "../utils/helpers";

const OfficePreview: React.FC<OfficePreviewProps> = (props) => {
  const [BrowserPreview, setBrowserPreview] = useState<React.ComponentType<OfficePreviewProps>>();

  useEffect(() => {
    void import("./OfficePreviewBrowser").then(({ default: component }) => setBrowserPreview(() => component));
  }, []);

  if (!BrowserPreview) {
    return <div className={cn("flex min-h-96 items-center justify-center", props.className)}>Loading document...</div>;
  }

  return <BrowserPreview {...props} />;
};

export { OfficePreview };
export default OfficePreview;
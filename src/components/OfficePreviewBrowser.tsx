import React, { useEffect, useState } from "react";
import { parseOffice } from "officeparser";
import { cn } from "../utils/helpers";
import type { OfficePreviewProps } from "./OfficePreview";

const base64ToUint8Array = (base64: string) => {
  const value = base64.includes(",") ? base64.slice(base64.indexOf(",") + 1) : base64;
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
};

const sanitizeHtml = (html: string) => {
  const parsedDocument = new DOMParser().parseFromString(html, "text/html");
  parsedDocument.querySelectorAll("script, iframe, object, embed, form").forEach((element) => element.remove());
  parsedDocument.querySelectorAll("*").forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      if (attribute.name.toLowerCase().startsWith("on")) element.removeAttribute(attribute.name);
    });
  });
  return parsedDocument.body.innerHTML;
};

const OfficePreviewBrowser: React.FC<OfficePreviewProps> = ({ base64, fileName, className }) => {
  const [html, setHtml] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    setHtml(undefined);
    setError(undefined);

    void parseOffice(base64ToUint8Array(base64))
      .then((document) => document.to("html"))
      .then((result) => {
        if (!cancelled) setHtml(sanitizeHtml(typeof result.value === "string" ? result.value : String(result.value)));
      })
      .catch((parseError) => {
        console.error("Office preview error:", parseError);
        if (!cancelled) setError(`Unable to preview ${fileName}. This office format may not be supported.`);
      });

    return () => {
      cancelled = true;
    };
  }, [base64, fileName]);

  return (
    <div className={cn("h-full min-h-96 w-full overflow-auto bg-muted/30 p-4", className)}>
      {error ? (
        <div className="flex min-h-80 items-center justify-center text-center">{error}</div>
      ) : html ? (
        <article className="mx-auto max-w-5xl rounded-lg bg-white p-6 text-left shadow-sm" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <div className="flex min-h-80 items-center justify-center">Loading document...</div>
      )}
    </div>
  );
};

export default OfficePreviewBrowser;
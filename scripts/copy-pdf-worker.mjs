import { copyFileSync } from "node:fs";

copyFileSync("node_modules/pdfjs-dist/build/pdf.worker.min.mjs", "dist/pdf.worker.min.mjs");
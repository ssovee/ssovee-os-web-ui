import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/sdk.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  loader: {
    ".svg": "dataurl",
    ".gif": "dataurl",
    ".wav": "dataurl",
  },
  external: [
    "react",
    "react-dom",
    "@phosphor-icons/react",
    "@tiptap/react",
    "@tiptap/starter-kit",
    "react-pdf",
    "pdfjs-dist",
  ],
  outDir: "dist",
  splitting: false,
  treeshake: true,
});

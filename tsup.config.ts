import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/sdk.ts",
    "src/components/*.tsx",
    "src/hooks/*.ts",
    "src/hooks/*.tsx",
  ],
  format: ["esm", "cjs"],
  platform: "browser",
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
  ],
  noExternal: ["officeparser", "react-pdf", "pdfjs-dist"],
  outDir: "dist",
  splitting: false,
  treeshake: true,
});

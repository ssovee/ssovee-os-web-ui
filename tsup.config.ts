import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/sdk.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  loader: {
    ".wav": "dataurl",
  },
  external: ["react", "react-dom", "@phosphor-icons/react"],
  outDir: "dist",
  splitting: false,
  treeshake: true,
});

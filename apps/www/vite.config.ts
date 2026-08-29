import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/ssovee-os-web-ui/' : '/',
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: path.resolve(fileURLToPath(new URL('.', import.meta.url)), 'node_modules/react'),
      'react-dom': path.resolve(fileURLToPath(new URL('.', import.meta.url)), 'node_modules/react-dom'),
      'ssovee-os-web-ui': path.resolve(fileURLToPath(new URL('../..', import.meta.url)), 'src/index.ts'),
      'ssovee-os-web-ui/theme.css': path.resolve(fileURLToPath(new URL('../..', import.meta.url)), 'src/theme.css'),
    },
  },
})

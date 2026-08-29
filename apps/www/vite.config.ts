import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/ssovee-os-web-ui/' : '/',
  resolve: {
    // Ensure linked local packages use the app's React instance.
    dedupe: ['react', 'react-dom'],
    alias: {
      react: path.resolve(fileURLToPath(new URL('.', import.meta.url)), 'node_modules/react'),
      'react-dom': path.resolve(fileURLToPath(new URL('.', import.meta.url)), 'node_modules/react-dom'),
    },
  },
})

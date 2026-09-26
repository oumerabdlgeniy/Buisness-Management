import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: globalThis.process?.env?.GITHUB_ACTIONS === 'true' ? '/Buisness-Management/' : '/',
  plugins: [
    react(),
  
  ],
})
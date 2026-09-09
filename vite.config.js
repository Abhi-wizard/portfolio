import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'emit-nojekyll',
      closeBundle() {
        try {
          fs.writeFileSync(path.resolve(process.cwd(), 'dist/.nojekyll'), '')
        } catch (e) {
          // ignore
        }
      }
    }
  ],
  base: '/portfolio/',
})


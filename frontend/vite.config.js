import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 10453,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:10453",
   },
})

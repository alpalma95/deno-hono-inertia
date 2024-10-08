import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    strictPort: true,
    origin: 'http://localhost:8000'
  },
  build: {
    outDir: '../public/',
    assetsDir: 'dist_assets',
    rollupOptions: {
      input: './app.html'
    }
  },
  
})

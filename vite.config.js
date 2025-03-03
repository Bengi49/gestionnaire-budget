import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'src/index.html'
    }
  },
  base: './',
  server: {
    port: 3000
  }
})
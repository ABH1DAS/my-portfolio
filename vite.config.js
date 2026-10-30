import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base ensures assets load properly on GitHub Pages (e.g. /my-portfolio/)
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});

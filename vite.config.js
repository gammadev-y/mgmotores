import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['@supabase/supabase-js'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          '@supabase/supabase-js': 'supabase'
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Define your entry point, assuming src/main.ts is your entry file
        main: path.resolve(__dirname, 'src/main.ts')
      },
      output: {
        // Custom file name for the main entry file
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'main') {
            return 'assets/main.js';
          }
          return 'assets/[name].[hash].js';
        },
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
});
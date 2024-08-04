import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Define your entry point, assuming src/index.ts is your entry file
        index: path.resolve(__dirname, 'src/index.ts')
      },
      output: {
        // Custom file name for the index entry file
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'index') {
            return 'assets/index.js';
          }
          return 'assets/[name].[hash].js';
        },
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
});
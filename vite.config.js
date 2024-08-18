import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        // Define your entry point, assuming src/index.ts is your entry file
        // eslint-disable-next-line no-undef
        index: path.resolve(__dirname, 'src/web/index.ts')
      },
      output: {
        // Custom file name for the index entry file
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name == 'index') {
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
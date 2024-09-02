import {defineConfig} from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/<REPO>/',
  build: {
    rollupOptions: {
      input: {
        // Define your entry point, assuming src/index.ts is your entry file
        // eslint-disable-next-line no-undef
        index: path.resolve(__dirname, 'src/web/main.ts'),
        main: 'index.html',
      },
      output: {
        // Custom file name for the index entry file
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name == 'index') {
            return 'index.js';
          }
          return '[name].[hash].js';
        },
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash].[ext]'
      }
    }
  }
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './private.key')),
      cert: fs.readFileSync(path.resolve(__dirname, './certificate.crt')), // Cambia .csr por .crt
    },
    port: 5000, 
  },
});

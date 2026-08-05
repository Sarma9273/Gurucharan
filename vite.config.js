import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    base: '/Gurucharan/',
    build: {
        target: 'es2022',
        cssMinify: true,
        sourcemap: false,
    },
});

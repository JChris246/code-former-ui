import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '^/(api|assets)/.*': {
                target: 'http://localhost:9118',
                changeOrigin: true,
            }
        },
    }
})

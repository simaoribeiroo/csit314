import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = process.env.VITE_API_TARGET ?? env.VITE_API_TARGET ?? 'http://127.0.0.1:80'

  return {
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
  }
})

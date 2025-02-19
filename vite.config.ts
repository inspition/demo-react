import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import envCompatible from 'vite-plugin-env-compatible'
import cesium from 'vite-plugin-cesium'

// https://vite.dev/config/
// console.log('process.env', process.env);

export default defineConfig({
  plugins: [react(), envCompatible(), cesium()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // 如果使用docker-compose开发模式，设置为false
    open: true,
    proxy: {
      // 把key的路径代理到target位置
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VITE_BASE_API as string]: {
        // 需要代理的路径   例如 '/api'
        target: process.env.VITE_BASE_PATH, // 代理到 目标路径
        changeOrigin: true,
        rewrite: path =>
          path.replace(new RegExp('^' + process.env.VITE_BASE_API), ''),
      },

      // 天气接口代理
      [process.env.VITE_WEATHER_API as string]: {
        // 需要代理的路径   例如 '/api'
        target: process.env.VITE_WEATHER_PATH, // 代理到 目标路径
        changeOrigin: true,
        rewrite: path =>
          path.replace(new RegExp('^' + process.env.VITE_WEATHER_API), ''),
      },
    },
  },
})

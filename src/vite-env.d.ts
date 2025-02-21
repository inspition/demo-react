/// <reference types="vite/client" />

import { Viewer } from 'cesium'

// interface ImportMetaEnv {
//   readonly VITE_BASE_API: string
//   readonly VITE_BASE_PATH: string

//   readonly VITE_WEATHER_API: string
//   readonly VITE_WEATHER_PATH: string
//   readonly VITE_BASE_URL: string
//   // 更多环境变量...
// }

// interface ImportMeta {
//   readonly env: ImportMetaEnv
// }

declare global {
  interface Window {
    viewer: Viewer
  }
  interface ImportMetaEnv {
    readonly VITE_BASE_API: string
    readonly VITE_BASE_PATH: string

    readonly VITE_WEATHER_API: string
    readonly VITE_WEATHER_PATH: string

    /**
     * 生产环境前缀
     */
    readonly VITE_BASE_URL: string

    // 更多环境变量...
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

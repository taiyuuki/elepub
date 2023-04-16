import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'path'
import unocss from 'unocss/vite'
import autoAPIs from 'unplugin-auto-import/vite'
import autoComponents from 'unplugin-vue-components/vite'
import { QuasarResolver as qr } from 'unplugin-vue-components/resolvers'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

function resolve(dir: string) {
  return join(__dirname, dir)
}
// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({ sassVariables: true }),
    unocss(),
    autoComponents({
      dts: 'src/components.d.ts',
      resolvers: [qr()],
    }),
    autoAPIs({
      imports: [
        'vue',
        'vue/macros',
        'pinia',
        'vue-router',
        {
          quasar: [
            'useQuasar',
            'Notify',
            'Dialog',
            'LocalStorage',
            'useMeta',
          ],
          'quasar/wrappers': ['boot'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
    })],
  resolve: {
    alias: {
      '@': resolve('src'),
      'src': resolve('src'),
      'components': resolve('src/components'),
      'composables': resolve('src/composables'),
      'layouts': resolve('src/layouts'),
      'pages': resolve('src/pages'),
      'router': resolve('src/router'),
      'stores': resolve('src/stores'),
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    // don't minify for debug builds
    minify: process.env.TAURI_DEBUG ? false : 'esbuild',
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
}))
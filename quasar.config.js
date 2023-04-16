/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

const { configure } = require('quasar/wrappers')
const { resolve } = require('path')
const isPro = process.env.NODE_ENV === 'production'

module.exports = configure(function (/* ctx */) {
  return {
    eslint: {
      // fix: true,
      // include = [],
      // exclude = [],
      // rawOptions = {},
      warnings: true,
      errors: true,
    },

    alias: {
      '@': resolve('src'),
      src: resolve('src'),
      components: resolve('src/components'),
      boot: resolve('src/boot'),
      layouts: resolve('src/layouts'),
      pages: resolve('src/pages'),
      router: resolve('src/router'),
      stores: resolve('src/stores'),
      assets: resolve('src/assets'),
    },

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ['unocss'],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ['app.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!
      // 'roboto-font', // optional, you are not bound to it
      // 'material-icons', // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16',
      },

      vueRouterMode: 'hash', // available values: 'hash', 'history'
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      // publicPath: '/',
      // analyze: true,
      // env: {},
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir

      extendViteConf(viteConf) {
        viteConf.base = './'
        viteConf.build.rollupOptions = {
          output: {
            chunkFileNames: 'js/[name]-[hash].js',
            entryFileNames: 'js/[name]-[hash].js',
            assetFileNames: '[ext]/[name].[ext]',
          },
        }
        // 禁用uno未引入uno.css的提示
        if (!isPro) {
          viteConf.server.hmr = { overlay: false }
        }
        // viteConf.build.assetsDir = 'dist/spa/assets';
        // viteConf.assetsInclude = ['**/*.webp'];
      },
      viteVuePluginOptions: { reactivityTransform: true },

      vitePlugins: [
        ['unocss/vite'],
        [
          'unplugin-vue-components/vite',
          {
            // local compnents options
            // resolvers: [
            //   // eslint-disable-next-line new-cap
            //   require('unplugin-vue-components/resolvers').QuasarResolver(),
            // ],
            dts: 'src/components.d.ts',
          },
        ],
        ['unplugin-auto-import/vite',
          {
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
          },
        ],
      ],
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      // https: true
      open: true, // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {},

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ['Notify', 'Dialog'],
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   registerServiceWorker: 'src-pwa/register-service-worker',
    //   serviceWorker: 'src-pwa/custom-service-worker',
    //   pwaManifestFile: 'src-pwa/manifest.json',
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    // },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
      // will mess up SSR

      // extendSSRWebserverConf (esbuildConf) {},
      // extendPackageJson (json) {},

      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        'render', // keep this as last one
      ],
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'generateSW', // or 'injectManifest'
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
      productName: '漫画生成器',
      // useFilenameHashes: true,
      // extendGenerateSWOptions (cfg) {}
      // extendInjectManifestOptions (cfg) {},
      // extendManifestJson (json) {}
      // extendPWACustomSWConf (esbuildConf) {}
      manifest: {
        name: '多看漫画生成器',
        short_name: '漫画生成器',
        description: '生成多看epub漫画的小工具',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#1976D2',
        theme_color: '#1976D2',
        icon: './src/assets/logo.png',
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: { hideSplashscreen: true },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf(esbuildConf)
      // extendElectronPreloadConf (esbuildConf)

      inspectPort: 5858,

      bundler: 'builder', // 'packager' or 'builder'

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'elepub',
        productName: 'elepub',
        win: {
          icon: resolve(__dirname, './src/assets/logo.png'),
          target: 'nsis',
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
        },
        mac: {
          icon: resolve(__dirname, './src/assets/logo.png'),
          target: 'dmg',
        },
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      contentScripts: ['my-content-script'],

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    },
  }
})
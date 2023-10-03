/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

const { join } = require('path')
const { configure } = require('quasar/wrappers')

const isPro = process.env.NODE_ENV === 'production'

function resolve(dir) {
    join(__dirname, dir)
}

module.exports = configure(function (/* ctx */) {
    return {
        eslint: {
            // fix: true,
            // include: [],
            // exclude: [],
            // rawOptions: {},
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
        boot: [
            'unocss',
        ],

        // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
        css: [
            'app.scss',
        ],

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
            'mdi-v6',
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
                viteConf.base = '/'
                viteConf.clearScreen = false
                // viteConf.server = {
                //     strictPort: true,
                // }
                viteConf.envPrefix = ['VITE_', 'TAURI_']
                viteConf.build.target = process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13'
                viteConf.minify = process.env.TAURI_DEBUG ? false : 'esbuild'
                viteConf.sourcemap = !!process.env.TAURI_DEBUG

                if (!isPro) {
                    viteConf.server.hmr = { overlay: false }
                }
            },
            // viteVuePluginOptions: {},

            vitePlugins: [
                ['vite-plugin-pages', {
                    extensions: ['vue'],
                    extendRoute(route) {
                        if (route.path === '/') {
                            return route
                        }
                        return {
                            ...route,
                            meta: { auth: true },
                        }
                    },
                }],
                [
                    'vite-plugin-vue-layouts',
                    { defaultLayout: 'MainLayout' },
                ],
                [
                    'unplugin-vue-components/vite',
                    {
                        dts: 'src/components.d.ts',
                    },
                ],
                [
                    'unplugin-auto-import/vite',
                    {
                        imports: [
                            'vue',
                            'pinia',
                            'vue-router',
                            {
                                quasar: [
                                    'useQuasar',
                                    'Notify',
                                    'Dialog',
                                ],
                                'quasar/wrappers': ['boot'],
                            },
                        ],
                        dts: 'src/auto-imports.d.ts',
                    },
                ],
                ['unocss/vite', {/** unocss options */ }],
            ],
        },

        // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
        devServer: {
            // https: true
            open: false, // opens browser window automatically
        },

        // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
        framework: {
            config: {},

            // iconSet: 'material-icons', // Quasar icon set
            lang: 'zh-CN', // Quasar language pack

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

        ssg: {
            inlineCriticalCss: false,
        },

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
            // useFilenameHashes: true,
            // extendGenerateSWOptions (cfg) {}
            // extendInjectManifestOptions (cfg) {},
            // extendManifestJson (json) {}
            // extendPWACustomSWConf (esbuildConf) {}
        },

        // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
        cordova: {
            // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
        },

        // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
        capacitor: {
            hideSplashscreen: true,
        },

        // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
        electron: {
            // extendElectronMainConf (esbuildConf)
            // extendElectronPreloadConf (esbuildConf)

            inspectPort: 5858,

            bundler: 'packager', // 'packager' or 'builder'

            packager: {
                // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

                // OS X / Mac App Store
                // appBundleId: '',
                // appCategoryType: '',
                // osxSign: '',
                // protocol: 'myapp://path',

                // Windows only
                // win32metadata: { ... }
            },

            builder: {
                // https://www.electron.build/configuration/configuration

                appId: 'elepub',
            },
        },

        // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
        bex: {
            contentScripts: [
                'my-content-script',
            ],

            // extendBexScriptsConf (esbuildConf) {}
            // extendBexManifestJson (json) {}
        },
    }
})

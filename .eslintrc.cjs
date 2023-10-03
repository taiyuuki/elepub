module.exports = {
    root: true,

    env: {
        browser: true,
        es2021: true,
        node: true,
        'vue/setup-compiler-macros': true,
    },

    extends: [
        '@taiyuuki/eslint-config-vue-unimport',
    ],

    globals: {
        ga: 'readonly', // Google Analytics
        cordova: 'readonly',
        __statics: 'readonly',
        __QUASAR_SSR__: 'readonly',
        __QUASAR_SSR_SERVER__: 'readonly',
        __QUASAR_SSR_CLIENT__: 'readonly',
        __QUASAR_SSR_PWA__: 'readonly',
        process: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly',
    },
    rules: {
        'import/no-unresolved':
          ['error', {
              'ignore': [
                  '~pages',
                  'uno.css',
                  'virtual:generated-layouts',
                  'virtual:generated-pages',
                  'virtual:vue-component-preview',
              ],
          }],
    },
}

import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import type { Router } from 'vue-router'
/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
    export interface PiniaCustomProperties {
        readonly router: Router
    }
}

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(() => {
    const pinia = createPinia()

    // You can add Pinia plugins here
    // pinia.use(SomePiniaPlugin)
    //   const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies
    //   pinia.use(
    //     cretaeCookiePersisted(cookies, {
    //       cookiesOptions: {
    //         expires: 15,
    //         sameSite: 'Strict',
    //       },
    //     })
    //   )
    //   pinia.use(createLSPersisted(LocalStorage))

    return pinia
})

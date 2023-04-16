import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'
import quasarLang from 'quasar/lang/zh-CN'
import 'quasar/src/css/index.sass'
import 'src/css/style.scss'
import 'uno.css'

createApp(App).use(Quasar, {
  plugins: { Notify, Dialog }, // import Quasar plugins and add here
  lang: quasarLang,
}).mount('#app')
import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
} from 'unocss';
// import { myShortcuts } from './unocss.this.js';
import { presetTaiyuuki } from './uno.taiyuuki.js';

export default defineConfig({
  presets: [
    presetAttributify({}),
    presetUno(),
    presetIcons(),
    presetTaiyuuki(),
  ],
  shortcuts: [],
  variants: [],
});

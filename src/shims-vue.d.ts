/* eslint-disable */

// Mocks all files ending in `.vue` showing them as plain Vue instances
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
interface Window {
  preload: {
    openFolder(folder: string): void;
    getBookChapters(path: string): Promise<{ id: string; title?: string }[][]>;
    getBookMessage(path: string): Promise<book>;
    getGrogress(): number;
    getCss(): Promise<string>;
    getImage(id: string): Promise<string>;
    getSection(id: string): Promise<string>;
    writeEPUB(
      filename: string,
      folder: string,
      progress: { value: number }
    ): void;
    saveData(data: string): void;
    loadData(): Promise<string>;
  };
}

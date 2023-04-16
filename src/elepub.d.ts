import { IpcRendererEvent } from 'electron';
import type { EpubImage, Metadata, Section, CustomFile } from 'wepub';

declare global {
  interface Window {
    wepubApi: {
      buildEpub: (
        epubDate: EpubData,
        onProgress?: OnProgressUpdata
      ) => Promise<boolean>;
      getProgress: (
        callback: (event: IpcRendererEvent, progress: number) => void
      ) => void;
    };
  }

  interface EpubData {
    metadata: Metadata;
    sections: Section[];
    images: EpubImage[];
    customFiles: CustomFile[];
    css: string;
    output: string;
  }

  type OnProgressUpdata = (progress: number) => void;
}

interface ScanResult {
  filePath: string;
  name: string;
  size: number;
  mtime: number;
}

interface ElectronAPI {
  platform: string;
  file: {
    open: () => Promise<{ filePath: string; content: string; name: string } | null>;
    save: (data: { filePath: string; content: string }) => Promise<{ ok: boolean; error?: string }>;
    saveAs: (data: { content: string; defaultName: string }) => Promise<{ filePath: string; name: string } | null>;
    scan: () => Promise<ScanResult[]>;
    openByPath: (filePath: string) => Promise<{ filePath: string; content: string; name: string } | null>;
  };
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    isMaximized: () => Promise<boolean>;
    onMaximizeChange: (cb: (maximized: boolean) => void) => void;
  };
  updater: {
    install: () => Promise<void>;
    onUpdateAvailable: (cb: (version: string) => void) => void;
    onUpdateDownloaded: (cb: () => void) => void;
  };
}

declare global {
  interface Window { electron: ElectronAPI; }
}
export {};

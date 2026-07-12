export interface SaveData {
  version: number;
  storage: number;
  nestStage: number;
  workerCount: number;
}

const SAVE_VERSION = 1;

export const SaveStore = {
  save(_data: SaveData): void {
    // V1: persistence is deferred to V2. This is a wired no-op stub.
  },

  load(): SaveData | null {
    // V1: always start a fresh colony. Returns null so callers treat it as new.
    return null;
  },

  version(): number {
    return SAVE_VERSION;
  },
};

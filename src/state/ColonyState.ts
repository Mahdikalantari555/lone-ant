import Phaser from "phaser";

export interface ColonyGrowth {
  workerCount: number;
  nestStage: number;
}

const STORAGE_THRESHOLDS = [0, 25, 75, 150, 300];

export class ColonyState extends Phaser.Events.EventEmitter {
  private _storage = 0;
  private _workerCount = 0;
  private _nestStage = 0;

  get storage(): number {
    return this._storage;
  }

  get workerCount(): number {
    return this._workerCount;
  }

  get nestStage(): number {
    return this._nestStage;
  }

  addFood(amount: number): void {
    if (amount <= 0) return;
    this._storage += amount;
    this.recomputeGrowth();
    this.emit("storage-changed", this._storage);
  }

  setWorkerCount(count: number): void {
    this._workerCount = Math.max(0, count);
    this.emit("workers-changed", this._workerCount);
  }

  reset(): void {
    this._storage = 0;
    this._workerCount = 0;
    this._nestStage = 0;
    this.emit("reset");
  }

  bootstrap(): void {
    this.recomputeGrowth();
  }

  private recomputeGrowth(): void {
    let stage = 0;
    for (let i = 0; i < STORAGE_THRESHOLDS.length; i++) {
      if (this._storage >= STORAGE_THRESHOLDS[i]) stage = i;
    }
    if (stage !== this._nestStage) {
      this._nestStage = stage;
      this.emit("nest-stage-changed", stage);
    }
    this._workerCount = stage + 1;
    this.emit("workers-changed", this._workerCount);
  }

  static growthFor(storage: number): ColonyGrowth {
    let stage = 0;
    for (let i = 0; i < STORAGE_THRESHOLDS.length; i++) {
      if (storage >= STORAGE_THRESHOLDS[i]) stage = i;
    }
    return { workerCount: stage + 1, nestStage: stage };
  }
}

export const colony = new ColonyState();

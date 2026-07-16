import Phaser from "phaser";

export interface ColonyGrowth {
  workerCount: number;
  nestStage: number;
}

const NEST_THRESHOLDS = [0, 10, 30, 60];

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

  removeFood(amount: number): void {
    if (amount <= 0) return;
    this._storage = Math.max(0, this._storage - amount);
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
    for (let i = 0; i < NEST_THRESHOLDS.length; i++) {
      if (this._storage >= NEST_THRESHOLDS[i]) stage = i;
    }
    if (stage !== this._nestStage) {
      this._nestStage = stage;
      this.emit("nest-stage-changed", stage);
    }
    const newWorkerCount = Math.floor(this._storage / 5);
    if (newWorkerCount !== this._workerCount) {
      this._workerCount = newWorkerCount;
      this.emit("workers-changed", this._workerCount);
    }
  }

  static growthFor(storage: number): ColonyGrowth {
    let stage = 0;
    for (let i = 0; i < NEST_THRESHOLDS.length; i++) {
      if (storage >= NEST_THRESHOLDS[i]) stage = i;
    }
    return { workerCount: Math.floor(storage / 5), nestStage: stage };
  }
}

export const colony = new ColonyState();

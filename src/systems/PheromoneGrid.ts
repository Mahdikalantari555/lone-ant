import { GRID_COLS, GRID_ROWS, TILE } from "../config/palette";
import { WorldGrid, cellToPixel, pixelToCell } from "../world/WorldGrid";

export type PheromoneLayer = "toFood" | "toNest";

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

export class PheromoneGrid {
  readonly cols = GRID_COLS;
  readonly rows = GRID_ROWS;
  private toFood: Float32Array;
  private toNest: Float32Array;

  constructor(private grid: WorldGrid) {
    this.toFood = new Float32Array(this.cols * this.rows);
    this.toNest = new Float32Array(this.cols * this.rows);
  }

  private idx(col: number, row: number): number {
    return row * this.cols + col;
  }

  deposit(layer: PheromoneLayer, x: number, y: number, amount: number): void {
    const { col, row } = pixelToCell(x, y);
    if (col < 0 || row < 0 || col >= this.cols || row >= this.rows) return;
    if (!this.grid.isWalkable(col, row)) return;
    const arr = layer === "toFood" ? this.toFood : this.toNest;
    const i = this.idx(col, row);
    arr[i] = Math.min(1, arr[i] + amount);
  }

  valueAt(layer: PheromoneLayer, x: number, y: number): number {
    const { col, row } = pixelToCell(x, y);
    if (col < 0 || row < 0 || col >= this.cols || row >= this.rows) return 0;
    return (layer === "toFood" ? this.toFood : this.toNest)[this.idx(col, row)];
  }

  gradient(layer: PheromoneLayer, x: number, y: number): { dx: number; dy: number } {
    const { col, row } = pixelToCell(x, y);
    const arr = layer === "toFood" ? this.toFood : this.toNest;
    let best = -1;
    let bx = 0;
    let by = 0;
    for (const [dc, dr] of NEIGHBOR_OFFSETS) {
      const c = col + dc;
      const r = row + dr;
      if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) continue;
      if (!this.grid.isWalkable(c, r)) continue;
      const v = arr[this.idx(c, r)];
      if (v > best) {
        best = v;
        bx = dc;
        by = dr;
      }
    }
    return { dx: bx, dy: by };
  }

  decay(dt: number, rate = 0.12): void {
    const f = Math.max(0, 1 - rate * dt);
    for (let i = 0; i < this.toFood.length; i++) {
      this.toFood[i] *= f;
      this.toNest[i] *= f;
      if (this.toFood[i] < 0.01) this.toFood[i] = 0;
      if (this.toNest[i] < 0.01) this.toNest[i] = 0;
    }
  }

  forEachCell(
    cb: (x: number, y: number, toFood: number, toNest: number) => void,
  ): void {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const i = this.idx(col, row);
        const f = this.toFood[i];
        const n = this.toNest[i];
        if (f > 0.02 || n > 0.02) {
          const p = cellToPixel(col, row);
          cb(p.x, p.y, f, n);
        }
      }
    }
  }

  cellCenter(col: number, row: number): { x: number; y: number } {
    return cellToPixel(col, row);
  }
}

export const PHEROMONE_CELL = TILE;

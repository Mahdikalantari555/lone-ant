import { GRID_COLS, GRID_ROWS, TILE } from "../config/palette";

export interface Cell {
  col: number;
  row: number;
}

export function cellToPixel(col: number, row: number): { x: number; y: number } {
  return { x: col * TILE + TILE / 2, y: row * TILE + TILE / 2 };
}

export function pixelToCell(x: number, y: number): Cell {
  return {
    col: Phaser.Math.Clamp(Math.floor(x / TILE), 0, GRID_COLS - 1),
    row: Phaser.Math.Clamp(Math.floor(y / TILE), 0, GRID_ROWS - 1),
  };
}

export class WorldGrid {
  readonly cols = GRID_COLS;
  readonly rows = GRID_ROWS;
  private walkable: boolean[];

  constructor() {
    this.walkable = new Array(this.cols * this.rows).fill(true);
    this.generate();
  }

  private index(col: number, row: number): number {
    return row * this.cols + col;
  }

  private generate(): void {
    const rng = new Phaser.Math.RandomDataGenerator(["lone-ant-world"]);
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const border = col === 0 || row === 0 || col === this.cols - 1 || row === this.rows - 1;
        if (border) {
          this.walkable[this.index(col, row)] = false;
          continue;
        }
        this.walkable[this.index(col, row)] = rng.frac() > 0.08;
      }
    }
  }

  isWalkable(col: number, row: number): boolean {
    if (col < 0 || row < 0 || col >= this.cols || row >= this.rows) return false;
    return this.walkable[this.index(col, row)];
  }

  isWalkablePixel(x: number, y: number): boolean {
    const { col, row } = pixelToCell(x, y);
    return this.isWalkable(col, row);
  }
}

import Phaser from "phaser";
import { WorldGrid, cellToPixel, pixelToCell, Cell } from "../world/WorldGrid";

interface Node {
  col: number;
  row: number;
  g: number;
  f: number;
  parent: Node | null;
}

const NEIGHBORS: ReadonlyArray<[number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

export class Pathfinding {
  constructor(private grid: WorldGrid) {}

  findPath(startX: number, startY: number, goalX: number, goalY: number): Phaser.Math.Vector2[] {
    const start = pixelToCell(startX, startY);
    let goal = pixelToCell(goalX, goalY);

    if (!this.grid.isWalkable(goal.col, goal.row)) {
      const nearest = this.nearestWalkable(goal);
      if (!nearest) return [];
      goal = nearest;
    }
    if (!this.grid.isWalkable(start.col, start.row)) return [];

    const open = new Map<number, Node>();
    const closed = new Set<number>();
    const key = (c: number, r: number) => r * this.grid.cols + c;

    const startNode: Node = {
      col: start.col,
      row: start.row,
      g: 0,
      f: this.heuristic(start, goal),
      parent: null,
    };
    open.set(key(start.col, start.row), startNode);

    let guard = 0;
    const maxIterations = this.grid.cols * this.grid.rows * 4;

    while (open.size > 0 && guard++ < maxIterations) {
      let current: Node | null = null;
      let currentKey = -1;
      for (const [k, n] of open) {
        if (current === null || n.f < current.f) {
          current = n;
          currentKey = k;
        }
      }
      if (!current) break;

      if (current.col === goal.col && current.row === goal.row) {
        return this.reconstruct(current);
      }

      open.delete(currentKey);
      closed.add(currentKey);

      for (const [dc, dr] of NEIGHBORS) {
        const nc = current.col + dc;
        const nr = current.row + dr;
        if (!this.grid.isWalkable(nc, nr)) continue;
        const nk = key(nc, nr);
        if (closed.has(nk)) continue;

        const stepCost = dc !== 0 && dr !== 0 ? Math.SQRT2 : 1;
        const g = current.g + stepCost;
        const existing = open.get(nk);
        if (!existing || g < existing.g) {
          open.set(nk, {
            col: nc,
            row: nr,
            g,
            f: g + this.heuristic({ col: nc, row: nr }, goal),
            parent: current,
          });
        }
      }
    }

    return [];
  }

  private heuristic(a: Cell, b: Cell): number {
    return Phaser.Math.Distance.Between(a.col, a.row, b.col, b.row);
  }

  private reconstruct(node: Node): Phaser.Math.Vector2[] {
    const cells: Node[] = [];
    let current: Node | null = node;
    while (current) {
      cells.unshift(current);
      current = current.parent;
    }
    return cells.map((c) => {
      const p = cellToPixel(c.col, c.row);
      return new Phaser.Math.Vector2(p.x, p.y);
    });
  }

  private nearestWalkable(goal: Cell): Cell | null {
    for (let radius = 1; radius <= 4; radius++) {
      for (let dc = -radius; dc <= radius; dc++) {
        for (let dr = -radius; dr <= radius; dr++) {
          const c = goal.col + dc;
          const r = goal.row + dr;
          if (this.grid.isWalkable(c, r)) return { col: c, row: r };
        }
      }
    }
    return null;
  }
}

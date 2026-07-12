import Phaser from "phaser";
import { WIDTH, HEIGHT, TILE, COLORS } from "../config/palette";
import { WorldGrid } from "./WorldGrid";

export class Terrain {
  private g: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, private grid: WorldGrid) {
    this.g = scene.add.graphics();
    this.g.setDepth(0);
    this.draw();
  }

  private draw(): void {
    const g = this.g;
    g.fillStyle(COLORS.ground.base, 1);
    g.fillRect(0, 0, WIDTH, HEIGHT);

    const rng = new Phaser.Math.RandomDataGenerator(["lone-ant-terrain"]);
    for (let row = 0; row < this.grid.rows; row++) {
      for (let col = 0; col < this.grid.cols; col++) {
        const x = col * TILE;
        const y = row * TILE;
        const roll = rng.frac();
        if (roll < 0.18) {
          g.fillStyle(COLORS.ground.mid, 1);
          g.fillRect(x, y, TILE, TILE);
        } else if (roll < 0.24) {
          g.fillStyle(COLORS.ground.highlight, 1);
          g.fillRect(x, y, TILE, TILE);
        }
        if (!this.grid.isWalkable(col, row)) {
          g.fillStyle(COLORS.ground.shadow, 1);
          g.fillRect(x, y, TILE, TILE);
        }
      }
    }

    const pebbles = Math.floor((WIDTH * HEIGHT) / 900);
    for (let i = 0; i < pebbles; i++) {
      const x = rng.between(2, WIDTH - 2);
      const y = rng.between(2, HEIGHT - 2);
      g.fillStyle(COLORS.ground.highlight, 1);
      g.fillCircle(x, y, rng.between(1, 2));
      g.fillStyle(COLORS.ground.shadow, 0.5);
      g.fillCircle(x + 1, y + 1, rng.between(1, 2));
    }

    const tufts = Math.floor((WIDTH * HEIGHT) / 1400);
    for (let i = 0; i < tufts; i++) {
      const x = rng.between(4, WIDTH - 4);
      const y = rng.between(4, HEIGHT - 4);
      g.lineStyle(1, COLORS.grass.mid, 1);
      const h = rng.between(3, 5);
      g.lineBetween(x, y, x - 1, y - h);
      g.lineBetween(x, y, x + 1, y - h);
      g.fillStyle(COLORS.grass.highlight, 1);
      g.fillCircle(x, y - h, 1);
    }

    const twigs = Math.floor((WIDTH * HEIGHT) / 2600);
    for (let i = 0; i < twigs; i++) {
      const x = rng.between(4, WIDTH - 4);
      const y = rng.between(4, HEIGHT - 4);
      g.lineStyle(1, COLORS.ground.shadow, 0.8);
      g.lineBetween(x, y, x + rng.between(3, 6), y + rng.between(-2, 2));
    }

    const litter = Math.floor((WIDTH * HEIGHT) / 2200);
    for (let i = 0; i < litter; i++) {
      const x = rng.between(4, WIDTH - 4);
      const y = rng.between(4, HEIGHT - 4);
      g.fillStyle(COLORS.ground.shadow, 0.6);
      g.fillRect(x, y, rng.between(2, 4), rng.between(2, 3));
    }
  }
}

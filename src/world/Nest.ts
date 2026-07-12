import Phaser from "phaser";
import { WIDTH, HEIGHT, TILE, COLORS } from "../config/palette";
import { WorldGrid } from "./WorldGrid";

export class Nest {
  readonly x: number;
  readonly y: number;
  private rim: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, _grid: WorldGrid) {
    this.x = WIDTH / 2;
    this.y = HEIGHT - TILE * 2;
    this.rim = scene.add.graphics();
    this.rim.setDepth(this.y);
    this.draw(0);
  }

  draw(stage: number): void {
    this.rim.clear();
    const cx = this.x;
    const cy = this.y;
    this.rim.fillStyle(COLORS.nest.shadow, 1);
    this.rim.fillCircle(cx, cy, TILE * (1 + stage * 0.4));
    this.rim.fillStyle(COLORS.nest.base, 1);
    this.rim.fillCircle(cx, cy, TILE * (0.8 + stage * 0.35));
    this.rim.fillStyle(0x000000, 1);
    this.rim.fillCircle(cx, cy, TILE * 0.45);
    this.rim.lineStyle(1, COLORS.nest.rimGlow, 0.8);
    this.rim.strokeCircle(cx, cy, TILE * (1 + stage * 0.4));
  }

  contains(x: number, y: number, radius: number): boolean {
    return Phaser.Math.Distance.Between(x, y, this.x, this.y) <= radius;
  }
}

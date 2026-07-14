import Phaser from "phaser";
import { WIDTH, TILE, COLORS } from "../config/palette";
import { WorldGrid } from "./WorldGrid";

export class Nest {
  readonly x: number;
  readonly y: number;
  private rim: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, _grid: WorldGrid) {
    this.x = WIDTH / 2;
    this.y = TILE * 5;
    this.rim = scene.add.graphics();
    this.rim.setDepth(this.y);
    this.draw(0);
  }

  draw(stage: number): void {
    this.rim.clear();
    const cx = this.x;
    const cy = this.y;
    const squash = 0.85;

    const ringRadii = [
      [10],
      [10, 16],
      [10, 16, 22],
      [10, 16, 22, 28],
    ];
    const radii = ringRadii[Math.min(stage, 3)];

    this.rim.fillStyle(COLORS.nest.shadow, 1);
    this.rim.fillEllipse(cx, cy, (radii[radii.length - 1] + 2) * 2, (radii[radii.length - 1] + 2) * 2 * squash);

    for (let i = radii.length - 1; i >= 0; i--) {
      const shade = i === 0 ? COLORS.nest.base : COLORS.nest.shadow;
      this.rim.fillStyle(shade, 1);
      this.rim.fillEllipse(cx, cy, radii[i] * 2, radii[i] * 2 * squash);
    }

    this.rim.fillStyle(COLORS.nest.base, 1);
    this.rim.fillEllipse(cx, cy, 14, 14 * squash);

    this.rim.fillStyle(COLORS.nest.hole, 1);
    this.rim.fillCircle(cx, cy, 3);

    if (stage >= 1) {
      this.rim.fillStyle(COLORS.nest.rimGlow, 0.7);
      this.rim.fillEllipse(cx, cy, (radii[1] + 2) * 2, (radii[1] + 2) * 2 * squash);
      this.rim.fillStyle(COLORS.nest.base, 1);
      this.rim.fillEllipse(cx, cy, (radii[1] - 1) * 2, (radii[1] - 1) * 2 * squash);
    }

    if (stage >= 2) {
      this.rim.fillStyle(COLORS.nest.rimGlow, 0.5);
      this.rim.fillEllipse(cx, cy, (radii[2] + 2) * 2, (radii[2] + 2) * 2 * squash);
      this.rim.fillStyle(COLORS.nest.shadow, 1);
      this.rim.fillEllipse(cx, cy, (radii[2] - 1) * 2, (radii[2] - 1) * 2 * squash);
    }

    if (stage >= 3) {
      const tunnelLen = 8;
      for (const angle of [0, Math.PI]) {
        const tx = cx + Math.cos(angle) * radii[3];
        const ty = cy + Math.sin(angle) * radii[3] * squash;
        const ex = cx + Math.cos(angle) * (radii[3] + tunnelLen);
        const ey = cy + Math.sin(angle) * (radii[3] + tunnelLen) * squash;
        this.rim.lineStyle(4, COLORS.nest.shadow, 1);
        this.rim.lineBetween(tx, ty, ex, ey);
        this.rim.fillStyle(COLORS.nest.hole, 1);
        this.rim.fillCircle(ex, ey, 3);
      }
      this.rim.fillStyle(COLORS.nest.rimGlow, 0.4);
      this.rim.fillEllipse(cx, cy, (radii[3] + 2) * 2, (radii[3] + 2) * 2 * squash);
      this.rim.fillStyle(COLORS.nest.shadow, 1);
      this.rim.fillEllipse(cx, cy, (radii[3] - 1) * 2, (radii[3] - 1) * 2 * squash);
    }

    this.rim.lineStyle(1, COLORS.nest.rimGlow, 0.8);
    this.rim.strokeEllipse(cx, cy, (radii[radii.length - 1] + 3) * 2, (radii[radii.length - 1] + 3) * 2 * squash);
  }

  contains(x: number, y: number, radius: number): boolean {
    return Phaser.Math.Distance.Between(x, y, this.x, this.y) <= radius;
  }
}

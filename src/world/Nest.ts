import Phaser from "phaser";
import { WIDTH, TILE } from "../config/palette";
import { WorldGrid } from "./WorldGrid";
import { TEX } from "../systems/TextureFactory";

const NEST_KEYS = [TEX.nestL1, TEX.nestL2, TEX.nestL3, TEX.nestL4];

export class Nest {
  readonly x: number;
  readonly y: number;
  private sprite: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, _grid: WorldGrid) {
    this.x = WIDTH / 2;
    this.y = TILE * 5;
    this.sprite = scene.add.image(this.x, this.y, TEX.nestL1);
    this.sprite.setDepth(this.y);
  }

  draw(stage: number): void {
    const key = NEST_KEYS[Math.min(stage, NEST_KEYS.length - 1)];
    this.sprite.setTexture(key);
  }

  contains(x: number, y: number, radius: number): boolean {
    return Phaser.Math.Distance.Between(x, y, this.x, this.y) <= radius;
  }
}

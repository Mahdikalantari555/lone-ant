import Phaser from "phaser";
import { Entity } from "./Entity";
import { TEX } from "../systems/TextureFactory";
import { WorldGrid, cellToPixel } from "../world/WorldGrid";
import { COLORS } from "../config/palette";

export class Food extends Entity {
  readonly value: number;

  constructor(scene: Phaser.Scene, x: number, y: number, value = 1) {
    super(scene, x, y, TEX.foodCrumb);
    this.value = value;
    const tints = [COLORS.food.crumbA, COLORS.food.crumbB, COLORS.food.crumbC];
    this.sprite.setTint(Phaser.Utils.Array.GetRandom(tints));
    this.sprite.setDepth(y);
  }

  static spawnCluster(scene: Phaser.Scene, grid: WorldGrid): Food[] {
    const foods: Food[] = [];
    const rng = new Phaser.Math.RandomDataGenerator([`food-${Date.now()}-${Math.random()}`]);
    const center = cellToPixel(rng.between(1, grid.cols - 2), rng.between(1, grid.rows - 4));
    const clusterSize = rng.between(2, 4);
    for (let i = 0; i < clusterSize; i++) {
      const ox = (rng.between(0, 2) - 1) * 16;
      const oy = (rng.between(0, 2) - 1) * 16;
      const x = Phaser.Math.Clamp(center.x + ox, 8, 312);
      const y = Phaser.Math.Clamp(center.y + oy, 8, 568);
      if (grid.isWalkablePixel(x, y)) {
        foods.push(new Food(scene, x, y, rng.between(1, 2)));
      }
    }
    return foods;
  }

  update(_dt: number): void {
    this.sprite.setDepth(this.y);
  }
}

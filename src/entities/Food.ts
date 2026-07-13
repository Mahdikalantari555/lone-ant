import Phaser from "phaser";
import { Entity } from "./Entity";
import { TEX } from "../systems/TextureFactory";
import { WorldGrid, cellToPixel } from "../world/WorldGrid";
import { COLORS } from "../config/palette";

export class Food extends Entity {
  readonly value: number;
  private static readonly FOOD_TYPES = [
    { tex: TEX.foodCrumb, tints: [COLORS.food.crumbA, COLORS.food.crumbB, COLORS.food.crumbC], value: 1 },
    { tex: TEX.foodSeed, tints: [COLORS.food.seedA, COLORS.food.seedB, COLORS.food.crumbC], value: 2 },
    { tex: TEX.foodBerry, tints: [COLORS.food.leafA, COLORS.food.leafB, COLORS.food.crumbC], value: 1 },
  ];

  constructor(scene: Phaser.Scene, x: number, y: number, value = 1) {
    const type = Food.FOOD_TYPES.find((t) => t.value === value) ?? Food.FOOD_TYPES[0];
    super(scene, x, y, type.tex);
    this.value = value;
    this.sprite.setTint(Phaser.Utils.Array.GetRandom(type.tints));
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

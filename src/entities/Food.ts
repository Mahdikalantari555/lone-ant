import Phaser from "phaser";
import { Entity } from "./Entity";
import { TEX } from "../systems/TextureFactory";
import { WorldGrid, cellToPixel } from "../world/WorldGrid";
import { COLORS } from "../config/palette";

const FOOD_TYPES = [
  { tex: TEX.foodCrumb, tints: [COLORS.food.crumbBase, COLORS.food.crumbShadow, COLORS.food.crumbHi], value: 1 },
  { tex: TEX.foodSeed, tints: [COLORS.food.seedBase, COLORS.food.seedShadow], value: 2 },
  { tex: TEX.foodBerry, tints: [COLORS.food.berryBase, COLORS.food.berryShadow], value: 1 },
] as const;

export class Food extends Entity {
  readonly value: number;
  readonly spriteTexture: string;

  constructor(scene: Phaser.Scene, x: number, y: number, value = 1, typeIndex?: number) {
    const type =
      typeIndex !== undefined
        ? FOOD_TYPES[typeIndex]
        : FOOD_TYPES.find((t) => t.value === value && t.tex !== TEX.foodBerry) ?? FOOD_TYPES[0];
    super(scene, x, y, type.tex);
    this.value = type.value;
    this.spriteTexture = type.tex;
    this.sprite.setTint(Phaser.Utils.Array.GetRandom([...type.tints]));
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
        const typeIndex = rng.pick([0, 0, 0, 1, 1, 2]) as number;
        foods.push(new Food(scene, x, y, FOOD_TYPES[typeIndex].value, typeIndex));
      }
    }
    return foods;
  }

  update(_dt: number): void {
    this.sprite.setDepth(this.y);
  }
}

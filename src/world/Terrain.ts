import Phaser from "phaser";
import { TILE, COLORS } from "../config/palette";
import { WorldGrid } from "./WorldGrid";
import { GROUND_TILE_KEYS } from "../systems/TextureFactory";

export class Terrain {
  constructor(scene: Phaser.Scene, private grid: WorldGrid) {
    const rng = new Phaser.Math.RandomDataGenerator(["lone-ant-terrain"]);

    for (let row = 0; row < this.grid.rows; row++) {
      for (let col = 0; col < this.grid.cols; col++) {
        const x = col * TILE + TILE / 2;
        const y = row * TILE + TILE / 2;
        const key = GROUND_TILE_KEYS[rng.between(0, GROUND_TILE_KEYS.length - 1)];
        const tile = scene.add.image(x, y, key).setDepth(0);
        if (!this.grid.isWalkable(col, row)) {
          tile.setTint(COLORS.dirt.shadow);
        }
      }
    }
  }
}

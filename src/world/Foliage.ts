import Phaser from "phaser";
import { TEX } from "../systems/TextureFactory";
import { WorldGrid } from "../world/WorldGrid";
import { COLORS, WIDTH, HEIGHT } from "../config/palette";

interface Blade {
  img: Phaser.GameObjects.Image;
  phase: number;
  baseX: number;
  baseY: number;
}

export class Foliage {
  private blades: Blade[] = [];

  constructor(scene: Phaser.Scene, grid: WorldGrid, count = 28) {
    const rng = new Phaser.Math.RandomDataGenerator(["lone-ant-foliage"]);
    let placed = 0;
    let guard = 0;
    while (placed < count && guard++ < 500) {
      const x = rng.between(12, WIDTH - 12);
      const y = rng.between(12, HEIGHT - 12);
      if (!grid.isWalkablePixel(x, y)) continue;
      const img = scene.add.image(x, y, TEX.grassTuft).setOrigin(0.5, 1);
      img.setTint(Phaser.Utils.Array.GetRandom([COLORS.grass.mid, COLORS.grass.hi, COLORS.grass.shadow]));
      img.setScale(1.0 + rng.frac() * 0.25);
      img.setDepth(y);
      this.blades.push({ img, phase: rng.frac() * Math.PI * 2, baseX: x, baseY: y });
      placed++;
    }
  }

  update(time: number): void {
    for (const b of this.blades) {
      const sway = Math.sin(time / 700 + b.phase) * 2;
      b.img.x = b.baseX + sway;
      b.img.setFlipX(sway < 0);
      b.img.setDepth(b.baseY);
    }
  }
}

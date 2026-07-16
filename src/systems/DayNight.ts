import Phaser from "phaser";
import { WIDTH, HEIGHT, COLORS, DAY_NIGHT_TINTS } from "../config/palette";
import { Nest } from "../world/Nest";
import { TEX } from "./TextureFactory";

const DAY_LENGTH_MS = 600_000;
const FIREFLY_COUNT = 16;

interface Stop {
  pos: number;
  color: number;
  alpha: number;
  label: string;
}

const STOPS: Stop[] = [
  { pos: 0.0, color: DAY_NIGHT_TINTS[0].color, alpha: DAY_NIGHT_TINTS[0].alpha, label: "DAWN" },
  { pos: 0.3, color: DAY_NIGHT_TINTS[1].color, alpha: DAY_NIGHT_TINTS[1].alpha, label: "DAY" },
  { pos: 0.55, color: DAY_NIGHT_TINTS[2].color, alpha: DAY_NIGHT_TINTS[2].alpha, label: "DUSK" },
  { pos: 0.8, color: DAY_NIGHT_TINTS[3].color, alpha: DAY_NIGHT_TINTS[3].alpha, label: "NIGHT" },
  { pos: 1.0, color: DAY_NIGHT_TINTS[0].color, alpha: DAY_NIGHT_TINTS[0].alpha, label: "DAWN" },
];

interface Firefly {
  img: Phaser.GameObjects.Image;
  baseX: number;
  baseY: number;
  phase: number;
  driftPhase: number;
  driftSpeed: number;
}

export class DayNight {
  private overlay: Phaser.GameObjects.Rectangle;
  private nestGlow: Phaser.GameObjects.Image;
  private currentLabel = "";
  private fireflies: Firefly[] = [];
  private nightFactor = 0;

  constructor(
    scene: Phaser.Scene,
    private nest: Nest,
    private onLabel: (label: string) => void,
  ) {
    this.overlay = scene.add
      .rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0xffffff, 0)
      .setDepth(1500);

    this.nestGlow = scene.add
      .image(nest.x, nest.y, TEX.dot)
      .setTint(COLORS.tint.warmLight)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setScale(6)
      .setAlpha(0)
      .setDepth(nest.y - 1);

    this.spawnFireflies(scene);
  }

  private spawnFireflies(scene: Phaser.Scene): void {
    const rng = new Phaser.Math.RandomDataGenerator(["fireflies"]);
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const nearNest = i < 6;
      const x = nearNest
        ? this.nest.x + rng.between(-70, 70)
        : rng.between(16, WIDTH - 16);
      const y = nearNest
        ? this.nest.y + rng.between(-70, 70)
        : rng.between(16, HEIGHT - 16);
      const img = scene.add
        .image(x, y, TEX.dot)
        .setTint(COLORS.tint.warmLight)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setScale(0.12 + rng.frac() * 0.12)
        .setAlpha(0)
        .setDepth(1600);
      this.fireflies.push({
        img,
        baseX: x,
        baseY: y,
        phase: rng.frac() * Math.PI * 2,
        driftPhase: rng.frac() * Math.PI * 2,
        driftSpeed: 0.3 + rng.frac() * 0.5,
      });
    }
  }

  update(time: number): void {
    const t = (time % DAY_LENGTH_MS) / DAY_LENGTH_MS;
    let a = STOPS[0];
    let b = STOPS[STOPS.length - 1];
    for (let i = 0; i < STOPS.length - 1; i++) {
      if (t >= STOPS[i].pos && t <= STOPS[i + 1].pos) {
        a = STOPS[i];
        b = STOPS[i + 1];
        break;
      }
    }
    const span = b.pos - a.pos || 1;
    const f = (t - a.pos) / span;
    const cA = Phaser.Display.Color.IntegerToColor(a.color);
    const cB = Phaser.Display.Color.IntegerToColor(b.color);
    const col = Phaser.Display.Color.Interpolate.ColorWithColor(cA, cB, 100, Math.floor(f * 100));
    const colorInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
    const alpha = Phaser.Math.Linear(a.alpha, b.alpha, f);
    this.overlay.setFillStyle(colorInt, alpha);

    this.nightFactor = Phaser.Math.Clamp((alpha - 0.1) / 0.45, 0, 1);
    this.nestGlow.setAlpha(this.nightFactor * 0.65);
    this.nestGlow.setScale(7 + Math.sin(time / 600) * 0.8);

    for (const ff of this.fireflies) {
      const flicker = Math.sin(time / 400 + ff.phase) * 0.5 + 0.5;
      ff.img.setAlpha(this.nightFactor * flicker * 0.75);
      ff.img.x = ff.baseX + Math.sin(time / 1200 + ff.driftPhase) * 10 * ff.driftSpeed;
      ff.img.y = ff.baseY + Math.cos(time / 900 + ff.driftPhase * 1.3) * 8 * ff.driftSpeed;
    }

    const label = t < 0.15 ? "DAWN" : t < 0.45 ? "DAY" : t < 0.6 ? "DUSK" : "NIGHT";
    if (label !== this.currentLabel) {
      this.currentLabel = label;
      this.onLabel(label);
    }
  }

  getNightFactor(): number {
    return this.nightFactor;
  }
}

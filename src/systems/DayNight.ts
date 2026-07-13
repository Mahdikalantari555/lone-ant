import Phaser from "phaser";
import { WIDTH, HEIGHT, COLORS, DAY_NIGHT_TINTS } from "../config/palette";
import { Nest } from "../world/Nest";
import { TEX } from "../systems/TextureFactory";

const DAY_LENGTH_MS = 600_000;

interface Stop {
  pos: number;
  color: number;
  alpha: number;
  label: string;
}

const STOPS: Stop[] = [
  { pos: 0.0, color: DAY_NIGHT_TINTS[0].color, alpha: DAY_NIGHT_TINTS[0].alpha, label: "🌅" },
  { pos: 0.3, color: DAY_NIGHT_TINTS[1].color, alpha: DAY_NIGHT_TINTS[1].alpha, label: "☀" },
  { pos: 0.55, color: DAY_NIGHT_TINTS[2].color, alpha: DAY_NIGHT_TINTS[2].alpha, label: "🌇" },
  { pos: 0.8, color: DAY_NIGHT_TINTS[3].color, alpha: DAY_NIGHT_TINTS[3].alpha, label: "🌙" },
  { pos: 1.0, color: DAY_NIGHT_TINTS[0].color, alpha: DAY_NIGHT_TINTS[0].alpha, label: "🌅" },
];

export class DayNight {
  private overlay: Phaser.GameObjects.Rectangle;
  private glow: Phaser.GameObjects.Image;
  private currentLabel = "";

  constructor(
    scene: Phaser.Scene,
    nest: Nest,
    private onLabel: (label: string) => void,
  ) {
    this.overlay = scene.add
      .rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0xffffff, 0)
      .setDepth(1500);

    this.glow = scene.add
      .image(nest.x, nest.y, TEX.dot)
      .setTint(COLORS.dayNight.nightGlow)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setScale(6)
      .setAlpha(0)
      .setDepth(nest.y - 1);
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

    const nightFactor = Phaser.Math.Clamp((alpha - 0.1) / 0.45, 0, 1);
    this.glow.setAlpha(nightFactor * 0.5);
    this.glow.setScale(6 + Math.sin(time / 600) * 0.6);

    const label = t < 0.15 ? "DAWN" : t < 0.45 ? "DAY" : t < 0.6 ? "DUSK" : "NIGHT";
    if (label !== this.currentLabel) {
      this.currentLabel = label;
      this.onLabel(label);
    }
  }
}

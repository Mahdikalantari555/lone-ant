import Phaser from "phaser";
import { WorkerAnt } from "../entities/WorkerAnt";
import { PheromoneGrid } from "./PheromoneGrid";
import { WorldGrid } from "../world/WorldGrid";
import { Nest } from "../world/Nest";
import { ColonyState } from "../state/ColonyState";
import { Food } from "../entities/Food";
import { TEX } from "./TextureFactory";
import { COLORS } from "../config/palette";

const MAX_WORKERS = 40;
const MAX_GLOW_DOTS = 200;
const DOT_DROP_INTERVAL = 0.28;
const DOT_FADE_DURATION = 30;

interface GlowDot {
  img: Phaser.GameObjects.Image;
  age: number;
  maxAge: number;
  active: boolean;
  seq: number;
}

export class WorkerManager {
  private workers: WorkerAnt[] = [];
  private glowPool: GlowDot[] = [];
  private glowGroup: Phaser.GameObjects.Group;
  private dropTimers: number[] = [];
  private dropSeq = 0;

  constructor(
    private scene: Phaser.Scene,
    private nest: Nest,
    private grid: WorldGrid,
    private pheromones: PheromoneGrid,
    private colony: ColonyState,
  ) {
    this.glowGroup = scene.add.group();
    this.preallocateDots();
  }

  private preallocateDots(): void {
    for (let i = 0; i < MAX_GLOW_DOTS; i++) {
      const img = this.scene.add
        .image(0, 0, TEX.pheromoneDot)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setAlpha(0)
        .setDepth(1)
        .setVisible(false);
      this.glowPool.push({ img, age: 0, maxAge: DOT_FADE_DURATION, active: false, seq: 0 });
      this.glowGroup.add(img);
    }
  }

  private acquireDot(x: number, y: number, maxAge: number): GlowDot | null {
    for (const dot of this.glowPool) {
      if (!dot.active) {
        dot.img.setPosition(x, y);
        dot.img.setAlpha(0.8);
        dot.img.clearTint();
        dot.img.setVisible(true);
        dot.img.setDepth(y);
        dot.age = 0;
        dot.maxAge = maxAge;
        dot.active = true;
        dot.seq = ++this.dropSeq;
        return dot;
      }
    }
    return null;
  }

  spawn(count: number): void {
    for (let i = 0; i < count && this.workers.length < MAX_WORKERS; i++) {
      const angle = Math.random() * Math.PI * 2;
      const x = this.nest.x + Math.cos(angle) * 14;
      const y = this.nest.y + Math.sin(angle) * 14;
      this.workers.push(new WorkerAnt(this.scene, x, y));
      this.dropTimers.push(0);
    }
  }

  private reconcile(): void {
    const target = Math.min(this.colony.workerCount, MAX_WORKERS);
    if (this.workers.length < target) {
      this.spawn(target - this.workers.length);
    } else if (this.workers.length > target) {
      const extra = this.workers.length - target;
      for (let i = 0; i < extra; i++) {
        this.workers.pop()?.destroy();
        this.dropTimers.pop();
      }
    }
  }

  getWorkers(): WorkerAnt[] {
    return this.workers;
  }

  removeWorker(worker: WorkerAnt): void {
    const i = this.workers.indexOf(worker);
    if (i >= 0) {
      this.workers.splice(i, 1);
      this.dropTimers.splice(i, 1);
      worker.destroy();
    }
  }

  update(dt: number, foods: Food[], nightFactor = 0): void {
    this.pheromones.decay(dt);
    this.reconcile();

    const ctx = {
      pheromones: this.pheromones,
      nest: this.nest,
      grid: this.grid,
      foods,
    };

    for (let i = 0; i < this.workers.length; i++) {
      const w = this.workers[i];
      w.update(dt, ctx);

      if (w.mode === "seeking" || w.mode === "returning") {
        this.dropTimers[i] = (this.dropTimers[i] || 0) + dt;
        if (this.dropTimers[i] >= DOT_DROP_INTERVAL) {
          this.dropTimers[i] = 0;
          const age = DOT_FADE_DURATION * (0.7 + Math.random() * 0.6);
          this.acquireDot(w.x, w.y, age);
        }
      }

      if (w.pendingDeposit !== null) {
        this.colony.addFood(w.pendingDeposit);
        w.pendingDeposit = null;
      }
    }

    this.updateGlowDots(dt, nightFactor);
  }

  private updateGlowDots(dt: number, nightFactor: number): void {
    // Newest drops get a warm bloom at night (matches ref night trail)
    const warmCutoff = this.dropSeq - 8;

    for (const dot of this.glowPool) {
      if (!dot.active) continue;
      dot.age += dt;
      const t = dot.age / dot.maxAge;
      if (t >= 1) {
        dot.active = false;
        dot.img.setVisible(false);
        dot.img.setAlpha(0);
        dot.img.clearTint();
        continue;
      }

      const baseAlpha = 0.85 * (1 - t);
      const breathe = Math.sin(dot.age * 1.5) * 0.08;
      let alpha = Math.max(0, baseAlpha + breathe);

      const isRecent = dot.seq > warmCutoff && t < 0.35;
      if (nightFactor > 0.15 && isRecent) {
        const warm = nightFactor * (1 - t / 0.35);
        alpha = Math.min(1, alpha + warm * 0.25);
        // Blend cyan toward warmLight via tint
        const mix = warm * 0.55;
        const warmCol = Phaser.Display.Color.IntegerToColor(COLORS.tint.warmLight);
        const coreCol = Phaser.Display.Color.IntegerToColor(COLORS.pheromone.core);
        const r = Math.floor(coreCol.red * (1 - mix) + warmCol.red * mix);
        const g = Math.floor(coreCol.green * (1 - mix) + warmCol.green * mix);
        const b = Math.floor(coreCol.blue * (1 - mix) + warmCol.blue * mix);
        dot.img.setTint(Phaser.Display.Color.GetColor(r, g, b));
      } else {
        dot.img.clearTint();
      }

      dot.img.setAlpha(alpha);
      dot.img.setDepth(dot.img.y);
    }
  }

  getActiveDots(): GlowDot[] {
    return this.glowPool.filter((d) => d.active);
  }
}

import Phaser from "phaser";
import { WorkerAnt } from "../entities/WorkerAnt";
import { PheromoneGrid } from "./PheromoneGrid";
import { WorldGrid } from "../world/WorldGrid";
import { Nest } from "../world/Nest";
import { ColonyState } from "../state/ColonyState";
import { Food } from "../entities/Food";
import { COLORS } from "../config/palette";

const MAX_WORKERS = 40;

export class WorkerManager {
  private workers: WorkerAnt[] = [];
  private trailGfx: Phaser.GameObjects.Graphics;

  constructor(
    private scene: Phaser.Scene,
    private nest: Nest,
    private grid: WorldGrid,
    private pheromones: PheromoneGrid,
    private colony: ColonyState,
  ) {
    this.trailGfx = scene.add.graphics();
    this.trailGfx.setBlendMode(Phaser.BlendModes.ADD);
    this.trailGfx.setDepth(1);
  }

  spawn(count: number): void {
    for (let i = 0; i < count && this.workers.length < MAX_WORKERS; i++) {
      const angle = Math.random() * Math.PI * 2;
      const x = this.nest.x + Math.cos(angle) * 14;
      const y = this.nest.y + Math.sin(angle) * 14;
      this.workers.push(new WorkerAnt(this.scene, x, y));
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
      worker.destroy();
    }
  }
  update(dt: number, foods: Food[]): void {
    this.pheromones.decay(dt);
    this.reconcile();

    const ctx = {
      pheromones: this.pheromones,
      nest: this.nest,
      grid: this.grid,
      foods,
    };

    for (const w of this.workers) {
      w.update(dt, ctx);
      if (w.pendingDeposit !== null) {
        this.colony.addFood(w.pendingDeposit);
        w.pendingDeposit = null;
      }
    }

    this.renderTrails();
  }

  private renderTrails(): void {
    const g = this.trailGfx;
    g.clear();
    this.pheromones.forEachCell((x, y, toFood, toNest) => {
      if (toFood > 0.02) {
        const size = 2 + toFood * 3;
        const alpha = Math.min(0.7, toFood * 0.7);
        g.fillStyle(COLORS.pheromone.core, alpha);
        g.fillTriangle(x, y - size, x - size, y, x, y + size);
        g.fillTriangle(x, y - size, x + size, y, x, y + size);
        g.fillStyle(COLORS.pheromone.mid, alpha * 0.6);
        const inner = size * 0.5;
        g.fillTriangle(x, y - inner, x - inner, y, x, y + inner);
        g.fillTriangle(x, y - inner, x + inner, y, x, y + inner);
      }
      if (toNest > 0.02) {
        const size = 2 + toNest * 3;
        const alpha = Math.min(0.6, toNest * 0.6);
        g.fillStyle(COLORS.pheromone.fade, alpha);
        g.fillTriangle(x, y - size, x - size, y, x, y + size);
        g.fillTriangle(x, y - size, x + size, y, x, y + size);
        g.fillStyle(COLORS.pheromone.mid, alpha * 0.5);
        const inner = size * 0.5;
        g.fillTriangle(x, y - inner, x - inner, y, x, y + inner);
        g.fillTriangle(x, y - inner, x + inner, y, x, y + inner);
      }
    });
  }
}

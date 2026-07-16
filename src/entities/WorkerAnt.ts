import Phaser from "phaser";
import { Entity } from "./Entity";
import { TEX } from "../systems/TextureFactory";
import { PheromoneGrid } from "../systems/PheromoneGrid";
import { WorldGrid } from "../world/WorldGrid";
import { Nest } from "../world/Nest";
import { WIDTH, HEIGHT } from "../config/palette";
import { Food } from "./Food";
import { CollisionSystem } from "../systems/CollisionSystem";

export type WorkerState = "seeking" | "returning";

export interface WorkerContext {
  pheromones: PheromoneGrid;
  nest: Nest;
  grid: WorldGrid;
  foods: Food[];
}

const WALK_KEYS = [
  TEX.workerAntWalk1,
  TEX.workerAntWalk2,
  TEX.workerAntWalk3,
  TEX.workerAntWalk4,
] as const;

export class WorkerAnt extends Entity {
  mode: WorkerState = "seeking";
  carrying = false;
  carryingValue = 0;
  pendingDeposit: number | null = null;
  private wanderX: number;
  private wanderY: number;
  private retargetT = 0;
  private carriedDot?: Phaser.GameObjects.Image;
  private walkFrame = 0;
  private walkTimer = 0;
  private lastX: number;
  private lastY: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEX.workerAnt);
    this.sprite.setScale(0.9);
    this.wanderX = x;
    this.wanderY = y;
    this.lastX = x;
    this.lastY = y;
  }

  pickUp(food: Food): void {
    this.carrying = true;
    this.carryingValue = food.value;
    this.mode = "returning";
    if (!this.carriedDot) {
      this.carriedDot = this.scene.add
        .image(this.x, this.y - 8, food.spriteTexture)
        .setScale(0.85)
        .setDepth(this.y + 1);
    }
  }

  deposit(): number {
    const v = this.carryingValue;
    this.carrying = false;
    this.carryingValue = 0;
    this.mode = "seeking";
    this.carriedDot?.destroy();
    this.carriedDot = undefined;
    return v;
  }

  update(dt: number, ctx?: unknown): void {
    if (!ctx) return;
    const c = ctx as WorkerContext;
    this.retargetT -= dt;
    const layer = this.mode === "seeking" ? "toFood" : "toNest";
    const targetX = this.mode === "returning" ? c.nest.x : this.wanderX;
    const targetY = this.mode === "returning" ? c.nest.y : this.wanderY;

    const grad = c.pheromones.gradient(layer, this.x, this.y);
    const dx = targetX - this.x + grad.dx * 10;
    const dy = targetY - this.y + grad.dy * 10;
    const dist = Math.hypot(dx, dy) || 1;
    const step = this.speed * dt;
    let nx = this.x + (dx / dist) * step;
    let ny = this.y + (dy / dist) * step;

    if (!c.grid.isWalkablePixel(nx, ny)) {
      nx = Phaser.Math.Clamp(this.x + (Math.random() - 0.5) * 8, 8, WIDTH - 8);
      ny = Phaser.Math.Clamp(this.y + (Math.random() - 0.5) * 8, 8, HEIGHT - 8);
      this.retargetT = 0;
    }
    this.sprite.setPosition(nx, ny);
    this.sprite.setFlipX(dx < 0);

    const moved = Math.hypot(this.x - this.lastX, this.y - this.lastY);
    this.lastX = this.x;
    this.lastY = this.y;
    if (moved > 0.2) this.updateWalkAnimation(dt);
    else this.sprite.setTexture(TEX.workerAnt);

    c.pheromones.deposit(layer, this.x, this.y, 0.06);

    if (this.mode === "seeking") {
      if (this.retargetT <= 0 || Phaser.Math.Distance.Between(this.x, this.y, this.wanderX, this.wanderY) < 6) {
        this.retargetT = Phaser.Math.Between(8, 16) / 10;
        let cx = this.x;
        let cy = this.y;
        for (let i = 0; i < 8; i++) {
          const tx = Phaser.Math.Clamp(this.x + Phaser.Math.Between(-40, 40), 8, WIDTH - 8);
          const ty = Phaser.Math.Clamp(this.y + Phaser.Math.Between(-40, 40), 8, HEIGHT - 8);
          if (c.grid.isWalkablePixel(tx, ty)) {
            cx = tx;
            cy = ty;
            break;
          }
        }
        this.wanderX = cx;
        this.wanderY = cy;
      }
      if (!this.carrying) {
        for (let i = 0; i < c.foods.length; i++) {
          const food = c.foods[i];
          if (CollisionSystem.overlapPoint(this, food.x, food.y, 8)) {
            c.foods.splice(i, 1);
            this.pickUp(food);
            break;
          }
        }
      }
    } else if (Phaser.Math.Distance.Between(this.x, this.y, c.nest.x, c.nest.y) < 12) {
      this.pendingDeposit = this.deposit();
    }

    if (this.carriedDot) this.carriedDot.setPosition(this.x, this.y - 8).setDepth(this.y + 1);
    this.sprite.setDepth(this.y);
  }

  private updateWalkAnimation(dt: number): void {
    this.walkTimer += dt;
    if (this.walkTimer >= 0.12) {
      this.walkTimer = 0;
      this.walkFrame = (this.walkFrame + 1) % WALK_KEYS.length;
      this.sprite.setTexture(WALK_KEYS[this.walkFrame]);
    }
  }

  destroy(): void {
    this.carriedDot?.destroy();
    super.destroy();
  }
}

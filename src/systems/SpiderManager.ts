import Phaser from "phaser";
import { Spider } from "../entities/Spider";
import { PlayerAnt } from "../entities/PlayerAnt";
import { WorkerAnt } from "../entities/WorkerAnt";
import { WorkerManager } from "./WorkerManager";
import { Food } from "../entities/Food";
import { SPIDER_AREA_LEFT, SPIDER_AREA_RIGHT, SPIDER_AREA_TOP, SPIDER_AREA_BOTTOM } from "../config/palette";
import { Nest } from "../world/Nest";
import { colony } from "../state/ColonyState";

export interface SpiderWorld {
  player: PlayerAnt;
  workers: WorkerManager;
  foods: Food[];
  nest: Nest;
  onPlayerCaught: () => void;
}

const DETECT_RANGE = 72;
const HIT_RANGE = 11;

export class SpiderManager {
  private spiders: Spider[] = [];
  private targetRing: Phaser.GameObjects.Graphics;

  constructor(private scene: Phaser.Scene, count: number, private world: SpiderWorld) {
    this.targetRing = scene.add.graphics();
    this.targetRing.setDepth(3000);
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(SPIDER_AREA_LEFT, SPIDER_AREA_RIGHT);
      const y = Phaser.Math.Between(SPIDER_AREA_TOP, SPIDER_AREA_BOTTOM);
      this.spiders.push(new Spider(scene, x, y));
    }
  }

  update(dt: number): void {
    this.targetRing.clear();
    const player = this.world.player;
    const workers = this.world.workers.getWorkers();

    for (const spider of this.spiders) {
      spider.update(dt);

      if (spider.mode === "roam") {
        const target = this.nearestAnt(spider, player, workers);
        if (target && Phaser.Math.Distance.Between(spider.x, spider.y, target.x, target.y) < DETECT_RANGE) {
          spider.telegraph(target.x, target.y);
        }
      }

      if (spider.mode === "telegraph" || spider.mode === "lunge") {
        const pulse = 0.3 + 0.3 * Math.abs(Math.sin(Date.now() / 150));
        this.targetRing.lineStyle(1, 0xff3b3b, pulse);
        this.targetRing.strokeCircle(spider.targetX, spider.targetY, 8 + pulse * 4);
        this.targetRing.lineStyle(1, 0xff3b3b, pulse * 0.6);
        this.targetRing.strokeCircle(spider.targetX, spider.targetY, 14 + pulse * 6);
        this.targetRing.lineStyle(1, 0xff3b3b, pulse * 0.3);
        this.targetRing.strokeCircle(spider.targetX, spider.targetY, 20 + pulse * 8);
      }

      if (spider.mode === "lunge" || spider.mode === "telegraph") {
        if (player.state !== "respawning") {
          const d = Phaser.Math.Distance.Between(spider.x, spider.y, player.x, player.y);
          if (d < HIT_RANGE) {
            this.world.onPlayerCaught();
            colony.removeFood(5);
            spider.recover();
            continue;
          }
        }
        for (let i = workers.length - 1; i >= 0; i--) {
          const w = workers[i];
          const d = Phaser.Math.Distance.Between(spider.x, spider.y, w.x, w.y);
          if (d < HIT_RANGE) {
            if (w.carrying) {
              this.world.foods.push(new Food(this.scene, w.x, w.y, w.carryingValue));
            }
            this.world.workers.removeWorker(w);
            colony.removeFood(5);
            spider.recover();
            break;
          }
        }
      }
    }
  }

  private nearestAnt(
    spider: Spider,
    player: PlayerAnt,
    workers: WorkerAnt[],
  ): { x: number; y: number } | null {
    let best: { x: number; y: number } | null = null;
    let bestD = Infinity;
    if (player.state !== "respawning") {
      const d = Phaser.Math.Distance.Between(spider.x, spider.y, player.x, player.y);
      if (d < bestD) {
        bestD = d;
        best = { x: player.x, y: player.y };
      }
    }
    for (const w of workers) {
      const d = Phaser.Math.Distance.Between(spider.x, spider.y, w.x, w.y);
      if (d < bestD) {
        bestD = d;
        best = { x: w.x, y: w.y };
      }
    }
    return best;
  }
}

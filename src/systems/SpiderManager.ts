import Phaser from "phaser";
import { Spider } from "../entities/Spider";
import { PlayerAnt } from "../entities/PlayerAnt";
import { WorkerAnt } from "../entities/WorkerAnt";
import { WorkerManager } from "./WorkerManager";
import { Food } from "../entities/Food";
import { Nest } from "../world/Nest";
import { WIDTH, HEIGHT } from "../config/palette";

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

  constructor(private scene: Phaser.Scene, count: number, private world: SpiderWorld) {
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(20, WIDTH - 20);
      const y = Phaser.Math.Between(20, HEIGHT - 120);
      this.spiders.push(new Spider(scene, x, y));
    }
  }

  update(dt: number): void {
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

      if (spider.mode === "lunge" || spider.mode === "telegraph") {
        if (player.state !== "respawning") {
          const d = Phaser.Math.Distance.Between(spider.x, spider.y, player.x, player.y);
          if (d < HIT_RANGE) {
            this.world.onPlayerCaught();
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

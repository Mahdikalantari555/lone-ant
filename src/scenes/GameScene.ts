import Phaser from "phaser";
import { TILE, COLORS, SPIDER_COUNT } from "../config/palette";
import { WorldGrid } from "../world/WorldGrid";
import { Terrain } from "../world/Terrain";
import { Foliage } from "../world/Foliage";
import { Nest } from "../world/Nest";
import { Pathfinding } from "../systems/Pathfinding";
import { InputController } from "../systems/InputController";
import { CollisionSystem } from "../systems/CollisionSystem";
import { PheromoneGrid } from "../systems/PheromoneGrid";
import { WorkerManager } from "../systems/WorkerManager";
import { SpiderManager } from "../systems/SpiderManager";
import { DayNight } from "../systems/DayNight";
import { PlayerAnt } from "../entities/PlayerAnt";
import { Food } from "../entities/Food";
import { colony } from "../state/ColonyState";
import { SaveStore } from "../state/SaveStore";
import { Hud } from "../ui/Hud";
import { TEX } from "../systems/TextureFactory";

export class GameScene extends Phaser.Scene {
  private grid!: WorldGrid;
  private nest!: Nest;
  private pathfinder!: Pathfinding;
  private inputCtl!: InputController;
  private player!: PlayerAnt;
  private foods: Food[] = [];
  private carriedValue = 0;
  private pheromones!: PheromoneGrid;
  private workers!: WorkerManager;
  private spiders!: SpiderManager;
  private foliage!: Foliage;
  private dayNight!: DayNight;
  private foodRespawnTimer = 0;

  constructor() {
    super("Game");
  }

  create(): void {
    this.grid = new WorldGrid();
    this.nest = new Nest(this, this.grid);
    this.pathfinder = new Pathfinding(this.grid);
    this.pheromones = new PheromoneGrid(this.grid);

    SaveStore.load();

    new Terrain(this, this.grid);
    this.foliage = new Foliage(this, this.grid);

    this.player = new PlayerAnt(this, this.nest.x, this.nest.y + 20);
    this.spawnFood();

    colony.bootstrap();
    this.nest.draw(colony.nestStage);
    this.workers = new WorkerManager(this, this.nest, this.grid, this.pheromones, colony);
    const hud = new Hud(this, colony);
    this.dayNight = new DayNight(this, this.nest, (label) => hud.setDayLabel(label));

    colony.on("nest-stage-changed", (stage: number) => this.nest.draw(stage));

    this.spiders = new SpiderManager(this, SPIDER_COUNT, {
      player: this.player,
      workers: this.workers,
      foods: this.foods,
      nest: this.nest,
      onPlayerCaught: () => this.respawnPlayer(),
    });

    this.inputCtl = new InputController(this);
    this.inputCtl.onTap((req) => {
      this.spawnTapMarker(req.x, req.y);
      if (this.player.state === "respawning") return;
      const path = this.pathfinder.findPath(this.player.x, this.player.y, req.x, req.y);
      if (path.length > 0) this.player.requestPath(path);
    });

    this.input.keyboard?.on("keydown-R", () => this.respawnPlayer());
  }

  update(time: number, delta: number): void {
    const dt = delta / 1000;
    this.player.update(dt);
    this.foods.forEach((f) => f.update(dt));
    this.dayNight.update(time);
    this.workers.update(dt, this.foods, this.dayNight.getNightFactor());
    this.spiders.update(dt);
    this.foliage.update(time);

    this.foodRespawnTimer += dt;
    if (this.foodRespawnTimer >= 15 && this.foods.length < 8) {
      this.foods.push(...Food.spawnCluster(this, this.grid));
      this.foodRespawnTimer = 0;
    }

    if (!this.player.carrying) {
      this.tryPickup();
    } else if (this.nest.contains(this.player.x, this.player.y, TILE * 0.9)) {
      this.deposit();
    }
  }

  private spawnTapMarker(x: number, y: number): void {
    const rings = [6, 10, 14];
    const alphas = [0.9, 0.55, 0.35];
    const colors = [COLORS.pheromone.core, COLORS.pheromone.mid, COLORS.pheromone.deep];
    for (let i = 0; i < rings.length; i++) {
      const ring = this.add
        .image(x, y, TEX.dot)
        .setTint(colors[i])
        .setBlendMode(Phaser.BlendModes.ADD)
        .setScale(rings[i] / 8)
        .setAlpha(alphas[i])
        .setDepth(50);
      this.tweens.add({
        targets: ring,
        scale: (rings[i] / 8) * 2.2,
        alpha: 0,
        duration: 380,
        ease: "Quad.Out",
        onComplete: () => ring.destroy(),
      });
    }
  }

  private tryPickup(): void {
    for (let i = 0; i < this.foods.length; i++) {
      const food = this.foods[i];
      if (CollisionSystem.overlapPoint(this.player, food.x, food.y, 10)) {
        this.carriedValue = food.value;
        food.destroy();
        this.foods.splice(i, 1);
        this.player.setCarrying(true);
        break;
      }
    }
  }

  private deposit(): void {
    colony.addFood(this.carriedValue);
    this.carriedValue = 0;
    this.player.setCarrying(false);
  }

  private respawnPlayer(): void {
    if (this.player.carrying) {
      this.foods.push(new Food(this, this.player.x, this.player.y, this.carriedValue));
      this.carriedValue = 0;
    }
    this.player.respawnAt(this.nest.x, this.nest.y + 20);
  }

  private spawnFood(): void {
    for (let i = 0; i < 4; i++) {
      this.foods.push(...Food.spawnCluster(this, this.grid));
    }
  }
}

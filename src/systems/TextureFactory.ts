import Phaser from "phaser";
import { COLORS, TILE } from "../config/palette";

export const TEX = {
  playerAnt: "tex-player-ant",
  playerAntIdle1: "tex-player-ant-idle1",
  playerAntIdle2: "tex-player-ant-idle2",
  playerAntWalk1: "tex-player-ant-walk1",
  playerAntWalk2: "tex-player-ant-walk2",
  playerAntWalk3: "tex-player-ant-walk3",
  playerAntWalk4: "tex-player-ant-walk4",
  workerAnt: "tex-worker-ant",
  workerAntIdle1: "tex-worker-ant-idle1",
  workerAntIdle2: "tex-worker-ant-idle2",
  workerAntWalk1: "tex-worker-ant-walk1",
  workerAntWalk2: "tex-worker-ant-walk2",
  workerAntWalk3: "tex-worker-ant-walk3",
  workerAntWalk4: "tex-worker-ant-walk4",
  foodCrumb: "tex-food-crumb",
  foodSeed: "tex-food-seed",
  foodBerry: "tex-food-berry",
  spider: "tex-spider",
  spiderAlert: "tex-spider-alert",
  dot: "tex-dot",
  pheromoneDot: "tex-pheromone-dot",
  grassTuft: "tex-grass-tuft",
  nestL1: "tex-nest-l1",
  nestL2: "tex-nest-l2",
  nestL3: "tex-nest-l3",
  nestL4: "tex-nest-l4",
  groundTile1: "tex-ground-1",
  groundTile2: "tex-ground-2",
  groundTile3: "tex-ground-3",
  groundTile4: "tex-ground-4",
  groundTile5: "tex-ground-5",
  groundTile6: "tex-ground-6",
} as const;

export const GROUND_TILE_KEYS = [
  TEX.groundTile1, TEX.groundTile2, TEX.groundTile3,
  TEX.groundTile4, TEX.groundTile5, TEX.groundTile6,
] as const;

export function generateTextures(scene: Phaser.Scene): void {
  generateAntTextures(scene);
  generateFoodTextures(scene);
  generateSpiderTextures(scene);
  generateGrassTuft(scene);
  generateGroundTiles(scene);
  generateNestTextures(scene);
  generatePheromoneDot(scene);
  generateDot(scene);
}

/* ─── Ant (16×16) ─────────────────────────────────────────────────── */

function generateAntTextures(scene: Phaser.Scene): void {
  generateAntFrame(scene, TEX.playerAnt, COLORS.playerAnt, true, 0);
  generateAntFrame(scene, TEX.playerAntIdle1, COLORS.playerAnt, true, 0);
  generateAntFrame(scene, TEX.playerAntIdle2, COLORS.playerAnt, true, 1);
  for (let i = 0; i < 4; i++) {
    generateAntFrame(scene, `tex-player-ant-walk${i + 1}`, COLORS.playerAnt, true, i);
  }

  generateAntFrame(scene, TEX.workerAnt, COLORS.workerAnt, false, 0);
  generateAntFrame(scene, TEX.workerAntIdle1, COLORS.workerAnt, false, 0);
  generateAntFrame(scene, TEX.workerAntIdle2, COLORS.workerAnt, false, 1);
  for (let i = 0; i < 4; i++) {
    generateAntFrame(scene, `tex-worker-ant-walk${i + 1}`, COLORS.workerAnt, false, i);
  }
}

function generateAntFrame(
  scene: Phaser.Scene,
  key: string,
  pal: { body: number; shadow: number; hi: number },
  isPlayer: boolean,
  frame: number,
): void {
  const s = 16;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  const antFrame = frame % 4;
  const idleFrame = frame % 2;
  const legOff = antFrame < 2 ? 0 : 1;

  // Antennae
  const antennaTipLY = idleFrame === 1 ? 1 : 0;
  const antennaTipRY = idleFrame === 1 ? 0 : 1;
  g.lineStyle(1, pal.hi, 1);
  g.lineBetween(6, 3, 4, antennaTipLY);
  g.lineBetween(9, 3, 11, antennaTipRY);

  // Head
  g.fillStyle(pal.body, 1);
  g.fillEllipse(8, 4, 4, 4);

  // Thorax
  g.fillEllipse(7.5, 8, 5, 4);

  // Abdomen base
  g.fillEllipse(8, 12, 8, 6);

  // Abdomen shadow
  g.fillStyle(pal.shadow, 1);
  g.fillEllipse(8, 13.5, 8, 3);

  // Abdomen sheen
  g.fillStyle(pal.hi, 1);
  g.fillEllipse(8, 10, 4, 2);

  // Legs — 3 pairs, width 1
  g.lineStyle(1, pal.shadow, 1);
  // Left legs
  g.lineBetween(5, 7, 2, 6 - legOff);
  g.lineBetween(5, 8, 2, 8);
  g.lineBetween(5, 9, 2, 10 + legOff);
  // Right legs (mirror)
  g.lineBetween(10, 7, 13, 6 - legOff);
  g.lineBetween(10, 8, 13, 8);
  g.lineBetween(10, 9, 13, 10 + legOff);

  // Player-only "this is you" pixel
  if (isPlayer) {
    g.fillStyle(pal.hi, 0.9);
    g.fillRect(8, 0, 1, 1);
  }

  g.generateTexture(key, s, s);
  g.destroy();
}

/* ─── Food (8×8) ──────────────────────────────────────────────────── */

function generateFoodTextures(scene: Phaser.Scene): void {
  // Crumb
  (() => {
    const s = 8;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(COLORS.food.crumbBase, 1);
    g.fillRect(1, 2, 5, 4);
    g.fillStyle(COLORS.food.crumbShadow, 1);
    g.fillRect(3, 5, 4, 2);
    g.fillStyle(COLORS.food.crumbHi, 1);
    g.fillRect(2, 2, 1, 1);
    g.fillRect(2, 3, 1, 1);
    g.generateTexture(TEX.foodCrumb, s, s);
    g.destroy();
  })();

  // Seed
  (() => {
    const s = 8;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(COLORS.food.seedBase, 1);
    g.fillEllipse(3.5, 3.5, 3, 5);
    g.fillStyle(COLORS.food.seedShadow, 1);
    g.fillEllipse(4, 5, 2, 2);
    g.generateTexture(TEX.foodSeed, s, s);
    g.destroy();
  })();

  // Berry
  (() => {
    const s = 8;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(COLORS.food.berryBase, 1);
    g.fillEllipse(3, 3, 4, 4);
    g.fillEllipse(5.5, 5, 3, 4);
    g.fillStyle(COLORS.food.berryShadow, 1);
    g.fillEllipse(5.5, 6, 3, 2);
    g.generateTexture(TEX.foodBerry, s, s);
    g.destroy();
  })();
}

/* ─── Spider (24×24) ──────────────────────────────────────────────── */

function generateSpiderTextures(scene: Phaser.Scene): void {
  generateSpiderFrame(scene, TEX.spider, false);
  generateSpiderFrame(scene, TEX.spiderAlert, true);
}

function generateSpiderFrame(scene: Phaser.Scene, key: string, alert: boolean): void {
  const s = 24;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  // Legs — drawn BEFORE body, 4 pairs
  g.lineStyle(1, COLORS.spider.body, 1);
  const legYs = [9, 12, 15, 18];
  for (let i = 0; i < 4; i++) {
    const y = legYs[i];
    const bend = 3 - (i % 2);
    // Left leg
    g.lineBetween(7, y, 3, y - bend);
    g.lineBetween(3, y - bend, 0, y - bend - 2);
    // Right leg
    g.lineBetween(17, y, 21, y - bend);
    g.lineBetween(21, y - bend, 24, y - bend - 2);
  }

  // Abdomen
  g.fillStyle(COLORS.spider.body, 1);
  g.fillEllipse(12, 16.5, 12, 11);

  // Abdomen sheen
  g.fillStyle(COLORS.spider.hi, 1);
  g.fillEllipse(10, 14, 6, 4);

  // Cephalothorax
  g.fillStyle(COLORS.spider.body, 1);
  g.fillEllipse(12, 8.5, 8, 7);

  // Eyes
  const eyeAlpha = alert ? 1.0 : 0.67;
  g.fillStyle(COLORS.spider.eye, eyeAlpha);
  g.fillRect(10, 7, 1, 1);
  g.fillRect(13, 7, 1, 1);

  // Alert ring — strobed ellipse around eyes
  if (alert) {
    g.lineStyle(1, COLORS.spider.eye, 0.35);
    g.strokeEllipse(11.5, 7, 6, 3);
  }

  g.generateTexture(key, s, s);
  g.destroy();
}

/* ─── Grass Tuft (8×8) ────────────────────────────────────────────── */

function generateGrassTuft(scene: Phaser.Scene): void {
  const s = 8;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  const rng = new Phaser.Math.RandomDataGenerator(["grass-tuft"]);

  const colors = [COLORS.grass.shadow, COLORS.grass.mid, COLORS.grass.hi];

  for (let i = 0; i < 3; i++) {
    const dx = rng.between(-2, 2);
    const h = rng.between(4, 6);
    const jitter = rng.between(-1, 1);
    const color = rng.pick(colors);
    g.lineStyle(1, color, 1);
    g.lineBetween(4 + dx, 7, 4 + dx + jitter, 7 - h);
  }

  g.generateTexture(TEX.grassTuft, s, s);
  g.destroy();
}

/* ─── Ground Tiles (16×16, 6 variants) ────────────────────────────── */

function generateGroundTiles(scene: Phaser.Scene): void {
  for (let v = 0; v < 6; v++) {
    const s = TILE;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    const rng = new Phaser.Math.RandomDataGenerator([`ground-tile-${v}`]);

    // Base fill
    g.fillStyle(COLORS.dirt.base, 1);
    g.fillRect(0, 0, s, s);

    // Scatter ~10 random pixels
    for (let i = 0; i < 10; i++) {
      const px = rng.between(0, s - 1);
      const py = rng.between(0, s - 1);
      const shade = rng.pick([COLORS.dirt.shadow, COLORS.dirt.mid, COLORS.dirt.hi]);
      g.fillStyle(shade, 1);
      g.fillRect(px, py, 1, 1);
    }

    // ~30% chance of one accent pixel
    if (rng.frac() < 0.3) {
      g.fillStyle(COLORS.dirt.accent, 1);
      g.fillRect(rng.between(1, s - 2), rng.between(1, s - 2), 1, 1);
    }

    g.generateTexture(GROUND_TILE_KEYS[v], s, s);
    g.destroy();
  }
}

/* ─── Nest Mound (128×128, 4 stages) ─────────────────────────────── */

function generateNestTextures(scene: Phaser.Scene): void {
  const stages = [
    { key: TEX.nestL1, outer: 18 },
    { key: TEX.nestL2, outer: 26 },
    { key: TEX.nestL3, outer: 34 },
    { key: TEX.nestL4, outer: 44 },
  ];

  for (const { key, outer } of stages) {
    const s = 128;
    const cx = 64;
    const cy = 64;
    const squash = 0.72;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);

    // 1. Ground shadow footprint
    g.fillStyle(COLORS.dirt.shadow, 1);
    g.fillEllipse(cx, cy, (outer + 6) * 2, (outer + 6) * 2 * squash);

    // 2. Ring: outer
    g.fillStyle(COLORS.nest.shadow, 1);
    g.fillEllipse(cx, cy, outer * 2, outer * 2 * squash);

    // 3. Ring: 0.78
    g.fillStyle(COLORS.nest.base, 1);
    g.fillEllipse(cx, cy, outer * 0.78 * 2, outer * 0.78 * 2 * squash);

    // 4. Ring: 0.55
    g.fillStyle(COLORS.nest.hi, 1);
    g.fillEllipse(cx, cy, outer * 0.55 * 2, outer * 0.55 * 2 * squash);

    // 5. Extra ring at level >= 3
    if (outer >= 34) {
      g.fillStyle(COLORS.nest.base, 1);
      g.fillEllipse(cx, cy, outer * 0.4 * 2, outer * 0.4 * 2 * squash);
    }

    // 6. Entrance rim
    g.fillStyle(COLORS.nest.rim, 1);
    g.fillEllipse(cx, cy, outer * 0.22 * 2, outer * 0.22 * 2 * squash);

    // 7. Entrance hole
    g.fillStyle(COLORS.nest.hole, 1);
    g.fillEllipse(cx, cy, outer * 0.16 * 2, outer * 0.16 * 2 * squash);

    // 8. Extra tunnel mouths at level >= 3
    if (outer >= 34) {
      const tunnelCount = outer >= 44 ? 2 : 1;
      const angles = [0.4, -0.5];
      for (let t = 0; t < tunnelCount; t++) {
        const angle = angles[t];
        const dist = outer * 0.6;
        const tx = cx + Math.cos(angle) * dist;
        const ty = cy + Math.sin(angle) * dist * squash;
        g.fillStyle(COLORS.nest.rim, 1);
        g.fillEllipse(tx, ty, 6, 4);
        g.fillStyle(COLORS.nest.hole, 1);
        g.fillEllipse(tx, ty, 4, 3);
      }
    }

    g.generateTexture(key, s, s);
    g.destroy();
  }
}

/* ─── Pheromone Glow Dot ──────────────────────────────────────────── */

function generatePheromoneDot(scene: Phaser.Scene): void {
  const radius = 4;
  const s = radius * 2 + 2;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  // Outer glow
  g.fillStyle(COLORS.pheromone.deep, 0.4);
  g.fillEllipse(s / 2, s / 2, s, s);

  // Inner core (60% size)
  const innerSize = s * 0.6;
  g.fillStyle(COLORS.pheromone.core, 1);
  g.fillEllipse(s / 2, s / 2, innerSize, innerSize);

  g.generateTexture(TEX.pheromoneDot, s, s);
  g.destroy();
}

/* ─── Utility Dot ─────────────────────────────────────────────────── */

function generateDot(scene: Phaser.Scene): void {
  const s = TILE;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(s / 2, s / 2, s / 2);
  g.generateTexture(TEX.dot, s, s);
  g.destroy();
}

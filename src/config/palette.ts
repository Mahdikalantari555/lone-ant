export const WIDTH = 320;
export const HEIGHT = 576;
export const TILE = 16;
export const GRID_COLS = WIDTH / TILE;
export const GRID_ROWS = HEIGHT / TILE;
export const SPIDER_COUNT = 1;

export const COLORS = {
  dirt: {
    shadow: 0x3b2a20,
    base: 0x5a3f2b,
    mid: 0x7a5738,
    hi: 0x9c7748,
    accent: 0xc9a15f,
  },
  grass: {
    shadow: 0x2e4423,
    mid: 0x557a34,
    hi: 0x8bab4c,
  },
  nest: {
    shadow: 0x4a2f22,
    base: 0x6b4530,
    hi: 0x8f6244,
    rim: 0xd9b076,
    hole: 0x1e140f,
  },
  playerAnt: {
    body: 0xa8432b,
    shadow: 0x5c2417,
    hi: 0xe8935f,
  },
  workerAnt: {
    body: 0x2b1d16,
    shadow: 0x140d0a,
    hi: 0x6b4a35,
  },
  food: {
    crumbBase: 0xe8c27a,
    crumbShadow: 0xc79a52,
    crumbHi: 0xfff2c2,
    seedBase: 0xb5533c,
    seedShadow: 0x7a3223,
    berryBase: 0x7fae4a,
    berryShadow: 0x4b7028,
  },
  pheromone: {
    core: 0x7cf5c4,
    mid: 0x2fbf91,
    deep: 0x0b5e4a,
  },
  spider: {
    body: 0x241b2e,
    hi: 0x4a3562,
    eye: 0xff3b3b,
  },
  tint: {
    dawn: 0xffd9a0,
    noon: 0xfff6e0,
    dusk: 0xff9d6c,
    night: 0x1a1f3d,
    warmLight: 0xffb347,
  },
  hud: {
    cream: 0xf4e9d8,
    outline: 0x241812,
  },
} as const;

export const DAY_NIGHT_TINTS = [
  { color: COLORS.tint.dawn, alpha: 0.25 },
  { color: COLORS.tint.noon, alpha: 0.1 },
  { color: COLORS.tint.dusk, alpha: 0.3 },
  { color: COLORS.tint.night, alpha: 0.55 },
] as const;

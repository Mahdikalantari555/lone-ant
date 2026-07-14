export const WIDTH = 320;
export const HEIGHT = 576;
export const TILE = 16;
export const GRID_COLS = WIDTH / TILE;
export const GRID_ROWS = HEIGHT / TILE;
export const SPIDER_COUNT = 1;

export const COLORS = {
  ground: {
    shadow: 0x3b2a20,
    base: 0x5a3f2b,
    mid: 0x7a5738,
    highlight: 0x9c7748,
    sunlit: 0xc9a15f,
  },
  grass: {
    shadow: 0x2e4423,
    mid: 0x557a34,
    highlight: 0x8bab4c,
  },
  nest: {
    shadow: 0x4a2f22,
    base: 0x6b4530,
    highlight: 0x8f6244,
    rimGlow: 0xd9b076,
    hole: 0x1e140f,
  },
  playerAnt: {
    body: 0xa8432b,
    shadow: 0x5c2417,
    highlight: 0xe8935f,
  },
  workerAnt: {
    body: 0x2b1d16,
    shadow: 0x140d0a,
    highlight: 0x6b4a35,
  },
  food: {
    crumbA: 0xe8c27a,
    crumbB: 0xc79a52,
    crumbC: 0xfff2c2,
    seedA: 0xb5533c,
    seedB: 0x7a3223,
    leafA: 0x7fae4a,
    leafB: 0x4b7028,
  },
  pheromone: {
    core: 0x7cf5c4,
    mid: 0x2fbf91,
    fade: 0x0b5e4a,
  },
  spider: {
    body: 0x241b2e,
    highlight: 0x4a3562,
    warning: 0xff3b3b,
  },
  hud: {
    text: 0xf4e9d8,
    outline: 0x140d0a,
    chip: 0x6b4530,
  },
  dayNight: {
    dawn: 0xffd9a0,
    noon: 0xfff6e0,
    dusk: 0xff9d6c,
    night: 0x1a1f3d,
    nightGlow: 0xffb347,
  },
} as const;

export const DAY_NIGHT_TINTS = [
  { color: COLORS.dayNight.dawn, alpha: 0.25 },
  { color: COLORS.dayNight.noon, alpha: 0.1 },
  { color: COLORS.dayNight.dusk, alpha: 0.3 },
  { color: COLORS.dayNight.night, alpha: 0.55 },
] as const;

const fs = require('fs');
const zlib = require('zlib');

function readPNG(path) {
  const buf = fs.readFileSync(path);
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not png');
  let off = 8;
  let width, height, bitDepth, colorType;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'PLTE') {
      // store for palette colorType
    }
    off += 12 + len;
    if (type === 'IEND') break;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const channels =
    colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 0 ? 1 : colorType === 3 ? 1 : 4;
  const bpp = channels; // bitDepth 8 assumed
  const stride = width * bpp;
  const out = Buffer.alloc(height * stride);
  let pos = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[pos++];
    const line = raw.subarray(pos, pos + stride);
    pos += stride;
    const prev = y === 0 ? Buffer.alloc(stride) : out.subarray((y - 1) * stride, y * stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? out[y * stride + x - bpp] : 0;
      const b = prev[x];
      const c = x >= bpp ? prev[x - bpp] : 0;
      let v = line[x];
      if (filter === 1) v = (v + a) & 255;
      else if (filter === 2) v = (v + b) & 255;
      else if (filter === 3) v = (v + ((a + b) >> 1)) & 255;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        v = (v + pr) & 255;
      }
      out[y * stride + x] = v;
    }
  }
  return { width, height, colorType, channels, bpp, stride, data: out };
}

function px(img, x, y) {
  const i = y * img.stride + x * img.bpp;
  if (img.channels === 4) return [img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]];
  if (img.channels === 3) return [img.data[i], img.data[i + 1], img.data[i + 2], 255];
  return [img.data[i], img.data[i], img.data[i], 255];
}

function toHex([r, g, b]) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function uniqueColors(img, max) {
  const map = new Map();
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const c = px(img, x, y);
      const key = toHex(c);
      map.set(key, (map.get(key) || 0) + 1);
    }
  }
  const arr = [...map.entries()].sort((a, b) => b[1] - a[1]);
  return arr.slice(0, max);
}

function regionColors(img, cols, rows) {
  const cellW = Math.floor(img.width / cols);
  const cellH = Math.floor(img.height / rows);
  const grid = [];
  for (let ry = 0; ry < rows; ry++) {
    const row = [];
    for (let rx = 0; rx < cols; rx++) {
      let r = 0, g = 0, b = 0, n = 0;
      for (let y = ry * cellH; y < (ry + 1) * cellH; y += 2) {
        for (let x = rx * cellW; x < (rx + 1) * cellW; x += 2) {
          const c = px(img, x, y);
          r += c[0]; g += c[1]; b += c[2]; n++;
        }
      }
      row.push(toHex([Math.round(r / n), Math.round(g / n), Math.round(b / n)]));
    }
    grid.push(row);
  }
  return grid;
}

const which = process.argv[2];
const file = process.argv[3];
const img = readPNG(file);

if (which === 'palette') {
  console.log(`DIM ${img.width}x${img.height} colorType=${img.colorType}`);
  const cols = uniqueColors(img, 60);
  console.log('TOP COLORS (hex : count):');
  for (const [hex, count] of cols) console.log(`  ${hex} : ${count}`);
} else if (which === 'regions') {
  const cols = parseInt(process.argv[4] || '8', 10);
  const rows = parseInt(process.argv[5] || '12', 10);
  console.log(`REGION GRID ${cols}x${rows} of ${img.width}x${img.height}:`);
  const grid = regionColors(img, cols, rows);
  grid.forEach((row) => console.log('  ' + row.join(' ')));
} else if (which === 'info') {
  const cols = uniqueColors(img, 200);
  console.log(`DIM ${img.width}x${img.height} colorType=${img.colorType}`);
  console.log(`UNIQUE COLORS: ${cols.length}`);
  console.log('ALL COLORS:');
  for (const [hex, count] of cols) console.log(`  ${hex} : ${count}`);
}

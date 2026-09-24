import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(__dirname, "..");
const defaultSource = path.join(repo, "assets", "linklock-logo-source.png");
const defaultMarkSource = path.join(repo, "assets", "linklock-mark-source.png");
const source = process.argv[2] ? path.resolve(process.argv[2]) : defaultSource;
const markSource = fs.existsSync(defaultMarkSource) ? defaultMarkSource : source;
const logo = path.join(repo, "public", "logo.png");
const logoMark = path.join(repo, "public", "logo-mark.png");
const iconSizes = [16, 32, 48, 180, 512];

if (!fs.existsSync(source)) {
  console.error(`Source image not found: ${source}`);
  process.exit(1);
}

function isYellowMarkPixel(r, g, b, a) {
  if (a < 40) return false;
  return r > 170 && g > 120 && b < 160;
}

function isLockupBackgroundPixel(r, g, b, a) {
  if (a < 8) return true;
  if (isYellowMarkPixel(r, g, b, a)) return false;
  const sum = r + g + b;
  if (sum < 120) return false;
  if (r > 228 && g > 228 && b > 228) return false;
  if (sum > 200) return true;
  if (r > 150 && g > 140 && b > 120) return true;
  return false;
}

async function processLockup(input, output) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (isLockupBackgroundPixel(r, g, b, a)) {
      data[i + 3] = 0;
    } else {
      data[i + 3] = 255;
    }
  }

  await sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(output);
}

async function processMark(input, output) {
  const { data, info } = await sharp(input)
    .resize(256, 256, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (isYellowMarkPixel(r, g, b, a)) {
      data[i + 3] = 255;
    } else {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
  }

  await sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 2 })
    .extend({
      top: 6,
      bottom: 6,
      left: 6,
      right: 6,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(output);
}

async function makeIcon(input, output, size) {
  const pad = Math.max(2, Math.floor(size / 10));
  const inner = size - pad * 2;
  await sharp(input)
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(output);
}

await processLockup(source, logo);
await processMark(markSource, logoMark);

const pngPaths = [];
for (const size of iconSizes) {
  const out = path.join(repo, "public", `icon-${size}.png`);
  await makeIcon(logoMark, out, size);
  pngPaths.push(out);
}

const icoBuffer = await pngToIco(pngPaths.slice(0, 3));

const appDir = path.join(repo, "src", "app");
const publicDir = path.join(repo, "public");

fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoBuffer);
fs.writeFileSync(path.join(appDir, "favicon.ico"), icoBuffer);

const icon512 = pngPaths.find((p) => p.includes("icon-512"));
const icon180 = pngPaths.find((p) => p.includes("icon-180"));

if (icon512) {
  fs.copyFileSync(icon512, path.join(appDir, "icon.png"));
  fs.copyFileSync(icon512, path.join(publicDir, "icon.png"));
}
if (icon180) {
  fs.copyFileSync(icon180, path.join(appDir, "apple-icon.png"));
  fs.copyFileSync(icon180, path.join(publicDir, "apple-icon.png"));
}

for (const pngPath of pngPaths) {
  fs.unlinkSync(pngPath);
}

const lockupMeta = await sharp(logo).metadata();
const markMeta = await sharp(logoMark).metadata();

console.log(`Lockup: ${lockupMeta.width}x${lockupMeta.height} (transparent bg)`);
console.log(`Mark: ${markMeta.width}x${markMeta.height} (favicon source)`);
console.log("Favicon assets generated from 4-dot mark.");

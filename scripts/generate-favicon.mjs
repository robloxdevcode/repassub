import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import pngToIco from "png-to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(__dirname, "..");
const defaultSource = path.join(repo, "assets", "linklock-logo-source.png");
const source = process.argv[2] ? path.resolve(process.argv[2]) : defaultSource;
const logo = path.join(repo, "public", "logo.png");
const logoMark = path.join(repo, "public", "logo-mark.png");
const iconSizes = [16, 32, 48, 180, 512];

if (!fs.existsSync(source)) {
  console.error(`Source image not found: ${source}`);
  process.exit(1);
}

const psScript = `
Add-Type -AssemblyName System.Drawing

function CopyLockup($in, $out) {
  $s = [System.Drawing.Bitmap]::FromFile($in)
  $s.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $s.Dispose()
}

function IsYellowMarkPixel($c) {
  if ($c.A -lt 40) { return $false }
  return ($c.R -gt 180 -and $c.G -gt 140 -and $c.B -lt 140)
}

function ExtractDotMark($in, $out) {
  $s = [System.Drawing.Bitmap]::FromFile($in)
  $minX = $s.Width; $minY = $s.Height; $maxX = 0; $maxY = 0
  $startX = [int]($s.Width * 0.62)
  for ($y = 0; $y -lt $s.Height; $y++) {
    for ($x = $startX; $x -lt $s.Width; $x++) {
      $c = $s.GetPixel($x, $y)
      if (IsYellowMarkPixel $c) {
        if ($x -lt $minX) { $minX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
  if ($maxX -lt $minX) {
    $s.Dispose()
    throw "No yellow mark pixels found in logo source"
  }
  $pad = 8
  $minX = [Math]::Max(0, $minX - $pad)
  $minY = [Math]::Max(0, $minY - $pad)
  $maxX = [Math]::Min($s.Width - 1, $maxX + $pad)
  $maxY = [Math]::Min($s.Height - 1, $maxY + $pad)
  $cw = $maxX - $minX + 1
  $ch = $maxY - $minY + 1
  $side = [Math]::Max($cw, $ch)
  $o = New-Object System.Drawing.Bitmap $side, $side, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($o)
  $g.Clear([System.Drawing.Color]::Transparent)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $ox = [int](($side - $cw) / 2)
  $oy = [int](($side - $ch) / 2)
  $srcRect = New-Object System.Drawing.Rectangle $minX, $minY, $cw, $ch
  $dstRect = New-Object System.Drawing.Rectangle $ox, $oy, $cw, $ch
  $g.DrawImage($s, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose(); $s.Dispose()
  $o.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $o.Dispose()
}

function MakeIcon($in, $out, $size, $pad) {
  $s = [System.Drawing.Bitmap]::FromFile($in)
  $minX = $s.Width; $minY = $s.Height; $maxX = 0; $maxY = 0
  for ($y = 0; $y -lt $s.Height; $y++) {
    for ($x = 0; $x -lt $s.Width; $x++) {
      if ($s.GetPixel($x, $y).A -gt 10) {
        if ($x -lt $minX) { $minX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
  $cw = $maxX - $minX + 1
  $ch = $maxY - $minY + 1
  $o = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($o)
  $g.Clear([System.Drawing.Color]::Transparent)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $inner = $size - (2 * $pad)
  $scale = [Math]::Min($inner / $cw, $inner / $ch)
  $dw = [int]($cw * $scale)
  $dh = [int]($ch * $scale)
  $ox = [int](($size - $dw) / 2)
  $oy = [int](($size - $dh) / 2)
  $srcRect = New-Object System.Drawing.Rectangle $minX, $minY, $cw, $ch
  $dstRect = New-Object System.Drawing.Rectangle $ox, $oy, $dw, $dh
  $g.DrawImage($s, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose(); $s.Dispose()
  $o.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $o.Dispose()
}

CopyLockup '${source.replace(/\\/g, "/")}' '${logo.replace(/\\/g, "/")}'
ExtractDotMark '${source.replace(/\\/g, "/")}' '${logoMark.replace(/\\/g, "/")}'
${iconSizes
  .map(
    (size) =>
      `MakeIcon '${logoMark.replace(/\\/g, "/")}' '${path.join(repo, "public", `icon-${size}.png`).replace(/\\/g, "/")}' ${size} ${Math.max(2, Math.floor(size / 8))}`,
  )
  .join("\n")}
`;

execFileSync("powershell", ["-NoProfile", "-Command", psScript], { stdio: "inherit" });

const pngPaths = iconSizes.map((size) => path.join(repo, "public", `icon-${size}.png`));
const icoBuffer = await pngToIco(pngPaths.slice(0, 3));

const appDir = path.join(repo, "src", "app");
const publicDir = path.join(repo, "public");

fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoBuffer);
fs.writeFileSync(path.join(appDir, "favicon.ico"), icoBuffer);

const icon512 = pngPaths.find((p) => p.includes("icon-512"));
const icon180 = pngPaths.find((p) => p.includes("icon-180"));
const icon32 = pngPaths.find((p) => p.includes("icon-32"));

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

const dimensions = execFileSync(
  "powershell",
  [
    "-NoProfile",
    "-Command",
    `Add-Type -AssemblyName System.Drawing; $i=[Drawing.Bitmap]::FromFile('${logo.replace(/\\/g, "/")}'); Write-Output ($i.Width.ToString() + 'x' + $i.Height.ToString()); $i.Dispose()`,
  ],
  { encoding: "utf8" },
).trim();

const markDimensions = execFileSync(
  "powershell",
  [
    "-NoProfile",
    "-Command",
    `Add-Type -AssemblyName System.Drawing; $i=[Drawing.Bitmap]::FromFile('${logoMark.replace(/\\/g, "/")}'); Write-Output ($i.Width.ToString() + 'x' + $i.Height.ToString()); $i.Dispose()`,
  ],
  { encoding: "utf8" },
).trim();

console.log(`Lockup: ${dimensions}`);
console.log(`Mark: ${markDimensions}`);
console.log("Favicon assets generated from 4-dot mark.");

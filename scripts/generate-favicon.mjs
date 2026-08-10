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
const sizes = [16, 32, 48, 180];

if (!fs.existsSync(source)) {
  console.error(`Source image not found: ${source}`);
  process.exit(1);
}

const psScript = `
Add-Type -AssemblyName System.Drawing

function Remove-DarkBackground($in, $out) {
  $s = [System.Drawing.Bitmap]::FromFile($in)
  $outBmp = New-Object System.Drawing.Bitmap $s.Width, $s.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  for ($y = 0; $y -lt $s.Height; $y++) {
    for ($x = 0; $x -lt $s.Width; $x++) {
      $c = $s.GetPixel($x, $y)
      $sum = $c.R + $c.G + $c.B
      if ($sum -lt 35) {
        $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, $c.R, $c.G, $c.B)) | Out-Null
      } else {
        $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.R, $c.G, $c.B)) | Out-Null
      }
    }
  }
  $outBmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $s.Dispose(); $outBmp.Dispose()
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

Remove-DarkBackground '${source.replace(/\\/g, "/")}' '${logo.replace(/\\/g, "/")}'
${sizes
  .map(
    (size) =>
      `MakeIcon '${logo.replace(/\\/g, "/")}' '${path.join(repo, "public", `icon-${size}.png`).replace(/\\/g, "/")}' ${size} ${Math.max(1, Math.floor(size / 16))}`,
  )
  .join("\n")}
`;

execFileSync("powershell", ["-NoProfile", "-Command", psScript], { stdio: "inherit" });

const pngPaths = sizes.map((size) => path.join(repo, "public", `icon-${size}.png`));
const icoBuffer = await pngToIco(pngPaths.slice(0, 3));

fs.writeFileSync(path.join(repo, "public", "favicon.ico"), icoBuffer);
fs.writeFileSync(path.join(repo, "src", "app", "favicon.ico"), icoBuffer);
fs.copyFileSync(pngPaths[1], path.join(repo, "src", "app", "icon.png"));
fs.copyFileSync(pngPaths[3], path.join(repo, "src", "app", "apple-icon.png"));

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

console.log(`Logo: ${dimensions}`);
console.log("Favicon assets generated.");

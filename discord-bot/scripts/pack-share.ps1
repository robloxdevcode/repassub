param(
  [Parameter(Mandatory = $true)][string]$Root,
  [Parameter(Mandatory = $true)][string]$OutFile
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression.FileSystem

$excludeNames = @(
  "node_modules", "data", ".env",
  "deploy-log.txt", "install-log.txt",
  "linklock-discord-bot.zip", "deploy-commands.zip",
  "UPLOAD-TO-KATABUMP.zip", "MAKE-KATABUMP-ZIP.cmd", "pack-share.cmd", "pack-dist-only.cmd"
)

$staging = Join-Path $env:TEMP ("linklock-bot-pack-" + [Guid]::NewGuid().ToString("n"))
New-Item -ItemType Directory -Path $staging | Out-Null

try {
  Get-ChildItem -LiteralPath $Root -Force | ForEach-Object {
    if ($excludeNames -contains $_.Name) { return }
    if ($_.Name -like "*.db" -or $_.Name -like "*.db-journal") { return }
    Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $staging $_.Name) -Recurse -Force
  }

  $count = (Get-ChildItem -LiteralPath $staging -Recurse -File).Count
  if (-not (Test-Path (Join-Path $staging "dist\index.js"))) {
    Write-Host "ERROR: dist/index.js missing from pack. Run build.cmd on your PC first."
    exit 1
  }
  if ($count -lt 5) {
    Write-Host "ERROR: Staging folder only has $count files - pack aborted."
    exit 1
  }

  if (Test-Path $OutFile) { Remove-Item -LiteralPath $OutFile -Force }

  & (Join-Path $Root "scripts\zip-linux.ps1") -SourceDirectory $staging -ZipFile $OutFile

  $sample = [System.IO.Compression.ZipFile]::OpenRead($OutFile).Entries | Select-Object -First 3 -ExpandProperty FullName
  if ($sample -match '\\') {
    Write-Host "ERROR: ZIP still has backslashes."
    exit 1
  }

  $size = (Get-Item -LiteralPath $OutFile).Length
  if ($size -lt 1000) {
    Write-Host ('ERROR: ZIP is too small (' + $size + ' bytes).')
    exit 1
  }

  Write-Host ('Packed ' + $count + ' files, ' + $size + ' bytes.')
}
finally {
  if (Test-Path $staging) {
    Remove-Item -LiteralPath $staging -Recurse -Force -ErrorAction SilentlyContinue
  }
}

param(
  [Parameter(Mandatory = $true)][string]$SourceDirectory,
  [Parameter(Mandatory = $true)][string]$ZipFile
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceDirectory = [System.IO.Path]::GetFullPath($SourceDirectory)
if (-not (Test-Path $sourceDirectory)) {
  Write-Host "ERROR: Source not found: $sourceDirectory"
  exit 1
}

if (Test-Path $ZipFile) {
  Remove-Item -LiteralPath $ZipFile -Force
}

$zip = [System.IO.Compression.ZipFile]::Open($ZipFile, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  Get-ChildItem -LiteralPath $sourceDirectory -Recurse -File | ForEach-Object {
    $relative = $_.FullName.Substring($sourceDirectory.Length).TrimStart("\", "/")
    $entryName = $relative.Replace("\", "/")
    [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $zip,
      $_.FullName,
      $entryName,
      [System.IO.Compression.CompressionLevel]::Optimal
    )
  }
}
finally {
  $zip.Dispose()
}

if (-not (Test-Path $ZipFile)) {
  Write-Host "ERROR: ZIP was not created."
  exit 1
}

Write-Host "Created ZIP with forward-slash paths (Linux/Katabump safe): $ZipFile"

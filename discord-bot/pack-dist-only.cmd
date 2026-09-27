@echo off
title LinkLock Bot - dist folder zip for Katabump (fixed paths)
cd /d "%~dp0"

echo.
echo   Building...
call "%ProgramFiles%\nodejs\npm.cmd" run build
if errorlevel 1 (
  echo   Build failed. Run install.cmd first.
  pause
  exit /b 1
)

set "OUT=%~dp0dist-folder-for-katabump.zip"
if exist "%OUT%" del /f "%OUT%"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$staging = Join-Path $env:TEMP ('ll-dist-' + [guid]::NewGuid().ToString('n'));" ^
  "New-Item -ItemType Directory -Path (Join-Path $staging 'dist') | Out-Null;" ^
  "Copy-Item -LiteralPath '%CD%\dist\*' -Destination (Join-Path $staging 'dist') -Recurse -Force;" ^
  "& '%~dp0scripts\zip-linux.ps1' -SourceDirectory $staging -ZipFile '%OUT%'"

echo.
echo   Created: dist-folder-for-katabump.zip
echo   Unarchive on Katabump - you get a FOLDER named dist (not dist\index.js files)
echo   Prefer: use pack-share.cmd for the full bot instead
echo.
pause

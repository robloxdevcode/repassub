@echo off
title LinkLock Bot - Pack ZIP for sharing
cd /d "%~dp0"

set "OUT=%~dp0linklock-discord-bot.zip"
set "OUT2=%~dp0..\linklock-discord-bot.zip"
if exist "%OUT%" del /f "%OUT%"
if exist "%OUT2%" del /f "%OUT2%"

echo.
echo   Step 1: build bot on your PC...
call "%ProgramFiles%\nodejs\npm.cmd" run build
if errorlevel 1 (
  echo   BUILD FAILED. Install Node.js, run install.cmd first.
  pause
  exit /b 1
)

echo.
echo   Step 2: create ZIP...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\pack-share.ps1" -Root "%CD%" -OutFile "%OUT%"
if errorlevel 1 (
  echo.
  echo   FAILED. See message above.
  pause
  exit /b 1
)

copy /y "%OUT%" "%OUT2%" >nul

for %%A in ("%OUT%") do set "SIZE=%%~zA"
echo.
echo   SUCCESS
echo   File 1: %OUT%
echo   File 2: %OUT2%  (copy for easy find)
echo   Size: %SIZE% bytes
echo.
echo   Open the zip - you MUST see dist\, package.json, src\
echo   Katabump Startup: set JS FILE to dist/index.js
echo   NOT included: .env, node_modules, data
echo.
echo   Upload to Katabump, unarchive into /home/container/
echo.
pause


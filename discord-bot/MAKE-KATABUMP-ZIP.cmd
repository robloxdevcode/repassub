@echo off
title MAKE KATABUMP ZIP - double click this only
cd /d "%~dp0"

if not exist "%~dp0package.json" (
  echo.
  echo   WRONG PLACE.
  echo   Do NOT open the zip and run this.
  echo.
  echo   Go to folder:
  echo   Documents \ GitHub \ repassub \ discord-bot
  echo.
  echo   Double-click MAKE-KATABUMP-ZIP.cmd THERE.
  echo.
  pause
  exit /b 1
)

echo %CD% | findstr /i "\\Temp\\" >nul
if not errorlevel 1 (
  echo.
  echo   You are in Temp - probably inside an extracted zip.
  echo   Close this. Use the real folder:
  echo   C:\Users\lekst\Documents\GitHub\repassub\discord-bot
  echo.
  pause
  exit /b 1
)

del /f /q "%~dp0UPLOAD-TO-KATABUMP.zip" 2>nul
del /f /q "%~dp0..\UPLOAD-TO-KATABUMP.zip" 2>nul
del /f /q "%~dp0linklock-discord-bot.zip" 2>nul
del /f /q "%~dp0..\linklock-discord-bot.zip" 2>nul
del /f /q "%~dp0dist-only-upload.zip" 2>nul
del /f /q "%~dp0dist-folder-for-katabump.zip" 2>nul

echo.
echo [1/3] Installing if needed...
if not exist "node_modules\" call "%ProgramFiles%\nodejs\npm.cmd" install
if errorlevel 1 goto fail

echo [2/3] Building bot...
call "%ProgramFiles%\nodejs\npm.cmd" run build
if errorlevel 1 goto fail
if not exist "dist\index.js" (
  echo BUILD FAILED - no dist\index.js
  goto fail
)

echo [3/3] Making UPLOAD-TO-KATABUMP.zip ...
set "ZIP=%~dp0UPLOAD-TO-KATABUMP.zip"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\pack-share.ps1" -Root "%CD%" -OutFile "%ZIP%"
if errorlevel 1 goto fail

echo.
echo ========================================
echo   DONE. ONE FILE TO UPLOAD:
echo.
echo   %ZIP%
echo ========================================
echo.
echo Open that zip on your PC - you MUST see a FOLDER named "dist"
echo.
start "" explorer /select,"%ZIP%"
pause
exit /b 0

:fail
echo.
echo FAILED. Install Node.js from nodejs.org then run this again.
pause
exit /b 1

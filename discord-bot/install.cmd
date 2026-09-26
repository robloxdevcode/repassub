@echo off
title LinkLock Bot - INSTALL
color 0A
cd /d "%~dp0"

echo.
echo  ============================================
echo   LINKLOCK BOT - Step 1: Install
echo  ============================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js not found.
  echo Install from https://nodejs.org then try again.
  goto :end
)

echo Installing packages... this can take a minute.
echo.

call npm.cmd install >> install-log.txt 2>&1
if errorlevel 1 (
  echo INSTALL FAILED. Open install-log.txt in this folder to see why.
  notepad install-log.txt
  goto :end
)

echo.
echo SUCCESS! Packages installed.
echo.
echo Next: double-click deploy-commands.cmd
echo Then: double-click dev.cmd
echo.

:end
echo Press any key to close this window...
pause >nul

@echo off
title LinkLock Bot - RUNNING
color 0E
cd /d "%~dp0"

echo.
echo  Bot is starting... DO NOT CLOSE THIS WINDOW.
echo  Test in Discord: /ping
echo.
echo  If login fails "disallowed intents":
echo  Developer Portal - Bot - turn ON Server Members Intent - Save
echo.

if not exist ".env" (
  echo ERROR: No .env file!
  pause
  exit /b 1
)

call npm.cmd run dev

echo.
echo Bot stopped. Press any key to close...
pause >nul

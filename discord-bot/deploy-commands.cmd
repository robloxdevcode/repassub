@echo off
title LinkLock Bot - DEPLOY COMMANDS
color 0B
cd /d "%~dp0"

echo.
echo ============================================
echo   DEPLOY SLASH COMMANDS
echo ============================================
echo.

if not exist ".env" (
  echo ERROR: No .env file in this folder!
  echo Copy .env.example to .env and fill in your IDs and token.
  echo.
  goto :stayopen
)

echo Running... (errors will show below)
echo.

call npm.cmd run deploy-commands
set DEPLOY_ERR=%ERRORLEVEL%

echo.
echo ============================================
if %DEPLOY_ERR% neq 0 (
  echo   FAILED ^(exit code %DEPLOY_ERR%^)
  echo ============================================
  echo.
  echo Most common fix:
  echo   1. Developer Portal - OAuth2 - URL Generator
  echo   2. Scopes: bot + applications.commands
  echo   3. Invite bot to YOUR server again
  echo   4. SERVER_ID in .env must match that server
  echo.
  call npm.cmd run deploy-commands ^> deploy-log.txt 2^>^&1
  echo Saved full log to deploy-log.txt
) else (
  echo   SUCCESS - commands registered!
  echo ============================================
  echo.
  echo Next: double-click dev.cmd and test /ping in Discord
)

:stayopen
echo.
echo Press any key to close this window...
pause

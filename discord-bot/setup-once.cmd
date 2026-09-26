@echo off
cd /d "%~dp0"
echo ============================================
echo  LinkLock Discord Bot - first-time setup
echo ============================================
echo.
if not exist ".env" (
  echo Creating .env from .env.example ...
  copy /Y ".env.example" ".env" >nul
  echo.
  echo IMPORTANT: Edit .env and add DISCORD_TOKEN, CLIENT_ID, SERVER_ID, OWNER_ID
  echo Then run this script again OR run deploy-commands.cmd + dev.cmd
  notepad ".env"
  pause
  exit /b 0
)
echo Step 1/3: npm install
call "%ProgramFiles%\nodejs\npm.cmd" install
if errorlevel 1 pause & exit /b 1
echo.
echo Step 2/3: deploy slash commands
call "%ProgramFiles%\nodejs\npm.cmd" run deploy-commands
if errorlevel 1 pause & exit /b 1
echo.
echo Step 3/3: start bot (dev)
echo.
call "%ProgramFiles%\nodejs\npm.cmd" run dev

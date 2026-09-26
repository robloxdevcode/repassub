@echo off
cd /d "%~dp0"
call "%ProgramFiles%\nodejs\npm.cmd" run build
if errorlevel 1 pause & exit /b 1
echo Build OK - run start.cmd for production
pause

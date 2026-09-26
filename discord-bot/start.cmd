@echo off
cd /d "%~dp0"
echo LinkLock Bot - production start. Close window to stop.
call "%ProgramFiles%\nodejs\npm.cmd" start

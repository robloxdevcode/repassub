@echo off
REM Keeps window open even if something crashes
cd /d "%~dp0"
cmd /k deploy-commands.cmd

@echo off
cd /d "%~dp0\.."
call npx.cmd dotenv -e .env.local -- npx.cmd tsx scripts/setup-stripe.ts %*

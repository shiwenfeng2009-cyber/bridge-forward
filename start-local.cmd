@echo off
setlocal
cd /d "%~dp0"
set "PATH=C:\Users\shiwe\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\shiwe\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin;%PATH%"
echo Starting Bridge Forward at http://localhost:3000
echo Keep this window open while testing the website.
node .\node_modules\next\dist\bin\next dev
pause

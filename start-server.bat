@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Cangjingge Server
echo.
echo   Cangjingge local server
echo   Folder: %cd%
echo   PC:     http://127.0.0.1:8787/
echo   Phone:  same Wi-Fi, use this PC's IP:8787
echo   Keep this window OPEN while installing on phone
echo   Stop:   close this window or Ctrl+C
echo.

REM Prefer threaded PowerShell server (more stable for PWA install)
where powershell >nul 2>nul
if %errorlevel%==0 (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve-pwa.ps1"
  goto :end
)

where python >nul 2>nul
if %errorlevel%==0 (
  echo Starting with python (threaded via -c)...
  python -c "from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer; h=ThreadingHTTPServer(('0.0.0.0',8787), SimpleHTTPRequestHandler); print('http://0.0.0.0:8787'); h.serve_forever()"
  goto :end
)

where py >nul 2>nul
if %errorlevel%==0 (
  echo Starting with py launcher ...
  py -3 -c "from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer; h=ThreadingHTTPServer(('0.0.0.0',8787), SimpleHTTPRequestHandler); print('http://0.0.0.0:8787'); h.serve_forever()"
  goto :end
)

echo ERROR: Python / PowerShell not found.
echo Install Python 3 from https://www.python.org/downloads/
echo Check "Add python.exe to PATH" during install.
echo.
pause
exit /b 1

:end
echo.
echo Server stopped.
pause

# Local HTTP server for Cangjingge PWA (threaded, LAN-friendly)
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\serve-pwa.ps1

$ErrorActionPreference = 'Stop'
$port = 8787
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

function Get-LanIPv4 {
  try {
    $ip = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
      Where-Object {
        $_.IPAddress -notlike '127.*' -and
        $_.IPAddress -notlike '169.254.*' -and
        $_.PrefixOrigin -ne 'WellKnown'
      } |
      Sort-Object -Property InterfaceMetric |
      Select-Object -First 1 -ExpandProperty IPAddress
    if ($ip) { return $ip }
  } catch {}
  try {
    $line = ipconfig | Select-String -Pattern 'IPv4' | Select-Object -First 1
    if ($line -match '(\d+\.\d+\.\d+\.\d+)') { return $Matches[1] }
  } catch {}
  return '192.168.x.x'
}

$lan = Get-LanIPv4

Write-Host ''
Write-Host '  Cangjingge PWA local server' -ForegroundColor Cyan
Write-Host "  Folder : $root"
Write-Host "  PC     : http://127.0.0.1:$port/" -ForegroundColor Green
Write-Host "  Phone  : http://${lan}:$port/" -ForegroundColor Yellow
Write-Host '  (Phone must be on the SAME Wi-Fi as this PC)'
Write-Host '  Keep this window open while using the phone'
Write-Host '  Press Ctrl+C to stop'
Write-Host ''

# Prefer threaded Python server (handles multiple phone requests)
$py = $null
foreach ($name in @('python', 'py', 'python3')) {
  $cmd = Get-Command $name -ErrorAction SilentlyContinue
  if ($cmd) {
    if ($name -eq 'py') { $py = @('py', '-3'); break }
    $py = @($name); break
  }
}

if ($py) {
  $code = @"
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

os.chdir(r'''$root''')
port = $port

class Handler(SimpleHTTPRequestHandler):
    # Longer timeout for slow phones / OneDrive cold files
    timeout = 60
    protocol_version = 'HTTP/1.1'

    def end_headers(self):
        # Help SW revalidate; avoid stale mid-install failures
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, fmt, *args):
        print('[%s] %s' % (self.log_date_time_string(), fmt % args))

print('Threaded server on 0.0.0.0:%s (LAN OK)' % port)
httpd = ThreadingHTTPServer(('0.0.0.0', port), Handler)
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print('\\nStopped.')
"@
  if ($py.Count -ge 2) {
    & $py[0] $py[1] -c $code
  } else {
    & $py[0] -c $code
  }
  exit $LASTEXITCODE
}

$npx = Get-Command npx -ErrorAction SilentlyContinue
if ($npx) {
  npx --yes serve -l tcp://0.0.0.0:$port .
  exit $LASTEXITCODE
}

Write-Host 'ERROR: Python or Node/npx not found.' -ForegroundColor Red
Write-Host 'Install Python 3, then run this script again.' -ForegroundColor Red
Write-Host 'Or run manually:  python -m http.server 8787 --bind 0.0.0.0' -ForegroundColor Yellow
exit 1

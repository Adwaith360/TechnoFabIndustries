$ErrorActionPreference = 'Stop'
$projectPath = Split-Path -Parent $PSScriptRoot
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$nodePath = if ($nodeCommand) { $nodeCommand.Source } else { $null }
if (-not $nodePath) {
  $runtimeRoot = Join-Path $env:LOCALAPPDATA 'OpenAI/Codex/runtimes/cua_node'
  if (Test-Path -LiteralPath $runtimeRoot) {
    $nodePath = Get-ChildItem -LiteralPath $runtimeRoot -Directory |
      Sort-Object LastWriteTime -Descending |
      ForEach-Object { Join-Path $_.FullName 'bin/node.exe' } |
      Where-Object { Test-Path -LiteralPath $_ } |
      Select-Object -First 1
  }
}
if (-not $nodePath) { throw 'Node.js was not found. Install Node.js 18 or newer, then run this file again.' }
$previewUrl = 'http://localhost:5173'
$running = $false
try {
  $response = Invoke-WebRequest -Uri $previewUrl -UseBasicParsing -TimeoutSec 2
  $running = $response.Content -match 'Techno Fab Industries'
  if (-not $running) { throw 'Port 5173 is occupied by another site. Stop that server before starting this preview.' }
} catch {
  if ($_.Exception.Message -like 'Port 5173*') { throw }
}
if (-not $running) {
  $serverFile = Join-Path $PSScriptRoot 'serve.mjs'
  Start-Process -FilePath $nodePath -ArgumentList ('"' + $serverFile + '"') -WorkingDirectory $projectPath -WindowStyle Hidden
  for ($attempt = 0; $attempt -lt 20; $attempt++) {
    Start-Sleep -Milliseconds 250
    try {
      $response = Invoke-WebRequest -Uri $previewUrl -UseBasicParsing -TimeoutSec 1
      if ($response.Content -match 'Techno Fab Industries') { $running = $true; break }
    } catch { }
  }
}
if (-not $running) { throw 'The preview server could not start on port 5173.' }
Start-Process $previewUrl
Write-Host "Website running at $previewUrl"

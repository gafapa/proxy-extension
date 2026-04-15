param()

$root = Split-Path -Parent $PSScriptRoot
$zipPath = Join-Path $root 'docs\downloads\proxy-extension.zip'
$sourcePath = Join-Path $root 'proxy\*'

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $zipPath) | Out-Null
if (Test-Path $zipPath) {
  Remove-Item $zipPath -Force
}

Compress-Archive -Path $sourcePath -DestinationPath $zipPath -Force
Write-Output "Packaged extension: $zipPath"

param()

$root = Split-Path -Parent $PSScriptRoot
$zipPath = Join-Path $root 'docs\downloads\proxy-extension.zip'
$sourcePath = Join-Path $root 'proxy'
$stagingPath = Join-Path ([System.IO.Path]::GetTempPath()) ([System.Guid]::NewGuid().ToString('N'))
$terserPath = Join-Path $root 'node_modules\.bin\terser.cmd'

if (-not (Test-Path $terserPath)) {
  throw 'Terser is required to package the extension. Run npm install first.'
}

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $zipPath) | Out-Null
if (Test-Path $zipPath) {
  Remove-Item $zipPath -Force
}

try {
  $files = Get-ChildItem -Path $sourcePath -Recurse -File | Where-Object {
    $_.FullName -notmatch [regex]::Escape((Join-Path $sourcePath '_metadata'))
  }

  foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($sourcePath.Length).TrimStart('\', '/')
    $destinationPath = Join-Path $stagingPath $relativePath
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destinationPath) | Out-Null
    Copy-Item -LiteralPath $file.FullName -Destination $destinationPath
  }

  Get-ChildItem -Path $stagingPath -Recurse -File -Filter '*.js' | ForEach-Object {
    & $terserPath $_.FullName --compress --mangle --comments false --output $_.FullName
    if ($LASTEXITCODE -ne 0) {
      throw "Failed to minify $($_.FullName)."
    }
  }

  Compress-Archive -Path (Join-Path $stagingPath '*') -DestinationPath $zipPath -Force
} finally {
  if (Test-Path $stagingPath) {
    Remove-Item -LiteralPath $stagingPath -Recurse -Force
  }
}
Write-Output "Packaged extension: $zipPath"

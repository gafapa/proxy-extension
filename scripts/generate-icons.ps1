param()

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$assetPath = Join-Path $root 'proxy\assets'
New-Item -ItemType Directory -Force -Path $assetPath | Out-Null

$definitions = @(
  @{ Size = 16; File = 'icon16.png' },
  @{ Size = 32; File = 'icon32.png' },
  @{ Size = 48; File = 'icon48.png' },
  @{ Size = 128; File = 'icon128.png' }
)

foreach ($definition in $definitions) {
  $bitmap = New-Object System.Drawing.Bitmap($definition.Size, $definition.Size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear([System.Drawing.Color]::FromArgb(17, 17, 17))
  $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
  $fontSize = [Math]::Round($definition.Size * 0.52, 0)
  $font = New-Object System.Drawing.Font('Segoe UI', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.DrawString('P', $font, $brush, (New-Object System.Drawing.RectangleF(0, 0, $definition.Size, $definition.Size)), $format)
  $bitmap.Save((Join-Path $assetPath $definition.File), [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $brush.Dispose()
  $font.Dispose()
  $bitmap.Dispose()
}

Write-Output 'Generated extension icons.'

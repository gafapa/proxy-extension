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

function New-RoundedRectanglePath {
  param(
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $Radius * 2
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

foreach ($definition in $definitions) {
  $size = [int]$definition.Size
  $scale = $size / 128
  function S([float]$Value) {
    return [float]($Value * $scale)
  }

  $bitmap = New-Object System.Drawing.Bitmap($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.Clear([System.Drawing.Color]::Transparent)

  $background = New-RoundedRectanglePath (S 6) (S 6) (S 116) (S 116) (S 26)
  $backgroundBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.RectangleF(0, 0, $size, $size)),
    [System.Drawing.Color]::FromArgb(11, 31, 38),
    [System.Drawing.Color]::FromArgb(14, 81, 78),
    [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
  )
  $graphics.FillPath($backgroundBrush, $background)

  $gatePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(245, 249, 247), [Math]::Max(2, (S 8)))
  $gatePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $gatePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $gatePath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $gatePath.AddBezier((S 38), (S 86), (S 38), (S 48), (S 90), (S 48), (S 90), (S 86))
  $graphics.DrawPath($gatePen, $gatePath)

  $doorPath = New-RoundedRectanglePath (S 42) (S 52) (S 44) (S 48) (S 14)
  $doorBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.RectangleF((S 42), (S 52), (S 44), (S 48))),
    [System.Drawing.Color]::FromArgb(19, 189, 173),
    [System.Drawing.Color]::FromArgb(40, 123, 240),
    [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
  )
  $graphics.FillPath($doorBrush, $doorPath)

  $nodeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 207, 91))
  $graphics.FillEllipse($nodeBrush, (S 28), (S 72), (S 18), (S 18))
  $graphics.FillEllipse($nodeBrush, (S 82), (S 72), (S 18), (S 18))

  $routePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(248, 207, 91), [Math]::Max(2, (S 6)))
  $routePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $routePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawLine($routePen, (S 43), (S 81), (S 82), (S 81))
  $graphics.DrawLine($routePen, (S 71), (S 70), (S 84), (S 81))
  $graphics.DrawLine($routePen, (S 71), (S 92), (S 84), (S 81))

  $highlightBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(52, 255, 255, 255))
  $graphics.FillEllipse($highlightBrush, (S 27), (S 20), (S 48), (S 22))

  $bitmap.Save((Join-Path $assetPath $definition.File), [System.Drawing.Imaging.ImageFormat]::Png)

  $highlightBrush.Dispose()
  $routePen.Dispose()
  $nodeBrush.Dispose()
  $doorBrush.Dispose()
  $doorPath.Dispose()
  $gatePath.Dispose()
  $gatePen.Dispose()
  $backgroundBrush.Dispose()
  $background.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

Write-Output 'Generated Proxy extension icons.'

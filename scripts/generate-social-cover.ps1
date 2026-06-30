$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$inputPath = Join-Path $projectRoot 'public\images\krasnodar-newbuild-hero.png'
$outputDir = Join-Path $projectRoot 'public\images\og'
$outputPath = Join-Path $outputDir 'voenniy-navigator-social-cover.png'

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $outputDir)) {
  New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$canvasWidth = 1200
$canvasHeight = 630

$background = [System.Drawing.Image]::FromFile($inputPath)
$bitmap = New-Object System.Drawing.Bitmap $canvasWidth, $canvasHeight
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

$scale = [Math]::Max($canvasWidth / $background.Width, $canvasHeight / $background.Height)
$drawWidth = [Math]::Ceiling($background.Width * $scale)
$drawHeight = [Math]::Ceiling($background.Height * $scale)
$drawX = [Math]::Floor(($canvasWidth - $drawWidth) / 2)
$drawY = [Math]::Floor(($canvasHeight - $drawHeight) / 2)

$graphics.DrawImage($background, (New-Object System.Drawing.Rectangle $drawX, $drawY, $drawWidth, $drawHeight))

$navy = [System.Drawing.Color]::FromArgb(220, 15, 20, 25)
$navySoft = [System.Drawing.Color]::FromArgb(78, 15, 37, 71)
$transparent = [System.Drawing.Color]::FromArgb(0, 15, 20, 25)
$blue = [System.Drawing.Color]::FromArgb(37, 99, 235)
$textPrimary = [System.Drawing.Color]::FromArgb(241, 243, 245)
$textMuted = [System.Drawing.Color]::FromArgb(198, 208, 220)
$panelLine = [System.Drawing.Color]::FromArgb(42, 241, 243, 245)
$gridLine = [System.Drawing.Color]::FromArgb(28, 241, 243, 245)

$gradientRect = New-Object System.Drawing.Rectangle 0, 0, $canvasWidth, $canvasHeight
$backgroundBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $gradientRect, $navy, $transparent, 0
$backgroundBlend = New-Object System.Drawing.Drawing2D.ColorBlend
$backgroundBlend.Colors = @(
  [System.Drawing.Color]::FromArgb(232, 15, 20, 25),
  [System.Drawing.Color]::FromArgb(210, 15, 20, 25),
  [System.Drawing.Color]::FromArgb(124, 15, 37, 71),
  [System.Drawing.Color]::FromArgb(16, 15, 37, 71)
)
$backgroundBlend.Positions = @(0.0, 0.42, 0.72, 1.0)
$backgroundBrush.InterpolationColors = $backgroundBlend
$graphics.FillRectangle($backgroundBrush, $gradientRect)

$overlayBrush = New-Object System.Drawing.SolidBrush $navySoft
$graphics.FillEllipse($overlayBrush, 730, -120, 520, 520)
$graphics.FillEllipse($overlayBrush, 880, 260, 340, 340)

$gridPen = New-Object System.Drawing.Pen $gridLine, 1
for ($x = 36; $x -lt 520; $x += 48) {
  $graphics.DrawLine($gridPen, $x, 74, $x, 556)
}
for ($y = 74; $y -lt 556; $y += 48) {
  $graphics.DrawLine($gridPen, 36, $y, 516, $y)
}

$panelPen = New-Object System.Drawing.Pen $panelLine, 1
$graphics.DrawRectangle($panelPen, 34, 72, 484, 486)

$badgeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(34, 37, 99, 235))
$badgePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(110, 37, 99, 235), 1)

function Draw-RoundedRect {
  param(
    [System.Drawing.Graphics]$G,
    [System.Drawing.Brush]$Brush,
    [System.Drawing.Pen]$Pen,
    [int]$X,
    [int]$Y,
    [int]$W,
    [int]$H,
    [int]$R
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $R * 2
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $W - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $W - $diameter, $Y + $H - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $H - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  if ($Brush) { $G.FillPath($Brush, $path) }
  if ($Pen) { $G.DrawPath($Pen, $path) }
  $path.Dispose()
}

Draw-RoundedRect -G $graphics -Brush $badgeBrush -Pen $badgePen -X 72 -Y 102 -W 230 -H 36 -R 18

$fontBadge = New-Object System.Drawing.Font 'Segoe UI Semibold', 13, ([System.Drawing.FontStyle]::Bold)
$fontEyebrow = New-Object System.Drawing.Font 'Segoe UI Semibold', 15, ([System.Drawing.FontStyle]::Bold)
$fontTitle = New-Object System.Drawing.Font 'Segoe UI Semibold', 30, ([System.Drawing.FontStyle]::Bold)
$fontSubtitle = New-Object System.Drawing.Font 'Segoe UI', 18, ([System.Drawing.FontStyle]::Regular)
$fontChip = New-Object System.Drawing.Font 'Segoe UI Semibold', 15, ([System.Drawing.FontStyle]::Bold)
$fontFooter = New-Object System.Drawing.Font 'Segoe UI', 14, ([System.Drawing.FontStyle]::Regular)

$stringFormat = New-Object System.Drawing.StringFormat
$stringFormat.Alignment = [System.Drawing.StringAlignment]::Near
$stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Near

$lightBrush = New-Object System.Drawing.SolidBrush $textPrimary
$mutedBrush = New-Object System.Drawing.SolidBrush $textMuted
$accentBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(145, 194, 255))

$graphics.DrawString('ДЛЯ ВОЕННОСЛУЖАЩИХ', $fontBadge, $lightBrush, 90, 111, $stringFormat)
$graphics.DrawString('ВОЕННЫЙ НАВИГАТОР', $fontEyebrow, $accentBrush, 72, 178, $stringFormat)
$graphics.DrawString('Подбор новостроек', $fontTitle, $lightBrush, (New-Object System.Drawing.RectangleF 72, 216, 440, 60), $stringFormat)
$graphics.DrawString('По военной ипотеке: Краснодар, Крым и дистанционный формат. Сначала разбор ситуации, потом подбор объектов под задачу.', $fontSubtitle, $mutedBrush, (New-Object System.Drawing.RectangleF 72, 324, 426, 150), $stringFormat)

$chipBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(38, 255, 255, 255))
$chipPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(70, 255, 255, 255), 1)

Draw-RoundedRect -G $graphics -Brush $chipBrush -Pen $chipPen -X 72 -Y 520 -W 124 -H 34 -R 17
Draw-RoundedRect -G $graphics -Brush $chipBrush -Pen $chipPen -X 208 -Y 520 -W 82 -H 34 -R 17
Draw-RoundedRect -G $graphics -Brush $chipBrush -Pen $chipPen -X 302 -Y 520 -W 164 -H 34 -R 17

$graphics.DrawString('Краснодар', $fontChip, $lightBrush, 96, 527, $stringFormat)
$graphics.DrawString('Крым', $fontChip, $lightBrush, 232, 527, $stringFormat)
$graphics.DrawString('Дистанционно', $fontChip, $lightBrush, 326, 527, $stringFormat)

$routePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(175, 37, 99, 235), 4)
$routePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$routePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$graphics.DrawBezier($routePen, 712, 438, 820, 344, 968, 356, 1080, 268)

$dotBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(37, 99, 235))
$dotBorder = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(230, 241, 243, 245), 3)
foreach ($dot in @(@(718, 432), @(882, 360), @(1074, 262))) {
  $graphics.FillEllipse($dotBrush, $dot[0], $dot[1], 14, 14)
  $graphics.DrawEllipse($dotBorder, $dot[0], $dot[1], 14, 14)
}

$footerPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(52, 241, 243, 245), 1)
$graphics.DrawLine($footerPen, 72, 580, 1128, 580)
$graphics.DrawString('voen-navigator.ru', $fontFooter, $mutedBrush, 72, 592, $stringFormat)
$graphics.DrawString('Сервис выбора новостройки', $fontFooter, $mutedBrush, 874, 592, $stringFormat)

$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$footerPen.Dispose()
$dotBorder.Dispose()
$dotBrush.Dispose()
$routePen.Dispose()
$chipPen.Dispose()
$chipBrush.Dispose()
$accentBrush.Dispose()
$lightBrush.Dispose()
$mutedBrush.Dispose()
$fontFooter.Dispose()
$fontChip.Dispose()
$fontSubtitle.Dispose()
$fontTitle.Dispose()
$fontEyebrow.Dispose()
$fontBadge.Dispose()
$panelPen.Dispose()
$gridPen.Dispose()
$overlayBrush.Dispose()
$backgroundBrush.Dispose()
$graphics.Dispose()
$bitmap.Dispose()
$background.Dispose()

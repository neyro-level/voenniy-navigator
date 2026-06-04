$sh = New-Object -ComObject WScript.Shell
$lnk = $sh.CreateShortcut("C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Happ - Proxy Utility\Happ.lnk")
Write-Host "Target: $($lnk.TargetPath)"
Write-Host "Args: $($lnk.Arguments)"
Write-Host "WorkDir: $($lnk.WorkingDirectory)"

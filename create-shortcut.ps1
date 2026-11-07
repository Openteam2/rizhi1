$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$desktop = [Environment]::GetFolderPath("Desktop")
$appName = [string]::Join("", [char[]](0x65E5, 0x77E5))
$shortcutPath = Join-Path $desktop ($appName + ".lnk")

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = Join-Path $root "start.cmd"
$shortcut.WorkingDirectory = $root
$shortcut.IconLocation = Join-Path $root "public\favicon.ico"
$shortcut.Description = "RiZhi local learning journal"
$shortcut.Save()

Write-Host "Shortcut created: $shortcutPath"

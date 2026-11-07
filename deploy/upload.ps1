param(
  [string]$SshUser = "root",
  [string]$ServerHost = "123.207.72.210",
  [string]$RemotePath = "/opt/rizhi",
  [string]$IdentityFile = ""
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$sshArgs = @()
if ($IdentityFile) { $sshArgs += @("-i", $IdentityFile) }

& ssh.exe @sshArgs "$SshUser@$ServerHost" "sudo mkdir -p '$RemotePath' && sudo chown -R ${SshUser}:${SshUser} '$RemotePath'"

$files = @(
  "package.json",
  "server.mjs",
  "README.md",
  ".env.example",
  "public",
  "deploy"
)

Push-Location $projectRoot
try {
  & scp.exe @sshArgs -r @files "${SshUser}@${ServerHost}:${RemotePath}/"
} finally {
  Pop-Location
}

Write-Host "Uploaded. Next, follow deploy/README.md on the server."

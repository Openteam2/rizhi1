param(
  [string]$Repository = "Openteam2/rizhi1",
  [string]$Tag = "v1.0.0",
  [string]$NotesFile = "RELEASE_NOTES_V1.0.0.md"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$token = [Environment]::GetEnvironmentVariable("GITHUB_TOKEN")
if ([string]::IsNullOrWhiteSpace($token)) {
  $envPath = Join-Path $root ".env"
  if (Test-Path -LiteralPath $envPath) {
    foreach ($line in Get-Content -LiteralPath $envPath) {
      if ($line -match '^\s*GITHUB_TOKEN\s*=\s*(.*)\s*$') {
        $token = $Matches[1].Trim().Trim('"').Trim("'")
        break
      }
    }
  }
}
if ([string]::IsNullOrWhiteSpace($token)) {
  throw "请在本地 .env 或 GITHUB_TOKEN 环境变量中配置令牌；不要通过聊天传递。"
}

Push-Location $root
try {
  $status = git status --porcelain
  if ($status) {
    throw "工作区存在未提交修改，请先提交后再发布。"
  }

  # Keep the token in process memory; never write it to .git/config or source.
  $basic = [Convert]::ToBase64String(
    [Text.Encoding]::ASCII.GetBytes("x-access-token:$token")
  )
  $authConfig = "http.https://github.com/.extraheader=AUTHORIZATION: basic $basic"
  git -c $authConfig push origin main
  if (-not (git tag -l $Tag)) {
    git tag -a $Tag -m "日知 $Tag"
  }
  git -c $authConfig push origin $Tag

  $body = Get-Content -LiteralPath $NotesFile -Raw
  $payload = @{
    tag_name = $Tag
    target_commitish = "main"
    name = "日知 $Tag"
    body = $body
    draft = $false
    prerelease = $false
  } | ConvertTo-Json -Depth 4
  $headers = @{
    Accept = "application/vnd.github+json"
    Authorization = "Bearer $token"
    "User-Agent" = "rizhi-release-publisher"
    "X-GitHub-Api-Version" = "2022-11-28"
  }

  $existing = $null
  try {
    $existing = Invoke-RestMethod `
      -Uri "https://api.github.com/repos/$Repository/releases/tags/$Tag" `
      -Headers $headers `
      -TimeoutSec 30
  } catch {
    $existing = $null
  }

  if ($existing) {
    $release = Invoke-RestMethod `
      -Method Patch `
      -Uri "https://api.github.com/repos/$Repository/releases/$($existing.id)" `
      -Headers $headers `
      -ContentType "application/json" `
      -Body $payload
  } else {
    $release = Invoke-RestMethod `
      -Method Post `
      -Uri "https://api.github.com/repos/$Repository/releases" `
      -Headers $headers `
      -ContentType "application/json" `
      -Body $payload
  }

  Write-Host "Published: $($release.html_url)"
} finally {
  Pop-Location
}

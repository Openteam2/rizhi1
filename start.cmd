@echo off
chcp 65001 >nul
title 日知 · 本地学习清单
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo 未找到 Node.js。请先安装 Node.js 24 或更高版本。
  pause
  exit /b 1
)

powershell -NoProfile -Command "try { $c=New-Object Net.Sockets.TcpClient; $c.Connect('127.0.0.1',4173); $c.Close(); exit 0 } catch { exit 1 }"
if not errorlevel 1 (
  start "" "http://127.0.0.1:4173"
  exit /b 0
)

start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 1; Start-Process 'http://127.0.0.1:4173'"
node server.mjs

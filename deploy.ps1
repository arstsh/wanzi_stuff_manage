# 后端一键部署脚本（Windows Server 2022 用 PowerShell）
# 用法：在服务器上以管理员身份打开 PowerShell，进入 backend 目录后执行
#   .\deploy.ps1

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "==> 拉取最新代码" -ForegroundColor Cyan
git pull origin main

Write-Host "==> 安装/更新后端依赖" -ForegroundColor Cyan
npm install

Write-Host "==> 生成 Prisma Client" -ForegroundColor Cyan
npm run db:generate

Write-Host "==> 执行数据库迁移（生产模式）" -ForegroundColor Cyan
npm run db:deploy

Write-Host "==> 编译 TypeScript" -ForegroundColor Cyan
npm run build

Write-Host "==> 重启 PM2 服务" -ForegroundColor Cyan

$pm2List = pm2 list 2>&1
$exists = $pm2List | Select-String "wanzi"

if ($exists) {
    pm2 restart wanzi
} else {
    pm2 start dist/server.js --name wanzi
}

Write-Host "==> 保存 PM2 进程列表" -ForegroundColor Cyan
pm2 save

Write-Host "==> 部署完成" -ForegroundColor Green

#!/bin/bash
# 后端一键部署脚本
# 用法：在云服务器 /var/www/wanzi_stuff_manage/backend 目录下执行
# bash deploy.sh

set -e

cd "$(dirname "$0")" || exit 1

echo "==> 拉取最新代码"
git pull origin main

echo "==> 安装/更新后端依赖"
npm install

echo "==> 生成 Prisma Client"
npm run db:generate

echo "==> 执行数据库迁移（生产模式）"
npm run db:deploy

echo "==> 编译 TypeScript"
npm run build

echo "==> 重启 PM2 服务"
if pm2 describe wanzi-inventory-backend >/dev/null 2>&1; then
  pm2 restart wanzi-inventory-backend
else
  pm2 start dist/server.js --name wanzi-inventory-backend
fi

echo "==> 保存 PM2 进程列表"
pm2 save

echo "==> 部署完成"

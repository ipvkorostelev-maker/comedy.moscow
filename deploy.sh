#!/bin/bash

# === НАСТРОЙКИ ===
SERVER="root@89.111.171.180"
REMOTE_DIR="/var/www/smeshno"
BRANCH="main"

# 1. Коммитим и пушим на GitHub
echo "📤 Отправляем на GitHub..."
git add .
git commit -m "${1:-update}" 2>/dev/null || echo "Нечего коммитить, деплоим текущую версию"
git push origin $BRANCH

# 2. На сервере: тянем код, собираем
echo "🚀 Деплоим на сервер..."
ssh $SERVER "
  cd $REMOTE_DIR

  git pull origin $BRANCH

  npm install --omit=dev

  npm run build

  pm2 restart smeshno || pm2 start ecosystem.config.js
"

echo "✅ Готово! Сайт обновлён."

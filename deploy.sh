#!/bin/bash
set -e

# === НАСТРОЙКИ ===
SERVER="root@89.111.171.180"
REMOTE_DIR="/var/www/smeshno"
BRANCH="main"

# 1. Коммитим и пушим на GitHub
echo "Отправляем на GitHub..."
git add .
git commit -m "${1:-update}" 2>/dev/null || echo "Нечего коммитить, деплоим текущую версию"
git push origin $BRANCH

# 2. На сервере: тянем код, останавливаем, собираем, запускаем
echo "Деплоим на сервер..."
ssh $SERVER "
  set -e
  cd $REMOTE_DIR

  git pull origin $BRANCH

  npm install --prefer-offline

  # Останавливаем ПЕРЕД билдом чтобы не было рассинхрона Server Actions
  pm2 stop smeshno || true

  # Чистим старый билд
  rm -rf .next

  npm run build

  pm2 start smeshno || pm2 start ecosystem.config.js
"

# 3. IndexNow — notify Yandex & Bing about all pages
echo "Уведомляем поисковики через IndexNow..."
sleep 3
URLS=$(curl -s https://comedy.moscow/sitemap.xml | grep -oP '(?<=<loc>)[^<]+')
if [ -n "$URLS" ]; then
  URLS_JSON=$(echo "$URLS" | jq -R -s -c '{urls: split("\n") | map(select(length > 0))}')
  curl -s -X POST https://comedy.moscow/api/indexnow \
    -H 'Content-Type: application/json' \
    -d "$URLS_JSON" || true
fi

echo "Готово! Сайт обновлён."

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

# 2. На сервере: тянем код, ставим заглушку, останавливаем, собираем, запускаем
echo "Деплоим на сервер..."
ssh $SERVER "
  set -e
  cd $REMOTE_DIR

  git pull origin $BRANCH

  npm install --prefer-offline

  # Включаем режим обслуживания (заглушку)
  touch /tmp/comedy-maintenance
  echo 'Режим обслуживания включён'

  # Останавливаем ПЕРЕД билдом чтобы не было рассинхрона Server Actions
  pm2 stop smeshno || true

  # Чистим старый билд
  rm -rf .next

  npm run build

  pm2 start smeshno || pm2 start ecosystem.config.js

  # Ждём пока сайт поднимется (до 60 секунд)
  echo 'Ждём восстановления сайта...'
  for i in \$(seq 1 30); do
    if curl -s -o /dev/null -w '%{http_code}' https://comedy.moscow/ | grep -q '200\|301\|302'; then
      echo 'Сайт отвечает'
      break
    fi
    sleep 2
  done

  # Выключаем режим обслуживания
  rm -f /tmp/comedy-maintenance
  echo 'Режим обслуживания выключен'
"

# 3. IndexNow — notify Yandex & Bing about all pages
echo "Уведомляем поисковики через IndexNow..."
sleep 3
  URLS=$(curl -s https://comedy.moscow/sitemap.xml | sed -n 's/.*<loc>\([^<]*\)<\/loc>.*/\1/p')
if [ -n "$URLS" ]; then
  URLS_JSON=$(echo "$URLS" | jq -R -s -c '{urls: split("\n") | map(select(length > 0))}')
  curl -s -X POST https://comedy.moscow/api/indexnow \
    -H 'Content-Type: application/json' \
    -d "$URLS_JSON" || true
fi

echo "Готово! Сайт обновлён."

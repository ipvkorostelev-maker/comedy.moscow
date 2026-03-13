#!/bin/bash

# Запускать ОДИН РАЗ при первом деплое
# Использование: bash setup-server.sh <домен>
# Пример: bash setup-server.sh smeshno.ru

SERVER="root@89.111.171.180"
REMOTE_DIR="/var/www/smeshno"
DOMAIN="${1:-}"
GITHUB_REPO="https://github.com/ВАШ_АККАУНТ/smeshno.git"  # ← замените

echo "🔧 Настраиваем сервер..."

ssh $SERVER "
  # Создаём папку и клонируем репозиторий
  mkdir -p $REMOTE_DIR
  git clone $GITHUB_REPO $REMOTE_DIR || (cd $REMOTE_DIR && git pull)

  # Создаём .env.local с нужными переменными
  cat > $REMOTE_DIR/.env.local <<'EOF'
WOMANSTANDUP_DATA_PATH=/var/www/womanstandup/data
WOMANSTANDUP_ASSETS_URL=https://womanstandup.ru
EOF

  # Устанавливаем зависимости и собираем
  cd $REMOTE_DIR
  npm install --omit=dev
  npm run build

  # Запускаем через PM2 на порту 3001
  PORT=3001 pm2 start npm --name smeshno -- start
  pm2 save
"

# Настраиваем nginx если передан домен
if [ -n "$DOMAIN" ]; then
  echo "🌐 Настраиваем nginx для $DOMAIN..."
  ssh $SERVER "cat > /etc/nginx/sites-available/smeshno <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\\$host;
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\\$scheme;
        proxy_cache_bypass \\\$http_upgrade;
    }
}
EOF
  ln -sf /etc/nginx/sites-available/smeshno /etc/nginx/sites-enabled/smeshno
  nginx -t && systemctl reload nginx

  # SSL через Certbot
  certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN
  "
  echo "✅ nginx настроен, SSL получен"
fi

echo "✅ Первичная настройка завершена!"
echo "   Сайт доступен на порту 3001"
echo "   Данные из womanstandup подхватятся автоматически"

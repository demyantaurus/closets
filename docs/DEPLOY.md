# Деплой в production

Стек: Docker Compose — app (Next.js standalone + Payload), PostgreSQL 16, nginx (TLS), certbot, ежедневные бэкапы.

## Требования к серверу

- Linux (Ubuntu 22.04+), Docker + Compose plugin
- Открытые порты 80 и 443
- DNS: A-запись домена указывает на сервер

## Первый запуск

```bash
git clone <repo> closets && cd closets
cp .env.production.example .env
# заполнить: DOMAIN, NEXT_PUBLIC_SERVER_URL, POSTGRES_PASSWORD,
# DATABASE_URL (тот же пароль), PAYLOAD_SECRET (openssl rand -hex 32),
# TELEGRAM_*, SMTP_*, NEXT_PUBLIC_YM_ID

docker compose -f docker-compose.prod.yml up -d --build
```

nginx стартует с self-signed сертификатом. Выпустите настоящий:

```bash
docker compose -f docker-compose.prod.yml run --rm certbot \
  certonly --webroot -w /var/www/certbot -d $DOMAIN --email admin@$DOMAIN --agree-tos --no-eff-email
docker compose -f docker-compose.prod.yml restart nginx
```

Продление автоматическое (сервис certbot, каждые 12 часов).

## Первичное наполнение

- Откройте `https://<домен>/admin` — создайте первого администратора.
- Либо демо-данные: `docker compose -f docker-compose.prod.yml exec app node --help` — сид работает только в dev-окружении; в проде наполняйте через админку.
- Проверьте «Настройки сайта» (телефоны, адрес, мессенджеры).

## Обновление версии

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

Миграции схемы: в dev Payload пушит схему сам; для продакшена сгенерируйте миграции (`pnpm payload migrate:create`) и добавьте `pnpm payload migrate` перед стартом (см. TODO в плане).

## Бэкапы

Сервис `backup` каждые сутки складывает в `./backups/`:
- `db-<дата>.sql.gz` — дамп базы
- `uploads-<дата>.tar.gz` — загруженные изображения

Хранение — 14 дней. Копируйте каталог на внешнее хранилище (rclone/cron на хосте).

Восстановление:

```bash
gunzip -c backups/db-XXXX.sql.gz | docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d closets
docker compose -f docker-compose.prod.yml run --rm -v $PWD/backups:/backups app sh -c "tar -xzf /backups/uploads-XXXX.tar.gz -C /app"
```

## Безопасность

- `/admin` можно закрыть по IP — раскомментируйте блок в `docker/nginx/templates/site.conf.template`.
- Rate limit на `/api` — 10 r/s на IP (nginx) + лимиты в самих формах.
- Заголовки: HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- Postgres не публикует порт наружу.

## Чек-лист запуска

- [ ] DNS указывает на сервер, сертификат Let's Encrypt выпущен (замок в браузере)
- [ ] Создан админ, пароль сильный; сид-пользователь admin@closets.local отсутствует/удалён
- [ ] Заполнены настройки сайта, загружены реальные фото (обложки категорий, товары, портфолио)
- [ ] Тестовая заявка с сайта дошла до админки, Telegram и почты
- [ ] Экспорт CSV открывается в Excel
- [ ] robots.txt и sitemap.xml отдаются, домен в них правильный
- [ ] Яндекс.Метрика получает визиты (NEXT_PUBLIC_YM_ID)
- [ ] Lighthouse mobile ≥ 90 на главной и странице товара (после загрузки реальных фото)
- [ ] Проверка на реальных устройствах: iPhone Safari, Android Chrome, десктоп Chrome/Firefox/Edge/Safari
- [ ] `./backups` содержит свежий дамп; восстановление проверено на staging

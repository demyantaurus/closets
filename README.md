# Closets — сайт мебели на заказ

Маркетинговый сайт + каталог с админ-панелью. Полный план: [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md).

## Стек

- Next.js (App Router) + TypeScript — публичный сайт (SSR/ISR)
- Payload CMS 3 — админ-панель (`/admin`) и API (`/api`), встроен в Next.js
- PostgreSQL 16
- SCSS Modules (без UI-китов), FSD-архитектура фронтенда
- Docker / docker compose

## Быстрый старт

```bash
cp .env.example .env   # заполнить PAYLOAD_SECRET
docker compose up
```

- Сайт: http://localhost:3000
- Админка: http://localhost:3000/admin
- Демо-данные: `docker compose exec app npx pnpm seed` (админ: admin@closets.local / admin1234)

Production-деплой (nginx + TLS + бэкапы): [docs/DEPLOY.md](./docs/DEPLOY.md), гид для контент-менеджера: [docs/ADMIN_GUIDE.md](./docs/ADMIN_GUIDE.md).

## Скрипты

| Команда | Назначение |
|---|---|
| `pnpm dev` | dev-сервер |
| `pnpm build` | production-сборка |
| `pnpm lint` | ESLint (включая проверку границ FSD-слоёв) |
| `pnpm lint:styles` | Stylelint (SCSS) |
| `pnpm lint:fsd` | Steiger — валидация FSD-структуры |
| `pnpm typecheck` | TypeScript |
| `pnpm generate:types` | генерация типов Payload из коллекций |
| `pnpm test` | vitest + Playwright |

## Структура

```
src/
├── app/          роутинг Next.js: (frontend) — сайт, (payload) — админка/API
├── views/        FSD: страницы
├── widgets/      FSD: крупные секции страниц
├── features/     FSD: пользовательские сценарии (формы, калькулятор)
├── entities/     FSD: доменные сущности
├── shared/       FSD: ui-примитивы, стили (styles/), утилиты, типы API
└── payload/      бэкенд: коллекции, глобалы, хуки, payload.config.ts
```

Правило импортов: `app → views → widgets → features → entities → shared`, только сверху вниз. `src/payload` доступен фронтенду только через `shared/api`.

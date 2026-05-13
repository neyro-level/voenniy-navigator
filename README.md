# Военный навигатор — Михаил Хряпин

Персональный сайт эксперта по военной ипотеке в Краснодаре.

**Стек:** Astro 5 + Tailwind CSS v4 + TypeScript strict + React islands + Vercel

---

## Быстрый старт

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

## Команды

| Команда | Описание |
|---|---|
| `pnpm dev` | Дев-сервер на localhost:4321 |
| `pnpm build` | Type-check + production build |
| `pnpm preview` | Preview production build |

## Структура

```
src/
├── layouts/         BaseLayout + PageLayout
├── components/
│   ├── layout/      Header, Footer
│   └── ui/          PhotoPlaceholder, (Button, Card)
├── lib/             navData, constants, seo, utils
├── pages/           Роуты + _pagename/ папки для блоков
└── styles/          global.css с @theme токенами
```

## Переменные окружения

Скопируйте `.env.example` в `.env` и заполните:

```bash
cp .env.example .env
```

| Переменная | Описание |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Токен Telegram-бота для уведомлений |
| `TELEGRAM_CHAT_ID` | ID чата для уведомлений |
| `PUBLIC_YM_COUNTER_ID` | ID счётчика Яндекс.Метрики |

## Документация

Все проектные документы в `_project-docs/`:
- [`SITE_ARCHITECTURE.md`](SITE_ARCHITECTURE.md) — карта сайта, URL, стек
- [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) — дизайн-система
- [`_project-docs/briefs/INDEX.md`](_project-docs/briefs/INDEX.md) — брифы страниц

# Военный навигатор — Михаил Хряпин

Персональный сайт эксперта по военной ипотеке в Краснодаре.

**Стек:** Astro 7 + Tailwind CSS v4 + TypeScript 6 strict + React islands
**Доставка:** SourceCraft primary → ручной release на AMS Server (Timeweb) после явной команды владельца. GitHub — зеркало.

---

## Быстрый старт

```bash
pnpm install --frozen-lockfile
pnpm dev        # http://localhost:4321
```

## Команды

| Команда | Описание |
|---|---|
| `pnpm dev` | Дев-сервер на localhost:4321 |
| `pnpm build` | Type-check + production build |
| `pnpm preview` | Preview production build |
| `pnpm qa:release-candidate` | Сводный отчёт кандидата: SHA, маршруты, sitemap, canonical, robots, llms и изображения |

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
| `PUBLIC_YM_COUNTER_ID` | ID счётчика Яндекс.Метрики; предусмотрено значение по умолчанию |
| `PUBLIC_LEADS_API_URL` | Same-origin URL AMS Leads API |
| `PUBLIC_PROJECT_ID` | Идентификатор проекта для Leads API |
| `PUBLIC_LEADS_SITE_KEY` | Публичный ключ сайта для Leads API |
| `PUBLIC_SMARTCAPTCHA_CLIENT_KEY` | Публичный ключ Yandex SmartCaptcha |
| `PUBLIC_YANDEX_MAPS_API_KEY` | Публичный ключ Яндекс.Карт |
| `PUBLIC_SITE_URL` | Необязательное переопределение канонического URL сайта |

## Документация

Рабочий порядок документов:
- [`project-docs/PASSPORT_PROJECTS.md`](project-docs/PASSPORT_PROJECTS.md)
- [`project-docs/WORKLOG.md`](project-docs/WORKLOG.md)
- [`project-docs/README.md`](project-docs/README.md)

Все актуальные документы проекта собраны в `project-docs/`.

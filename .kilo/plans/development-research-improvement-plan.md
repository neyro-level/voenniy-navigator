# План улучшений по SITE_DEVELOPMENT_RESEARCH — «Военный навигатор»

## Цель задачи

Подготовить безопасный порядок улучшения Astro-проекта «Военный навигатор» на основе документа `project-docs/SITE_DEVELOPMENT_RESEARCH.md`: сначала стабилизировать текущую рабочую ветку, затем внедрять performance/UX/build-улучшения без поломки контента, SEO/GEO, форм и мобильной версии.

## Проверенный контекст

**Верифицировано:**

- Клиент: Михаил Хряпин / проект «Военный навигатор».
- Папка: `C:\Users\User\Desktop\Сборка АМС\Военный навигатор (AMS)`.
- Стек: Astro 5 + Tailwind CSS v4 + TypeScript strict + React islands + pnpm.
- Деплой: GitHub Actions → AMS Server → `https://voen-navigator.ru`.
- Обязательный паспорт проекта находится в `project-docs/PASSPORT_PROJECTS.md`; файл `PROJECT_PASSPORT.md` не используется в этом проекте.
- `project-docs/WORKLOG.md` фиксирует последний стабильный статус: `pnpm build` проходил без ошибок, `pnpm geo-check` давал `100/100`, production работал без console errors.
- Документ Development Research находится в `project-docs/SITE_DEVELOPMENT_RESEARCH.md`.
- В `project-docs/SITE_DEVELOPMENT_RESEARCH.md` приоритеты ближайших улучшений: `@astrojs/partytown`, Astro prefetch, затем `astro-min`, `astro-icon`, `PlayForm/Compress`, далее исследование `@unpic/astro`, `subfont`, View Transitions/loading indicator.
- `astro.config.mjs` сейчас минимальный: `react()`, `sitemap()`, Tailwind Vite plugin, `output: 'static'`; Partytown/prefetch/min/compress пока не подключены.
- Аналитика сейчас устроена через `CookieBanner.tsx`, `window.ym`, `src/lib/analytics.ts` и inline-обработчики в `BaseLayout.astro`.
- Изображения идут через собственный `src/components/ui/OptimizedImage.astro`; это не нужно заменять на `@unpic/astro` в первом спринте.
- В проекте много inline SVG: `grep` показал 142 вхождения `<svg`/иконок в `src` — миграция на `astro-icon` должна быть отдельным этапом.
- Есть brief-документы страниц в `project-docs/briefs/`: `PAGE_HOME.md`, `PAGE_PODBOR.md`, `PAGE_BONUS.md`, `PAGE_KALKULYATOR_VOENNOY_IPOTEKI.md`, `PAGE_USLOVIYA_VOENNOY_IPOTEKI.md`, `PAGE_VOENNAYA_IPOTEKA_KRASNODAR.md`, `PAGE_VOENNAYA_IPOTEKA_KRYM.md`, `PAGE_CONTACTS.md` и др.
- `project-docs/SEMANTICS.md` — источник правды по Wordstat/SEO-кластерам.

**Критичный текущий статус:**

- Рабочее дерево не чистое: есть крупные несохранённые/незакоммиченные изменения в страницах и компонентах, удаления старых home-блоков, новые untracked секции, а также сторонние `.qwen/*` и локальные skill-копии `ams-astro-build/`, `ams-copywriting/`.
- По `git diff --stat`: 25 tracked-файлов изменены, около `368 insertions / 1717 deletions`; дополнительно много untracked файлов.
- Поэтому нельзя начинать внедрение новых зависимостей или оптимизаций, пока Code-агент не зафиксирует/не проверит фактическое состояние рабочей ветки и не отделит пользовательские изменения от будущих улучшений.

## Затронутые зоны

- Конфигурация: `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `astro.config.mjs`, `.github/workflows/deploy-ams.yml`.
- Layout/аналитика: `src/layouts/BaseLayout.astro`, `src/layouts/PageLayout.astro`, `src/lib/analytics.ts`, `src/components/ui/CookieBanner.tsx`, `src/components/ui/ScriptLoader.astro`.
- SEO/GEO: `src/lib/geo/*`, `src/pages/llms.txt.ts`, `src/pages/robots.txt.ts`, `scripts/geo-check.mjs`.
- Изображения: `src/components/ui/OptimizedImage.astro`, `public/images/`, `src/assets/` при наличии.
- Иконки: `src/components/layout/*`, `src/components/sections/FinalCTA.astro`, page-секции с inline SVG.
- Навигация/UX: `astro.config.mjs`, `src/components/layout/Header.astro`, `RouteMapOverlay.astro`, route-файлы страниц.
- Документация: `project-docs/SITE_DEVELOPMENT_RESEARCH.md`, `project-docs/WORKLOG.md`, при смысловых изменениях — релевантные `project-docs/briefs/PAGE_*.md`.

## Что можно менять

После стабилизации рабочей ветки Code-агенту можно менять:

- `astro.config.mjs` — только точечное добавление проверенных интеграций/настроек.
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` — только под реально внедряемые зависимости.
- `src/layouts/BaseLayout.astro`, `src/lib/analytics.ts`, `src/components/ui/CookieBanner.tsx` — для Partytown/analytics-адаптации.
- `src/components/ui/ScriptLoader.astro` — если нужен единый загрузчик third-party скриптов.
- `src/components/layout/*`, `src/components/sections/*` и отдельные page-секции — только на этапе `astro-icon`, без одновременного изменения текстов/структуры.
- `.github/workflows/deploy-ams.yml` — только если меняется build/geo/compress-проверка в CI.
- `project-docs/WORKLOG.md` и `project-docs/SITE_DEVELOPMENT_RESEARCH.md` — обязательно после каждого завершённого этапа.

## Что нельзя менять

- Не трогать `.env`, `.env.local`, секреты, Telegram/CRM/API токены.
- Не коммитить `.qwen/*`, локальные skill-копии и временные артефакты без отдельного решения.
- Не менять тексты, офферы, H1/H2, CTA и структуру страниц «заодно» при performance-работах.
- Не менять дизайн-токены и визуальную систему без задачи на дизайн.
- Не заменять `OptimizedImage.astro` на `@unpic/astro` в первом спринте: сначала исследование и сравнение.
- Не включать View Transitions одновременно с Partytown: это отдельный рискованный UX-этап.
- Не включать PurgeCSS/Subfont без полной проверки всех страниц и кириллицы.
- Не ломать cookie-consent: Яндекс.Метрика должна грузиться только после согласия пользователя.

## План реализации

### Этап 0. Стабилизация перед улучшениями

1. Проверить `git status --short`, `git diff --stat`, список untracked файлов.
2. Разделить изменения на группы: пользовательские правки сайта, локальные настройки/мусор, новые plan/skill-файлы, будущие улучшения.
3. Не внедрять новые зависимости, пока не принято решение по текущим незакоммиченным изменениям.
4. Запустить проверки текущего состояния: `pnpm build`, `pnpm geo-check`.
5. Если сборка падает — сначала исправить текущие изменения, а не начинать Development Research-улучшения.

### Этап 1. Baseline-аудит перед performance-правками

1. Зафиксировать текущий `package.json`, `astro.config.mjs`, `BaseLayout.astro`, `CookieBanner.tsx`, `analytics.ts`.
2. Снять baseline: размер `dist`, наличие/размер HTML/CSS/JS, поведение Яндекс.Метрики после cookie accept.
3. Проверить production/dev страницы: `/`, `/kalkulyator-voennoy-ipoteki/`, `/usloviya-voennoy-ipoteki/`, `/voennaya-ipoteka-krasnodar/`, `/contacts/`.

### Этап 2. Быстрое безопасное улучшение — Astro Prefetch

1. Добавить в `astro.config.mjs` встроенный prefetch Astro без новых зависимостей.
2. Начать с осторожной стратегии: `prefetchAll: true`, `defaultStrategy: 'hover'` или эквивалент по актуальной Astro 5-документации.
3. Проверить desktop/mobile навигацию, sitemap, route overlay, footer links.
4. Запустить `pnpm build` и `pnpm geo-check`.

### Этап 3. Partytown + Яндекс.Метрика

1. Проверить актуальную документацию `@astrojs/partytown` для Astro 5.
2. Установить интеграцию и подключить её в `astro.config.mjs`.
3. Настроить `forward` для `ym` так, чтобы текущие вызовы `window.ym(...)` из `analytics.ts` и inline-скриптов не сломались.
4. Перенести загрузку `https://mc.yandex.ru/metrika/tag.js` в Partytown-совместимый сценарий, сохранив cookie-consent gate.
5. Проверить, что до согласия cookie Метрика не грузится, после согласия `ym` и цели работают.
6. Проверить console/network на desktop и mobile.
7. Запустить `pnpm build`, `pnpm geo-check`.

### Этап 4. Минификация билда

1. Изучить актуальность `astro-min` для Astro 5 + Tailwind v4.
2. Подключить только если пакет совместим и поддерживается.
3. Проверить, что inline JSON-LD в `BaseLayout.astro` не повреждается минификацией.
4. Проверить, что `llms.txt`, `robots.txt`, sitemap и legal pages генерируются корректно.
5. Запустить `pnpm build`, `pnpm geo-check` и выборочную проверку `dist`.

### Этап 5. Compression build artifacts

1. Проверить, нужен ли `PlayForm/Compress` при текущем Nginx/AMS Server.
2. Если сервер не отдаёт `.br`/`.gz` автоматически — не внедрять пакет вслепую, а сначала зафиксировать серверное требование.
3. При внедрении проверить, что GitHub Actions загружает сжатые артефакты и Nginx отдаёт их с корректными headers.

### Этап 6. Иконки через astro-icon — отдельный рефакторинг

1. Сначала составить карту повторяющихся inline SVG: logo/phone/telegram/max/vk/check/arrow/faq.
2. Внедрять `astro-icon` только для повторяемых системных иконок, не трогая декоративные уникальные SVG-карты/силуэты.
3. Начать с `Header.astro`, `Footer.astro`, `RouteMapOverlay.astro`, `FinalCTA.astro`.
4. Проверить визуальное соответствие: stroke 1.5, размеры 14/16/20/24, цвет через `currentColor`/токены.
5. Не менять тексты и layout одновременно с миграцией иконок.

### Этап 7. Research-only: изображения, subfont, View Transitions

1. `@unpic/astro`: провести отдельный spike и сравнить с текущим `OptimizedImage.astro`; не заменять без доказанного выигрыша на AMS Server.
2. `subfont`: проверить кириллицу, формы, динамические тексты, legal pages; внедрять только после полного QA.
3. View Transitions + loading indicator: рассматривать только после Partytown и prefetch, с отдельной mobile/Safari-проверкой.

### Этап 8. Документация и закрытие каждого этапа

1. Обновить `project-docs/WORKLOG.md`: что изменено, какие проверки прошли, что отложено.
2. Обновить `project-docs/SITE_DEVELOPMENT_RESEARCH.md`: отметить статус каждой рекомендации — `внедрено`, `отложено`, `не подходит`, `требует проверки`.
3. Если меняется публичная логика аналитики/cookie/forms — обновить релевантные проектные документы.

## Проверка результата

Минимальный набор после каждого технического этапа:

```bash
pnpm build
pnpm geo-check
```

Браузерная проверка:

- `/` desktop + mobile 375px.
- `/kalkulyator-voennoy-ipoteki/` desktop + mobile 375px.
- `/usloviya-voennoy-ipoteki/` desktop + mobile 375px.
- `/voennaya-ipoteka-krasnodar/` desktop + mobile 375px.
- `/contacts/` desktop + mobile 375px.
- Проверить отсутствие горизонтального overflow.
- Проверить Header, RouteMapOverlay, Footer, MobileBottomCTA.
- Проверить открытие/закрытие формы, отправку при настроенных public env, fallback-сценарий при ненастроенном API.
- Проверить cookie banner: до accept Метрика не грузится, после accept сеть/цели работают.
- Проверить console на критичные ошибки.
- Проверить `dist` на placeholder-утечки: `[DOMAIN]`, `[MAX_LINK]`, `[VK_GROUP]`, `example.com`, секретные env.

## Документация

Обновлять обязательно:

- `project-docs/WORKLOG.md` — после каждого этапа.
- `project-docs/SITE_DEVELOPMENT_RESEARCH.md` — living document: статус внедрения, найденные проблемы, фактические решения.

Обновлять по необходимости:

- `project-docs/PASSPORT_PROJECTS.md` — если меняются правила сборки, обязательные команды или инфраструктура.
- `project-docs/SITE_ARCHITECTURE.md` — если изменяется навигация, SEO/GEO или карта сайта.
- `project-docs/briefs/PAGE_*.md` — только если затронуты смыслы, структура, CTA, тексты или публичная логика страницы.
- `.env.example` — только для новых public-переменных, значения оставлять пустыми.

## Риски

- **Высокий:** рабочее дерево уже содержит крупные незакоммиченные изменения; новые оптимизации могут смешаться с чужой/предыдущей работой.
- **Высокий:** Partytown может сломать Яндекс.Метрику, цели `ym`, webvisor или cookie-consent gate.
- **Средний:** минификация может повредить inline JSON-LD или скрипты в `BaseLayout.astro`.
- **Средний:** compression бесполезна без настройки Nginx на отдачу precompressed `.br`/`.gz`.
- **Средний:** `astro-icon` при массовой миграции может изменить визуальные размеры/цвета иконок.
- **Средний:** `@unpic/astro` может не дать выигрыша на AMS Server без edge image CDN.
- **Средний:** `subfont` может обрезать кириллицу/редкие символы и сломать legal/динамический контент.
- **Низкий:** Astro Prefetch может увеличить лишний сетевой трафик, если включить слишком агрессивную стратегию.

## Открытые вопросы

Без ответа можно безопасно начинать только этапы 0–2.

1. Нужно ли сначала привести текущее рабочее дерево к чистому состоянию отдельным коммитом/решением, или продолжать поверх существующих незакоммиченных изменений?
2. Какие улучшения считать первым Code-спринтом: только `prefetch`, или `prefetch + Partytown` после стабилизации?

**Рекомендуемое решение:** сначала стабилизировать рабочее дерево и пройти `pnpm build`/`pnpm geo-check`, затем внедрить `prefetch`, затем отдельным этапом Partytown.

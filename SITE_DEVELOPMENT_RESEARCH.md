# Исследование: Развитие и улучшение сайта «Военный навигатор»

> **Дата исследования:** 04.06.2026
> **Цель:** Собрать перспективные open-source репозитории, инструменты и паттерны для дальнейшего развития Astro-сайта АМС (Военный навигатор, Союз Ростов, Сайт АМС).
> **Стек проекта:** Astro 5 + Tailwind CSS v4 + TypeScript strict + React islands
> **Статус:** Черновик для будущего детального изучения

---

## Содержание

1. [Общая стратегия развития](#1-общая-стратегия-развития)
2. [Репозитории с высоким приоритетом (🔴)](#2-репозитории-с-высоким-приоритетом-)
3. [Репозитории со средним приоритетом (🟡)](#3-репозитории-со-средним-приоритетом-)
4. [Репозитории для reference / изучения паттернов (🔵)](#4-репозитории-для-reference--изучения-паттернов-)
5. [Итоговая таблица приоритетов](#5-итоговая-таблица-приоритетов)
6. [Следующие шаги](#6-следующие-шаги)

---

## 1. Общая стратегия развития

### Текущее состояние (что уже сделано)
- ✅ Единая GEO-система (`src/lib/geo/`) — 100/100 на всех 3 сайтах
- ✅ Локальные шрифты InterVariable + fallback metrics
- ✅ Image pipeline (`OptimizedImage.astro`) с LQIP
- ✅ Motion system (`RevealOnScroll.astro`) + CSS `vn-reveal`
- ✅ Unified analytics layer (`analytics.ts`) для Яндекс.Метрики
- ✅ Env-gate для `ReviewWidget`
- ✅ CI/CD с `pnpm geo-check` gate

### Зоны роста (что можно усилить)
1. **Performance:** Third-party scripts (YM) блокируют main thread. Нужен Partytown.
2. **Build optimization:** Нет минификации HTML/CSS/JS/SVG на уровне билда.
3. **Images:** Кастомный `OptimizedImage` хорош, но промышленные решения (Unpic) дают больше.
4. **Icons:** SVG иконки сейчас вручную вставлены в компоненты. Можно автоматизировать через sprites.
5. **Navigation:** Prefetch + View Transitions для SPA-like ощущения.
6. **Fonts:** InterVariable весит ~300KB. Subsetting может сократить до 20–50KB.
7. **Compression:** Нет gzip/brotli на уровне статического билда.

---

## 2. Репозитории с высоким приоритетом (🔴)

### 2.1 `@astrojs/partytown` — вынос аналитики в Web Worker

- **Ссылка:** [github.com/withastro/astro/tree/main/packages/integrations/partytown](https://github.com/withastro/astro/tree/main/packages/integrations/partytown)
- **Официальная документация:** [docs.astro.build/ru/guides/integrations-guide/partytown](https://docs.astro.build/ru/guides/integrations-guide/partytown/)
- **Что это:** Официальная Astro-интеграция для Partytown — библиотеки от Builder.io, которая переносит third-party скрипты (Google Analytics, GTM, Яндекс.Метрика, Facebook Pixel) в web worker.
- **Почему важно:**
  - Скрипты аналитики блокируют main thread и портят Core Web Vitals.
  - Реальные кейсы показывают улучшение LCP на 30–50%.
  - Total Blocking Time (TBT) снижается на 60–80%.
- **Что изучить:**
  - Как проксировать `window.ym` и `dataLayer.push` через `forward` конфиг.
  - Совместимость с Astro View Transitions (есть нюансы с Firefox).
  - Пример интеграции с Яндекс.Метрикой (не только GA).
- **Примерные репозитории для изучения:**
  - `handystudio/astro-google-analytics` — [github.com/handystudio/astro-google-analytics](https://github.com/handystudio/astro-google-analytics) — GA4 + Partytown, drop-in компонент.
  - `launchfa.st/blog/astro-gtm-partytown` — гайд по GTM + Partytown в Astro.
- **Усилие:** ~2 часа
- **Риски:**
  - View Transitions + Partytown = баги в Firefox (по состоянию на декабрь 2023, нужно проверить актуальность).
  - Яндекс.Метрика может требовать дополнительной прокси-конфигурации для CORS.

---

### 2.2 `astro-min` — минификация HTML/CSS/JS/SVG на Rust

- **Ссылка:** [github.com/advanced-astro/min](https://github.com/advanced-astro/min)
- **Что это:** Astro-интеграция для минификации статических ассетов. Написана на Rust, работает через LightningCSS и html-minifier-terser.
- **Почему важно:**
  - Сжимает HTML, CSS, JavaScript, SVG в процессе билда.
  - Значительно быстрее аналогов на Node.js.
  - Zero-config — достаточно добавить в `astro.config.mjs`.
- **Что изучить:**
  - Сравнение с `PlayForm/Compress` — что лучше для нашего стека.
  - Настройки SVGO для минификации SVG-иконок.
  - Влияние на время билда в CI.
- **Усилие:** ~1 час
- **Риски:** Минификация может сломать inline JSON-LD — нужно проверить на `schema.org` разметке.

---

### 2.3 `astro-icon` — SVG-иконки с автоматическим sprite

- **Ссылка:** [github.com/natemoo-re/astro-icon](https://github.com/natemoo-re/astro-icon)
- **Официальная документация:** [www.astroicon.dev](https://www.astroicon.dev/)
- **Что это:** Компонент `Icon` для Astro, который:
  - Поддерживает иконки из `src/icons/` (локальные SVG).
  - Автоматически оптимизирует SVG через SVGO.
  - Создаёт SVG sprites: первое использование — `<symbol>`, повторные — `<use>`.
  - Поддерживает Iconify (тысячи иконок из CDN).
- **Почему важно:**
  - У нас есть иконки в футере (WhatsApp, Telegram, телефон) и в UI.
  - Сейчас они вставлены inline в каждый компонент — дублирование HTML.
  - `astro-icon` даст чистый код и меньший размер страницы.
- **Что изучить:**
  - Миграция с v0 на v1 ( breaking changes: убрали `pack` prop, `Sprite.Provider`).
  - Интеграция с Tailwind CSS v4 (классы для `fill` и `stroke`).
  - Создание собственного icon set в `src/icons/`.
- **Усилие:** ~2 часа
- **Риски:** Низкие — компонент стабильный, 374K+ weekly downloads.

---

### 2.4 `@unpic/astro` — универсальный responsive image service

- **Ссылка:** [github.com/ascorbic/unpic-img](https://github.com/ascorbic/unpic-img) (пакет `@unpic/astro`)
- **Официальная документация:** [unpic.pics/img/astro](https://unpic.pics/img/astro/)
- **Что это:** Библиотека для генерации responsive `<img>` тегов с автоматическим:
  - Определением CDN (Cloudinary, Imgix, Contentful, Shopify и др.).
  - Генерацией `srcset` и `sizes`.
  - Поддержкой форматов WebP/AVIF.
  - Placeholder (blurhash, dominant color).
  - Адаптивным layout (constrained, fullWidth, fixed).
- **Два режима работы:**
  1. **Image Service** — заменяет стандартный Astro image service в `astro.config.mjs`. Работает с нативным `<Image />` от Astro.
  2. **Component** — отдельный `<Image>` компонент из `@unpic/astro` с расширенными возможностями.
- **Почему важно:**
  - Наш `OptimizedImage.astro` хорош, но Unpic — промышленный стандарт.
  - Автоматически использует edge image CDN на Vercel/Netlify для локальных изображений.
  - Не требует build-time обработки — работает через CDN URL API.
- **Что изучить:**
  - Можно ли использовать как drop-in замену `OptimizedImage.astro`.
  - Как работает с локальными изображениями (не CDN).
  - Placeholder стратегии (blurhash vs LQIP).
- **Усилие:** ~3 часа
- **Риски:**
  - Если деплоим не на Vercel/Netlify — edge CDN не доступен, fallback на sharp.
  - Blurhash требует дополнительного пакета `@unpic/placeholder`.

---

## 3. Репозитории со средним приоритетом (🟡)

### 3.1 `astro-loading-indicator` — прогресс-бар навигации

- **Ссылка:** [github.com/florian-lefebvre/astro-loading-indicator](https://github.com/florian-lefebvre/astro-loading-indicator)
- **Что это:** Прогресс-бар (как у YouTube/Turbolinks) для Astro View Transitions. Показывается между навигациями по страницам.
- **Почему полезно:** Дает пользователю визуальный фидбек при переходе между страницами. Особенно актуально, если включить prefetch + view transitions.
- **Усилие:** ~30 минут
- **Зависимость:** Требует включения View Transitions.

---

### 3.2 Astro Prefetch (встроено в ядро)

- **Ссылка:** [docs.astro.build/en/guides/prefetch](https://docs.astro.build/en/guides/prefetch/)
- **Что это:** Встроенная в Astro функция предзагрузки страниц. Поддерживает стратегии:
  - `hover` (по умолчанию) — prefetch при наведении.
  - `tap` — prefetch при touchstart/mousedown.
  - `viewport` — prefetch при появлении в viewport.
  - `load` — prefetch всех ссылок после загрузки страницы.
- **Конфигурация:**
  ```js
  export default defineConfig({
    prefetch: {
      prefetchAll: true,
      defaultStrategy: 'hover'
    }
  });
  ```
- **Почему полезно:** Ускоряет навигацию между страницами услуг (`/voennaya-ipoteka/` → `/etapy-pokupki/`).
- **Усилие:** ~15 минут (только конфиг)
- **Примечание:** Если включить View Transitions — prefetch включается автоматически.

---

### 3.3 `PlayForm/Compress` — сжатие gzip/brotli/zstd

- **Ссылка:** [github.com/PlayForm/Compress](https://github.com/PlayForm/Compress)
- **Что это:** Astro-интеграция для сжатия статических файлов в процессе билда. Поддерживает gzip, brotli, zstd.
- **Почему полезно:** Меньше байтов на проводе = быстрее загрузка. Особенно важно для медленных соединений.
- **Сравнение с `astro-min`:**
  - `astro-min` — минификация (удаление пробелов, оптимизация AST).
  - `PlayForm/Compress` — компрессия (архивирование).
  - Идеально использовать **вместе**.
- **Усилие:** ~1 час
- **Риски:** Нужно убедиться, что сервер (Timeweb/Nginx) отдаёт сжатые файлы с правильными заголовками.

---

### 3.4 `astro-purgecss-static` — удаление неиспользуемого CSS

- **Ссылка:** [github.com/KreskoLab/astro-purgecss-static](https://github.com/KreskoLab/astro-purgecss-static)
- **Что это:** Интеграция PurgeCSS для Astro в static mode. Анализирует все `.astro`, `.mdx`, `.html` файлы и вычищает неиспользуемые CSS-классы.
- **Почему полезно:** Tailwind CSS v4 генерирует много utility-классов. PurgeCSS оставляет только те, что реально используются.
- **Усилие:** ~2 часа
- **Риски:**
  - Может удалить динамически генерируемые классы (через `class:list` или JS).
  - Нужно тщательно тестировать на всех страницах.
  - С Tailwind v4 есть нюансы — v4 использует CSS-first подход, PurgeCSS может работать иначе.

---

### 3.5 `subfont` — субсетинг шрифтов

- **Ссылка:** [github.com/forthgoing/subfont](https://github.com/forthgoing/subfont)
- **Что это:** Astro-интеграция, которая автоматически подрезает файлы шрифтов только под глифы, используемые на сайте.
- **Пример:** InterVariable (~300KB) → подрезанный под нужные символы (~20–50KB).
- **Почему полезно:** У нас уже локальный InterVariable. Subfont может ещё сильнее уменьшить его вес.
- **Усилие:** ~2 часа
- **Риски:**
  - Если на сайте есть динамический контент (который может содержать редкие символы) — они не попадут в субсет.
  - Нужно убедиться, что Cyrillic покрыт полностью.

---

## 4. Репозитории для reference / изучения паттернов (🔵)

### 4.1 AstroWind — самая популярная Astro тема

- **Ссылка:** [github.com/onwidget/astrowind](https://github.com/onwidget/astrowind) (или `arthelokyo/astrowind`)
- **Демо:** [astrowind.vercel.app](https://astrowind.vercel.app/)
- **Звёзды:** ~1.8K+
- **Что это:** Production-ready шаблон Astro v6 + Tailwind CSS v4. Самая популярная Astro тема (2022–2025).
- **Что изучить:**
  - Структуру проекта (`src/components/`, `src/content/`, `config.yaml`).
  - Паттерн SEO-мета компонентов (`CustomStyles.astro`, `Favicons.astro`).
  - Интеграцию с Unpic для изображений.
  - Подход к Open Graph и социальным мета-тегам.
  - Конфигурацию через YAML (`config.yaml` вместо жёсткого TypeScript).
- **Почему полезно:** Лучшие практики от команды, которая делает Astro-сайты на продакшн.

---

### 4.2 Astro Paper — SEO-friendly блог

- **Ссылка:** [github.com/satnaing/astro-paper](https://github.com/satnaing/astro-paper)
- **Звёзды:** ~1.4K
- **Что это:** Минималистичный, доступный, SEO-friendly блог на Astro.
- **Что изучить:**
  - Структуру SEO (meta tags, structured data, RSS).
  - Dark mode реализацию.
  - Accessibility паттерны.
- **Почему полезно:** Если планируется раздел «Статьи» или «Блог» на Военном навигаторе — отличная основа.

---

### 4.3 bejamas/ui — Astro-native UI компоненты

- **Ссылка:** [bejamas.com/blog/introducing-bejamas-ui-an-astro-native-component-library](https://bejamas.com/blog/introducing-bejamas-ui-an-astro-native-component-library)
- **CLI:** `bunx bejamas@latest init`
- **Что это:** Первый полноценный Astro-native UI kit в стиле shadcn/ui. Компоненты — это plain `.astro` файлы (не React!), Tailwind v4, zero-JS by default.
- **Что изучить:**
  - Паттерны написания компонентов без React.
  - Интеграцию с Tailwind v4 tokens.
  - Подход к документации (авто-генерация из JSDoc → MDX → Starlight).
- **Почему полезно:** Для расширения дизайн-системы АМС без добавления React-зависимостей.

---

### 4.4 Vercel Examples — паттерны деплоя и архитектуры

- **Ссылка:** [github.com/vercel/examples](https://github.com/vercel/examples)
- **Что это:** Официальные примеры от Vercel: monorepo, Turborepo, edge functions, middleware, bot protection, i18n.
- **Что изучить:**
  - `solutions/monorepo` — как организовать monorepo с Astro.
  - `solutions/edge-middleware` — A/B тестирование, geo-redirects.
  - `solutions/bot-protection-datadome` — защита от ботов.
- **Почему полезно:** Если в будущем планируется переход на Vercel Hosting или нужны edge-функции.

---

### 4.5 `seo-graph` — Schema.org JSON-LD graph builder

- **Ссылка:** [github.com/jdevalk/seo-graph](https://github.com/jdevalk/seo-graph)
- **Что это:** Интеграция для построения связного JSON-LD графа (Organization → WebSite → WebPage → FAQPage → BreadcrumbList).
- **Что изучить:**
  - Как связать сущности между собой (`@id` references).
  - Паттерн «graph» вместо отдельных script-тегов.
- **Почему полезно:** У нас уже есть `src/lib/geo/schema.ts`. Можно сравнить подходы и усилить связность схем.

---

### 4.6 Starlight — документация на Astro

- **Ссылка:** [github.com/withastro/starlight](https://github.com/withastro/starlight)
- **Что это:** Официальный шаблон для документации от Astro. Поддерживает i18n, Pagefind search, Expressive Code.
- **Что изучить:**
  - Компоненты табов, карточек, асайдов — можно позаимствовать для бизнес-сайта.
  - Подход к навигации и sidebar.
- **Почему полезно:** Если планируется раздел «Помощь» или «База знаний».

---

## 5. Итоговая таблица приоритетов

| # | Репозиторий | Приоритет | Усилие | Эффект | Для AMS | Ссылка |
|---|-------------|-----------|--------|--------|---------|--------|
| 1 | `@astrojs/partytown` | 🔴 Высокий | 2ч | +30–50% LCP | Перенос Я.Метрики в worker | [GitHub](https://github.com/withastro/astro/tree/main/packages/integrations/partytown) |
| 2 | `astro-min` | 🔴 Высокий | 1ч | Меньше байтов | Минификация билда | [GitHub](https://github.com/advanced-astro/min) |
| 3 | `astro-icon` | 🔴 Высокий | 2ч | Чистый SVG | Иконки футера/меню | [GitHub](https://github.com/natemoo-re/astro-icon) |
| 4 | `@unpic/astro` | 🔴 Высокий | 3ч | Responsive images | Замена OptimizedImage | [GitHub](https://github.com/ascorbic/unpic-img) |
| 5 | `astro-loading-indicator` | 🟡 Средний | 30мин | UX навигации | С View Transitions | [GitHub](https://github.com/florian-lefebvre/astro-loading-indicator) |
| 6 | Astro prefetch (core) | 🟡 Средний | 15мин | Быстрая навигация | `astro.config.mjs` | [Docs](https://docs.astro.build/en/guides/prefetch/) |
| 7 | `PlayForm/Compress` | 🟡 Средний | 1ч | gzip/brotli | Сжатие статики | [GitHub](https://github.com/PlayForm/Compress) |
| 8 | `astro-purgecss-static` | 🟡 Средний | 2ч | Меньше CSS | После Tailwind v4 | [GitHub](https://github.com/KreskoLab/astro-purgecss-static) |
| 9 | `subfont` | 🟡 Средний | 2ч | -80% вес шрифта | Оптимизация Inter | [GitHub](https://github.com/forthgoing/subfont) |
| 10 | AstroWind | 🔵 Низкий | — | Reference | Паттерны компонентов | [GitHub](https://github.com/onwidget/astrowind) |
| 11 | bejamas/ui | 🔵 Низкий | — | Reference | Astro-native UI | [Site](https://bejamas.com/blog/introducing-bejamas-ui-an-astro-native-component-library) |
| 12 | Vercel Examples | 🔵 Низкий | — | Reference | Архитектура / деплой | [GitHub](https://github.com/vercel/examples) |
| 13 | `seo-graph` | 🔵 Низкий | — | Reference | JSON-LD graph | [GitHub](https://github.com/jdevalk/seo-graph) |
| 14 | Astro Paper | 🔵 Низкий | — | Reference | Блог / статьи | [GitHub](https://github.com/satnaing/astro-paper) |
| 15 | Starlight | 🔵 Низкий | — | Reference | Документация / компоненты | [GitHub](https://github.com/withastro/starlight) |

---

## 6. Следующие шаги

### Ближайшие (на этой неделе)
1. **Partytown + Яндекс.Метрика** — самый большой performance impact.
   - Проверить совместимость с текущим `analytics.ts`.
   - Настроить `forward: ['ym']` в конфиге Partytown.
   - Протестировать на dev и staging.

2. **Astro Prefetch** — бесплатное улучшение UX.
   - Добавить `prefetch: { prefetchAll: true }` в `astro.config.mjs`.
   - Проверить, что не ломает ничего на мобильных.

### Среднесрочные (на следующей неделе)
3. **astro-min** — просто добавить в конфиг, получить минификацию.
4. **astro-icon** — мигрировать SVG иконки из футера и UI.
5. **PlayForm/Compress** — добавить gzip/brotli к билду.

### Долгосрочные (в этом месяце)
6. **@unpic/astro** — исследовать как drop-in замену `OptimizedImage.astro`.
7. **subfont** — проверить, сколько весит подрезанный InterVariable.
8. **View Transitions + astro-loading-indicator** — SPA-like навигация.

---

> **Примечание:** Этот документ — living document. По мере изучения репозиториев и внедрения фич добавляйте сюда заметки, найденные проблемы и решения.

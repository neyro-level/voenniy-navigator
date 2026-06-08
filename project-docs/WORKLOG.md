# WORKLOG — Военный навигатор

## Текущий статус

- **Stack:** Astro 5 + Tailwind CSS v4 + TypeScript strict + React islands.
- **Build:** `pnpm build` passes with 0 errors, 0 warnings.
- **Browser check:** localhost and production (`voen-navigator.ru`) render correctly, 0 console errors.
- **Documentation source of truth:** `project-docs/`.

### 2026-06-09 — Стратегическая пересборка главной страницы и footer

- **Reworked:** главная `/` перестроена по новой коммерческой логике без смысловых повторов: оффер → процесс → маршруты → контраст риска и решения → живые сценарии → эксперт → FAQ → финальный CTA.
- **Updated:** блоки `04-FirstReview`, `05-SelectionLogic`, `06-Scenarios`, `07-MikhailTrust`, `09-FAQ`, `10-FinalCTA` переписаны с новым copywriting-слоем и премиальной визуальной иерархией.
- **Removed:** устаревший блок `08-Proof.astro` удалён из рендера и из файловой структуры как лишний и дублирующий trust-смыслы.
- **Improved mobile UX:** проведён проход по мобильной адаптации ключевых блоков главной, уточнены ритм отступов, tap-targets, вертикальные таймлайны и финальный CTA.
- **Expanded icons:** в `src/icons/` добавлены локальные SVG-иконки `shield-check`, `globe`, `clock` для использования в компонентах без зависимости от внешнего набора.
- **Rebuilt:** `src/components/layout/Footer.astro` полностью пересобран в спокойный премиальный footer без дублирующей заявки: бренд, контакты, 3 навигационные колонки и legal strip.
- **Checks:** `pnpm build` проходит успешно после всех изменений; локальный dev-сервер перезапущен и отображает актуальную версию страницы.

### 2026-06-08 — Усилен копирайтинг Hero-блока главной страницы

- **Updated:** `src/pages/_home/01-Hero.astro` по правилам `ams-copywriting` (Tight mode, 3U).
- **Refined:** eyebrow, lead-текст, примечание и сигналы сделаны конкретнее и острее, без воды.
- **Refined:** шаги в карточке «Как работает сервис» сокращены до сути (разбираем задачу, фиксируем критерии, отбираем список, определяем шаг).
- **Checked:** H1 и CTA строго соответствуют утверждённому brief (`PAGE_HOME.md`).
- **Next:** готов к разбору и усилению следующего блока главной страницы.

### 2026-06-08 — Собрана страница `/o-servise/` и включена в навигацию

- **Created:** новая entity/trust страница `src/pages/o-servise.astro` и блоки `src/pages/_o-servise/*` по `project-docs/briefs/PAGE_O_SERVISE.md`.
- **Included everywhere:** `/o-servise/` добавлена в header, footer и RouteMap overlay.
- **Updated brand layer:** `SITE.name`, `GEO_SITE.name` и связанные GEO/SEO-формулировки переведены на сервисный бренд `Военный навигатор`.
- **Updated:** breadcrumb/service schema для новой страницы, llms links и контактные schema-описания.
- **Checks:** после сборки страницы нужен `pnpm build`, локальный прогон `/o-servise/` и затем публикация изменений в GitHub.

### 2026-06-08 — Главная пересобрана с нуля по новому сервисному brief

- **Rebuilt from scratch:** главная `/` больше не донашивает старый каркас и собрана в новый чистый набор секций по `project-docs/briefs/PAGE_HOME.md`.
- **New block set:** `01-Hero`, `02-ShortAnswer`, `03-Routes`, `04-FirstReview`, `05-SelectionLogic`, `06-Scenarios`, `07-MikhailTrust`, `08-Proof`, `09-FAQ`, `10-FinalCTA`.
- **Route updated:** `src/pages/index.astro` переведён на новый порядок блоков, обновлённые FAQ и актуальные meta/schema-формулировки.
- **Legacy kept in repo:** старые `_home`-блоки не удалялись без отдельного согласования, но больше не участвуют в рендере главной.
- **Checks:** после полной пересборки главной выполню отдельный `pnpm build` и быструю проверку локального рендера.

### 2026-06-08 — Сервисное позиционирование и briefs для следующего этапа

- **Approved:** зафиксировано сервисное позиционирование: `Военный навигатор` — сервис выбора новостройки и сопровождения покупки по военной ипотеке, Михаил Хряпин — экспертное лицо и главный навигатор сервиса.
- **Merged:** `PROJECT_STANDARD.md` объединён с `PASSPORT_PROJECTS.md`; актуальные правила тона, CTA, первого шага и стоп-слов перенесены в паспорт.
- **Updated:** `project-docs/README.md`, `PASSPORT_PROJECTS.md` и `SITE_ARCHITECTURE.md` синхронизированы с новой субъектностью бренда.
- **Updated:** `project-docs/briefs/PAGE_HOME.md` пересобран как рабочий brief сервисной hub-главной.
- **Created:** `project-docs/briefs/PAGE_O_SERVISE.md` как новый brief entity/trust страницы `/o-servise/`.
- **Next:** отдельный этап планирования и разработки новой главной, route `/o-servise/`, перелинковки, schema и browser QA.

### 2026-06-08 — Централизация документации в project-docs

- **Decision:** `project-docs/` зафиксирован как единственная актуальная зона документации проекта.
- **Moved:** `PASSPORT_PROJECTS.md` и `WORKLOG.md` переведены в `project-docs/` как новые канонические файлы.
- **Moved:** `DESIGN_SYSTEM.md`, `SEMANTICS.md`, `PROJECT_STANDARD.md`, `SITE_DEVELOPMENT_RESEARCH.md`, шаблоны и все page briefs собраны в `project-docs/`.
- **Created:** полный набор as-built briefs по всем актуальным смысловым и promo-страницам.
- **Removed:** старые корневые дубли документов и неактуальные snapshot / component-doc файлы вне `project-docs/`.
- **Updated:** паспорт переписан с новой фактурой: Военный Навигатор как небольшая компания, Михаил Хряпин как руководитель и публичное лицо, ИП Мазур как юрлицо.

### 2026-06-08 — Сборка полного набора page briefs

- **Created:** as-built briefs для `PAGE_HOME`, `PAGE_PODBOR`, `PAGE_BONUS`, `PAGE_VOENNAYA_IPOTEKA_KRASNODAR`, `PAGE_VOENNAYA_IPOTEKA_KRYM`, `PAGE_KALKULYATOR_VOENNOY_IPOTEKI`, `PAGE_USLOVIYA_VOENNOY_IPOTEKI`, `PAGE_SEMEYNAYA_VOENNOY_IPOTEKI`, `PAGE_CONTACTS`.
- **Created:** `project-docs/README.md` и `project-docs/briefs/README.md` как навигация по структуре документации.

### 2026-06-08 — Публикация крупной переработки страниц + старт Development Research

- **Published:** в `origin/main` отправлен коммит `feat: expand service pages and refresh homepage structure` с крупной пользовательской переработкой главной страницы и service SEO-страниц.
- **Baseline:** перед улучшениями зафиксировано текущее техническое состояние — `pnpm build` и `pnpm geo-check` проходят, сборка генерирует 16 страниц.
- **Updated:** в `astro.config.mjs` включён встроенный Astro Prefetch с осторожной стратегией `prefetchAll: true` + `defaultStrategy: 'hover'`.

### 2026-06-08 — Partytown для Яндекс.Метрики

- **Added:** установлена интеграция `@astrojs/partytown@2.1.7` и подключена в `astro.config.mjs`.
- **Updated:** Partytown настроен с `forward: ['ym']`.
- **Changed:** `CookieBanner.tsx` теперь создаёт `type="text/partytown"` script только после согласия пользователя.
- **Checks:** `pnpm build` и `pnpm geo-check` проходят успешно (`100/100`).

### 2026-06-08 — Проверка astro-min и безопасный откат

- **Tested:** `astro-min@1.3.1` был протестирован.
- **Decision:** интеграция откатана полностью как небезопасная из-за hydration errors.
- **Improved:** `scripts/geo-check.mjs` сделан устойчивее к minified HTML.

### 2026-06-08 — Частичная миграция shared SVG на astro-icon

- **Added:** установлена интеграция `astro-icon@1.1.5`.
- **Updated:** на `<Icon />` переведены shared/layout зоны, CTA-иконки и thanks-иконки.
- **Checks:** `pnpm build` и `pnpm geo-check` проходят (`100/100`).

### 2026-06-08 — Infra audit AMS Server по compression

- **Verified:** production сайта обслуживается Nginx `1.18.0 (Ubuntu)` на AMS Server.
- **Verified:** HTML уже отдаётся с `Content-Encoding: gzip`.
- **Found:** для JS/CSS компрессия не включена.
- **Decision:** этап `PlayForm/Compress` отложен как инфраструктурно заблокированный.

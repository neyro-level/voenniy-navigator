# WORKLOG — Военный навигатор

## Текущий статус

- **Stack:** Astro 5 + Tailwind CSS v4 + TypeScript strict + React islands.
- **Build:** `pnpm build` passes with 0 errors, 0 warnings.
- **Browser check:** localhost and production (`voen-navigator.ru`) render correctly, 0 console errors.
- **Documentation source of truth:** `project-docs/`.

### 2026-06-10 — Пересборка блока Conditions на странице условий военной ипотеки

- **Reframed block logic:** `src/pages/_usloviya-voennoy-ipoteki/02-Conditions.astro` переведён из общего списка правил в более сильный сценарий `4 ключевых параметра одобрения`.
- **Strengthened conversion angle:** новый lead объясняет, что сервис проверяет параметры до подачи документов и помогает исключить отказ на старте, а не просто пересказывает правила НИС.
- **Rebuilt cards:** вместо 6 перегруженных карточек собрана строгая сетка 2x2 с 4 карточками: стаж в НИС, ежегодный взнос государства, срок кредитования и требования к объекту.
- **Refined visual layer:** карточки переведены в более премиальный flat-паттерн с тонкой рамкой, акцентными иконками, номером карточки и усилением ключевых цифр внутри текста.
- **Updated brief:** `project-docs/briefs/PAGE_USLOVIYA_VOENNOY_IPOTEKI.md` обновлён до v1.1 и синхронизирован с новым as-built смыслом блока `02 Conditions`.

### 2026-06-10 — Фикс прыгающих ползунков в карточках накоплений и собственных средств

- **Stabilized field headers:** в `src/pages/_kalkulyator-voennoy-ipoteki/02-Calculator.astro` шапка field-card переведена с `flex` на более жёсткую `grid`-схему, чтобы label и значение больше не спорили за ширину.
- **Reserved value column:** для числового output задана стабильная ширина и `tabular-nums`, чтобы рост суммы не менял геометрию карточки.
- **Locked label height:** label-слой зафиксирован под 2 строки, поэтому `Накопления НИС` и длинные подписи больше не двигают ползунок вверх-вниз.
- **Shortened own-funds copy:** подпись `Собственные средства / маткапитал` сокращена до `Свои средства / маткапитал`, чтобы уверенно держаться в пределах двух строк.
- **Checks:** `pnpm build` проходит успешно; локально подтверждено на tablet/laptop, что ползунки в карточках `Накопления НИС` и `Свои средства / маткапитал` больше не прыгают.

### 2026-06-10 — Полировка калькулятора для laptop/tablet и облегчение вторичного текста

- **Refined responsive logic:** в `src/pages/_kalkulyator-voennoy-ipoteki/02-Calculator.astro` скорректированы брейкпоинты калькулятора: на `~1100px` блок раньше переключается в более спокойный single-column tablet-layout вместо тесного desktop-режима.
- **Reduced visual bulk:** уменьшены paddings у frame / controls / summary-panel, уплотнены tabs, сценарные карточки и field-cards, чтобы калькулятор легче выглядел на ноутбуках и планшетах.
- **Softened secondary typography:** вторичные тексты, пояснения, label-слой, microcopy и summary-notes сделаны меньше и легче по визуальному весу без потери читаемости.
- **Improved scenario rhythm:** на промежуточных ширинах сценарии собираются в более чистую 2-column композицию, а на tablet/mobile уходят в 1 колонку.
- **Checks:** `pnpm build` проходит успешно; локально подтверждена адаптация калькулятора на `1180px`, `1024px` и `768px`.

### 2026-06-10 — Синхронизация FAQ и финального CTA калькулятора с главной страницей

- **Confirmed route state:** сценарный блок на странице калькулятора не возвращён в рендер; после блока параметров по странице сразу идёт FAQ.
- **Updated FAQ design:** `src/pages/_kalkulyator-voennoy-ipoteki/06-FAQ.astro` приведён к визуальному паттерну главной страницы: sticky-левая колонка, CTA-ссылка, нумерованный аккордеон, hover/open-состояния и плавное раскрытие.
- **Updated final CTA design:** `src/pages/_kalkulyator-voennoy-ipoteki/07-CTA.astro` переведён с shared dark CTA на тот же светлый премиальный финальный экран, что и на главной странице.
- **Synced CTA copy:** финальная кнопка калькулятора возвращена к проектной формулировке `Получить разбор ситуации` вместо более слабого `Отправить на разбор`.
- **Updated brief:** `project-docs/briefs/PAGE_KALKULYATOR_VOENNOY_IPOTEKI.md` синхронизирован с новым as-built решением для FAQ и Final CTA.

### 2026-06-10 — Пересборка страницы калькулятора под short hero + wide workbench

- **Reworked Hero:** `src/pages/_kalkulyator-voennoy-ipoteki/01-Hero.astro` сокращён до короткого первого экрана без proof-слоя и лишних буллитов: новый H1 `Калькулятор военной ипотеки, сколько даст банк?`, короткий лид и CTA `Подать заявку`.
- **Created:** новый блок `src/pages/_kalkulyator-voennoy-ipoteki/02-Calculator.astro` как основной full-width workbench страницы вместо зажатой hero-панели.
- **Added logic:** калькулятор разделён на 2 режима — `Бюджет покупки` и `Накопления НИС`; добавлен мостик `Подставить накопления в бюджет покупки`.
- **Expanded results:** в summary-rail теперь показываются сумма кредита, стартовый взнос, бюджет покупки и понятный KPI `Не хватает / Запас`.
- **Updated flow:** route `src/pages/kalkulyator-voennoy-ipoteki.astro` переведён на новую структуру `Hero → Calculator → Explainer → Basics → Scenarios → FAQ → Final CTA`.
- **Synced copy:** секции `02-Explainer`, `03-Basics`, `04-Scenarios`, `05-FAQ` обновлены по нумерации после добавления отдельного блока калькулятора.
- **Updated brief:** `project-docs/briefs/PAGE_KALKULYATOR_VOENNOY_IPOTEKI.md` обновлён под новую структуру и dual-logic модель.
- **Checks:** `pnpm build` проходит успешно; через localhost подтверждены короткий hero, wide-калькулятор, mobile-адаптация и перенос накоплений НИС в основной расчёт.

### 2026-06-10 — Оптимизация структуры страницы калькулятора: убран лишний блок, усилен FAQ

- **Removed redundant block:** удалён дублирующий блок сценариев (`06-Scenarios.astro`), так как информация о лимитах и программах уже была раскрыта в блоке «Параметры». Это ускорило страницу и сфокусировало пользователя на целевом действии.
- **Upgraded FAQ:** блок `06-FAQ.astro` пересобран в премиальном формате главной страницы (асимметричная сетка, нумерация, плавное раскрытие). Все вопросы по умолчанию закрыты.
- **Strengthened copy:** вопросы и ответы в FAQ переписаны под интент пользователя после калькулятора (про расхождения в суммах, аккредитацию, дистанционные сделки и выбор банка).
- **Restructured:** файлы блоков переименованы для сохранения хронологического порядка (`06-FAQ`, `07-CTA`).
- **Updated route:** `src/pages/kalkulyator-voennoy-ipoteki.astro` обновлён с новой, более короткой и конверсионной последовательностью.
- **Updated brief:** `project-docs/briefs/PAGE_KALKULYATOR_VOENNOY_IPOTEKI.md` синхронизирован с новой 7-блочной структурой.
- **Checks:** `pnpm build` проходит успешно; страница стала легче, быстрее и логичнее ведет к заявке.

### 2026-06-09 — Полная пересборка страницы `/o-servise/` по brief v3.0

- **Reworked Hero:** блок `01-Hero.astro` пересобран под более плотный trust-first сценарий: новый H1, 2 версии подзаголовка (desktop/mobile), минималистичный trust-row, photo-card Михаила с corner brackets.
- **Created:** новый `02-ProofLayer.astro` сразу после Hero с цифрами доверия: 65 сделок по ВИ, 180 сделок, с 2016 года, 0% комиссии для покупателя.
- **Created:** новый `03-Process.astro` вместо старого блока ограничений — 4 премиальных шага процесса: разбор, подбор, ипотека, сопровождение сделки.
- **Rebuilt:** `04-RoleOfMikhail.astro` в editorial split-композиции: фото `mikhail-hero.png`, новый коммерческий H2, прямой lead и 3 смысла (опыт, ответственность, глубокий разбор).
- **Rebuilt:** `05-FAQ.astro` приведён к точному визуальному паттерну главной страницы: sticky-левая колонка, нумерованный аккордеон, плавное раскрытие, все вопросы по умолчанию закрыты.
- **Rebuilt:** `06-FinalCTA.astro` приведён к точному визуальному паттерну главной страницы: светлый фон, левый оффер и правая карточка гарантий. Тёмная версия убрана.
- **Removed:** удалены устаревшие блоки `02-WhatIsService`, `03-WhyMilitaryFamilies`, `05-PrimaryReview`, `06-SelectionMethod`, `07-Transparency`, `08-ProofLayer`, `09-OfficesContact`, `10-FinalCTA`.
- **Updated route:** `src/pages/o-servise.astro` переведён на новую 6-блочную структуру: Hero → ProofLayer → Process → RoleOfMikhail → FAQ → FinalCTA.
- **Updated SEO layer:** `src/pages/_o-servise/pageData.ts` синхронизирован с новой субъектностью и OG для страницы.
- **Updated brief:** `project-docs/briefs/PAGE_O_SERVISE.md` обновлён до v3.0 и синхронизирован с финальной структурой и светлым CTA.
- **Checks:** `pnpm build` и `pnpm geo-check` проходят успешно; mobile-адаптация уточнена для Hero, RoleOfMikhail, FAQ и FinalCTA.

### 2026-06-09 — Mobile UX правка Hero на главной

- **Adjusted:** в `src/pages/_home/01-Hero.astro` убран принудительный `order: -1` у hero-визуала на tablet/mobile.
- **Result:** в мобильной адаптации главной визуал теперь идёт после текста, CTA и trust-сигналов, а не поднимается над оффером.
- **Reason:** первый экран на mobile стал ближе к коммерческой логике страницы: сначала смысл и действие, затем поддерживающий визуал.

### 2026-06-09 — Аудит и чистка блока `04-FirstReview` на главной

- **Audited:** блок `Как мы формируем ваш персональный маршрут покупки` проверен на laptop (`1366px`), small laptop/tablet (`1023px`, `768px`) и mobile (`390px`) через localhost.
- **Root cause found:** лишний маркер `03` вверху экрана появлялся из-за responsive-ветки в `src/pages/_home/04-FirstReview.astro`: номер шага становился `position: absolute`, но карточка не имела корректного локального контекста и таймлайн разваливался.
- **Reworked responsive pattern:** tablet/mobile-режим переведён с ломаного вертикального таймлайна на чистый стек карточек с inline badge-номерами `01 / 02 / 03`.
- **Improved:** скрыты декоративные connectors на tablet/mobile, возвращены карточкам нормальные границы, фон, радиусы и читаемая внутренняя иерархия.
- **Kept intact:** desktop-версия блока сохранена в горизонтальной 3-card композиции.
- **Checks:** `pnpm build` проходит успешно после правки; браузерно подтверждён корректный вид блока на `1366 / 1023 / 768 / 390`.

### 2026-06-09 — Усилен trust-блок Михаила и финальный CTA на главной

- **Updated:** в `src/pages/_home/07-MikhailTrust.astro` фото Михаила переведено из простой вставки в layered photo-card: добавлены премиальная рамка, мягкая подложка, световой halo и нижняя caption-плашка с ролью.
- **Responsive:** фото-блок Михаила проверен и адаптирован для desktop / tablet / mobile без потери читаемости и без конфликтов с текстовой частью секции.
- **Updated:** в `src/pages/_home/10-FinalCTA.astro` правая гарантийная зона пересобрана в более премиальную visual-card композицию с layered shell, glow-подложкой и отдельными benefit-cards.
- **Improved:** гарантии `Без комиссий`, `Можно дистанционно`, `20 минут` получили нумерацию, более сильную иерархию и устойчивый responsive-layout вместо простой плоской карточки.
- **Checks:** `pnpm build` проходит успешно; финальный CTA и trust-блок Михаила просмотрены на `1366 / 768 / 390` через localhost.

### 2026-06-09 — Стратегическая пересборка главной страницы и footer

- **Reworked:** главная `/` перестроена по новой коммерческой логике без смысловых повторов: оффер → процесс → маршруты → контраст риска и решения → живые сценарии → эксперт → FAQ → финальный CTA.
- **Updated:** блоки `04-FirstReview`, `05-SelectionLogic`, `06-Scenarios`, `07-MikhailTrust`, `09-FAQ`, `10-FinalCTA` переписаны с новым copywriting-слоем и премиальной визуальной иерархией.
- **Removed:** устаревший блок `08-Proof.astro` удалён из рендера и из файловой структуры как лишний и дублирующий trust-смыслы.
- **Improved mobile UX:** проведён проход по мобильной адаптации ключевых блоков главной, уточнены ритм отступов, tap-targets, вертикальные таймлайны и финальный CTA.
- **Expanded icons:** в `src/icons/` добавлены локальные SVG-иконки `shield-check`, `globe`, `clock` для использования в компонентах без зависимости от внешнего набора.
- **Rebuilt:** `src/components/layout/Footer.astro` полностью пересобран в спокойный премиальный footer без дублирующей заявки: бренд, контакты, 3 навигационные колонки и legal strip.
- **Checks:** `pnpm build` проходит успешно после всех изменений; локальный dev-сервер перезапущен и отображает актуальную версию страницы.

### 2026-06-09 — SEO/GEO аудит и синхронизация по семантическому ядру

- **Audited:** SEO/GEO-модуль проверен по `BaseLayout`, `geo/config.ts`, `geo/schema.ts`, `robots.txt`, `llms.txt`, sitemap и indexable routes.
- **Fixed module mismatch:** из глобального `WebSite` schema убран ложный `SearchAction`, потому что на сайте нет реального onsite-поиска.
- **Synced GEO layer:** обновлены `GEO_SERVICES`, `GEO_PROCESS`, `GEO_FAQ`, `GEO_LINKS` и `llms.txt` под текущую сервисную субъектность, новую главную, страницу `/o-servise/` и семантические приоритеты проекта.
- **Updated page SEO:** пересобраны `title`, `description`, OG и page-level schema для `/`, `/o-servise/`, `/voennaya-ipoteka-krasnodar/`, `/voennaya-ipoteka-krym/`, `/kalkulyator-voennoy-ipoteki/`, `/usloviya-voennoy-ipoteki/`, `/semeynaya-voennaya-ipoteka/`, `/contacts/`.
- **Expanded schema coverage:** для страниц калькулятора, условий и семейной военной ипотеки добавлены `Service` + `FAQPage` JSON-LD; `faqItems` вынесены в `pageData.ts`, чтобы schema и видимый FAQ не расходились.
- **Cleaned mismatch:** со страницы `/contacts/` убран `FAQPage` schema, потому что отдельный FAQ-блок в route не рендерится; contact page переведена в более точный brand/local SEO-слой.
- **Fixed linking:** устранены битые ссылки на несуществующий route `/distancionnaya-pokupka/`; для contact CTA добавлен реальный anchor `#request` как fallback.
- **Checks:** `pnpm build` и `pnpm geo-check` проходят успешно, GEO score `100/100`.

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

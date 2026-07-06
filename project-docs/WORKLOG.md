# WORKLOG — Военный навигатор

## Текущий статус

- **Stack:** Astro 5 + Tailwind CSS v4 + TypeScript strict + React islands.
- **Build:** `pnpm build` passes; текущая сборка без ошибок, с 1 неблокирующим warning от Astro content loader.
- **Browser check:** localhost and production (`voen-navigator.ru`) render correctly, 0 console errors.
- **Documentation source of truth:** `project-docs/`.

## 2026-07-06 — Заменён root verification-файл Яндекс.Вебмастера

- **Goal:** перевести домен на новый аккаунт Яндекс.Вебмастера и убрать старый verification-код из корня сайта.
- **Removed:** `public/yandex_3736f6157fb9c46c.html`
- **Added:** `public/yandex_7114ad7de7461e1d.html`
- **Verification code:** `Verification: 7114ad7de7461e1d`
- **Check:** по проекту не осталось ссылок на старый root verification-файл; служебные regex в `scripts/geo-check.mjs` и `scripts/seo-check.mjs` менять не потребовалось, потому что они матчат любой `yandex_<hex>.html`.

## 2026-07-03 — Проведён повторный SEO/GEO-аудит после расширения структуры журнала

- **Goal:** синхронизировать AI/SEO-модуль сайта с расширенным journal-layer, новыми route-страницами и обновлённой SEO-структурой перед повторным production deploy.
- **AI/GEO layer updated:**
  - `src/lib/geo/llms.ts` переведён на live-генерацию `llms.txt` из фактической структуры сайта: priority commercial pages, journal archive, все rubrics и все 18 опубликованных статей теперь автоматически попадают в AI-readable map;
  - `src/pages/llms.txt.ts` сделан асинхронным, чтобы `llms.txt` собирался из реального content-layer, а не из статичного списка;
  - `src/lib/geo/schema.ts` усилен: `Organization` теперь отдаёт более полный entity-signal, `contactPoint`, `areaServed`, description и publisher-связку для AI/SEO-слоя;
  - `src/layouts/BaseLayout.astro` теперь гарантирует sitewide baseline `WebSite + Organization` schema даже на journal-layer, где раньше organization-сигнал не был стабильно задан на всех страницах.
- **GEO check updated:** `scripts/geo-check.mjs` переписан под текущую live-архитектуру:
  - проверяет priority commercial pages;
  - проверяет meta/schema coverage на indexable pages;
  - валидирует `BlogPosting` на статьях;
  - валидирует `CollectionPage` на archive/category routes;
  - проверяет, что `llms.txt` реально отражает commercial layer + journal structure + live article URLs;
  - корректно исключает utility/noindex routes из sitemap expectations.
- **Cleanup:** placeholder email убран из `src/lib/geo/config.ts`, чтобы GEO-config не держал production-like TODO-значение.
- **Verification passed:**
  - `pnpm build`
  - `pnpm geo-check` → `100 / 100`
  - `pnpm seo-check` → `0 blockers`, `5 warnings`
- **Accepted warnings:** 5 warning по длинным journal `title` приняты осознанно, потому что пользователь отдельно запретил править тексты, `title` и `H1` в рамках этого релиза.
- **Docs synced:** обновлён `project-docs/SEO_PASSPORT_VOEN_NAVIGATOR.md`, чтобы AI/GEO source of truth был зафиксирован в каноническом SEO-документе проекта.

## 2026-07-03 — Опубликован усиленный journal-layer и синхронизирован SEO-документный контур

- **Goal:** вывести в live-слой весь подготовленный журнал без переписывания текстов, `title` и `H1`, синхронизировать SEO-паспорт и клиентский PDF-документ, пройти локальные technical + browser checks и подготовить production-release.
- **Live journal sync:** все `ARTICLE_*.md` в `project-docs/briefs/journal/` механически перенесены в `src/content/journal/` по canonical fenced-блокам `Полный текст статьи для переноса`; текущий live-слой журнала теперь содержит `18` опубликованных статей.
- **New articles published:** добавлены live-файлы:
  - `src/content/journal/dokumenty-dlya-voennoy-ipoteki.md`
  - `src/content/journal/prodat-kvartiru-po-voennoy-ipoteke.md`
  - `src/content/journal/vtorichka-po-voennoy-ipoteke.md`
  - `src/content/journal/pervonachalnyy-vznos-po-voennoy-ipoteke.md`
  - `src/content/journal/distantsionnaya-pokupka-po-voennoy-ipoteke.md`
  - `src/content/journal/skolko-stoit-sdelka-po-voennoy-ipoteke.md`
  - `src/content/journal/proverka-obekta-po-voennoy-ipoteke.md`
  - `src/content/journal/voennaya-ipoteka-v-sochi-i-novorossiyske.md`
- **Assets added:** созданы временные SVG-обложки:
  - `public/images/journal/distantsionnaya-pokupka-po-voennoy-ipoteke-cover.svg`
  - `public/images/journal/pervonachalnyy-vznos-po-voennoy-ipoteke-cover.svg`
  - `public/images/journal/proverka-obekta-po-voennoy-ipoteke-cover.svg`
  - `public/images/journal/skolko-stoit-sdelka-po-voennoy-ipoteke-cover.svg`
  - `public/images/journal/voennaya-ipoteka-v-sochi-i-novorossiyske-cover.svg`
- **Journal logic synced:** `src/lib/journal/index.ts` обновлён под новые primary/secondary routes и supporting-кластеры для money pages.
- **Docs synced:** приведены к фактическому live-состоянию:
  - `project-docs/SEO_PASSPORT_VOEN_NAVIGATOR.md`
  - `project-docs/JOURNAL_EDITORIAL_MAP.md`
  - `project-docs/JOURNAL_SEO_ENHANCEMENT_PLAN.md`
  - `project-docs/SEO_INTERNAL_LINKING_MATRIX_2026-07-03.md`
  - `project-docs/CLIENT_SEO_PDF_3M_VOEN_NAVIGATOR.md`
  - `project-docs/briefs/journal/README.md`
- **Technical fixes:** исправлена опечатка во внутреннем slug-ссылке в материале про первоначальный взнос; `scripts/seo-check.mjs` доработан так, чтобы journal pagination `/journal/N/` корректно считалась archive-layer, а не article-layer.
- **Verification passed:**
  - `pnpm build`
  - `pnpm geo-check`
  - `pnpm seo-check`
  - browser QA preview на `1366px` и `390px` для `/journal/`, `/journal/3/`, `/journal/distantsionnaya-pokupka-po-voennoy-ipoteke/`, `/journal/category/sdelka-i-riski/`, `/usloviya-voennoy-ipoteki/`
- **Browser QA result:** горизонтального overflow не найдено; пагинация `/journal/3/` собирается и открывается; новые article routes, archive, category pages и supporting-blocks отображаются корректно; проверочные HEAD-запросы к новым SVG и связанным image assets вернули `200`.
- **Accepted warning:** `pnpm seo-check` оставляет `5` soft-warnings по длинным journal titles; warning принят осознанно, потому что в рамках этого релиза видимые `title / H1` запрещено менять по ТЗ пользователя.
- **Production release:** commit `bd9b9c5` (`Publish expanded journal and sync SEO docs`) отправлен в `main`; GitHub Actions workflow `Deploy to AMS Server` (`run 28667231921`) завершился успешно.
- **Live smoke-check:** production `https://voen-navigator.ru` после деплоя проверен вручную; `200` и корректные live-title подтверждены для `/`, `/journal/`, `/journal/3/`, `/journal/distantsionnaya-pokupka-po-voennoy-ipoteke/`, `/journal/dokumenty-dlya-voennoy-ipoteki/`, `/journal/voennaya-ipoteka-v-sochi-i-novorossiyske/`, `/usloviya-voennoy-ipoteki/`; реальные `cover` новых материалов отдают `200`, archive-layer и supporting-blocks доступны на проде.

## 2026-07-03 — Созданы брифы на 5 новых статей журнала по глобальному SEO-плану

- **Goal:** реализовать предложения из глобального плана развития журнала: закрыть пробелы по первоначальному взносу, дистанционной покупке, стоимости сделки, проверке объекта и гео-расширению (Сочи / Новороссийск).
- **New article briefs created:**
  - `project-docs/briefs/journal/ARTICLE_PERVONACHALNY_VZNOS_PO_VOENNOY_IPOTEKE.md` — «Первоначальный взнос по военной ипотеке: сколько нужно своих денег».
  - `project-docs/briefs/journal/ARTICLE_DISTANTSIONNAYA_POKUPKA_PO_VOENNOY_IPOTEKE.md` — «Дистанционная покупка квартиры по военной ипотеке: как купить, находясь в другом городе».
  - `project-docs/briefs/journal/ARTICLE_STOIMOST_SDELKI_PO_VOENNOY_IPOTEKE.md` — «Сколько стоит сделка по военной ипотеке: скрытые расходы, которые не видны сразу».
  - `project-docs/briefs/journal/ARTICLE_PROVERKA_OBEKTA_PO_VOENNOY_IPOTEKE.md` — «Проверка объекта перед покупкой по военной ипотеке: что смотреть, чтобы не купить проблемы».
  - `project-docs/briefs/journal/ARTICLE_SOCHI_NOVOROSSIYSK_VOENNAYA_IPOTEKA.md` — «Военная ипотека в Сочи и Новороссийске: стоит ли покупать на юге России».
- **Each brief includes:**
  - live `title / description / H1 / excerpt / tags`;
  - cover path + `coverAlt`;
  - детальное описание нужной фотографии;
  - ТЗ для Codex: создать временную SVG-заглушку обложки;
  - роль статьи, семантический фокус, объём, тон, каркас;
  - 3 семейных сценария;
  - типичные ошибки;
  - чек-лист;
  - перелинковка и CTA;
  - полный текст статьи для переноса в `site/src/content/journal/`;
  - FAQ из 5 вопросов;
  - ТЗ по schema (BlogPosting + BreadcrumbList).
- **Documentation synced:**
  - `project-docs/JOURNAL_SEO_ENHANCEMENT_PLAN.md` — фаза 3 дополнена 8 статьями, добавлена фаза 5 с будущими кандидатами.
  - `project-docs/JOURNAL_EDITORIAL_MAP.md` — таблица статей, будущие статьи, раздел глобальных усилений и список брифов обновлены.
  - `project-docs/SEO_PASSPORT_VOEN_NAVIGATOR.md` — раздел 5.3 дополнен 5 новыми статьями.
- **Note:** сайт не изменялся. Все материалы готовы для реализации Codex.

## 2026-07-03 — Предложено глобальное усиление журнала и созданы брифы 3 новых статей

- **Goal:** выйти за рамки завершённой фазы 2 SEO-усиления журнала и предложить масштабное развитие кластера `/journal/`.
- **Global enhancement added:** в `project-docs/JOURNAL_EDITORIAL_MAP.md` добавлен раздел 10 «Глобальные усиления журнала» с предложениями по расширению кластера, форматам, hub-странице, перелинковке и метрикам.
- **New article briefs created:**
  - `project-docs/briefs/journal/ARTICLE_DOKUMENTY_DLYA_VOENNOY_IPOTEKI.md` — «Документы для военной ипотеки: что собрать до похода в банк».
  - `project-docs/briefs/journal/ARTICLE_PRODAT_KVARTIRU_PO_VOENNOY_IPOTEKE.md` — «Можно ли продать квартиру, купленную по военной ипотеке: правила и ограничения».
  - `project-docs/briefs/journal/ARTICLE_VTORICHKA_PO_VOENNOY_IPOTEKE.md` — «Вторичка по военной ипотеке: когда готовая квартира выгоднее новостройки».
- **Documentation synced:**
  - `project-docs/JOURNAL_SEO_ENHANCEMENT_PLAN.md` — фаза 3 обновлена списком новых статей.
  - `project-docs/JOURNAL_EDITORIAL_MAP.md` — таблица статей, будущие статьи и список брифов обновлены.
  - `project-docs/SEO_PASSPORT_VOEN_NAVIGATOR.md` — раздел 5.3 дополнен 3 новыми статьями.
- **Style:** все тексты в журналистско-экспертном стиле, с живыми вводными, 3 сценариями, типичными ошибками и чек-листами. Сайт не изменялся — брифы готовы для переноса в `site/src/content/journal/`.

## 2026-07-03 — Исправлены карты на страницах Краснодара и Крыма

- **Problem confirmed on production:** на `https://voen-navigator.ru/voennaya-ipoteka-krasnodar/` и `https://voen-navigator.ru/voennaya-ipoteka-krym/` Yandex Maps JS API возвращал `Invalid API key`, из-за чего интерактивная карта могла зависать пустым блоком.
- **Code updated:** `src/components/ui/ComplexesMapReact.tsx` переведён на отказоустойчивую схему: при валидном ключе остаётся интерактивная карта, при ошибке или отсутствии ключа автоматически показывается статичная карта Яндекс с кликабельными маркерами и сохранённым переходом к карточкам ЖК.
- **Styles synced:** `src/components/sections/ComplexesMapSection.astro` и `src/pages/_voennaya-ipoteka-krym/02-Map.astro` получили стили для статичной карты, маркеров и сервисного уведомления.
- **Verification passed:** локально открыты страницы `/voennaya-ipoteka-krasnodar/` и `/voennaya-ipoteka-krym/`, карта отображается, маркеры рендерятся, консоль без ошибок и warning.
- **Build passed:** `pnpm build` (`astro check && astro build`) — 0 errors, 0 warnings.

### 2026-06-30 — Исправлен meta-layout карточек журнала на desktop и mobile

- **File updated:** `src/components/journal/JournalCard.astro`.
- **Problem fixed:** в превью-карточках `/journal/` рубрика, дата публикации и время чтения визуально расползались: на desktop/laptop дата и `N мин` опускались относительно рубрики, а на mobile вся meta-строка ломала ритм карточек.
- **Layout updated:** meta-зона карточки переведена с плавающего `flex-wrap` на явную двухстрочную структуру: рубрика отдельно, дата и время чтения — в отдельной компактной строке с разделителем.
- **Verified:** `pnpm build`, `pnpm geo-check` и `pnpm seo-check` завершились успешно; локальный preview `/journal/` проверен на `1366px` и `390px` — дата и `N мин` больше не сползают, горизонтального overflow нет.

### 2026-06-30 — Уточнены продающие заголовки модалки в блоке «Готовые подборки»

- **File updated:** `src/pages/_home/02-EntryPoints.astro`.
- **Modal behavior kept:** все 6 карточек второго блока на главной продолжают открывать стандартную модальную форму заявки через `data-modal-open`.
- **Sales copy updated:** заголовки модалки на всех карточках приведены к единому формату `Получите подборку ...`, чтобы оффер сразу совпадал со сценарием выбранной подборки.
- **Verified:** `pnpm build`, `pnpm geo-check` и `pnpm seo-check` завершились успешно; в `dist/index.html` на всех 6 карточках главной уже стоят нужные `data-modal-title` со своими продающими заголовками.

### 2026-06-30 — Заменена обложка статьи про банки по военной ипотеке

- **Article:** `/journal/banki-po-voennoy-ipoteke/`.
- **Source image:** пользовательское фото `Для журнала фото 4.webp` перенесено в публичный media-слой как `public/images/journal/banki-po-voennoy-ipoteke-cover.webp`.
- **Content updated:** `src/content/journal/banki-po-voennoy-ipoteke.md` переведён с `/images/secondary-hero.jpg` на новый WEBP; `coverAlt` обновлён под новый сюжет.
- **Verified:** `pnpm build`, `pnpm geo-check` и `pnpm seo-check` завершились успешно; в `dist/journal/banki-po-voennoy-ipoteke/index.html` и `dist/journal/index.html` статья и карточка архива уже используют `/images/journal/banki-po-voennoy-ipoteke-cover.webp`.
- **Note:** Astro во время `build` выводит non-blocking warning `Duplicate id "banki-po-voennoy-ipoteke"` для этой статьи; route собирается штатно, но content-loader слой стоит отдельно перепроверить при следующем тех-аудите журнала.

### 2026-06-30 — Заменена обложка статьи про покупку квартиры в Краснодаре

- **Article:** `/journal/kak-kupit-kvartiru-po-voennoy-ipoteke-v-krasnodare/`.
- **Source image:** пользовательское фото `Для журнала фото 3.jpg` перенесено в публичный media-слой как `public/images/journal/kak-kupit-kvartiru-v-krasnodare-cover.jpg`.
- **Content updated:** `src/content/journal/kak-kupit-kvartiru-po-voennoy-ipoteke-v-krasnodare.md` переведён с `/images/krasnodar-newbuild-hero.png` на новый JPG; `coverAlt` обновлён под новый сюжет.
- **Verified:** `pnpm build` завершился успешно; в `dist/journal/kak-kupit-kvartiru-po-voennoy-ipoteke-v-krasnodare/index.html` и `dist/journal/index.html` статья и карточка архива уже используют `/images/journal/kak-kupit-kvartiru-v-krasnodare-cover.jpg`.
- **Note:** Astro во время `build` выводит non-blocking warning `Duplicate id "kak-kupit-kvartiru-po-voennoy-ipoteke-v-krasnodare"` для этой статьи; route собирается штатно, но content-loader слой стоит отдельно перепроверить при следующем тех-аудите журнала.

### 2026-06-30 — Заменена обложка статьи про новостройки Краснодара

- **Article:** `/journal/novostroyki-krasnodara-po-voennoy-ipoteke/`.
- **Source image:** пользовательское фото `Для журнала фото 2.jpg` перенесено в публичный media-слой как `public/images/journal/novostroyki-krasnodara-cover.jpg`.
- **Content updated:** `src/content/journal/novostroyki-krasnodara-po-voennoy-ipoteke.md` переведён с `/images/complexes/samolet/samolet-1.jpg` на новый JPG; `coverAlt` обновлён под новый сюжет.
- **Verified:** `pnpm build` завершился успешно; в `dist/journal/novostroyki-krasnodara-po-voennoy-ipoteke/index.html` и `dist/journal/index.html` статья и карточка архива уже используют `/images/journal/novostroyki-krasnodara-cover.jpg`.
- **Note:** Astro во время `build` выводит non-blocking warning `Duplicate id "novostroyki-krasnodara-po-voennoy-ipoteke"` для этой статьи; route собирается штатно, но content-loader слой стоит отдельно перепроверить при следующем тех-аудите журнала.

### 2026-06-30 — Заменена обложка статьи про калькулятор военной ипотеки

- **Article:** `/journal/kalkulyator-voennoy-ipoteki-chto-schitat/`.
- **Source image:** пользовательское фото `Фото для блога военный 1.jpg` перенесено в публичный media-слой как `public/images/journal/kalkulyator-voennoy-ipoteki-cover.jpg`.
- **Content updated:** `src/content/journal/kalkulyator-voennoy-ipoteki-chto-schitat.md` переведён с `/images/mortgage-hero.webp` на новый JPG; `coverAlt` обновлён под новый сюжет.
- **Verified:** `pnpm build` завершился успешно; в `dist/journal/kalkulyator-voennoy-ipoteki-chto-schitat/index.html` и `dist/journal/index.html` статья и карточка архива уже используют `/images/journal/kalkulyator-voennoy-ipoteki-cover.jpg`.
- **Note:** Astro во время `build` выводит non-blocking warning `Duplicate id "kalkulyator-voennoy-ipoteki-chto-schitat"` для этой статьи; route собирается штатно, но content-loader слой стоит отдельно перепроверить при следующем тех-аудите журнала.

### 2026-06-30 — Обновлён единый social / OG cover сайта

- **Problem:** текущий social-preview использовал старые портретные изображения Михаила Хряпина; в предпросмотре соцсетей это давало неаккуратный кроп с обрезанной головой.
- **Decision:** вместо разных OG-картинок для сервисных страниц введён единый site-level social-cover с акцентом на новостройки и маршрут по военной ипотеке.
- **Created:** `public/images/og/voenniy-navigator-social-cover.png`.
- **Generator:** добавлен `scripts/generate-social-cover.ps1`, чтобы можно было быстро пересобрать social-cover без ручной работы в стороннем редакторе.
- **Meta layer updated:** `src/lib/og.ts` переведён на новый shared asset для главной, Краснодара, Крыма, калькулятора, условий, контактов, thank-you и страницы сервиса.
- **Verified:** `pnpm build` проходит с `0 errors`, `0 warnings`; в `dist/index.html`, `dist/voennaya-ipoteka-krasnodar/index.html`, `dist/voennaya-ipoteka-krym/index.html`, `dist/o-servise/index.html` и `dist/contacts/index.html` `og:image` и `twitter:image` уже указывают на `https://voen-navigator.ru/images/og/voenniy-navigator-social-cover.png`.

### 2026-06-30 — Восстановлен production-слой карты после ручного релиза form-fix

- **Incident:** на live-страницах `/voennaya-ipoteka-krasnodar/` и `/voennaya-ipoteka-krym/` карта показывала fallback `Ключ Яндекс.Карт ещё не подключён к окружению сайта.` вместо маркеров.
- **Root cause:** активный ручной релиз form-fix `/var/www/client-sites/voenniy-navigator/releases/202606301343-sourcefix-env` был собран без `PUBLIC_YANDEX_MAPS_API_KEY`; в production HTML `KrymDirectionsMap` и `ComplexesMapReact` уходили с `apiKey=""`, хотя в рабочем checkout и GitHub Actions секрет уже присутствуют.
- **Fixed:** текущий checkout пересобран локально с `.env.local`, где подключён `PUBLIC_YANDEX_MAPS_API_KEY`, и перевыкатан на AMS Server как release `202606301425-mapkey-restore` с переключением `current` на новый каталог.
- **Verified on production:** `current/voennaya-ipoteka-krasnodar/index.html` и `current/voennaya-ipoteka-krym/index.html` больше не содержат пустой `apiKey`; live browser-check подтвердил возврат числовых маркеров на карте Краснодара и Крыма.
- **Network proof:** `GET https://api-maps.yandex.ru/2.1/?apikey=...&lang=ru_RU` на production возвращает `200`; island `/_astro/ComplexesMapReact*.js` загружается штатно.

### 2026-06-30 — Исправлен production-сбой форм из-за невалидного `source`

- **Incident:** тестовые заявки на `voen-navigator.ru` доходили до `AMS Leads API`, но отклонялись валидацией `source` как `Invalid url`; симптом подтверждён на AMS Server через `journalctl -u ams-leads-api` и логи `POST /v1/leads` от `voen-navigator.ru`.
- **Root cause:** фронт отправлял в поле `source` не абсолютный URL страницы, а относительный путь (`/bonus/`, `/podbor/hero`) или аналитическую метку (`home-hero-primary-cta`, `journal-archive`), тогда как API требует валидный URL.
- **Fixed:** `src/lib/leads.ts` теперь нормализует `source` до абсолютного URL и сохраняет исходную route/marketing-метку отдельно в `meta.source_context`.
- **Fallback fixed:** `src/layouts/PageLayout.astro` синхронизирован с тем же правилом для fallback-модалки без React-island; дополнительно исправлено извлечение текста ошибки из API-ответа.
- **Release:** из-за грязного основного worktree production был перевыкатан из отдельного clean worktree; активный релиз на AMS Server переключён на `/var/www/client-sites/voenniy-navigator/releases/202606301343-sourcefix-env`.
- **Server registry fixed:** в `/etc/ams-platform/ams-leads-api.projects.json` для `voenniy-navigator` добавлены live-origin’ы `https://voen-navigator.ru` и `https://www.voen-navigator.ru`, без которых сервер отклонял валидную SmartCaptcha с production-домена как `captcha_host_mismatch`.
- **Backend hotfix:** в live `AMS Leads API` ослаблена server-side валидация `source`: API больше не режет лиды только из-за относительного пути или старого marketing-marker’а. Теперь сервер сам нормализует `source` в абсолютный URL по host/origin запроса и сохраняет исходный marker в `meta.source_context`.
- **Backend contract synced:** live schema `AMS Leads API` больше не выкидывает `meta.source_context`, `method`, `contact_method`, `magnet`, `quiz_answers`; это позволяет не терять контекст маршрута и квиз-данные, даже если запрос пришёл от старого bundle или открытой до релиза вкладки.
- **Verified on production:** `current/_astro/leads*.js` содержит `apiUrl=/api/leads`, `projectId=voenniy-navigator`, `siteKey=vn_9217643557b1477587e2da65e0c887c3`, а live `AMS Leads API` уже принимает `source` не только как строгий `url()`, но и в tolerant-режиме с server-side нормализацией.
- **Live smoke:** после server hotfix реальный browser-submit через production-домен дал `POST https://voen-navigator.ru/api/leads => 200` и реальный редирект на `/thanks/?method=call`; в request body подтверждены `source=https://voen-navigator.ru/` и `meta.source_context=/`.
- **Checks passed:** `pnpm build` — 0 errors, 0 warnings; `pnpm geo-check` — 100/100; `pnpm seo-check` — 0 blockers, 0 warnings.

### 2026-06-29 — Блок 02 «Готовые подборки» на главной: выравнивание + модальные офферы

- **File updated:** `src/pages/_home/02-EntryPoints.astro`.
- **Alignment fixed:** убрано `justify-content: space-between` + `margin-top: auto`, из-за которого названия и иконки карточек «плясали» по вертикали при разной длине описаний. Десктоп/планшет переведён на единый `gap: 24px` — иконка и название выровнены по верху. На mobile `align-items: flex-start` + `align-self: center` для стрелки — иконка выравнивается по названию, стрелка по центру.
- **Modal wiring:** карточки переведены из обычных ссылок в modal-entry слой через `data-modal-open` / `data-modal-title` / `data-modal-subtitle` / `data-modal-source`. Использован стандартный `RequestModal`, подключённый глобально в `PageLayout.astro`.
- **Sales copy:** для каждой из 6 карточек задан собственный сильный заголовок и подзаголовок оффера: квартиры с ремонтом, с большой кухней, дома рядом с городом, новостройки с отделкой, цена снижена, участки под строительство.
- **Analytics sources:** каждая карточка получила уникальный `modalSource` (`home-collections-repair`, `home-collections-kitchen`, `home-collections-house`, `home-collections-finishing`, `home-collections-discount`, `home-collections-land`) для отслеживания заявок по подборкам.
- **Kept intact:** тексты карточек (title/description), иконки и href не менялись.
- **Checks passed:** dev-сервер компилирует страницу без ошибок; data-атрибуты и все 6 заголовков присутствуют в HTML (проверено через node-fetch).

### 2026-06-27 — Скорректированы кропы фото журнала и добавлен SEO-check

- **Journal media:** добавлен frontmatter-параметр `coverPosition` и применён в карточках/hero статей, чтобы портреты не обрезали головы на laptop и mobile.
- **Fixed covers:** скорректированы статьи `Сумма по военной ипотеке: как понять реальный бюджет`, `Условия военной ипотеки в 2026 году: что проверить до подбора` и повторное использование портрета Михаила в статье про развод.
- **SEO cleanup:** добавлен `pnpm seo-check` как post-build технический gate: meta/canonical/OG, JSON-LD, sitemap/noindex, внутренние ссылки, media assets, robots/llms и favicon assets.
- **Favicon baseline:** добавлены `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png` и соответствующие links в `BaseLayout`.
- **Cleanup:** production fallback URL в `src/lib/utils.ts` заменён с localhost на `https://voen-navigator.ru/`.
- **Checks passed:** `pnpm build` — 0 errors, 0 warnings, 0 hints; `pnpm geo-check` — 100/100; `pnpm seo-check` — 0 blockers, 0 warnings; локальные скриншоты `/journal/`, `/journal/summa-voennoy-ipoteki-i-raschet/`, `/journal/usloviya-voennoy-ipoteki-2026/` на 1024/390 подтверждают корректный кроп.

### 2026-06-27 — Добавлена внутренняя перелинковка и мобильная вычитка статей журнала

- **Updated:** все 10 статей `src/content/journal/*.md` вычитаны на мобильную читаемость: абзацы укорочены до 2–4 строк, сложные предложения разбиты, списки выровнены по длине.
- **Internal links:** добавлена внутренняя перелинковка между статьями журнала и коммерческими страницами (`/voennaya-ipoteka-krasnodar/`, `/voennaya-ipoteka-krym/`, `/kalkulyator-voennoy-ipoteki/`, `/usloviya-voennoy-ipoteki/`, `/semeynaya-voennaya-ipoteka/`, перекрёстные ссылки между статьями).
- **Stop-words:** повторная проверка на стоп-слова проекта — чисто.
- **Checks passed:** `pnpm build` — 0 errors, 0 warnings; `pnpm geo-check` — 100/100.

### 2026-06-27 — Усилен копирайтинг 10 статей журнала

- **Updated:** все 10 материалов раздела `/journal/` переписаны и расширены: добавлены вовлечённые вступления, экспертные разборы, практические фильтры, типичные ловушки и финальные CTA.
- **Style:** тексты переведены в журналистско-экспертный тон с сохранением требований `ams-copywriting` (H2-BRIDGE, FAQ-SAFE-логика внутри разделов, без воды и неподтверждённых обещаний).
- **Project voice:** сохранён брендовый субъект — Военный навигатор как сервис, Михаил Хряпин как экспертное лицо; убраны стоп-слова проекта (`ЖК` заменён на «жилой комплекс» / «новостройка`, консультационные CTA приведены к «получить подборку»).
- **Content:** каждая статья расширена с ~500–700 до ~800–1300 слов, добавлены разделы с маршрутами, фильтрами, рисками и сравнениями.
- **Files changed:** `src/content/journal/*.md` (10 файлов).
- **Checks passed:** `pnpm build` — 0 errors, 0 warnings; все 10 статей, архив, рубрики и `/llms.txt` сгенерированы корректно.

### 2026-06-27 — Запущен Журнал Военный навигатор

- **Created:** новый evergreen SEO-раздел `/journal/` на Astro content collection: архив, `/journal/2/`, страницы статей, рубрики, популярные и похожие материалы.
- **Content:** добавлены 10 экспертных коммерческих статей по SEO-базе `SEMANTICS.md`: Краснодар, Крым, условия, сумма, банки, калькулятор, семейный сценарий и риски сделки.
- **Home:** FAQ на главной заменён на preview журнала из 3 featured-материалов; `FAQPage` schema с главной убрана, потому что видимого FAQ больше нет.
- **Navigation/GEO:** `/journal/` добавлен в footer, карту маршрутов и `/llms.txt`; в верхнее меню не добавлен, чтобы header остался компактным.
- **SEO:** архивы и рубрики используют `CollectionPage`, статьи — `BlogPosting`; sitemap содержит `/journal/`, `/journal/2/`, рубрики и 10 статей; `/blog/` не создаётся.
- **Audit:** после первичной сборки проведён дизайн/content-аудит; preview на главной сокращён с 4 до 3 карточек для более спокойной премиальной сетки.
- **Checks passed:** `pnpm build` — 0 errors, 0 warnings; `pnpm geo-check` — 100/100; local preview `/`, `/journal/`, `/journal/2/`, статья и рубрика — HTTP 200; `/blog/` — 404 как ожидается.

### 2026-06-26 — Добавлен файл подтверждения Яндекс.Вебмастера

- **Added:** `public/yandex_3736f6157fb9c46c.html` с кодом `Verification: 3736f6157fb9c46c`.
- **Purpose:** файл должен отдаваться из корня production-сайта по `/yandex_3736f6157fb9c46c.html` после следующего деплоя.
- **Checks passed:** `pnpm build` — 0 errors, 0 warnings; файл присутствует в `dist/yandex_3736f6157fb9c46c.html`; `pnpm geo-check` — GEO score `100/100`.

### 2026-06-26 — Подключены VK Михаила Хряпина и Яндекс.Метрика

- **VK:** ссылка `https://vk.com/mikhail_khryapin` добавлена в единые `CONTACTS` и `GEO_CONTACTS`; теперь выводится в footer, карте маршрутов, hero страницы `/contacts/`, Schema.org `sameAs` и `/llms.txt`.
- **Yandex Metrika:** счётчик `110176980` подключён через существующий consent-gated `CookieBanner` + Partytown с параметрами из кода Яндекса; добавлен `noscript` fallback.
- **Deploy:** `PUBLIC_YM_COUNTER_ID=110176980` закреплён в GitHub Actions env для production build.
- **Checks passed:** `pnpm build` — 0 errors, 0 warnings; `pnpm geo-check` — GEO score `100/100`; в `dist` проверены VK-ссылка и счётчик `110176980`.

### 2026-06-26 — Telegram-группа подключена к заявкам

- **Decision:** сайт не меняем; заявки продолжают идти через `/api/leads` в общий `AMS Leads API`.
- **Server config:** для проекта `voenniy-navigator` обновлен `VOENNIY_NAVIGATOR_TELEGRAM_CHAT_ID`; Telegram delivery в registry уже включен через `chatIdEnv`.
- **Relay:** для `AMS Leads API` подключен `ams-telegram-relay`, потому что AMS Server не открывает `api.telegram.org:443` напрямую.
- **Verified:** тестовое сообщение от leads-бота ушло в Telegram-группу, Telegram вернул `message_id=322`; `/api/leads` без SmartCaptcha ожидаемо возвращает `400 captcha_required`.

### 2026-06-26 — MAX-группа подключена к заявкам

- **Decision:** сайт не меняем; MAX подключен как второй delivery channel в общем `AMS Leads API`.
- **Chat id:** получен через события MAX-бота `ams-lead` после добавления бота в группу и сообщения `/start`; значение сохранено в server env и Doppler как `VOENNIY_NAVIGATOR_MAX_CHAT_ID`.
- **Server config:** registry проекта обновлен: `"max": { "enabled": true, "chatIdEnv": "VOENNIY_NAVIGATOR_MAX_CHAT_ID" }`.
- **Verified:** тестовое сообщение в MAX-группу отправлено через `platform-api.max.ru/messages`, API вернул `message_id=mid.ffffba9a039c8d53019f0425e7247787`; `/api/leads` без SmartCaptcha ожидаемо возвращает `400 captcha_required`.

### 2026-06-26 — Перенос на отдельный VPS отложен

- **Decision:** работаем на текущем AMS Server, Timeweb Cloud `5.42.100.161`.
- **Migration plan:** `project-docs/SERVER_MIGRATION_PLAN.md` переведен в статус `deferred / on hold`.
- **Deploy/API:** GitHub Actions secrets, DNS и `/api/leads` не меняем; общий `AMS Leads API` остается в текущем рабочем контуре.
- **Next:** возвращаться к серверной миграции только по отдельному решению.

### 2026-06-26 — Зафиксирован план переноса сайта на отдельный VPS клиента

- **Plan added:** создан `project-docs/SERVER_MIGRATION_PLAN.md`.
- **Decision:** переносим только статический Astro-сайт; заявки пока остаются через общий managed `AMS Leads API` АМС.
- **Infra model:** отдельный Timeweb Cloud VPS клиента, GitHub Actions release-based deploy, staging-first cutover.
- **Blocked until:** клиент зарегистрирует сервер и передаст IP/SSH или Timeweb Terraform access.
- **Checks passed:** `pnpm build` — 0 errors, 0 warnings; `pnpm geo-check` — GEO score `100/100`.

### 2026-06-26 — Полное удаление виджета обратной связи

- **Removed:** удалён React island виджета из `src/components/ui/`.
- **Layout cleanup:** `src/layouts/BaseLayout.astro` больше не импортирует и не рендерит виджет обратной связи.
- **Env cleanup:** из `.env.example` и `.github/workflows/deploy-ams.yml` удалены публичные review-переменные и review-секрет из build-env.
- **Docs cleanup:** из research-документа удалена устаревшая строка про env-gate виджета.
- **Checks passed:** `pnpm build` — 0 errors, 0 warnings; `pnpm geo-check` — GEO score `100/100`.

### 2026-06-22 — Полировка hero `/semeynaya-voennaya-ipoteka/` перед production

- **Hero visual:** на странице семейной военной ипотеки расширена visual-колонка с цифрами на desktop; potential-card пересобрана в responsive bento-виджет без изменения пользовательских текстов.
- **Cleanup:** удалён неиспользуемый legacy-компонент `src/pages/_usloviya-voennoy-ipoteki/04-Amount.astro`; актуальный route использует `03-Amount`, `04-Banks`, `05-Geo`.
- **Mobile QA:** проверены viewport `375`, `390`, `768`; карточка цифр занимает почти всю ширину экрана на mobile, значения не переносятся и горизонтального overflow нет.
- **Desktop QA:** проверены viewport `1024`, `1366`, `1440`; баннер справа стал шире, значения в metric tiles остаются в одну строку.
- **Docs synced:** `project-docs/briefs/PAGE_SEMEYNAYA_VOENNOY_IPOTEKI.md` обновлён по as-built визуальному решению hero.
- **Checks passed:** `pnpm build` — 0 errors, 0 warnings; `pnpm geo-check` — GEO score `100/100`.

### 2026-06-22 — QA страниц `/o-servise/` и `/semeynaya-voennaya-ipoteka/`

- **Reviewed:** сверены роуты, локальные блоки, page data и брифы страниц услуги и семейной военной ипотеки.
- **Cleanup check:** в `src/pages/_o-servise/` и `src/pages/_semeynaya-voennaya-ipoteka/` не найдено неиспользуемых старых блоков; актуальные секции соответствуют импортам в страницах.
- **Fixed:** в hero страницы `/o-servise/` убраны старые `nth-child`-правила для trust-row, которые могли попадать в divider-элементы на tablet; адаптив теперь работает через grid.
- **Checks passed:** `pnpm build` — 0 errors, 0 warnings; `pnpm geo-check` — GEO score `100/100`; локальный preview-smoke `/o-servise/` и `/semeynaya-voennaya-ipoteka/` — HTTP 200 и ключевые тексты на месте.

### 2026-06-22 — Cleanup старых home-блоков и фиксация proof-фактов

- **Home cleanup:** из `src/pages/_home/` удалены неиспользуемые старые блоки, которые не импортируются в актуальную главную: `03-Problem`, `04-Scenarios`, `05-Review`, `06-Limits`, `07-Service`, `08-Trust`, `09-Reviews`.
- **Docs synced:** `project-docs/SITE_ARCHITECTURE.md` и `project-docs/briefs/PAGE_USLOVIYA_VOENNOY_IPOTEKI.md` обновлены: цифры `65 сделок по военной ипотеке`, `180 сделок всего`, `с 2016 года` зафиксированы как подтверждённая фактура без TODO на подтверждение.
- **Pending facts kept:** VK-группа и email остаются TODO до передачи клиентом.
- **Checks passed:** `pnpm build` — 0 errors, 0 warnings; `pnpm geo-check` — GEO score `100/100`.

### 2026-06-21 — Release-проверка главной, cleanup навигации и синхронизация brief

- **Reviewed:** главная `/` перепроверена после последних ручных правок относительно `project-docs/briefs/PAGE_HOME.md` и текущей реализации в `src/pages/index.astro`.
- **Fixed:** в `src/lib/navigation/navData.ts` убран временный badge `new` у пункта `Крым`, чтобы header не отдавал тестовый шум в production.
- **Docs synced:** `project-docs/briefs/PAGE_HOME.md` очищен от устаревших ссылок на старые блоки, выровнен по актуальным секциям `Подход / Сценарии / Михаил`, синхронизированы CTA-логика, SEO-рамка, нумерация разделов и статус as-built.
- **Browser QA:** локальная главная просмотрена на desktop и mobile; горизонтального overflow нет, reveal-блоки корректно раскрываются при скролле.
- **Checks passed:** `pnpm astro check`, `pnpm build`, `pnpm geo-check` — без ошибок, GEO score `100/100`.

### 2026-06-21 — Блок калькулятора на главной переведён в полноширинный премиальный layout

- **Layout changed:** `src/pages/_home/04-Mortgage.astro` пересобран из узкого split-screen в полноширинную карточку в рамках контейнера.
- **Composition:** заголовок + lead сверху, под ними широкая карточка калькулятора в две колонки (панель ввода слева, sticky карточка результата справа), 4 преимущества — отдельным рядом под калькулятором.
- **Visual polish:** добавлен typography mixing в H2, улучшена итоговая карточка с крупным числом «Банк одобрит», soft/error tint для строки gap, премиальная тень и рамки.
- **Responsive:** на tablet/mobile сохранён вертикальный stack без overflow; ползунки и сценарии адаптированы под узкие экраны.
- **Docs synced:** `project-docs/briefs/PAGE_HOME.md` обновлён раздел 8 под новый layout блока 04.
- **Checks passed:** `pnpm astro check` и `pnpm build` — 0 errors, 0 warnings; визуальная проверка desktop, tablet и mobile через localhost пройдена.

### 2026-06-21 — Блок 05 «Подход» на главной: переработка comparison-карточек

- **Decision:** вместо запланированного в брифе блока `Как работает сервис` оставлен comparison-блок `src/pages/_home/05-SelectionLogic.astro`, потому что он сильнее закрывает возражение «почему не искать самому через агрегатор».
- **Copy reframed:** eyebrow изменён с `Главное отличие` на `Подход`; H2 переписан на `Не каталог, а проверенный маршрут от ситуации к объекту` с typography mixing; lead сокращён и усилен.
- **Visual upgrade:** фон блока переведён на `bg-primary` для tonal shift; карточки получили document-style header с иконками `x` / `check`, divider, bullet-списки и премиальные hover-состояния.
- **Contrast improved:** левая карточка «Обычный поиск» — приглушённая, правая «Военный навигатор» — с акцентной обводкой и мягкой тенью.
- **Responsive:** на tablet/mobile карточки собираются в вертикальный stack без overflow.
- **Docs synced:** `project-docs/briefs/PAGE_HOME.md` обновлён — раздел 4 (структура блоков) и раздел 9 (описание блока 05) приведены к реальному компоненту.
- **Checks passed:** `pnpm astro check` и `pnpm build` — 0 errors, 0 warnings; визуальная проверка desktop и mobile через localhost пройдена.

### 2026-06-21 — Блок 06 «Живые сценарии» на главной: премиальная переработка

- **File updated:** `src/pages/_home/06-Scenarios.astro`.
- **Copy reframed:** eyebrow сохранён `Живые сценарии`; H2 изменён на `Сценарии, которые закрываем` с typography mixing; lead сокращён и усилен фокусом на результат.
- **Scenarios aligned:** карточки приведены к 4 каноническим сценариям: `Квартира для жизни`, `Переезд позже`, `Вложение средств`, `Дистанционная покупка`.
- **Visual upgrade:** карточки стали document-style — иконка в круге, decorative marker `01–04`, accent line, hover с lift и акцентной обводкой.
- **Icons added:** подключены иконки `home`, `compass`, `percent`, `globe` через `astro-icon`.
- **CTA added:** добавлена кнопка `Обсудить мой сценарий`, открывающая модалку заявки.
- **Responsive:** 4 колонки на desktop, 2×2 на tablet, 1 колонка на mobile.
- **Docs synced:** `project-docs/briefs/PAGE_HOME.md` раздел 10 обновлён под новый дизайн и тексты.
- **Checks passed:** `pnpm astro check` и `pnpm build` — 0 errors, 0 warnings; визуальная проверка desktop и mobile через localhost пройдена.

### 2026-06-21 — Блок 07 «Михаил / Trust» на главной: усиление копи и дизайна

- **File updated:** `src/pages/_home/07-MikhailTrust.astro`.
- **Copy reframed:**
  - caption на фото заменён с непонятного `Главный навигатор сервиса · первичный расчёт и фильтр рисков` на коммерческий `Главный навигатор сервиса · персональный подбор и сопровождение`;
  - lead переписан от третьего лица: акцент на том, что Михаил лично разбирает ситуацию и предлагает варианты, которые реально одобрит банк;
  - 3 trust-point заменены на `Личный разбор`, `Проверка объектов`, `Прозрачные условия` с более конкретными и коммерческими описаниями.
- **Visual upgrade:**
  - фото в чистой рамке с акцентными corner brackets вместо перегруженного glow;
  - trust-point оформлены как карточки с иконками в круглых badge и hover-lift;
  - caption на фото оформлен glassmorphism'ом с корректными светлыми цветами (`--color-text-ondark`).
- **Icons added:** подключены иконки `users`, `building-check`, `file-text` через `astro-icon`.
- **CTA kept:** `Обсудить мою ситуацию` (модалка) + ссылка на `/o-servise/`.
- **Responsive:** desktop — две колонки 5:7, mobile — вертикальный stack, фото адаптировано под высоту viewport.
- **Docs synced:** `project-docs/briefs/PAGE_HOME.md` раздел 12 переписан под актуальный блок 07; таблица CTA-логики приведена в соответствие.
- **Checks passed:** `pnpm astro check` и `pnpm build` — 0 errors, 0 warnings; визуальная проверка desktop и mobile через localhost пройдена.

### 2026-06-20 — Legal-страницы: политика выровнена по паттерну согласия

- **Privacy TOC normalized:** в `src/components/technical/pages/PrivacyPage.astro` блок `Содержание документа` перестроен по образцу из `ConsentPage.astro` — теперь это светлая сетка карточек-ссылок с единым фоном, рамкой и hover-state.
- **Operator contacts restyled:** финальный блок `Контактная информация оператора` на `/politika/` убран с тёмного фона и переведён в обычную светлую карточку страницы с трёхколоночной сеткой на desktop и вертикальным стеком на tablet/mobile.
- **Visual consistency improved:** подписи полей, значения, отступы и блок `Вернуться на главную` приведены к тому же спокойному legal-style, что и остальные светлые секции документа.
- **Checks passed:** `pnpm build` проходит успешно; `/politika/` локально переснята для визуального smoke-check после правки.

### 2026-06-19 — Финальный CTA приведён к единому премиальному виду на всех страницах

- **Copy updated:** финальный CTA изменён на премиальный вариант:
  - eyebrow `ПЕРСОНАЛЬНЫЙ РАЗБОР`;
  - title `Получите разбор вашей ситуации`;
  - accent `и реальный план покупки`;
  - subtitle `За 20 минут выясним вашу задачу, проверим лимиты банка и подберём объекты, которые реально одобрят. Без обязательств и скрытых платежей.`;
  - CTA `Получить подборку`.
- **Removed from copy:** убраны формулировки `Первый шаг к квартире` и `а не со случайной витрины`, чтобы блок не привязывался к квартире и звучал дороже.
- **Component defaults updated:** в `src/components/sections/FinalCTALight.astro` обновлены дефолтные значения пропсов, title / subtitle / ctaText сделаны необязательными.
- **Site-wide sync:** все вызовы `<FinalCTALight />` на страницах `/`, `/kalkulyator-voennoy-ipoteki/`, `/contacts/`, `/voennaya-ipoteka-krasnodar/`, `/usloviya-voennoy-ipoteki/`, `/semeynaya-voennaya-ipoteka/`, `/o-servise/`, `/voennaya-ipoteka-krym/` приведены к единому виду. На `/contacts/` сохранён `sectionId="request"` для якоря формы.
- **Docs synced:** `project-docs/briefs/PAGE_HOME.md` обновлён раздел 14.
- **Checks passed:** `pnpm astro check` и `pnpm build` — 0 errors, 0 warnings.

### 2026-06-19 — Главная: собран блок 04 «Калькулятор / Ипотечный центр»

- **File added:** создан `src/pages/_home/04-Mortgage.astro`.
- **Composition:** split-screen — слева H2 + 4 преимущества в сетке 2×2, справа мини-калькулятор на `bg-primary`.
- **Copy:** eyebrow `Ипотечный центр`, H2 `Рассчитайте военную ипотеку`, 4 преимущества с иконками `calculator`, `building-2`, `users`, `globe`.
- **Mini-calculator:** переключатель сценариев `Стандартная / Семейная / Новые территории` (ставки 18% / 6% / 2%, срок 25 / 30 / 30 лет), ползунки `Стоимость квартиры / Взнос НИС в месяц / Первоначальный взнос`, итоговые плашки `Банк одобрит / Бюджет покупки / Не хватает или Запас`.
- **Logic:** формула `loanFromPayment` взята из полного калькулятора `_kalkulyator-voennoy-ipoteki/02-Calculator.astro`, адаптирована под 3 поля.
- **CTA:** `Рассчитать точнее →` ведёт на `/kalkulyator-voennoy-ipoteki/`.
- **Integration:** блок подключён в `src/pages/index.astro` после `03-WhyFree`.
- **Docs synced:** `project-docs/briefs/PAGE_HOME.md` обновлён раздел 04.
- **Checks passed:** `pnpm astro check` и `pnpm build` — 0 errors, 0 warnings; визуальная проверка desktop и mobile через localhost пройдена.

### 2026-06-19 — Главная: удалён старый блок «Первичный расчёт», собран блок 03 «Почему бесплатно» (вариант А)

- **Old block removed:** удалён `src/pages/_home/04-FirstReview.astro` («Как мы формируем ваш персональный маршрут покупки») и его подключение из `src/pages/index.astro`.
- **WhyFree block added:** создан `src/pages/_home/03-WhyFree.astro` с 4 иконочными карточками в сетке 2×2 (1 колонка на mobile) на фоне `bg-primary`, сами карточки — `bg-surface`.
- **Copy:** eyebrow `Бизнес-модель`, H2 `Почему это бесплатно для вас`, подзаголовок `Комиссию платит застройщик или продавец...`, 4 карточки с иконками `building-2`, `percent`, `shield-check`, `badge-check`.
- **Design:** радиус 12px, иконка 44px, hover — lift + акцентная линия сверху, адаптивная мобильная раскладка с горизонтальными карточками.
- **Docs synced:** `project-docs/briefs/PAGE_HOME.md` обновлён под актуальную структуру блоков 02–04.
- **Checks passed:** `pnpm astro check` и `pnpm build` — 0 errors, 0 warnings; визуальная проверка desktop и mobile через localhost пройдена.

### 2026-06-19 — Hero главной переведён на category-entry с разными modal-офферами

- **Hero routes rewired:** в `src/pages/_home/01-Hero.astro` карточки `Новостройки / Дома / Вторичка / Ипотека` переведены из обычных ссылок в modal-entry слой с отдельными `data-modal-title`, `data-modal-subtitle` и `data-modal-source` под каждый сценарий.
- **Sales copy differentiated:** для каждой карточки задан собственный оффер: бесплатный подбор новостроек под военную ипотеку, разбор сценария по дому, подбор готовой квартиры на вторичном рынке и отдельная бесплатная помощь по военной ипотеке.
- **Primary CTA synced:** главный CTA первого экрана теперь тоже открывает modal с формулировкой `Получить разбор ситуации`, а не уводит пользователя в нейтральный переход без контекста.
- **Responsive polish applied:** для hero отдельно усилена mobile/laptop-адаптация — зафиксирован более устойчивый двухстрочный H1, добавлены безопасные переносы для крупной типографики и сохранён grid/cards layout `4 → 2×2 → 1`.
- **Technical checks passed:** `pnpm build` проходит успешно; локальный hero переснят через headless Edge на laptop и mobile для smoke-QA после правки.

### 2026-06-18 — Research layer по расширению каталога Краснодара под военную ипотеку

- **Krasnodar monitoring started:** проведён отдельный web-monitoring Яндекс.Недвижимости и ЦИАН по странице `/voennaya-ipoteka-krasnodar/` с задачей понять, как расширять каталог дальше `12` текущих ЖК.
- **Research artifact added:** создан файл `project-docs/KRASNODAR_JK_MONITORING_2026-06-18.md` с unified-таблицей по текущим и потенциальным ЖК, статусами `current-ok / current-recheck / add-primary / add-reserve` и комментариями под data-layer каталога.
- **Aggregator filter conclusion:** на дату проверки `2026-06-18` корректный верхний гео-слой для фильтра Краснодара — `Прикубанский округ / Карасунский округ / Центральный округ / Западный округ`; выдуманные ярлыки вроде `Север` признаны неканоничными.
- **Current recommendation:** как первый production-кандидат собран пул примерно на `25` ЖК; второй эшелон для доведения витрины до `28–30` объектов требует отдельной ручной перепроверки по спорным карточкам и sold-out статусам.

### 2026-06-18 — Каталог Краснодара расширен до 25 ЖК и переведён на статус-фильтр

- **Data-layer rebuilt:** `src/data/krasnodar-complexes.ts` пересобран на итоговый пул `25` ЖК: текущие `12` оставлены основным слоем, ещё `13` заведены как `additional` под `Показать ещё`.
- **Explicit filter status added:** для краснодарского каталога введён явный слой `statusCategory: ready | building`; объекты `строится, есть сданные` сознательно отнесены в `Сданные`.
- **Catalog behavior updated:** в `src/components/sections/ComplexCatalogReact.tsx` добавлены фильтры `Все / Сданные / Строятся`, сохранён приоритет базовых 12 карточек и внедрён controlled-pattern `Показать ещё` для полного пула и для каждого фильтра.
- **Photo-pass completed:** для всех новых `13` ЖК собраны и подключены по `3` изображения в `public/images/complexes/<slug>/`, без редизайна карточек и с сохранением текущего слайдера.
- **Map scope stabilized:** карта Краснодара оставлена в рамках текущего цикла как обзорный слой по основным `12` ЖК, чтобы marker-click всегда вёл к уже видимой карточке каталога.
- **SEO/doc sync done:** скрытый SEO-слой каталога, `PAGE_VOENNAYA_IPOTEKA_KRASNODAR.md` и этот `WORKLOG.md` синхронизированы с новым as-built поведением.
- **Checks passed:** `pnpm build` и `pnpm geo-check` проходят успешно после расширения каталога.

### 2026-06-18 — Research layer по крымским ЖК для замены временного каталога

- **Krym monitoring started:** проведён отдельный web-monitoring по направлениям `Симферополь / Севастополь / Побережье` под страницу `/voennaya-ipoteka-krym/` с приоритетом на ГК `ИнтерСтрой`.
- **Research artifact added:** создан файл `project-docs/KRYM_JK_MONITORING_2026-06-18.md` с shortlist-кандидатами, reserve-пулом, рисками по `апартаментам` и черновым data-layer полям под текущий каталог.
- **Current conclusion:** самый чистый пул сейчас собрался по Симферополю и побережью; по Севастополю сильные жилые кандидаты уже видны, но часть объектов требует отдельного подтверждения из-за более слабого или смешанного ипотечного сигнала в выдаче.

### 2026-06-18 — Крым переведён на реальный каталог ИнтерСтрой и синхронизирован с картой

- **Separate krym data-layer added:** создан отдельный массив `krymComplexes` и отдельная группировка по `Симферополь / Севастополь / Побережье`; временная нарезка краснодарских объектов из крымского route убрана.
- **Approved complex set applied:** в страницу включены 14 утверждённых ЖК: 6 по Симферополю, 4 по Севастополю и 4 по побережью.
- **Official images connected:** для всех карточек Крыма добавлены официальные фотографии ЖК из слоёв ИнтерСтрой; для `Парк Победы` официальный page-layer оказался беднее, поэтому в карточке используется повтор официального hero-кадра.
- **Map synced to real objects:** карта и каталог теперь используют один и тот же крымский data-layer, а counts в tabs считаются по реальному составу направления.
- **SEO copy synced:** скрытый SEO-список каталога и status copy переведены с временной формулировки на реальную крымскую подборку.

### 2026-06-18 — Финальный QA Краснодара и Крыма перед общим релизом

- **Dual-page QA passed:** локально перепроверены `/voennaya-ipoteka-krasnodar/` и `/voennaya-ipoteka-krym/` на desktop и mobile (`390px`) через preview из текущего репозитория.
- **Krasnodar catalog confirmed:** фильтры `Все / Сданные / Строятся`, паттерн `Показать ещё`, карточки и CTA-модалка отрабатывают штатно; горизонтального скролла не найдено.
- **Krym map/catalog sync confirmed:** верхние tabs блока карты и нижние tabs каталога синхронно переключают направления без overflow; лишние буллиты из map-блока убраны, а верхний переключатель переведён в более лёгкий editorial-стиль.
- **Release scope fixed:** страница Краснодара у карты теперь показывает сокращённый copy с акцентом на `25 жилых комплексов`, после чего весь текущий worktree готов к единому commit/push в `main`.

### 2026-06-17 — Финальный предпубликационный QA и точечная полировка contact/meta-слоя

- **Prepublish QA passed:** локально прогнаны ключевые route-страницы `/`, `/voennaya-ipoteka-krasnodar/`, `/voennaya-ipoteka-krym/`, `/kalkulyator-voennoy-ipoteki/`, `/usloviya-voennoy-ipoteki/`, `/o-servise/`, `/contacts/` на desktop, laptop, tablet и mobile через fresh preview из этого репозитория.
- **Environment pitfall documented:** при проверке выяснилось, что порт `4321` мог быть занят чужим preview-процессом; для финального QA использовался отдельный локальный preview-порт, чтобы исключить ложную проверку другого проекта.
- **Contacts hero aligned:** в hero страницы `/contacts/` добавлен `Max`, чтобы верхний контактный слой соответствовал уже принятому site-wide паттерну мессенджеров.
- **GEO config synced:** `GEO_CONTACTS.max` приведён к тому же временному tel-action, что и основной публичный контактный слой сайта.
- **Basic SEO polish:** meta description главной и калькулятора укорочены до более безопасной длины без изменения on-page текстов.

### 2026-06-17 — Репозиторий очищен от локального мусора и QA-артефактов

- **Root cleanup done:** из корня и временных папок удалены локальные скриншоты, HTML-снэпшоты, парсинг-хвосты, временные изображения, `photo-search`, `screenshots`, `test-results`, `tmp` и разовые Python-скрипты для поиска фото.
- **Dev leftovers reduced:** остановлены лишние локальные preview/dev-процессы проекта и удалены большинство временных логов, которые не относятся к исходникам сайта.
- **Ignore rules hardened:** `.gitignore` дополнен паттернами для локальных QA-логов, временных папок и root-level JPG, чтобы такие артефакты не захламляли репозиторий в следующих сессиях.

### 2026-06-17 — Hero Краснодара и Крыма поджаты по высоте

- **Hero height reduced:** первые экраны `/voennaya-ipoteka-krasnodar/` и `/voennaya-ipoteka-krym/` уменьшены по вертикальному объёму, чтобы блок не оставлял лишнее пустое пространство на desktop и laptop.
- **Responsive spacing tightened:** для tablet и mobile у обоих hero уменьшены верхний и нижний padding, а также отступ перед визуальным mockup.
- **Scope kept:** оффер, CTA, композиция и контент hero не менялись; правка касается только вертикального ритма и высоты первого экрана.

### 2026-06-17 — Исправлен production-слой карты и SmartCaptcha

- **Map root cause found:** карта на боевом домене не работала, потому что `PUBLIC_YANDEX_MAPS_API_KEY` не пробрасывался в GitHub deploy workflow, и production build собирался без ключа Яндекс.Карт.
- **Deploy workflow fixed:** в `.github/workflows/deploy-ams.yml` добавлен `PUBLIC_YANDEX_MAPS_API_KEY` в build-env production-деплоя.
- **SmartCaptcha cleaned:** для всех invisible-форм сайта включён штатный `hideShield`, чтобы на боевом домене не всплывал privacy/shield-виджет поверх интерфейса.
- **Scope:** серверная проверка SmartCaptcha и сама защита формы сохранены; убран только лишний визуальный overlay.

### 2026-06-17 — Из переключателей Крыма убраны временные поясняющие комментарии

- **Direction tabs cleaned:** под tabs `Симферополь / Севастополь / Побережье` больше не показываются временные редакторские пояснения ни в блоке карты, ни в каталоге.
- **Data layer simplified:** из `krymDirections.ts` убран временный `note`-слой, чтобы переключатель направлений оставался чистым UI-компонентом без переходного текста.
- **Scope kept:** логика синхронизации карты и каталога, состав направлений и количество карточек не менялись.

### 2026-06-17 — Brief страницы Крыма синхронизирован с текущей реальностью

- **Brief updated:** `project-docs/briefs/PAGE_VOENNAYA_IPOTEKA_KRYM.md` переведён из формулировки `Transitional` в рабочий `as-built`-статус.
- **Structure fixed:** в brief зафиксирована актуальная route-структура `Hero → Map → Catalog → Soft CTA → How We Work → Trust → Reviews → FAQ → Final CTA`.
- **Shared standards noted:** отдельно прописано, что FAQ и финальная форма на странице Крыма используют канонические shared-компоненты сайта.
- **Interim scope clarified:** в документе честно оставлено, что data-layer карты и каталога пока промежуточный, а старые локальные блоки в папке Крыма не участвуют в рендере.

### 2026-06-17 — Hero страницы контактов очищен от лишнего верхнего слоя

- **Removed breadcrumb:** из первого экрана `/contacts/` убран слой `Главная / Контакты`, чтобы hero начинался сразу с основного смысла.
- **Removed duplicate eyebrow:** из hero убрана строка `Контакты / Михаил Хряпин`, которая визуально дублировала тему страницы и перегружала верх.
- **Result:** первый экран контактов стал чище и спокойнее, без лишнего служебного текста над H1.

### 2026-06-17 — Крым переведён на первые 4 блока Краснодара как промежуточный этап

- **Route updated:** в `/voennaya-ipoteka-krym/` первые 4 блока заменены на паттерн страницы Краснодара: `Hero → Map → Catalog → Soft CTA`.
- **Old Krym top blocks removed from render:** из route временно убраны `Cities`, `Checklist` и `Remote`; вместо собственного hero Крыма в рендер подставлен первый экран Краснодара по прямому запросу пользователя.
- **No copy adaptation yet:** на этом шаге тексты внутри перенесённых 4 блоков сознательно не менялись; задача этапа — именно перенос структуры и UI-паттерна без редакторской адаптации.
- **Docs synced:** `PAGE_VOENNAYA_IPOTEKA_KRYM.md` обновлён как transitional as-built brief до следующего этапа текстовой и data-адаптации под Крым.

### 2026-06-17 — Крым переведён с прямых импортов на локальные копии 4 верхних блоков

- **Local copies created:** для `/voennaya-ipoteka-krym/` созданы собственные файлы `01-Hero`, `02-Map`, `03-Catalog`, `04-SoftCTA` вместо прямых импортов из краснодарской страницы и shared-секции.
- **Route decoupled:** route Крыма теперь собирается из собственных `_voennaya-ipoteka-krym/*` блоков, поэтому дальнейшая правка страницы может идти независимо от Краснодара.
- **Copy-only mode kept:** тексты верхних 4 блоков и текущий data-layer на этом шаге не адаптировались под Крым по прямому указанию пользователя.
- **Tracking fixed:** у soft CTA обновлён route-source формы на `/voennaya-ipoteka-krym/`, чтобы аналитика и происхождение лида не ссылались на Краснодар.

### 2026-06-17 — В Крым скопированы следующие краснодарские блоки, кроме FAQ и финального CTA

- **Hero normalized:** первый экран Крыма приведён к прямой локальной копии hero-паттерна Краснодара без дополнительных расхождений в корневой секции.
- **Additional copies created:** в `_voennaya-ipoteka-krym/` добавлены локальные `05-HowWeWork`, `06-Trust`, `07-Reviews`.
- **Route expanded:** `/voennaya-ipoteka-krym/` теперь собрана в последовательности `Hero → Map → Catalog → Soft CTA → How We Work → Trust → Reviews → FAQ → Final CTA`.
- **Scope respected:** FAQ по Крыму и последняя заявочная форма не переносились и оставлены собственными, как было указано пользователем.

### 2026-06-17 — Тексты страницы Крыма очищены от Краснодара

- **Hero adapted:** первый экран переведён на оффер `Новостройки Крыма по военной ипотеке`; CTA и supporting copy больше не ссылаются на Краснодар.
- **Map panel adapted:** в левом текстовом слое карты и в badge карты заменён Краснодар на Крым, при этом сама геометрия карты пока сознательно не менялась.
- **Catalog copy adapted:** скрытый SEO-слой каталога переведён на крымский контекст как временный переходный слой до замены самих карточек.
- **Downstream blocks adapted:** soft CTA, `Trust` и `Reviews` очищены от упоминаний Краснодара; modal subtitles и alt-тексты тоже синхронизированы под Крым.

### 2026-06-17 — В карту Крыма встроен tab-паттерн по трём направлениям

- **Tabs added:** в map-секцию `/voennaya-ipoteka-krym/` добавлен переключатель `Симферополь / Севастополь / Побережье`.
- **Future-ready structure:** каждое направление теперь живёт как отдельный набор меток на карте; интерфейс уже готов под сценарий `примерно 6 объектов на направление`.
- **Temporary fill:** пока tabs наполнены временным разбиением текущей подборки, чтобы не блокировать UX и дальнейшую настройку карты.
- **Scope kept:** сама география Крыма, реальные объекты по городам и каталог под направления ещё не финализированы и будут заменены следующим этапом.

### 2026-06-17 — Переключатели направлений Крыма синхронизированы между картой и каталогом

- **Premium placement:** city-switcher убран из верхней зоны карты и встроен в левую информационную панель, чтобы блок выглядел спокойнее и премиальнее.
- **Catalog switcher added:** такой же переключатель добавлен в верх каталога без лишних фильтров — только `Симферополь / Севастополь / Побережье`.
- **Linked behavior:** переключатели карты и каталога теперь синхронизированы через page-level state/event, поэтому смена направления в одном блоке обновляет и второй блок.
- **Shared interim data:** пока и карта, и каталог используют одно временное разбиение текущей подборки по трём направлениям до замены на реальные крымские объекты.

### 2026-06-17 — Количество карточек по направлениям Крыма доведено до нужного объёма

- **Simferopol:** временная подборка направления расширена до 6 карточек.
- **Sevastopol:** временная подборка направления расширена до 6 карточек.
- **Coast:** для побережья оставлены 4 карточки, как зафиксировано пользователем.
- **Scope:** это всё ещё переходное наполнение на текущем наборе объектов; позже направления будут заменены на реальные крымские комплексы.

### 2026-06-17 — Локально восстановлена интерактивность каталога Краснодара и перепроверена карта

- **Catalog hover restored:** в `src/components/ui/ComplexCard.tsx` hover-состояние снова уверенно активируется при наведении на карточку, включая визуальную зону с фото, а не только узкую текстовую область.
- **Mouse transition stabilized:** при движении курсора внутри карточки сохранён плавный сценарий `photo → details`, без ощущения, что карточка «не реагирует на мышку».
- **Map runtime confirmed:** локальная browser-проверка страницы `/voennaya-ipoteka-krasnodar/` подтвердила наличие `Yandex Maps` canvas и живого map-root внутри блока карты; route и секция карты в репозитории не потеряны.
- **Checks:** `pnpm build` проходит успешно после фикса; page runtime дополнительно проверен на локальном preview с headless browser.

### 2026-06-17 — Страница условий приведена к стандарту калькулятора

- **Frame aligned:** `/usloviya-voennoy-ipoteki/` собрана в общем контейнере сайта без инородных wide-обводок и без ощущения отдельного лендинга.
- **Typography normalized:** hero, секционные заголовки, карточки, таблица банков, FAQ и финальный CTA выровнены под общий стандарт `display / h2 / h3 / lead / body / body-sm` из `src/styles/global.css`.
- **Blocks polished:** подчищены все активные секции страницы — `Hero`, `Conditions`, `Eligibility`, `Amount`, `Scenarios`, `Banks`, `Next Steps`, `Geo`, shared `FAQ` и shared `FinalCTALight`.
- **Copy cleaned:** убраны спорные oversized-тексты, технический мусор и неточные формулировки; CTA разделены по логике страницы: калькулятор там, где нужен расчёт, и разбор там, где нужен персональный маршрут сделки.
- **Shared standards kept:** страница использует единый FAQ-компонент сайта и эталонную финальную форму, как на главной странице.
- **Checks:** `pnpm build` проходит успешно; страница готова как референс для следующей волны выравнивания внутренних SEO-страниц.

### 2026-06-17 — Калькулятор приведён к эталону по фрейму и типографике

- **Frame normalized:** `/kalkulyator-voennoy-ipoteki/` больше не ощущается отдельным wide-лендингом; oversized-обёртка в `02-Calculator.astro` убрана, первый экран и workbench собраны внутри общего `vn-container`.
- **Typography standardized:** по всей странице выровнены `H1/H2/H3`, lead, body и supportive text под токены сайта из `src/styles/global.css`; локальная система `clamp/px/rem` для обычных заголовков и вводных текстов убрана.
- **Blocks polished:** под один ритм приведены `02-Calculator`, `03-Broker`, `04-Explainer`, `05-Basics`, финальный CTA и FAQ; калькулятор теперь живёт по тем же shared-паттернам, что и главная.
- **Reference decision:** калькулятор принят как референс для следующих внутренних страниц по четырём слоям — фрейм, типографика, ритм секций и shared FAQ-паттерн.
- **Text standard fixed:** базовое правило для сайта — `Hero H1 = var(--fs-display)`, `Section H2 = var(--fs-h2)`, `H3 = var(--fs-h3)`, hero/final CTA lead = `var(--fs-lead)`, секционные вводные = `var(--fs-body)`, supportive text = `var(--fs-body-sm)`; исключения допускаются только для UI-чисел калькулятора.
- **Checks:** `pnpm build` проходит успешно; локально проверены `/kalkulyator-voennoy-ipoteki/` и `/` на `1280`, `1024`, `768`, `390` через headless browser screenshots — страница визуально собрана в общий контейнер, без заметного horizontal overflow и без скачков типографики между блоками.

### 2026-06-17 — FAQ-аккордеон переведён на более компактный стандарт вопросов

- **Question size reduced:** в site-wide FAQ-паттерне вопрос больше не живёт как `H3`; стандарт снижен до шкалы `body` с весом `600` и line-height около `1.45-1.5`.
- **Shared component updated:** `src/components/sections/FAQ.astro` поджат по размеру вопроса и по вертикальному ритму строки, чтобы аккордеон выглядел спокойнее на desktop и laptop.
- **Legacy active FAQs aligned:** тот же стандарт применён к активным локальным FAQ на страницах сервиса, семейной военной ипотеки и Крыма, чтобы на сайте не осталось двух разных масштабов вопросов.
- **Docs synced:** правило зафиксировано в `project-docs/DESIGN_SYSTEM.md` как стандарт для FAQ-блоков сайта.

### 2026-06-17 — На всём сайте оставлен один FAQ-компонент

- **Single source of truth:** все route-страницы с FAQ теперь используют только `src/components/sections/FAQ.astro`.
- **Routes unified:** на shared FAQ переведены `/`, `/kalkulyator-voennoy-ipoteki/`, `/o-servise/`, `/semeynaya-voennaya-ipoteka/`, `/usloviya-voennoy-ipoteki/`, `/voennaya-ipoteka-krasnodar/`, `/voennaya-ipoteka-krym/`.
- **Data separated from UI:** вопросы и ответы для `o-servise` и `voennaya-ipoteka-krasnodar` подняты в `pageData.ts`; UI-компонент больше не хранит page-specific контент внутри себя.
- **Local duplicates removed:** старые локальные FAQ-файлы удалены из `_home`, `_kalkulyator-voennoy-ipoteki`, `_o-servise`, `_semeynaya-voennaya-ipoteka`, `_voennaya-ipoteka-krym`, `_voennaya-ipoteka-krasnodar`.

### 2026-06-17 — Краснодар доведён до финального as-built и взят как эталон geo/object page

- **Final route fixed:** страница `/voennaya-ipoteka-krasnodar/` зафиксирована в финальной структуре `Hero → Map → Catalog → Soft CTA → How We Work → Trust → Reviews → FAQ → Final CTA` без мёртвых локальных хвостов.
- **Typography polished:** у Hero, карты, soft CTA, процесса, trust, отзывов и финального CTA убраны локальные oversized-отклонения; ключевые заголовки приведены к `var(--fs-h2)`, служебный текст — к общей шкале `body/body-sm/label`.
- **Frame and catalog aligned:** карта и каталог живут в общем контейнере сайта, без инородных white-box отклонений и без ощущения отдельного лендинга внутри проекта.
- **Single shared endings:** Краснодар переведён на канонические shared-компоненты `src/components/sections/FAQ.astro` и `src/components/sections/FinalCTALight.astro`; тот же финальный CTA-паттерн теперь используется на главной, в Крыму, сервисе, калькуляторе, условиях, семейной ипотеке и контактах.
- **Docs cleaned:** финальный brief Краснодара переписан как as-built, удалены obsolete-файлы `PAGE_VOENNAYA_IPOTEKA_KRASNODAR_v2.md`, `KRASNODAR_ZHK_CATALOG.md`, `KRASNODAR_COMPLEXES_RESEARCH.md`, а промежуточная краснодарская история в `WORKLOG.md` свёрнута до одного актуального entry.

### 2026-06-17 — Max добавлен в общий контактный стандарт сайта

- **Max enabled:** в `CONTACTS.max` временно подключён кликабельный контакт `tel:+79384074457`, пока отдельная ссылка на профиль Max ещё не выдана.
- **Shared CTA coverage:** Max автоматически появился во всех shared contact-зонах, где компонент уже поддерживал второй мессенджер: финальный CTA, hero контактов и route-map overlay.
- **Footer aligned:** в `src/components/layout/Footer.astro` рядом с Telegram добавлена отдельная плашка `Max`, чтобы нижний контактный слой тоже жил по единому паттерну.
- **Phone-link polish:** для временного `Max` убрано принудительное открытие в новой вкладке; ссылка теперь ведёт как обычный кликабельный телефонный action.

### 2026-06-16 — Глобальная замена шрифта с Inter на Manrope

- **Installed:** в проект добавлен `@fontsource-variable/manrope` как новый базовый шрифт сайта.
- **Updated global typography:** `src/styles/global.css` теперь импортирует `Manrope` и использует его в `--font-family-base`.
- **Removed legacy font layer:** из `src/layouts/BaseLayout.astro` убраны preload и inline `@font-face` для старого `InterVariable.woff2`.
- **Updated source of truth:** `project-docs/DESIGN_SYSTEM.md` синхронизирован под `Manrope` как новый основной шрифт.
- **Verification:** локальная сборка после замены шрифта проходит успешно.

### 2026-06-16 — Из названий карточек убран префикс «ЖК»

- **Updated UI copy:** в каталоге Краснодара названия комплексов теперь отображаются без префиксов `ЖК`, `Квартал`, `Клубный квартал` и без типографских кавычек, чтобы карточки выглядели чище и ближе к визуальному референсу.
- **Kept data intact:** исходные названия в `src/data/krasnodar-complexes.ts` не переписывались; очистка сделана на уровне UI в `src/components/ui/ComplexCard.tsx`.
- **Aligned CTA context:** в сценарий заявки из карточки передаётся уже очищенное название комплекса.

### 2026-06-16 — Убраны CTA-хвосты из карточек и поджаты названия ЖК

- **Removed CTA hint:** из всех карточек каталога убран нижний текстовый call to action, чтобы карточки выглядели чище и визуально ближе к референсу.
- **Refined title row:** строка `название + цена` в карточках стала компактнее; убраны ограничения, которые раньше преждевременно ломали длинные названия вроде `Родные просторы`.
- **Adjusted typography:** заголовки сделаны мельче и легче по весу, без лишней тяжести, с более премиальным ритмом.

### 2026-06-16 — Смягчено раскрытие карточки и упрощены верхние плашки

- **Adjusted hover behavior:** при наведении на текст фото теперь сжимается мягче; убран слишком большой разрыв между изображением и текстовым блоком.
- **Aligned filters:** панель фильтров на десктопе растянута на всю ширину сетки карточек.
- **Simplified badges:** из верхних плашек убраны `Военная ипотека` и класс объекта; оставлен только статус `Есть сданные` или `Новый этап`.
- **Softened badge style:** статусная плашка уменьшена по высоте и кеглю, чтобы оставаться заметной, но не спорить с фотографией.

### 2026-06-16 — Доведён mobile tap-сценарий карточек каталога

- **Reduced hover gap:** в раскрытом состоянии карточки фотография теперь уходит вверх мягче, а зазор между визуалом и текстом уменьшен ещё сильнее.
- **Improved touch UX:** на мобильных и тач-устройствах первый тап по текстовой части карточки раскрывает детали, второй выполняет действие карточки.
- **Kept desktop behavior:** на десктопе сохранён быстрый hover-сценарий без лишних кликов.

### 2026-06-16 — Карточки каталога сделаны чище по визуалу

- **Removed hover shadow:** у карточек убрана тень при наведении; hover теперь держится на чистой рамке без лишнего объёма.
- **Rounded visual block:** фотография внутри карточки стала более округлой и отделённой от белой подложки, ближе к витринному референсу.
- **Added premium footer row:** в нижней части карточки добавлена тонкая разделительная линия и аккуратный action-ряд с `Получить консультацию`.

### 2026-06-16 — Добавлен тонкий divider после адреса в карточке

- **Refined text hierarchy:** после адреса в карточке добавлена деликатная горизонтальная линия, чтобы разделить первичный блок заголовка и детальный блок характеристик.
- **Matched reference rhythm:** нижняя часть карточки стала ближе к референсу по визуальной паузе и структурности текста.

### 2026-06-16 — Divider переведён в hover-состояние, текст карточек дополнительно уменьшен

- **Updated divider behavior:** линия после адреса теперь скрыта в спокойном состоянии и проявляется только при раскрытии карточки.
- **Refined typography:** вторичный текст, адрес, цена и нижний action-ряд карточки уменьшены на desktop и mobile для более аккуратной, премиальной подачи.

### 2026-06-16 — Поджата типографика карточек и добавлены фото ещё для 3 ЖК

- **Refined typography:** в каталоге `/voennaya-ipoteka-krasnodar/` уменьшен размер названий жилых комплексов, ослаблен визуальный вес цены и адреса, чтобы карточки читались аккуратнее и спокойнее на десктопе.
- **Added assets:** подключены реальные локальные фото из CIAN для `ЖК «Самолёт»`, `ЖК «Парк Победы»` и `ЖК «Народные кварталы»`.
- **Updated data:** в `src/data/krasnodar-complexes.ts` у трёх карточек заменены `null`-заглушки на реальные пути к изображениям.
- **Decision:** оставили по 3 кадра на карточку, чтобы сохранить премиальный ритм каталога и не перегрузить hover-слайдер.
- **Next:** продолжить тем же способом наполнение остальных карточек каталога реальными фотографиями.

### 2026-06-16 — Премиальная пересборка каталога ЖК на странице Краснодара

- **Updated:** блок каталога `/voennaya-ipoteka-krasnodar/` визуально упрощён и очищен.
- **Removed:** служебный лейбл `Каталог ЖК / 02` и подзаголовок под H2, чтобы секция начиналась сразу с сильного заголовка.
- **Restyled:** фильтры переведены в более спокойную белую панель с тонкими разделителями и меньшим визуальным шумом.
- **Restyled:** карточки переведены с серой подложки на белую, с мягкой рамкой, тенью и более спокойной иерархией внутри.
- **Changed interaction:** автослайдер по таймеру заменён на ручное переключение фото по горизонтальным зонам наведения на изображение; индикаторы заменены с точек на премиальные линейные маркеры.
- **Improved data UX:** исправлена логика фильтра `2027 и позже` — теперь учитывается `deadlineMax`, а не только `deadlineMin`.
- **Verification:** `pnpm build` прошёл; desktop/mobile визуально проверены на localhost без ошибок сборки.

### 2026-06-16 — Подключены реальные фото для карточки DOGMA PARK

- **Source:** `https://zhk-dogma-park-krasnodar-i.cian.ru/` (CIAN, 3 выбранных рендера ЖК).
- **Added assets:** `public/images/complexes/dogma-park/dogma-park-1.jpg`, `dogma-park-2.jpg`, `dogma-park-3.jpg`.
- **Updated data:** в `src/data/krasnodar-complexes.ts` карточка `DOGMA PARK` переведена с `null`-заглушек на локальные изображения.
- **Decision:** оставили 3 фотографии, а не 5, чтобы карточка оставалась лёгкой и слайдер не перегружал каталог.
- **Next:** при необходимости собрать таким же способом фото для остальных 11 ЖК и затем довести UX карточки/hover-сценарий.

### 2026-06-16 — Production hotfix: восстановлен `voen-navigator.ru`

- **Issue:** production-сайт открывал HTML главной, но ассеты `/_astro/*`, `/fonts/*` и внутренние страницы отдавали `404/403`; внешняя проверка могла выглядеть как зависание/нерабочий сайт.
- **Root cause:** директории текущего релиза `/var/www/client-sites/voenniy-navigator/releases/20260615154415-smartcaptcha` имели права `drwx------ root:www-data`, из-за чего nginx не мог зайти в папки релиза.
- **Server fix:** на AMS Server нормализованы права текущего релиза: директории `2755`, файлы `0644`, группа `www-data`; `nginx -t` успешен, nginx перезагружен.
- **Verified:** `https://voen-navigator.ru/`, `/voennaya-ipoteka-krasnodar/`, `/o-servise/` и CSS `/_astro/index.CbnYArwn.css` возвращают `200`.
- **Hardening:** в `.github/workflows/deploy-ams.yml` добавлен post-rsync шаг нормализации прав релиза, чтобы следующий деплой не повторил проблему.

### 2026-06-15 — SmartCaptcha readiness for AMS Leads API

- **Added:** client-side Yandex SmartCaptcha support for both lead flows:
  - `src/components/ui/RequestModal.tsx`
  - `src/components/leadgen/LeadGenRequestModal.tsx`
- **Updated:** `src/lib/leads.ts` now forwards `smartCaptchaToken` into AMS Leads API payloads.
- **Updated:** `.env.example` now includes `PUBLIC_SMARTCAPTCHA_CLIENT_KEY`.
- **Installed:** `@yandex/smart-captcha`.
- **Shared backend:** on AMS Server deployed shared AMS Leads API update with SmartCaptcha support and nginx rate limit for `/api/leads`, so all connected projects получили серверный антифлуд-слой уже сейчас.
- **Kept:** existing modal logic, copy, thank-you redirects and analytics events; changed only the anti-bot protection layer.
- **Verification:** `pnpm build` — passed.

### 2026-06-11 — Пересборка блоков 03 (Eligibility) и 04 (Amount)

- **Block 03 (Eligibility):** пересобран по H2-BRIDGE и Risk Reversal.
  - H2: «Три условия, без которых банк не начнёт рассмотрение» (напряжение + механизм).
  - Lead: конкретный риск — «потерять месяцы на пересборку пакета».
  - Критерии сокращены до 3 пунктов, документы — до 2, без воды.
  - Добавлен фильтр «Кому не подходит» (Risk Reversal): 3 пункта отсечения.
  - CTA: «Рассчитать в калькуляторе» (ведёт на `/kalkulyator-voennoy-ipoteki/`).
  - Mobile: grid → 1 column, filter → vertical stack.
- **Block 04 (Amount):** пересобран с премиальным визуалом «карточка-квитанция».
  - H2: «2,1–2,3 млн — но это не ваш финальный бюджет» (конкретика + напряжение).
  - Lead: «Банк не одобряет по таблице» — сразу отстройка.
  - Визуал: тёмная карточка-квитанция (bank statement) с базовой суммой, 4 рычага и итогом «до 5 млн ₽».
  - 4 фактора в mini-cards: срок, банк, объект, дополнительные средства.
  - CTA: «Рассчитать сумму» (ведёт на калькулятор).
  - Mobile: квитанция full-width, факторы 2×2 grid.
- **Build:** `pnpm build` проходит с 0 errors, 0 warnings.
- **Next:** блок 05 (Scenarios) → 06 (Banks) → 07 (Next Steps) → 08 (Geo) → 09 (FAQ).

### 2026-06-11 — Пересборка блоков 06–09 на странице `/usloviya-voennoy-ipoteki/`

- **Block 06 (Banks):** пересобран в таблицу сравнения 4 банков (ПСБ, Сбер, ВТБ, Банк РОССИЯ).
  - Десктоп: responsive-таблица с параметрами (ставка, сумма, срок, первоначальный взнос, объекты, возраст, особенности).
  - Mobile: карточки с параметрами вместо таблицы.
  - CTA: «Подобрать банк под мою ситуацию» → модалка на `/contacts/#request`.
  - Стиль: премиальные тёмные карточки, accent badges, hover-эффекты.
- **Block 07 (Next Steps):** пересобран из 7 шагов оформления в 4 шага сервиса.
  - Шаги: Первичный разбор → Финальный расчёт → Подбор объекта → Сопровождение сделки.
  - 4 карточки в grid (4 cols desktop, 2 cols tablet, 1 col mobile).
  - CTA: «Начать с первичного разбора» → модалка.
- **Block 08 (Geo):** создан новый блок перекрёстных ссылок.
  - 2 карточки: Краснодар (50+ проектов, 2–4 недели) и Крым (15+ проектов, 3–5 недель).
  - Ссылки: `/voennaya-ipoteka-krasnodar/` и `/voennaya-ipoteka-krym/`.
  - Подключён в `usloviya-voennoy-ipoteki.astro` между Process и FAQ.
- **Block 09 (FAQ):** расширен с 8 до 11 вопросов.
  - Добавлены: процентная ставка, развод, продажа квартиры.
  - Все вопросы по FAQ-SAFE: прямые ответы, без рекламы, с ограничениями.
  - Schema `faqSchema` автоматически синхронизирован через `pageData.ts`.
- **Build:** `pnpm build` проходит с 0 errors, 0 warnings.
- **Next:** проверка мобильной версии, Safari iOS, финальный QA.

### 2026-06-11 — Финализация брифа страницы Условия военной ипотеки (v2.0)

- **Decision:** утверждена финальная структура страницы `/usloviya-voennoy-ipoteki/` из 9 блоков по методологии АМС.
- **Removed:** удалён старый дублирующий бриф `pages/PAGE_USLOVIYA_VOENNOY_IPOTEKI.md`. Единственный бриф — `project-docs/briefs/PAGE_USLOVIYA_VOENNOY_IPOTEKI.md`.
- **New structure (9 blocks):** 01-Hero → 02-Conditions → 03-Eligibility → 04-Amount → 05-Scenarios → 06-Banks → 07-NextSteps → 08-Geo → 09-FAQ.
- **Key changes:** добавлен фильтр «Кому не подходит» в Eligibility; Banks пересобран в таблицу сравнения; Process укорочен до 4 шагов сервиса; добавлен Geo-мостик на Краснодар и Крым; FAQ расширен до 10+ вопросов с процентом, ставкой, разводом, продажей.
- **CTA logic:** блоки 02-05 → калькулятор; блоки 06-09 → разбор.
- **SEO-check:** все H2 по H2-BRIDGE, FAQ по FAQ-SAFE, Risk Reversal через фильтр отсечения.
- **Next:** пересборка блоков 03-09 по финальному брифу.

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
- **Updated FAQ design:** FAQ страницы калькулятора приведён к визуальному паттерну главной страницы: sticky-левая колонка, CTA-ссылка, нумерованный аккордеон, hover/open-состояния и плавное раскрытие.
- **Updated final CTA design:** финальный CTA калькулятора переведён на тот же светлый премиальный shared-паттерн, что и на главной странице.
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
- **Rebuilt:** FAQ приведён к точному визуальному паттерну главной страницы: sticky-левая колонка, нумерованный аккордеон, плавное раскрытие, все вопросы по умолчанию закрыты.
- **Rebuilt:** финальный CTA приведён к точному светлому паттерну главной страницы. Тёмная версия убрана.
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
- **Updated:** финальный CTA главной пересобран в более премиальную visual-card композицию с layered shell, glow-подложкой и отдельными benefit-cards.
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

### 2026-06-15 — SmartCaptcha и production hardening

- **Added:** для проекта `voenniy-navigator` в `AMS Leads API` включена обязательная Yandex SmartCaptcha.
- **Published:** на `voen-navigator.ru` выкачена новая production-сборка с `PUBLIC_SMARTCAPTCHA_CLIENT_KEY`; обе lead-формы передают `smartCaptchaToken`.
- **Verified:** прямой `POST https://voen-navigator.ru/api/leads` без `smartCaptchaToken` возвращает `400 captcha_required`.
- **Infra:** server-side rate-limit на leads-роуте и Nginx-level throttling остаются активны как антибот-слой.

### 2026-07-03 — SEO-перелинковка journal ↔ commercial pages доведена до кластерной архитектуры

- **Implemented:** в `src/lib/journal/index.ts` собрана единая матрица связей между статьями, рубриками и приоритетными commercial pages: Краснодар, Крым, Калькулятор, Условия, Семейная.
- **Added:** новые компоненты `src/components/journal/CommercialRouteCard.astro`, `src/components/journal/JournalMainRoutes.astro`, `src/components/sections/CommercialSupportingMaterials.astro`.
- **Updated journal archive:** `/journal/` теперь содержит направляющий SEO-блок `Главные страницы по теме`, а карточки статей показывают `Следующий шаг` в релевантную money page.
- **Updated category pages:** у рубрик появился отдельный коммерческий переход в страницу кластера; `JournalPopular` теперь может показывать `Главный следующий шаг`, а не только статьи.
- **Updated article pages:** финальный CTA в статье больше не ведёт по умолчанию в `/contacts/`, а маршрутизирует в основную commercial page темы; secondary route используется как смежный шаг, если он логически нужен.
- **Updated commercial pages:** на `/voennaya-ipoteka-krasnodar/`, `/voennaya-ipoteka-krym/`, `/kalkulyator-voennoy-ipoteki/`, `/usloviya-voennoy-ipoteki/`, `/semeynaya-voennaya-ipoteka/` встроен обратный SEO-блок `Полезные материалы` с релевантными supporting-статьями и соседними кластерами.
- **Synced money-query layer:** `title` и `H1` на пяти приоритетных commercial pages приведены к строгой связке с основным кластерным запросом: `Военная ипотека Краснодар`, `Военная ипотека в Крыму`, `Калькулятор военной ипотеки`, `Условия военной ипотеки`, `Семейная военная ипотека`.
- **Documented:** создана рабочая матрица `project-docs/SEO_INTERNAL_LINKING_MATRIX_2026-07-03.md` как источник правды по связям article -> money page и page -> supporting layer.
- **Verified:** `pnpm build` — success; `pnpm geo-check` — `100/100`; `pnpm seo-check` — `0 blockers`, `0 warnings`.
- **Verified in dist:** архив `/journal/`, рубрики и priority money pages действительно содержат новые блоки `Главные страницы по теме`, `Следующий шаг` и `Полезные материалы`.

### 2026-07-03 — Top-50 ядро дополнено live-сверкой `title / description / H1`

- **Updated:** root-файл `SEO_CORE_TOP50_VOEN_NAVIGATOR_2026-07-03.md`.
- **Added:** секция `3A` с live-сверкой Top-50 ядра против фактических опубликованных `title / description / H1` и оценкой совпадения по money pages и anti-objection статье.
- **Added:** секция `3B` с inventory всех опубликованных SEO-страниц: основные commercial/trust pages, архив журнала, рубрики и все 10 стартовых статей.
- **Fixed source of truth:** в документе явно зафиксировано, что exact-match `title` и `H1` уже стоят на пяти приоритетных commercial pages, а главные незакрытые SEO-gap pages сейчас — `/kvartiry-po-voennoy-ipoteke/`, `/voennaya-ipoteka-sevastopol/`, `/voennaya-ipoteka-simferopol/`.
- **Live evidence:** мета-слой снимался с опубликованного сайта `https://voen-navigator.ru/` 2026-07-03, а не только из локального кода.

### 2026-07-03 — Для журнала создан отдельный контур редакционных брифов

- **Created:** `project-docs/JOURNAL_EDITORIAL_MAP.md` как master-файл по развитию журнала: роль, правила написания, антиканнибализация, ориентиры по длине, article map и будущие темы.
- **Created:** `project-docs/briefs/journal/README.md` как вход в папку журнальных брифов.
- **Created:** отдельные брифы `project-docs/briefs/journal/ARTICLE_*.md` на все 10 опубликованных статей журнала.
- **Synced:** `project-docs/briefs/README.md` и `project-docs/briefs/PAGE_JOURNAL.md` обновлены, чтобы новый журналный контур стал официальной частью документации проекта.
- **Purpose fixed:** теперь журнал можно развивать не хаотично по статье за статьёй, а через master-map + article briefs, включая работу через ИИ, редактора и SEO-слой.

### 2026-07-03 — SEO-стратегия и Top-50 объединены в единый SEO-паспорт

- **Created:** `project-docs/SEO_PASSPORT_VOEN_NAVIGATOR.md` как канонический SEO-документ проекта.
- **Included in passport:** профиль сайта, регионы, главная SEO-формула, live-структура, live `title / description / H1`, Top-50 ядро, journal-layer, gap pages, перелинковка и 6-месячный план.
- **Simplified:** вместо двух главных документов (`SEO_STRATEGY_CLUSTER_MAP_VOEN_NAVIGATOR_2026-07-03.md` + `SEO_CORE_TOP50_VOEN_NAVIGATOR_2026-07-03.md`) теперь есть один рабочий SEO-паспорт для постоянной поддержки.
- **Marked as source layers:** root-файлы `SEO_STRATEGY_CLUSTER_MAP_VOEN_NAVIGATOR_2026-07-03.md` и `SEO_CORE_TOP50_VOEN_NAVIGATOR_2026-07-03.md` оставлены как исторические и source-материалы, но не как текущий канон.
- **Synced docs:** `project-docs/README.md` и `project-docs/PASSPORT_PROJECTS.md` обновлены, чтобы при SEO-задачах новый вход шел через SEO-паспорт.

### 2026-07-03 — Зафиксирована полная SEO-система проекта, включая журнал

- **Extended passport:** в `project-docs/SEO_PASSPORT_VOEN_NAVIGATOR.md` добавлены правила, что является каноном, что является supporting-слоем и что не нужно удалять как "лишние дубли".
- **Fixed reading order:** для любого SEO-захода теперь явно задан маршрут `SEO_PASSPORT -> SEMANTICS -> INTERNAL_LINKING -> JOURNAL_EDITORIAL_MAP -> PAGE/ARTICLE brief`.
- **Journal linked into SEO system:** `project-docs/README.md`, `project-docs/briefs/README.md` и `project-docs/briefs/PAGE_JOURNAL.md` обновлены так, чтобы журнал читался как полноценный SEO-кластер, а не как отдельная папка со статьями.
- **Deletion rule fixed:** root SEO-файлы оставлены как архивный source-слой; удалять их сейчас не рекомендуется, лучше позже вынести в отдельный `archive/seo/`, если понадобится визуальная чистка проекта.

### 2026-07-03 — Усилен SEO-слой журнала (фаза 1)

- **Scope:** все 10 статей `src/content/journal/*.md`, hub `/journal/`, 7 рубрик, `src/lib/journal/index.ts`, `src/pages/journal/[slug].astro`.
- **Meta updated:** уникальные `title / description / H1` у каждой статьи; обновлены title/description hub `/journal/` и категорий.
- **Schema updated:** `BlogPosting` получил `dateModified`, `speakable`, `url` для `author`/`publisher`, `articleSection`.
- **Internal links:** добавлены contextual links из каждой статьи на primary commercial pages (`/voennaya-ipoteka-krasnodar/`, `/voennaya-ipoteka-krym/`, `/kalkulyator-voennoy-ipoteki/`, `/usloviya-voennoy-ipoteki/`, `/semeynaya-voennaya-ipoteka/`).
- **Docs synced:** `SEO_PASSPORT_VOEN_NAVIGATOR.md`, `JOURNAL_EDITORIAL_MAP.md`, `JOURNAL_SEO_ENHANCEMENT_PLAN.md` приведены в соответствие с live-слоем.
- **Checks passed:** `astro check && astro build` — 0 errors, 0 warnings.
- **Note:** Astro выводит non-blocking warning `Duplicate id ...` для журнальных статей при сборке; route собирается штатно.

### 2026-07-03 — Завершена фаза 2: усилены все 10 брифов журнала

- **Scope:** все брифы в `project-docs/briefs/journal/ARTICLE_*.md`.
- **Done:** каждый бриф теперь содержит live title/description/H1, target word count, тон и стиль, каркас, 2–3 семейных сценария, маршрут/фильтры, типичные ошибки, чек-лист, CTA и полный текст статьи для переноса на сайт.
- **Style:** журналистский, экспертный, человечный, без признаков AI; цепляющие H2/H3.
- **Docs synced:** `SEO_PASSPORT_VOEN_NAVIGATOR.md`, `JOURNAL_EDITORIAL_MAP.md`, `JOURNAL_SEO_ENHANCEMENT_PLAN.md` приведены в соответствие с усиленными брифами.
- **Next:** фаза 3 — связь журнала с будущими gap-pages (`/kvartiry-po-voennoy-ipoteke/`, `/voennaya-ipoteka-sevastopol/`, `/voennaya-ipoteka-simferopol/`).

### 2026-07-03 — Усилен бриф десятой статьи журнала

- **Article:** `/journal/kvartira-po-voennoy-ipoteke-pri-razvode/`.
- **Brief updated:** `project-docs/briefs/journal/ARTICLE_KVARTIRA_PO_VOENNOY_IPOTEKE_PRI_RAZVODE.md` расширен до полноценного editorial brief: title/H1/description, объём, ситуации, факторы раздела имущества, ошибки, чек-лист, CTA, перелинковка.
- **Content planned:** статья расширена с ~710 до ~1600–1800 слов, добавлена живая вводная, три типичные ситуации, разбор шести факторов, типичные ошибки, чек-лист.
- **Docs synced:** `SEO_PASSPORT_VOEN_NAVIGATOR.md`, `JOURNAL_EDITORIAL_MAP.md`, `JOURNAL_SEO_ENHANCEMENT_PLAN.md` приведены в соответствие с live-слоем.

### 2026-07-03 — Усилен бриф девятой статьи журнала

- **Article:** `/journal/semeynaya-i-voennaya-ipoteka/`.
- **Brief updated:** `project-docs/briefs/journal/ARTICLE_SEMEYNAYA_I_VOENNAYA_IPOTEKA.md` расширен до полноценного editorial brief: title/H1/description, объём, сценарии семей, разбор «сравнивать vs совмещать», ошибки, чек-лист, CTA, перелинковка.
- **Content planned:** статья расширена с ~830 до ~1700–1900 слов, добавлена живая вводная, три сценария выбора программы, пять факторов выбора, типичные ошибки, чек-лист.
- **Docs synced:** `SEO_PASSPORT_VOEN_NAVIGATOR.md`, `JOURNAL_EDITORIAL_MAP.md`, `JOURNAL_SEO_ENHANCEMENT_PLAN.md` приведены в соответствие с live-слоем.

### 2026-07-03 — Усилен бриф восьмой статьи журнала

- **Article:** `/journal/sevastopol-ili-simferopol-po-voennoy-ipoteke/`.
- **Brief updated:** `project-docs/briefs/journal/ARTICLE_SEVASTOPOL_ILI_SIMFEROPOL_PO_VOENNOY_IPOTEKE.md` расширен до полноценного editorial brief: title/H1/description, объём, сценарии семей, критерии сравнения, ошибки, чек-лист, CTA, перелинковка.
- **Content planned:** статья расширена с ~760 до ~1700–1900 слов, добавлена живая вводная, три сценария выбора города, три ломающих выбор фактора, типичные ошибки, чек-лист.
- **Docs synced:** `SEO_PASSPORT_VOEN_NAVIGATOR.md`, `JOURNAL_EDITORIAL_MAP.md`, `JOURNAL_SEO_ENHANCEMENT_PLAN.md` приведены в соответствие с live-слоем.

### 2026-07-03 — Усилен бриф седьмой статьи журнала

- **Article:** `/journal/voennaya-ipoteka-v-krymu/`.
- **Brief updated:** `project-docs/briefs/journal/ARTICLE_VOENNAYA_IPOTEKA_V_KRYMU.md` расширен до полноценного editorial brief: title/H1/description, объём, сценарии семей, дистанционная сделка, ошибки, чек-лист, CTA, перелинковка.
- **Content planned:** статья расширена с ~995 до ~2000–2200 слов, добавлена живая вводная, три сценария (Симферополь для жизни, Севастополь на будущее, дистанционная покупка у моря), типичные ошибки, чек-лист.
- **Docs synced:** `SEO_PASSPORT_VOEN_NAVIGATOR.md`, `JOURNAL_EDITORIAL_MAP.md`, `JOURNAL_SEO_ENHANCEMENT_PLAN.md` приведены в соответствие с live-слоем.

### 2026-07-03 — Усилен бриф шестой статьи журнала

- **Article:** `/journal/kalkulyator-voennoy-ipoteki-chto-schitat/`.
- **Brief updated:** `project-docs/briefs/journal/ARTICLE_KALKULYATOR_VOENNOY_IPOTEKI_CHTO_SCHITAT.md` расширен до полноценного editorial brief: title/H1/description, объём, сценарии участников, пять параметров расчёта, ошибки, чек-лист, CTA, перелинковка.
- **Content planned:** статья расширена с ~780 до ~1700–1900 слов, добавлена живая вводная, три сценария расчёта, разбор вводных, типичные ошибки, чек-лист после расчёта.
- **Docs synced:** `SEO_PASSPORT_VOEN_NAVIGATOR.md`, `JOURNAL_EDITORIAL_MAP.md`, `JOURNAL_SEO_ENHANCEMENT_PLAN.md` приведены в соответствие с live-слоем.

### 2026-07-03 — Усилен бриф пятой статьи журнала

- **Article:** `/journal/banki-po-voennoy-ipoteke/`.
- **Brief updated:** `project-docs/briefs/journal/ARTICLE_BANKI_PO_VOENNOY_IPOTEKE.md` расширен до полноценного editorial brief: title/H1/description, объём, сценарии, шесть параметров оценки банка, ошибки, чек-лист, CTA, перелинковка.
- **Content planned:** статья расширена с ~910 до ~1900–2100 слов, добавлена живая вводная, три сценария (Краснодар, Крым дистанционно, ранняя стадия), таблица сравнения банков, типичные ошибки, чек-лист.
- **Docs synced:** `SEO_PASSPORT_VOEN_NAVIGATOR.md`, `JOURNAL_EDITORIAL_MAP.md`, `JOURNAL_SEO_ENHANCEMENT_PLAN.md` приведены в соответствие с live-слоем.

### 2026-07-03 — Усилен бриф четвёртой статьи журнала

- **Article:** `/journal/summa-voennoy-ipoteki-i-raschet/`.
- **Brief updated:** `project-docs/briefs/journal/ARTICLE_SUMMA_VOENNOY_IPOTEKI_I_RASCHET.md` расширен до полноценного editorial brief: title/H1/description, объём, сценарии участников, структура бюджета, ошибки, чек-лист, CTA, перелинковка.
- **Content planned:** статья расширена с ~600 до ~1700–1900 слов, добавлена живая вводная, три сценария бюджета, разбор пяти элементов реального бюджета, ловушка «чуть-чуть добавить», чек-лист.
- **Docs synced:** `SEO_PASSPORT_VOEN_NAVIGATOR.md`, `JOURNAL_EDITORIAL_MAP.md`, `JOURNAL_SEO_ENHANCEMENT_PLAN.md` приведены в соответствие с live-слоем.

### 2026-07-03 — Усилен бриф третьей статьи журнала

- **Article:** `/journal/usloviya-voennoy-ipoteki-2026/`.
- **Brief updated:** `project-docs/briefs/journal/ARTICLE_USLOVIYA_VOENNOY_IPOTEKI_2026.md` расширен до полноценного editorial brief: title/H1/description, объём, сценарии участников, фильтры, ошибки, чек-лист, CTA, перелинковка.
- **Content planned:** статья расширена с ~998 до ~2000–2200 слов, добавлена живая вводная, три сценария участников, разбор ставки/лимита/ограничений, типичные ошибки, чек-лист.
- **Docs synced:** `SEO_PASSPORT_VOEN_NAVIGATOR.md`, `JOURNAL_EDITORIAL_MAP.md`, `JOURNAL_SEO_ENHANCEMENT_PLAN.md` приведены в соответствие с live-слоем.

### 2026-07-03 — Усилен бриф второй статьи журнала

- **Article:** `/journal/novostroyki-krasnodara-po-voennoy-ipoteke/`.
- **Brief updated:** `project-docs/briefs/journal/ARTICLE_NOVOSTROYKI_KRASNODARA_PO_VOENNOY_IPOTEKE.md` расширен до полноценного editorial brief: title/H1/description, объём, сценарии, фильтры, ошибки, чек-лист, CTA, перелинковка.
- **Content planned:** статья расширена с ~760 до ~1700–1900 слов, добавлена живая вводная, три сценария семей (Петровы — жизнь, Соколовы — аренда, Воронины — на будущее), три фильтра отбора, типичные ошибки, чек-лист объекта.
- **Docs synced:** `SEO_PASSPORT_VOEN_NAVIGATOR.md`, `JOURNAL_EDITORIAL_MAP.md`, `JOURNAL_SEO_ENHANCEMENT_PLAN.md` приведены в соответствие с live-слоем.

### 2026-07-03 — Усилен бриф и текст первой статьи журнала

- **Article:** `/journal/kak-kupit-kvartiru-po-voennoy-ipoteke-v-krasnodare/`.
- **Brief updated:** `project-docs/briefs/journal/ARTICLE_KAK_KUPIT_KVARTIRU_PO_VOENNOY_IPOTEKE_V_KRASNODARE.md` расширен до полноценного editorial brief: title/H1/description, объём, сценарии, маршрут, ошибки, чек-лист, CTA, перелинковка.
- **Content updated on site:** статья расширена с ~1008 до ~1851 слова, добавлена живая вводная, три сценария семей (Петровы, Соколовы, Воронины), 6 вводных, 6 шагов маршрута, типичные ошибки, чек-лист.
- **Live meta updated:** title `Как купить квартиру в Краснодаре по военной ипотеке: пошаговый маршрут`, excerpt `С чего начать покупку в Краснодаре по военной ипотеке: бюджет, банк, район, новостройка и типичные ошибки, которые удлиняют сделку.`, `updatedDate: 2026-07-03`.
- **Checks passed:** `astro check && astro build` — 0 errors, 0 warnings.

### 2026-07-03 — Старые root SEO-файлы удалены после консолидации

- **Deleted:** `SEO_STRATEGY_CLUSTER_MAP_VOEN_NAVIGATOR_2026-07-03.md`.
- **Deleted:** `SEO_CORE_TOP50_VOEN_NAVIGATOR_2026-07-03.md`.
- **Reason:** после сборки `project-docs/SEO_PASSPORT_VOEN_NAVIGATOR.md` эти документы стали лишним параллельным слоем и создавали риск путаницы.
- **New rule:** в проекте действует один SEO-канон — `project-docs/SEO_PASSPORT_VOEN_NAVIGATOR.md`; отдельные параллельные SEO-стратегии и отдельные Top-50 файлы больше не ведем.
- **History kept:** логика стратегии и ядра сохранена внутри SEO-паспорта, `project-docs/WORKLOG.md` и git-истории репозитория `site`.

### 2026-07-03 — Собран клиентский markdown-файл под PDF на первые 3 месяца SEO

- **Created:** `project-docs/CLIENT_SEO_PDF_3M_VOEN_NAVIGATOR.md`.
- **Purpose:** компактная клиентская версия без внутренней технической перегрузки: исходная точка, стартовое ядро, приоритетные страницы, роль журнала и план работ на 3 месяца.
- **Based on:** `project-docs/SEO_PASSPORT_VOEN_NAVIGATOR.md` как канонический SEO-источник проекта.
- **Use case:** файл можно сразу конвертировать в PDF и отправлять клиенту как понятный документ по старту SEO-продвижения.

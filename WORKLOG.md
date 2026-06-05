# WORKLOG — Военный навигатор

## Текущий статус

- **Stack:** Astro 5 + Tailwind CSS v4 + TypeScript strict + React islands.
- **Build:** `pnpm build` passes with 0 errors, 0 warnings.
- **Browser check:** localhost and production (`voen-navigator.ru`) render correctly, 0 console errors.
- **Deployed:** commit `9736e0e` pushed to `main`, GitHub Actions → AMS Server.

### 2026-06-05 — Бриф страницы калькулятора
- **Created:** `pages/PAGE_KALKULYATOR_VOENNOY_IPOTEKI.md` — утвержденный бриф новой страницы `/kalkulyator-voennoy-ipoteki/`.
- **Decision:** страница зафиксирована как универсальная расчетная SEO-страница без жесткой привязки к Краснодару или Крыму в H1 и первом экране.
- **Structure:** утверждена короткая структура из 6 блоков: hero + калькулятор, explainer, базовые ориентиры, сценарии покупки, FAQ, финальный CTA.
- **Scaffold:** создана рабочая папка `src/pages/_kalkulyator-voennoy-ipoteki/` под будущую сборку секций.
- **Checks:** сборка не запускалась, так как правки только в markdown-документах и организационной структуре.

### 2026-06-05 — Wordstat / Семантика
- **Research:** собрана Wordstat-семантика через `mcp__yandex_searchapi` по кластерам:
  - новостройки Краснодар;
  - военная ипотека Краснодар;
  - Краснодарский край;
  - Крым;
  - калькулятор военной ипотеки;
  - брендовый слой `Военный навигатор`.
- **Created:** `SEMANTICS.md` — большой обзор по кластерам, интентам, динамике спроса и рекомендациям по архитектуре сайта.
- **Updated:** `PASSPORT_PROJECTS.md` — добавлен `SEMANTICS.md` в список источников правды и обязательного чтения для SEO/контентных задач.
- **Key finding:** буквальный спрос на `купить новостройку по военной ипотеке` слабый, а основной реальный спрос идёт через формулировки `военная ипотека краснодар`, `квартиры по военной ипотеке`, `ипотека краснодар новостройки`, `новостройки крыма`, `калькулятор военной ипотеки`.
- **Key finding:** по Крыму спрос распадается на отдельные городские кластеры, прежде всего Севастополь и Симферополь.
- **Checks:** изменений в коде сайта нет; сборка не запускалась, так как правки только в markdown-документах.

### 2026-06-04 — Sprint 2+3: Local fonts + Image pipeline + Motion system + Analytics
- **Local fonts:** заменён Google Fonts CDN на локальный `InterVariable.woff2` в `public/fonts/`.
  - `BaseLayout.astro`: preload + `@font-face` с `font-display: swap`.
  - Fallback metrics: `ascent-override: 91.59%`, `descent-override: 22.81%`, `size-adjust: 105.77%` (Arial fallback).
- **Image pipeline:** `OptimizedImage.astro` обновлён — поддержка `astro:assets` Image для импортов, fallback `<img>` для external/public путей.
  - Добавлен `style` prop, LQIP placeholder, `onerror` handler.
  - Заменены raw `<img>` на `<OptimizedImage>` в 5 ключевых файлах:
    - `01-Hero.astro` (hero portrait)
    - `08-Trust.astro` (trust photo)
    - `03-Scenarios.astro` (krasnodar cards)
    - `02-Hero.astro` (leadgen hero)
    - `04-Trust.astro` (leadgen expert)
- **Motion system:** добавлен `RevealOnScroll.astro` + CSS `data-reveal` утилиты + inline JS в `BaseLayout.astro`.
  - Modes: `fade-up`, `fade-in`, `stagger` (с задержками и threshold).
  - `prefers-reduced-motion: reduce` — отключает анимации.
  - Обёрнуты секции: `02-ShortAnswer`, `03-Problem`, `04-Scenarios`, `05-Method`.
- **Hover shifts:** scenario rows (`04-Scenarios.astro`) — `translateX(4px)` на hover обёрнут в `@media (hover: hover) and (pointer: fine)`.
- **Accessibility:** добавлены `aria-label` для footer-ссылок (Telegram, VK).
- **Analytics layer:** unified `src/lib/analytics.ts` — type-safe обёртка над `ym`.
  - Event map: `modal_open`, `lead_submit`, `faq_open`, `page_scroll_50`, `page_scroll_90`, `phone_click`, `messenger_click`, `cta_click`, `nav_map_open`, `nav_map_close`.
  - Заменены прямые `window.ym` вызовы в `RequestModal.tsx` и `LeadGenRequestModal.tsx` на `track()`.
  - Scroll depth tracking (50% / 90%) — inline JS в `BaseLayout.astro`.
  - FAQ open tracking — inline JS в `11-FAQ.astro`.
  - Global click tracking для `data-track` атрибутов — phone, messenger clicks в Footer.
  - `meta[name="ym-counter-id"]` в `BaseLayout.astro` для доступа inline скриптов к counter ID.
- **CI/CD:** обновлён `.github/workflows/deploy-ams.yml` — pnpm `10.33.2` → `11.5.1`, `CI=true pnpm install --frozen-lockfile`.
- **Build:** `pnpm build` passes with 0 errors, 0 warnings; 15 pages.
- **Next:** WCAG checklist (skip links, heading hierarchy audit), astro-compress (после решения pnpm store conflict).

### 2026-06-04
- **GEO Optimization:** реализована Generative Engine Optimization для AI-поисковиков.
  - Добавлен `src/pages/llms.txt.ts` — авто-генерируемый Markdown для AI-краулеров.
  - Обновлён `public/robots.txt` — разрешены 6 AI-ботов (ChatGPT, Perplexity, Claude, GPTBot, OAI-SearchBot, Google-Extended).
  - Расширен `src/lib/seo.ts` — `WebSite` schema + расширенная `Organization` (`logo`, `sameAs`, `founder`).
  - Добавлен `<link rel="alternate" type="text/plain" href="/llms.txt">` в `BaseLayout.astro`.
  - Добавлен `scripts/geo-check.mjs` — пост-билд аудит GEO (скор 90/100, порог 80).
- **Infra:** портированы Astro Starter improvements — `utils.ts`, `validation.ts`, `OptimizedImage.astro`, `ScriptLoader.astro`, `CookieToggle.tsx`, `useEmailQueryParam.ts`, `leads.ts`, `og.ts`, расширенные constants, font fallback в BaseLayout, fallback modal в PageLayout.
- **Build:** `pnpm build` passes with 0 errors, 0 warnings; 13 pages.
- **Deployed:** commit `f956fc8` pushed to `main`, GitHub Actions → AMS Server.
- **Updated:** `PASSPORT_PROJECTS.md` — добавлены секции «Инфраструктурные улучшения» и «GEO Optimization».

### 2026-06-01
- Done: removed local AI/Astro build instruction duplicates: `ASTRO_RULES_CORE.md`, `CLAUDE.md`, `BUILD_INSTRUCTIONS.md`, `BUILD_PHASE_1_FOUNDATION.md`, `BUILD_PHASE_2_PAGES.md`, `BUILD_PHASE_3_FINAL.md`.
- Done: updated `PASSPORT_PROJECTS.md`; Astro build methodology now points to the global Codex/AI-SYSTEM rules instead of local project files.

### 2026-06-01
- Done: created `PASSPORT_PROJECTS.md` with local project context, sources of truth, form/API caution and journaling rules.
- Done: removed local `AGENTS.md` according to the global Codex rule that only `C:\Users\User\.codex\AGENTS.md` keeps that name.
- Next: before the next code edit, update active references in README/docs if they still point to the old local file name.

### 2026-05-25
- Done: started rebuild of `/voennaya-ipoteka-krasnodar/` from the new commercial brief `pages/PAGE_VOENNAYA_IPOTEKA_KRASNODAR.md`.
- Done: rebuilt the hero around the clean SEO H1 "Квартиры в Краснодаре по военной ипотеке" and the lead offer "подборка 12 проверенных ЖК".
- Done: redesigned the right-side hero visual as a catalog/PDF preview and removed large background section numbers from the rebuilt block.
- Done: adapted the mobile hero: one primary CTA, no secondary CTA, no proof rows before the visual, catalog preview kept immediately after the button.
- Done: replaced the weak short-answer block with a full commercial second screen: "Что будет внутри подборки 12 ЖК" with a document-style catalog contents preview.
- Done: added restrained CSS motion to the second block: staggered document rows, desktop hover highlight, and `prefers-reduced-motion` fallback.
- Done: saved the agreed direction for the next block in `pages/PAGE_VOENNAYA_IPOTEKA_KRASNODAR.md`: 3 real ЖК examples from the подборка, with scenarios "для жизни с семьёй", "под инвестицию", and "в сформированном районе"; no "я" tone and no "переезд позже" wording.
- Checked: `pnpm build` passes with 0 errors and 0 warnings; 375px mobile has no horizontal overflow.

### 2026-05-22
- Done: read project and vault instructions, project architecture/design docs, package/config, source tree, page structure, and lead handling code.
- Checked: `git status --short` is clean before worklog creation; `pnpm build` passes with 13 static pages.
- Noted: no `WORKLOG.md` existed, so created this journal and `_worklog/archive/` according to vault rules.
- Next: wait for the specific edit/task; use the relevant PAGE brief as the source of truth before touching code.

### 2026-05-25 - Краснодар / видеооффер
- Done: strengthened the first and second screens around the updated content offer: "12 ЖК с видеоразбором", scenarios for life/rent/investment, and checking concrete flats inside each ЖК.
- Changed: hero lead, primary CTA, catalog preview captions, proof row, second block heading, CTA, document rows, and document footer.
- Checked: `pnpm build` passes with 0 errors and 0 warnings; browser check at 1440px and 375px shows no horizontal overflow.
- Done: added the third screen `03-Scenarios.astro` for `/voennaya-ipoteka-krasnodar/`: 3 purchase scenarios for family life, rent, and investment, with a 5/7 scenario-board composition and CTA.
- Checked: `pnpm build` passes; browser check at 1440px, 768px, and 375px shows the scenarios block renders without horizontal overflow.
- Changed: converted the third screen to a dark accent section with dark-elevated scenario board, on-dark typography, subtle grid, and blue scenario accents.
- Checked: `pnpm build` passes; browser check at 1440px and 375px confirms dark colors render and no horizontal overflow appears.
- Changed: simplified the third screen scenario cards: shorter titles/texts, removed extra explanatory offer lines, and tightened card spacing for cleaner scanning.
- Checked: `pnpm build` passes; browser check at 1440px and 375px confirms cleaner cards and no horizontal overflow.
- Changed: rebuilt the third screen as a premium "Что войдет в подборку" block with three visual ЖК preview cards, removed the matrix wording, and replaced visible "сценарий" wording on the Краснодар route with goal/purpose language.
- Fixed: corrected the third screen responsive grid so the three preview cards collapse into full-width cards on mobile instead of squeezing into three narrow columns.

### 2026-05-25 - Typography standard
- Done: applied the AMS typography scale in `src/styles/global.css` and added the requested mobile overrides for `--fs-display`, `--fs-h1`, `--fs-h2`, `--fs-h3`, `--fs-lead`, `--fs-body`, and `--fs-body-sm`.
- Changed: normalized elevated local `font-size` declarations across page sections, technical pages, leadgen components, quiz/review UI, and shared CTA/layout components to project typography tokens.
- Kept: decorative large sizes such as 404/section markers, catalog cover number, metric number, emoji/icon marks, and legal-card background numbers.
- Checked: `pnpm build` passes with 0 errors and 0 warnings; no `pnpm preflight` script exists in `package.json`.
- Changed: expanded the typography system with semantic aliases, `.vn-type-*` utilities, line-height tokens, and a documented `type-exception` rule in `AGENTS.md` so future exceptions are explicit and easier to audit.

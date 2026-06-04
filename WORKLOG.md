# WORKLOG - Voenniy Navigator

## Current Status
- Project: Astro + Tailwind CSS v4 + TypeScript strict + React islands.
- **Deploy: GitHub → AMS Server (Timeweb Cloud, `5.42.100.161`) → `voen-navigator.ru`.**
- Vercel project removed completely. Preview domains blocked (301 → production).
- Local `.vercel/` folder removed.
- Project migrated to `PASSPORT_PROJECTS.md` + `WORKLOG.md`; local `AGENTS.md` was removed.
- Build is green as of 2026-05-22: `pnpm build` completed with 0 errors and 0 warnings.
- Important mismatch to remember: project notes describe all major pages as complete, but several route files currently render only `01-Hero.astro` plus `pageData.ts`.

## Next Steps
- Before editing any page, read `SITE_ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, the relevant `pages/PAGE_*.md`, and use the global Codex/AI-SYSTEM Astro rules as the technical source of truth.
- For form/API work, reconcile current `src/lib/leads.ts` AMS Leads API flow with older docs that still mention `/api/contact` and Telegram-only handling.
- For page-building work, continue component-by-component in `src/pages/_[slug]/`, keeping route files thin.

## Open Questions
- Confirm whether `/api/contact` is intentionally replaced by AMS Leads API or should be restored for this Vercel project.
- Confirm whether the next focus is unfinished funnel pages (`/video/`, `/bonus/`, `/prezentaciya/`) or completing the partially componentized SEO pages.

## Journal

### 2026-06-04
- **Infra cleanup:** Removed Vercel project `voenniy-navigator` completely (deployments deleted).
- **Infra cleanup:** Deleted local `.vercel/` folder from repo.
- **Infra cleanup:** Removed stale `voenniy-navigator.5.42.100.161.nip.io` nginx config from server.
- **Infra cleanup:** Added nginx redirect block: `voenniy-navigator.preview.ams-cloud.ru` and `voenniy-navigator.preview.ams-chirkov.ru` → 301 to `https://voen-navigator.ru/`.
- **Verified:** `voen-navigator.ru` (production) returns 200 OK.
- **Verified:** `pnpm dev` runs locally on `localhost:4321`.
- Updated `WORKLOG.md` deploy target to AMS Server.

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

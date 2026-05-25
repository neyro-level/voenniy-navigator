# WORKLOG - Voenniy Navigator

## Current Status
- Project studied for continuation: Astro + Tailwind CSS v4 + TypeScript strict + React islands, Vercel deploy target.
- Build is green as of 2026-05-22: `pnpm build` completed with 0 errors and 0 warnings.
- Important mismatch to remember: project notes describe all major pages as complete, but several route files currently render only `01-Hero.astro` plus `pageData.ts`.

## Next Steps
- Before editing any page, read `SITE_ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `ASTRO_RULES_CORE.md`, and the relevant `pages/PAGE_*.md`.
- For form/API work, reconcile current `src/lib/leads.ts` AMS Leads API flow with older docs that still mention `/api/contact` and Telegram-only handling.
- For page-building work, continue component-by-component in `src/pages/_[slug]/`, keeping route files thin.

## Open Questions
- Confirm whether `/api/contact` is intentionally replaced by AMS Leads API or should be restored for this Vercel project.
- Confirm whether the next focus is unfinished funnel pages (`/video/`, `/bonus/`, `/prezentaciya/`) or completing the partially componentized SEO pages.

## Journal
### 2026-05-22
- Done: read project and vault instructions, project architecture/design docs, package/config, source tree, page structure, and lead handling code.
- Checked: `git status --short` is clean before worklog creation; `pnpm build` passes with 13 static pages.
- Noted: no `WORKLOG.md` existed, so created this journal and `_worklog/archive/` according to vault rules.
- Next: wait for the specific edit/task; use the relevant PAGE brief as the source of truth before touching code.

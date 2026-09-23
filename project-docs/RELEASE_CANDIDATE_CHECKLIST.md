# Release candidate checklist — Военный навигатор

## Статус

Подготовка завершена для SourceCraft release candidate. Production не запускался.
Финальный release допускается только после merge EPIC-05 в SourceCraft `main`,
явной команды владельца `Выпускаем production` и закрытия блока rollback ниже.

## Exact source и доказательства

- Canonical primary: приватный SourceCraft `integrator-p/voen-navigator`.
- Final SHA: получить из чистого `origin/main` непосредственно перед release;
  не подменять им SHA Pull Request или GitHub mirror.
- Runtime migration gate: SourceCraft run `13`, `merge-risky`, passed for the
  Astro 7 runtime head. Более поздние изменения EPIC-05 — только QA/docs и не
  меняют runtime output.
- Artifact: workflow `publish-release` принимает только full
  `expected_main_sha`, проверяет совпадение с `SOURCECRAFT_COMMIT_SHA`, строит
  один static artifact и сохраняет manifest/checksum.
- GitHub mirror: выполнять только после успешного production rollout и live
  smoke; до этого GitHub не является release source.

## Public configuration names

| Name | Назначение | Release expectation |
| --- | --- | --- |
| `PUBLIC_YM_COUNTER_ID` | Яндекс.Метрика | optional fallback exists |
| `PUBLIC_LEADS_API_URL` | Same-origin AMS Leads API | required for lead submission |
| `PUBLIC_PROJECT_ID` | проект Leads API | required for lead submission |
| `PUBLIC_LEADS_SITE_KEY` | публичный ключ Leads API | required for lead submission |
| `PUBLIC_SMARTCAPTCHA_CLIENT_KEY` | Yandex SmartCaptcha | required for protected forms |
| `PUBLIC_YANDEX_MAPS_API_KEY` | Яндекс.Карты | required for interactive map API |
| `PUBLIC_SITE_URL` | optional canonical URL override | optional; production domain is fallback |

Значения, server identity и SSH material хранятся только в Secret Master и не
фиксируются здесь, в `.env.example`, Git или SourceCraft CI logs.

## Release sequence

1. Verify clean canonical SourceCraft `main` and exact SHA.
2. Reuse valid runtime Merge Gate evidence; run a new one only if source/runtime
   changed after it.
3. Trigger one manual `publish-release` workflow for that exact SHA.
4. Verify artifact manifest and checksum outside production host.
5. Deploy artifact to a new release directory without switching `current`.
6. Perform pre-activation file/config/permissions smoke, then atomically switch
   `current`.
7. Run live smoke for home, journal index/article/category, commercial pages,
   calculator, maps, forms boundary, assets, sitemap, robots and `llms.txt`.
8. Keep previous release until stabilization; then mirror the released exact SHA
   from SourceCraft to GitHub.

## Rollback target — VERIFIED

- Read-only verification date: `2026-09-22`.
- AMS Server hostname: `ams-market-virtual-claud`.
- Active symlink: `/var/www/client-sites/voenniy-navigator/current`.
- Resolved known-good release:
  `/var/www/client-sites/voenniy-navigator/releases/20260708141134-cc5bc7f`.
- Release directory ownership/mode: `amsdeploy:www-data`, `2755`.
- Existing release manifest: not present in this legacy release.
- Stable checksum reference: SHA-256 of the active `index.html` is
  `b168137c16ea43333643d0f13a6d54f2239dc0c07093c7f208755e289482d60f`.
- Read-only proof: Nginx configuration validation passed and the production
  origin returned HTTP `200` while this release was active.

Keep this directory unchanged through rollout and stabilization. If the new
release fails activation or live smoke, atomically repoint `current` to this
exact directory, validate Nginx again and repeat the critical live smoke.

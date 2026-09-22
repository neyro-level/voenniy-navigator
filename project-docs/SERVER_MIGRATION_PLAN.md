# SERVER_MIGRATION_PLAN - Военный навигатор

**Статус:** deferred / on hold; работаем на текущем AMS Server  
**Дата фиксации:** 2026-06-26  
**Дата паузы:** 2026-06-26  
**Проект:** Военный навигатор  
**Production:** `https://voen-navigator.ru/`  
**Текущий сервер:** AMS Server, Timeweb Cloud, `5.42.100.161`  
**Текущий рабочий контур:** остается AMS Server, Timeweb Cloud, `5.42.100.161`  
**Будущий целевой контур:** отдельный клиентский Timeweb Cloud VPS, если решение вернется в работу  
**Scope v1:** план сохранен как будущий сценарий; сейчас перенос на отдельный сервер не выполняется.

> Delivery notice (2026-09-22): этот deferred-документ не является активным
> release runbook. Все упоминания GitHub Actions ниже — исторический transport
> старого сценария и не разрешают автоматический deploy. Если перенос сервера
> будет возобновлён, transport должен быть перепроектирован от canonical
> SourceCraft `main` по разделу 13 `SITE_ARCHITECTURE.md`.

## 0. Current Decision

На 2026-06-26 перенос `Военного навигатора` на отдельный сервер клиента отложен. Работаем на текущем сервере АМС:

- production остается на AMS Server `5.42.100.161`;
- legacy GitHub deploy secrets не меняем и не используем;
- DNS-записи `voen-navigator.ru` не переключаем;
- `/api/leads` и общий `AMS Leads API` остаются в текущем рабочем контуре;
- этот файл остается как подготовленный план на будущее, но не является активным checklist на выполнение.

## 1. Summary

> Не активно сейчас. Раздел ниже описывает будущий сценарий, если решение о переносе будет возвращено в работу.

- Клиент регистрирует отдельный VPS в Timeweb Cloud и оплачивает его сам.
- Код остаётся в canonical SourceCraft-репозитории АМС; GitHub — только зеркало.
- Будущий deploy должен запускаться вручную из exact green SourceCraft `main`.
- На новый сервер переносим только статический Astro-сайт.
- Контур заявок пока остается через общий `AMS Leads API` АМС.
- На сервере клиента `/api/leads` будет проксироваться в общий API, чтобы сайт не зависел от внутренней реализации форм.

## 2. Key Decisions

- **Сервер клиента:** отдельный Timeweb Cloud VPS.
- **Стартовый профиль:** Ubuntu 24.04 LTS, 2 vCPU, 4 GB RAM, 25 GB NVMe.
- **Deploy model:** owner-intent SourceCraft release -> immutable artifact -> SSH/rsync -> `/var/www/client-sites/voenniy-navigator/releases/[release]` -> `current`.
- **API model:** сайт отправляет заявки в `/api/leads`, Nginx проксирует запросы в общий `AMS Leads API`.
- **Ownership:** сервер и оплата - клиент; код, deploy-пайплайн и API-заявки на этапе сопровождения - АМС.
- **Exit path:** при завершении сотрудничества API можно оставить как услугу, заменить endpoint или развернуть отдельный API у клиента.

## 3. Target Baseline

```text
Timeweb Cloud
-> Ubuntu 24.04 LTS
-> 2 vCPU / 4 GB RAM / 25 GB NVMe
-> Nginx + Certbot + rsync + Git
-> release-based deploy
-> static Astro site outside Docker
```

### Naming

- **client slug:** `voenniy-navigator`
- **site slug:** `voenniy-navigator`
- **hostname:** `voenniy-navigator-app-01`
- **deploy user:** `voennavdeploy`
- **platform user:** `voennavplatform`, резерв под будущие platform-services, в v1 отдельный API не поднимаем
- **site root:** `/var/www/client-sites/voenniy-navigator`

## 4. Waiting For Client / User

До серверных действий нужны:

- IP нового сервера.
- Root/emergency доступ или SSH-доступ администратора.
- Подтверждение доступа к DNS домена `voen-navigator.ru`.
- Timeweb Cloud project access или API token, если создаем сервер через Terraform.
- Подтверждение SSH public keys для `admin`, `deploy`, `platform` или разрешение сгенерировать их под этот проект.
- Решение по staging-домену: рекомендовано `staging.voen-navigator.ru`.

## 5. Server Preparation Checklist

- [ ] Создать отдельный клиентский проект в Timeweb Cloud.
- [ ] Создать сервер Ubuntu 24.04 LTS по стартовому профилю `2 vCPU / 4 GB RAM / 25 GB NVMe`.
- [ ] Создать deploy-пользователя `voennavdeploy`.
- [ ] Создать platform-пользователя `voennavplatform` как резерв под будущий API-контур.
- [ ] Установить базовые пакеты: `nginx`, `certbot`, `python3-certbot-nginx`, `rsync`, `git`, `jq`, `tmux`, `htop`, `acl`, `curl`.
- [ ] Создать директории:

```text
/var/www/client-sites/voenniy-navigator/releases
/var/www/client-sites/voenniy-navigator/shared
/var/www/client-sites/voenniy-navigator/current
```

- [ ] Настроить права для `voennavdeploy` и `www-data`.
- [ ] Проверить bootstrap log: `/var/log/cloud-init-output.log`, если сервер создавался через cloud-init.
- [ ] Включить backups в панели Timeweb Cloud.

## 6. Nginx Plan

### Domains

- staging: `staging.voen-navigator.ru`
- production: `voen-navigator.ru`
- production www: `www.voen-navigator.ru`

### Static Site

- `root` указывает на `/var/www/client-sites/voenniy-navigator/current`.
- Для Astro output используются статические файлы из `dist`.
- SPA fallback не нужен, потому что сайт статический и маршруты генерируются Astro.

### Leads Proxy

На сервере клиента `/api/leads` должен остаться same-origin endpoint для фронтенда:

```nginx
location /api/leads {
    limit_req zone=ams_leads_per_ip burst=10 nodelay;

    proxy_pass https://api.ams-cloud.ru/v1/leads;
    proxy_ssl_server_name on;
    proxy_set_header Host api.ams-cloud.ru;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Важно: реальные секреты, site keys и внутренние токены не фиксируются в репозитории.

## 7. Legacy GitHub Actions Plan (deprecated transport reference)

Текущий build уже использует same-origin endpoint:

```yaml
PUBLIC_LEADS_API_URL: /api/leads
```

Этот список сохранён только как inventory старых имён. Возобновлять GitHub
Actions deploy запрещено; актуальные secret names и release transport должны
быть заново подтверждены через Secret Master и SourceCraft release contract.

- `AMS_HOST` - новый IP сервера клиента.
- `AMS_USER` - `voennavdeploy`.
- `AMS_SSH_KEY` - private key deploy-пользователя в GitHub Secrets.
- `AMS_CLIENT_SITES_ROOT` - `/var/www/client-sites`.

Build-переменные сайта сохранить:

- `PUBLIC_LEADS_API_URL=/api/leads`
- `PUBLIC_PROJECT_ID=voenniy-navigator`
- `PUBLIC_LEADS_SITE_KEY`
- `PUBLIC_SMARTCAPTCHA_CLIENT_KEY`
- `PUBLIC_YANDEX_MAPS_API_KEY`

До production cutover verify URL должен смотреть на staging. После переключения DNS verify возвращаем на `https://voen-navigator.ru/`.

## 8. Staging QA

- [ ] `pnpm build` проходит без ошибок.
- [ ] `pnpm geo-check` дает `100/100`.
- [ ] Owner-intent SourceCraft release доставляет неизменяемый artifact на новый сервер.
- [ ] `https://staging.voen-navigator.ru/` возвращает `200`.
- [ ] Основные страницы открываются:
  - `/`
  - `/voennaya-ipoteka-krym/`
  - `/voennaya-ipoteka-krasnodar/`
  - `/semeynaya-voennaya-ipoteka/`
  - `/o-servise/`
- [ ] `robots.txt`, `sitemap-index.xml`, `llms.txt` доступны на staging.
- [ ] `POST /api/leads` не возвращает `404` или `502`.
- [ ] При невалидной или отсутствующей SmartCaptcha ожидаема ошибка общего API, например `400 captcha_required`.

## 9. Production Cutover

- [ ] Зафиксировать старый IP: `5.42.100.161`.
- [ ] Убедиться, что staging проверен.
- [ ] Поменять A-записи `voen-navigator.ru` и `www.voen-navigator.ru` на новый IP.
- [ ] Выпустить SSL через Let's Encrypt для production-доменов.
- [ ] Проверить `https://voen-navigator.ru/` и `https://www.voen-navigator.ru/`.
- [ ] Проверить формы и `/api/leads` на production.
- [ ] Старый серверный контур не удалять минимум 7 дней.

## 10. Rollback Plan

Если после DNS cutover проявится критичная проблема:

- вернуть A-записи домена на старый IP `5.42.100.161`;
- вернуть `current` на прежний known-good release без повторной сборки;
- оставить новый сервер для диагностики;
- не удалять старый release до завершения стабилизации.

## 11. Status Checklist

- [ ] Сервер клиента создан.
- [ ] IP и emergency/SSH-доступ получены.
- [ ] DNS-доступ подтвержден.
- [ ] Staging-домен направлен на новый сервер.
- [ ] Nginx static site config настроен.
- [ ] `/api/leads` проксируется в общий `AMS Leads API`.
- [ ] SourceCraft release transport и Secret Master names подтверждены для нового сервера.
- [ ] Staging deploy прошел.
- [ ] Staging QA пройден.
- [ ] Production DNS переключен.
- [ ] Production SSL выпущен.
- [ ] Production QA пройден.
- [ ] Старый контур выдержан минимум 7 дней после cutover.

## 12. Assumptions

- Клиент сам регистрирует и оплачивает Timeweb Cloud VPS.
- На первом этапе не разворачиваем отдельный Leads API на сервере клиента.
- Общий `AMS Leads API` остается рабочим управляемым сервисом АМС.
- Код сайта остаётся в canonical SourceCraft-репозитории АМС; GitHub — зеркало.
- Полная передача проекта клиенту позже возможна через замену API endpoint или разворачивание отдельного API.

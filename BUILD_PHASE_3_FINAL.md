# BUILD_PHASE_3_FINAL.md

**Проект:** Военный навигатор — Михаил Хряпин
**Фаза:** 3 из 3 — Финал
**Читать перед началом:** CLAUDE.md
**Требование:** Фаза 2 пройдена и чекпоинт ✅

---

## Этап 3.1 — Плейсхолдеры и данные

**Задача:**
```
Прочитай CLAUDE.md раздел 18 (список TODO).

Найди и исправь все плейсхолдеры в проекте:
grep -r "\[PRIMARY_PHONE\]\|\[TELEGRAM\]\|\[MAX_LINK\]\|\[VK_GROUP\]\|\[DOMAIN\]\|\[ГОД\]" src/

Для каждого:
- Если данные готовы → подставить реальное значение
- Если данных нет → оставить TODO-комментарий: <!-- TODO: [имя плейсхолдера] -->
- Не выдумывать значения

НИКОГДА не публиковать сайт с незаполненными контактными данными.
```

**Таблица плейсхолдеров:**

| Плейсхолдер | Статус | Значение |
|---|---|---|
| [PRIMARY_PHONE] | ✅ | +7 938 407 4457 |
| [TELEGRAM] | ⏳ | ждём |
| [MAX_LINK] | ⏳ | ждём |
| [VK_GROUP] | ⏳ | ждём |
| [PRIMARY_EMAIL] | ⏳ | ждём |
| [DOMAIN] | ⏳ | ждём финальный |
| [ГОД] | ✅ | 2016 (уточнить у Михаила) |
| [YANDEX_BUSINESS_URL] | ⏳ | после регистрации |
| PUBLIC_YM_COUNTER_ID | ⏳ | после регистрации |
| [VK_VIDEO_EMBED_URL] | ⏳ | на /thanks/ |
| [VK_VIDEO_IPOTEKA_URL] | ⏳ | на /bonus/ |
| [VK_VIDEO_NOVOSTROYKI_URL] | ⏳ | на /bonus/ |
| [TELEGRAM_CHANNEL] | ⏳ | на /thanks/ и /bonus/ |

---

## Этап 3.2 — Типографика финальная

**Задача:**
```
Прочитай ASTRO_RULES_CORE.md раздел «Типографика».

Проверь на ширинах 375px / 768px / 1280px / 1440px:

1. Ни один H1, H2, H3 не заканчивается одним словом на строке
2. Все числа с единицами неразрывны: 65&nbsp;сделок, +7&nbsp;938...
3. Адреса: ул.&nbsp;Кубанская&nbsp;Набережная,&nbsp;33
4. text-wrap: balance на всех заголовках (global.css) ✓
5. text-wrap: pretty на всех параграфах (global.css) ✓

Где есть висячие строки — добавить &nbsp; между
предпоследним и последним смысловым словом.
```

---

## Этап 3.3 — SEO финальный аудит

**Задача:**
```
Прочитай CLAUDE.md.

Проверь каждую индексируемую страницу:

Title: 50-60 символов
  /                              → 55 симв. ✅
  /voennaya-ipoteka-krasnodar/   → 52 симв. ✅
  /voennaya-ipoteka-krym/        → 51 симв. ✅
  /etapy-pokupki/                → 54 симв. ✅
  /distancionnaya-pokupka/       → 53 симв. ✅
  /contacts/                     → 56 симв. ✅

Description: 140-160 символов — проверить все 6

JSON-LD: проверить через https://validator.schema.org
  Главная: Organization + Person + WebSite + Service + FAQPage + BreadcrumbList
  /voennaya-ipoteka-krasnodar/: Service + FAQPage + BreadcrumbList
  /contacts/: Organization + LocalBusiness(×2) + FAQPage + BreadcrumbList

Sitemap: проверить что НЕТ:
  /thanks/, /404/, /video/, /bonus/, /prezentaciya/

robots.txt: проверить Disallow для всех закрытых страниц.
```

---

## Этап 3.4 — Performance

**Задача:**
```
Запусти Lighthouse на главной странице (мобильный режим).
Цель: Performance ≥ 85, Accessibility ≥ 90.

Типичные проблемы и решения:
- LCP > 2.5 сек → Hero фото: loading="eager" + fetchpriority="high"
- CLS > 0.1 → задать width + height на все img
- TBT > 300ms → React islands только client:visible где можно
- Image без alt → проверить все img

Не публиковать если Performance < 75.
```

---

## Этап 3.5 — vercel.json и окружение

**Задача:**
```
Создай / обнови vercel.json:

{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-src 'self' https://yandex.ru https://*.yandex.ru https://vk.com https://vkvideo.ru;"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}

В Vercel Dashboard → Settings → Environment Variables:
- TELEGRAM_BOT_TOKEN
- TELEGRAM_CHAT_ID
- PUBLIC_YM_COUNTER_ID
Добавить для Production + Preview окружений.

Проверить что .env НЕ закоммичен (в .gitignore).
```

---

## Этап 3.6 — Финальный деплой

**Задача:**
```
1. pnpm build → 0 ошибок
2. Commit: "feat: initial launch [date]"
3. Push → Vercel автодеплой
4. Проверить Vercel Preview URL

После деплоя:
□  Все страницы открываются на реальном домене
□  SSL активен (https://)
□  robots.txt отдаётся: /robots.txt
□  sitemap-index.xml отдаётся: /sitemap-index.xml
□  Тестовая заявка с prod → пришла в Telegram
□  /404/ — кастомная страница (не дефолтная Vercel)
□  Мобиль: сайт читаем на реальном телефоне
```

---

## ✅ ФИНАЛЬНЫЙ ЧЕКПОИНТ

```
КОНТЕНТ
□  Нет [PLACEHOLDER] в тексте (grep -r "\[" src/ --include="*.astro")
□  Телефон везде одинаковый
□  Адреса совпадают с Яндекс.Бизнес (когда будет зарегистрирован)
□  Copyright год актуальный

SEO
□  Title 50-60 / Desc 140-160 на всех 6 страницах
□  H1 ровно один на каждой странице
□  Alt на всех изображениях
□  JSON-LD: 0 ошибок в validator.schema.org
□  BreadcrumbList на всех страницах включая главную
□  Sitemap: только индексируемые страницы
□  robots.txt: закрытые страницы в Disallow

ФУНКЦИОНАЛ
□  RequestModal: заявка приходит в Telegram
□  /thanks/?method=telegram показывает «напишем в Telegram»
□  Яндекс.Карты: обе карты работают
□  /video/ → квиз → /bonus/ работает end-to-end
□  CookieBanner: consent сохраняется

ТЕХНИЧЕСКИЕ
□  pnpm build: 0 errors, 0 warnings
□  Lighthouse Performance ≥ 85 (mobile)
□  Нет горизонтального скролла на 375px
□  Нет ошибок в консоли браузера
□  SSL активен
□  .env не в репозитории

ТИПОГРАФИКА
□  Нет висячих строк на 375px и 1440px
□  Числа неразрывны: 65&nbsp;сделок
□  text-wrap: balance на заголовках
```

---

**Конец BUILD_PHASE_3_FINAL.md**

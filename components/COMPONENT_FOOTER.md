# COMPONENT_FOOTER.md

**Компонент:** Footer — Спокойный якорь
**Проект:** Военный навигатор — Михаил Хряпин
**Версия:** 1.0
**Дата:** 2026-05-12
**Файл:** `src/components/layout/Footer.astro`
**Тип:** Сквозной компонент, рендерится через PageLayout.astro на всех страницах

---

## 1. Концепция

**Роль:** Footer — не повторение финального CTA страниц, а спокойный нижний якорь. Информация, контакты, офисы, юридика, маршрутная графика.

**Отличие от финального CTA страниц:** Финальные CTA (`bg/dark` в конце каждой страницы) — это активный призыв. Footer — тихий навигационный штаб. Два разных регистра одного тёмного фона.

**Изюминка:** Route Path Strip — тонкая горизонтальная линия маршрута «Цель → Объект → Сделка → Результат» перед юрданными. Повторяет смысл проекта языком дизайна, не текстом.

---

## 2. Подключение в PageLayout.astro

```astro
---
import Header from '../components/layout/Header.astro';
import RouteMapOverlay from '../components/layout/RouteMapOverlay.astro';
import Footer from '../components/layout/Footer.astro';
import MobileBottomCTA from '../components/layout/MobileBottomCTA.astro';
---
<body>
  <Header />
  <RouteMapOverlay />
  <main><slot /></main>
  <Footer />
  <MobileBottomCTA />
</body>
```

---

## 3. Данные — constants.ts

Footer берёт ссылки из `navData.ts` (не создаёт отдельный массив).
Офисы и контакты — из `constants.ts`.

```typescript
// src/lib/constants.ts (дополнение)

export const OFFICES = [
  {
    city: 'Краснодар',
    address: 'ул. Кубанская Набережная, 33',
    detail: '3 подъезд, 2 этаж, офис 4',
    mapUrl: 'https://yandex.ru/map-widget/v1/?um=constructor%3A269f590d4b02b49eb7666fde1d0f90859fb09fd28d03c93cc6fd72ae30f4bb48&source=constructor',
    note: 'По предварительной записи',
    primary: true,
  },
  {
    city: 'Бахчисарай (Крым)',
    address: 'ул. Комарова, 13',
    detail: '',
    mapUrl: 'https://yandex.ru/map-widget/v1/?um=constructor%3Ac4045c942f0d5288e0d89be0d9997a6643816d5f052f4110e27f450ed3db5ff9&source=constructor',
    note: 'По предварительной записи',
    primary: false,
  },
];

export const CONTACTS = {
  phone:    '[PRIMARY_PHONE]',
  telegram: '[TELEGRAM]',
  max: '[MAX_LINK]',         // Max — российский мессенджер, ссылка уточняется
  vk:       '[VK_GROUP]',
  email:    '[PRIMARY_EMAIL]',
};

export const LEGAL = {
  name:    'ИП Мазур Алёна Викторовна',
  inn:     '910406895307',
  ogrn:    '322237500111941',
  year:    new Date().getFullYear(),
};

export const ROUTE_PATH = [
  { step: '01', label: 'Цель',    href: '/voennaya-ipoteka-krasnodar/' },
  { step: '02', label: 'Объект',  href: '/voennaya-ipoteka-krasnodar/' },
  { step: '03', label: 'Маршрут', href: '/etapy-pokupki/' },
  { step: '04', label: 'Сделка',  href: '/etapy-pokupki/' },
  { step: '05', label: 'Результат', href: '/contacts/' },
];
```

---

## 4. Визуальная структура (5 зон)

```
┌──────────────────────────────────────────────────────────────┐
│  ЗОНА 1: Compact CTA Panel                                    │
│  Последний спокойный конверсионный блок                       │
├──────────────────────────────────────────────────────────────┤
│  ЗОНА 2: Trust Strip                                          │
│  65 сделок ВИ · с 2016 · 180+ всего                          │
├──────┬──────────────┬──────────────┬──────────────────────────┤
│      │              │              │                          │
│ЗОНА 3│              │              │                          │
│ БРЕНД│  НАВ.        │  ОФИСЫ       │  КОНТАКТЫ                │
│      │              │              │                          │
├──────┴──────────────┴──────────────┴──────────────────────────┤
│  ЗОНА 4: Route Path Strip                                     │
│  01 Цель ——→ 02 Объект ——→ 03 Маршрут ——→ 04 Сделка ——→ 05   │
├──────────────────────────────────────────────────────────────┤
│  ЗОНА 5: Legal Strip                                          │
│  ИП Мазур · ИНН · ОГРН · Политика · Cookie · © 2026          │
└──────────────────────────────────────────────────────────────┘
```

**Фон:** `color.bg.dark` (#0F1419)
**Декор:** Decorative grid 64×64 (rgba(255,255,255,0.025)), только в зоне 3
**Все разделители:** 1px solid rgba(241,243,245,0.07) — ghost border

---

## 5. Зона 1 — Compact CTA Panel

**Высота:** ~100px desktop
**Padding:** 28px vertical, 48px horizontal
**Layout:** flex, justify-content: space-between, align-items: center

**Левая часть:**
```
РАЗБЕРИТЕ ЦЕЛЬ ПОКУПКИ ДО ВЫБОРА КВАРТИРЫ
Михаил поможет понять маршрут: Краснодар, Крым,
калькулятор или переезд позже.
```
- H2 аналог: Semi Bold 20px, color.text.ondark, max-width 520px
- Body: Regular 13px, color.text.ondark-mute opacity 0.7, margin-top 4px

**Правая часть (flex, gap 12px):**
```
[Записаться на разбор]   [Написать в Telegram]
```
- Primary: bg color.accent.cta, white, Medium 14px, h 40px, padding 0 20px, radius.md
- Ghost: border 1px rgba(241,243,245,0.2), color.text.ondark, Medium 14px, h 40px

**Bottom border:** 1px rgba(241,243,245,0.07)

**Mobile:** Stack вертикально — текст сверху, кнопки под ним full-width

---

## 6. Зона 2 — Trust Strip

**Высота:** ~52px
**Padding:** 14px 48px
**Layout:** flex, justify-content: center, gap 40px, align-items: center

**3 элемента:**
```
65 сделок по военной ипотеке   ·   с 2016 года   ·   180+ сделок в недвижимости
```

**Структура каждого элемента:**
- Цифра/дата: Semi Bold 15px, color.text.ondark
- Описание: Regular 11px, letter-spacing 0.04em, UPPERCASE, color.text.ondark-mute

**Разделители:** `·` Regular 14px, rgba(241,243,245,0.2)

**Bottom border:** 1px rgba(241,243,245,0.07)

**Mobile:** 3 элемента в ряд (compact), или 2+1 при нехватке места

---

## 7. Зона 3 — Main Grid (4 колонки)

**Padding:** 48px vertical, 48px horizontal
**Grid:** 3/3/3/3 (12 колонок, 4 равных)
**Decorative grid** включён только здесь

---

### Колонка 1 — Бренд (cols 1–3)

**Логотип (inline SVG, та же что в хедере, уменьшенная):**

```svg
<svg width="32" height="32" viewBox="0 0 40 40" fill="none">
  <circle cx="20" cy="20" r="9"
    stroke="rgba(241,243,245,0.22)" stroke-width="0.7"
    stroke-dasharray="2.2 2.2"/>
  <path d="M7 13 L7 7 L13 7"
    stroke="rgba(241,243,245,0.75)" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M27 7 L33 7 L33 13"
    stroke="rgba(241,243,245,0.75)" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7 27 L7 33 L13 33"
    stroke="rgba(241,243,245,0.75)" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M27 33 L33 33 L33 27"
    stroke="rgba(241,243,245,0.75)" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="20" cy="20" r="2.8" fill="#2563EB"/>
</svg>
```

**Текст под логотипом:**
- `ВОЕННЫЙ НАВИГАТОР` — Semi Bold 13px, UPPERCASE, letter-spacing 0.04em, color.text.ondark
- `Михаил Хряпин` — Regular 11px, letter-spacing 0.06em, UPPERCASE, color.text.ondark-mute opacity 0.5

**Описание (margin-top 16px):**
```
Помогает военнослужащим и их семьям
выбрать квартиру под задачу и пройти
маршрут покупки без хаоса.
```
- Regular 13px, color.text.ondark-mute opacity 0.6, line-height 1.6, max-width 200px

**Социальные ссылки (margin-top 20px, flex gap 12px):**
- VK icon (20px, color.text.ondark-mute → color.text.ondark hover)
- Telegram icon
- YouTube icon (опционально)
- Все: href с `target="_blank" rel="noopener noreferrer"`
- Touch target ≥ 44px

---

### Колонка 2 — Навигация (cols 4–6)

**Header:**
```
РАЗДЕЛЫ
```
- label-mono 10px, color.accent.cta, accent line (2×18px) слева

**6 ссылок (берутся из navData.ts):**
```
Главная               /
Краснодар             /voennaya-ipoteka-krasnodar/
Крым                  /voennaya-ipoteka-krym/
Этапы покупки         /etapy-pokupki/
Калькулятор           /kalkulyator-voennoy-ipoteki/
Контакты              /contacts/
```
- Regular 14px, color.text.ondark-mute
- Hover: color.text.ondark, translateX(3px), transition 150ms
- display: flex, flex-direction: column, gap: 10px

---

### Колонка 3 — Офисы (cols 7–9)

**Header:**
```
ОФИСЫ
```
- label-mono 10px, color.accent.cta, accent line

**Офис 1 — Краснодар:**
```
[map-pin 14px]  Краснодар
                ул. Кубанская Набережная, 33
                3 подъезд, 2 этаж, офис 4
```
- City: Medium 13px, color.text.ondark
- Address: Regular 12px, color.text.ondark-mute opacity 0.6, line-height 1.5

**Ghost divider (margin 12px 0)**

**Офис 2 — Бахчисарай:**
```
[map-pin 14px]  Бахчисарай (Крым)
                ул. Комарова, 13
```

**Микро-текст под обоими:**
```
По предварительной записи
```
- Regular 11px, color.text.ondark-mute opacity 0.4, margin-top 8px

**Link:**
```
Открыть карты →    /contacts/
```
- Text Link, Regular 12px, color.accent.cta, hover underline

---

### Колонка 4 — Контакты (cols 10–12)

**Header:**
```
СВЯЗАТЬСЯ
```
- label-mono 10px, color.accent.cta, accent line

**4 канала (vertical, gap 12px):**

```
[phone 16px]        [PRIMARY_PHONE]
[send 16px]         Telegram
[smartphone 16px]   Max  ← российский мессенджер
[share-2 16px]      ВКонтакте
```
- Иконка для Max: `smartphone` (Lucide) — нейтральная, пока нет официальной иконки Max
- Max: ссылка `[MAX_LINK]` — добавить когда Михаил предоставит

---

## 8. Зона 4 — Route Path Strip

**Высота:** ~56px
**Padding:** 0 48px
**Background:** rgba(241,243,245,0.03) — едва заметнее основного dark
**Border-top + bottom:** 1px rgba(241,243,245,0.07)
**Layout:** flex, align-items center, justify-content center, gap 0

**5 элементов + 4 стрелки:**

```
[01] Цель  ——→  [02] Объект  ——→  [03] Маршрут  ——→  [04] Сделка  ——→  [05] Результат
```

**Структура step-элемента:**
```html
<a href="[href]" class="vn-route-step">
  <span class="vn-route-num">01</span>
  <span class="vn-route-label">Цель</span>
</a>
```
- `.vn-route-num`: label-mono 9px, color.accent.cta opacity 0.4
- `.vn-route-label`: Regular 12px, color.text.ondark-mute opacity 0.5
- Hover: оба → opacity 1, color.text.ondark
- Активный шаг (текущая страница): opacity 1 + accent dot под лейблом

**Стрелка между шагами:**
```html
<span class="vn-route-arrow">——→</span>
```
- Regular 10px, rgba(241,243,245,0.15)
- padding: 0 16px

**Mobile:** Route Path скрывается на mobile (display: none ≤ 767px)

---

## 9. Зона 5 — Legal Strip

**Высота:** ~48px
**Padding:** 0 48px
**Layout:** flex, justify-content: space-between, align-items: center, 3 части
**Border-top:** 1px rgba(241,243,245,0.07)

**Левая часть:**
```
© 2026 ИП Мазур Алёна Викторовна · ИНН 910406895307 · ОГРН 322237500111941
```
- Regular 11px, color.text.ondark-mute opacity 0.4
- `{new Date().getFullYear()}` для года

**Центральная часть — подпись разработчика:**
```
разработка сайта ↗
```
- `<a href="https://chirkovandrey.ru" target="_blank" rel="noopener noreferrer">`
- Regular 11px, color.text.ondark-mute opacity 0.35
- Иконка `arrow-up-right` (Lucide, 11px, inline) — обозначает внешнюю ссылку
- letter-spacing: 0.03em
- Hover: opacity 0.35 → 0.75, transition 200ms
- **Нет подчёркивания по умолчанию** — только на hover появляется тонкое
- Padding: 4px 14px, border-left + border-right: 1px solid rgba(241,243,245,0.07) — тонкие разделители с обеих сторон

**Правая часть:**
```
Политика конфиденциальности  ·  Cookie
```
- Regular 11px, color.text.ondark-mute opacity 0.4
- Ссылки: `/politika/`, `/cookies/`
- hover: opacity 0.7

**Mobile:** Stack вертикально, centered, gap 6px
Порядок: копирайт → **разработка** → политика

---

## 10. Mobile структура

```
[COMPACT CTA PANEL]
  Записаться   Telegram

[TRUST: 65 сделок ВИ · с 2016 · 180+]

[BRAND: Логотип + описание]

[CONTACTS ROW: phone | TG | Max | VK]

[ACCORDION: Разделы сайта ˅]
[ACCORDION: Офисы ˅]
[ACCORDION: Юридическое ˅]

[LEGAL STRIP]
```

**Аккордеоны (vanilla JS, не React):**
- Trigger: `<button>` с иконкой chevron
- Content: `<div>` c max-height transition (0 → auto через JS)
- `aria-expanded` на кнопке

---

## 11. Полный Astro scaffold

```astro
---
// src/components/layout/Footer.astro
import { NAV_ITEMS } from '../../lib/navigation/navData';
import { OFFICES, CONTACTS, LEGAL, ROUTE_PATH } from '../../lib/constants';
---

<footer class="vn-footer" role="contentinfo">

  <!-- Зона 1: Compact CTA -->
  <div class="vn-footer__cta">
    <div class="vn-footer__cta-text">
      <p class="vn-footer__cta-title">
        Разберите цель покупки до выбора квартиры
      </p>
      <p class="vn-footer__cta-sub">
        Михаил поможет понять маршрут: Краснодар, Крым,
        калькулятор или переезд позже.
      </p>
    </div>
    <div class="vn-footer__cta-actions">
      <a href="/contacts/#request" class="vn-btn-primary">
        Записаться на разбор
      </a>
      <a href={CONTACTS.telegram} target="_blank" rel="noopener"
         class="vn-btn-ghost">
        Написать в Telegram
      </a>
    </div>
  </div>

  <!-- Зона 2: Trust Strip -->
  <div class="vn-footer__trust" aria-label="Опыт работы">
    <div class="vn-trust-item">
      <span class="vn-trust-num">65</span>
      <span class="vn-trust-desc">сделок по военной ипотеке</span>
    </div>
    <span class="vn-trust-dot" aria-hidden="true">·</span>
    <div class="vn-trust-item">
      <span class="vn-trust-num">с 2016</span>
      <span class="vn-trust-desc">года в новостройках Краснодара</span>
    </div>
    <span class="vn-trust-dot" aria-hidden="true">·</span>
    <div class="vn-trust-item">
      <span class="vn-trust-num">180+</span>
      <span class="vn-trust-desc">сделок в недвижимости</span>
    </div>
  </div>

  <!-- Зона 3: Main Grid -->
  <div class="vn-footer__grid">

    <!-- Бренд -->
    <div class="vn-footer__brand">
      <a href="/" class="vn-footer__logo" aria-label="На главную">
        <!-- inline SVG логотипа -->
      </a>
      <p class="vn-footer__desc">
        Помогает военнослужащим и их семьям выбрать квартиру
        под задачу и пройти маршрут покупки без хаоса.
      </p>
      <div class="vn-footer__social">
        <a href={CONTACTS.vk} target="_blank" rel="noopener noreferrer"
           aria-label="ВКонтакте"><!-- VK icon --></a>
        <a href={CONTACTS.telegram} target="_blank" rel="noopener noreferrer"
           aria-label="Telegram"><!-- TG icon --></a>
      </div>
    </div>

    <!-- Навигация -->
    <nav class="vn-footer__nav" aria-label="Разделы сайта">
      <p class="vn-footer__col-header">Разделы</p>
      <ul>
        <li><a href="/">Главная</a></li>
        {NAV_ITEMS.map(item => (
          <li><a href={item.href}>{item.label}</a></li>
        ))}
      </ul>
    </nav>

    <!-- Офисы -->
    <div class="vn-footer__offices">
      <p class="vn-footer__col-header">Офисы</p>
      {OFFICES.map(office => (
        <div class="vn-office">
          <p class="vn-office__city">{office.city}</p>
          <p class="vn-office__addr">{office.address}</p>
          {office.detail && <p class="vn-office__detail">{office.detail}</p>}
        </div>
      ))}
      <a href="/contacts/" class="vn-footer__map-link">Открыть карты →</a>
    </div>

    <!-- Контакты -->
    <div class="vn-footer__contacts">
      <p class="vn-footer__col-header">Связаться</p>
      <a href={`tel:${CONTACTS.phone}`} class="vn-contact-row">
        <!-- phone icon --> {CONTACTS.phone}
      </a>
      <a href={CONTACTS.telegram} target="_blank" rel="noopener"
         class="vn-contact-row">
        <!-- send icon --> Telegram
      </a>
      <a href={CONTACTS.max} target="_blank" rel="noopener"
         class="vn-contact-row">
        <!-- smartphone icon --> Max
      </a>
      <a href={CONTACTS.vk} target="_blank" rel="noopener"
         class="vn-contact-row">
        <!-- share-2 icon --> ВКонтакте
      </a>
    </div>

  </div><!-- /grid -->

  <!-- Зона 4: Route Path -->
  <div class="vn-footer__route" aria-hidden="true">
    {ROUTE_PATH.map((step, i) => (
      <>
        <a href={step.href} class="vn-route-step">
          <span class="vn-route-num">{step.step}</span>
          <span class="vn-route-label">{step.label}</span>
        </a>
        {i < ROUTE_PATH.length - 1 && (
          <span class="vn-route-arrow">——→</span>
        )}
      </>
    ))}
  </div>

  <!-- Зона 5: Legal -->
  <div class="vn-footer__legal">
    <p>
      © {LEGAL.year} {LEGAL.name} · ИНН {LEGAL.inn} · ОГРН {LEGAL.ogrn}
    </p>
    <a
      href="https://chirkovandrey.ru"
      target="_blank"
      rel="noopener noreferrer"
      class="vn-footer__dev-link"
      aria-label="Разработка сайта — Андрей Чирков"
    >
      разработка сайта
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="1.5"
           stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true">
        <path d="M7 17L17 7M7 7h10v10"/>
      </svg>
    </a>
    <div>
      <a href="/politika/">Политика конфиденциальности</a>
      <span>·</span>
      <a href="/cookies/">Cookie</a>
    </div>
  </div>

</footer>
```

---

## 12. Ключевые CSS-правила

```css
.vn-footer {
  background: #0F1419;
  color: rgba(241,243,245,0.7);
  font-family: 'Inter', system-ui, sans-serif;
}

/* Зона 3 — grid с декоративной сеткой */
.vn-footer__grid {
  display: grid;
  grid-template-columns: 3fr 3fr 3fr 3fr;
  gap: 48px;
  padding: 48px;
  background-image: repeating-linear-gradient(
    0deg,
    transparent, transparent 63px,
    rgba(255,255,255,0.025) 63px, rgba(255,255,255,0.025) 64px
  ),
  repeating-linear-gradient(
    90deg,
    transparent, transparent 63px,
    rgba(255,255,255,0.025) 63px, rgba(255,255,255,0.025) 64px
  );
}

/* Разделители */
.vn-footer__cta,
.vn-footer__trust,
.vn-footer__grid,
.vn-footer__route {
  border-bottom: 1px solid rgba(241,243,245,0.07);
}

/* Trust цифры */
.vn-trust-num {
  font-size: 15px;
  font-weight: 600;
  color: #F1F3F5;
  display: block;
}
.vn-trust-desc {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(241,243,245,0.45);
}

/* Route Path */
.vn-footer__route {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 48px;
  height: 56px;
  background: rgba(241,243,245,0.02);
}
.vn-route-num { font-size: 9px; letter-spacing: 0.05em; color: rgba(37,99,235,0.4); }
.vn-route-label { font-size: 12px; color: rgba(241,243,245,0.45); }
.vn-route-step:hover .vn-route-num,
.vn-route-step:hover .vn-route-label { color: rgba(241,243,245,1); }
.vn-route-arrow { font-size: 10px; color: rgba(241,243,245,0.15); padding: 0 16px; }

/* Legal */
.vn-footer__legal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 48px;
  height: 48px;
  font-size: 11px;
  color: rgba(241,243,245,0.35);
}
.vn-footer__legal a {
  color: rgba(241,243,245,0.35);
  text-decoration: none;
}
.vn-footer__legal a:hover { color: rgba(241,243,245,0.7); }

/* Разработка сайта — центральный элемент */
.vn-footer__dev-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  letter-spacing: 0.03em;
  color: rgba(241,243,245,0.35);
  text-decoration: none;
  padding: 4px 14px;
  border-left: 1px solid rgba(241,243,245,0.07);
  border-right: 1px solid rgba(241,243,245,0.07);
  transition: color 200ms ease, border-color 200ms ease;
}
.vn-footer__dev-link:hover {
  color: rgba(241,243,245,0.75);
  border-color: rgba(241,243,245,0.14);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: rgba(241,243,245,0.25);
}

/* Mobile */
@media (max-width: 1023px) {
  .vn-footer__grid { grid-template-columns: 1fr 1fr; gap: 32px; padding: 32px 20px; }
  .vn-footer__route { display: none; }
}
@media (max-width: 767px) {
  .vn-footer__grid { grid-template-columns: 1fr; }
  .vn-footer__cta  { flex-direction: column; gap: 16px; padding: 24px 20px; }
  .vn-footer__legal {
    flex-direction: column;
    height: auto;
    padding: 16px 20px;
    gap: 8px;
    text-align: center;
  }
  .vn-footer__dev-link {
    border-left: none;
    border-right: none;
    border-top: 1px solid rgba(241,243,245,0.07);
    border-bottom: 1px solid rgba(241,243,245,0.07);
    padding: 8px 0;
    width: 100%;
    justify-content: center;
  }
}
```

---

## 13. Accessibility

```html
<footer role="contentinfo">
  <nav aria-label="Разделы сайта">...</nav>
  <section aria-label="Контакты">...</section>
  <section aria-label="Офисы">...</section>
</footer>
```

- Все телефоны: `href="tel:..."` (кликабельны на mobile)
- Внешние ссылки: `target="_blank" rel="noopener noreferrer"`
- Social icons: `aria-label` на каждой ссылке (нет текста → нужен label)
- Route Path: `aria-hidden="true"` (декоративный, не навигационный)
- Touch target всех ссылок: min 44×44px
- focus-visible: outline 2px color.accent.cta

---

## 14. Чек-лист

- [ ] Footer подключён в PageLayout.astro
- [ ] constants.ts: OFFICES, CONTACTS, LEGAL, ROUTE_PATH заполнены реальными данными
- [ ] Логотип SVG в Footer — тёмная версия (белые скобки + синяя точка)
- [ ] Trust strip: 65 сделок ВИ / с 2016 / 180+ (уточнить 180+ у Михаила)
- [ ] Все телефоны tel: ссылки
- [ ] Социальные ссылки rel="noopener"
- [ ] Route Path скрыт на mobile
- [ ] Аккордеоны на mobile работают без JS-зависимости (details/summary fallback)
- [ ] Legal: год через new Date().getFullYear()
- [ ] Ссылки /politika/ и /cookies/ работают
- [ ] NAP в footer совпадает с NAP на /contacts/ и Яндекс.Бизнес

---

**Конец COMPONENT_FOOTER.md v1.0**

*Подключается в: src/layouts/PageLayout.astro*
*Данные: src/lib/constants.ts + src/lib/navigation/navData.ts*
*Стиль: DESIGN_SYSTEM.md (Architectural Navigator v1.0)*

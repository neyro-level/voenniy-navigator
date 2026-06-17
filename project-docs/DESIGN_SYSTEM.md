**Дизайн-система "Architectural Navigator"**

**Проект:** Михаил Хряпин — навигатор по новостройкам Краснодара для военнослужащих **Версия:** 1.0 Final **Дата:** Апрель 2026

---

**1\. Концепция**

**Название системы:** Architectural Navigator

**Эталон:** Linear, Vercel, Stripe Enterprise, Arc Browser. Холодная архитектурная минималистичность с premium-деталями.

**Визуальный язык:** минимализм \+ структурализм. Высокая плотность деталей при сохранении строгости. Никакой декоративности ради декоративности. Каждый элемент функционален.

**Интонация:** спокойная экспертная уверенность. Не банковский корпоратив, не luxury, не IT-хипстер. Холодная точность с характером.

**Для кого:** военнослужащие и их семьи, покупающие новостройку в Краснодаре по военной ипотеке. Рациональная аудитория, принимающая серьёзное финансовое решение.

---

**2\. Цветовая система**

**Backgrounds**

bg/primary              \#F1F3F5    холодный серо-голубой, основной фон  
bg/secondary            \#E9ECEF    контрастная секция (кейсы, FAQ)  
bg/surface              \#FFFFFF    карточки на bg/secondary  
bg/surface-lowest       \#FAFBFC    вложенные карточки, нижний уровень  
bg/dark                 \#0F1419    финальная тёмная секция (не чёрный)  
bg/dark-elevated        \#1A2028    форма на тёмном фоне

**Text**

text/primary            \#0F1419    основной текст  
text/secondary          \#4A5568    вторичный, холодный графит  
text/tertiary           \#8B95A3    вспомогательный, label-mono  
text/on-dark            \#F1F3F5    на тёмном фоне  
text/on-dark-mute       rgba(241,243,245,0.7)   приглушённый на тёмном

**Accents**

accent/primary          \#0F2547    глубокий navy, typography mixing, декорации  
accent/secondary        \#2563EB    vivid blue, ТОЛЬКО для CTA  
accent/hover            \#1D4ED8    hover-состояние CTA  
accent/primary-soft     rgba(15,37,71,0.08)    для badge-fills  
accent/secondary-soft   rgba(37,99,235,0.08)   для soft-pills

**Borders & Decoration**

outline/variant         rgba(15,37,71,0.15)    ghost borders  
outline/on-dark         rgba(241,243,245,0.12) на тёмном  
decoration/grid-light   rgba(15,37,71,0.04)    сетка на светлом фоне  
decoration/grid-dark    rgba(255,255,255,0.03) сетка на тёмном  
decoration/marker       rgba(15,37,71,0.05)    section markers

**Status**

error/base              \#BA1A1A  
error/container         \#FFDAD6  
error/on-container      \#93000A

**Запреты**

* Нельзя использовать \#000000 (чистый чёрный). Самый тёмный цвет в системе — \#0F1419  
* Нельзя использовать тёплые оттенки (бежевый, песочный, латунь, золото, оранжевый)  
* Нельзя использовать чистый белый для основных фонов — только для карточек на цветном фоне

---

**3\. Типографика**

**Шрифт**

Manrope — единственный шрифт на всю систему.

Веса в использовании:

* Regular (400)  
* Medium (500)  
* Semi Bold (600)  
* Italic (для цитат)

**Замечание для Figma/API:** "Semi Bold" пишется с пробелом.

**Desktop-шкала**

display             64px / line-height 1.05 / Semi Bold / letter-spacing \-0.03em  
display-accent      64px / 1.05 / Semi Bold / color accent/primary (для mixing)  
h1                  48px / 1.1 / Semi Bold / letter-spacing \-0.02em  
h2                  36px / 1.15 / Semi Bold / letter-spacing \-0.015em  
h3                  22px / 1.3 / Semi Bold / letter-spacing \-0.005em  
body-lg             19px / 1.5 / Regular  
body                16px / 1.6 / Regular  
body-medium         16px / 1.6 / Medium  
small               14px / 1.5 / Regular  
small-medium        14px / 1.5 / Medium  
label-mono          12px / 1.4 / Medium / letter-spacing 0.05em / UPPERCASE  
quote-italic        17px / 1.5 / Regular italic

**Mobile-шкала**

display-m           44px / 1.1 / Semi Bold / letter-spacing \-0.02em  
h1-m                36px / 1.15 / Semi Bold / letter-spacing \-0.015em  
h2-m                28px / 1.2 / Semi Bold / letter-spacing \-0.01em  
body-lg-m           17px / 1.55 / Regular

**Decorative**

number-marker       200-220px / 1 / Semi Bold (section markers)  
number-marker-m     120px (mobile version)  
number-card         48px / 1 / Semi Bold (номера карточек)

**Правила применения**

**Typography mixing:** в ключевых заголовках можно комбинировать text/primary (\#0F1419) и accent/primary (\#0F2547) в одном предложении. Акцент делается на смысловом слове.

**FAQ standard:** единственный канонический FAQ-компонент сайта — `src/components/sections/FAQ.astro`. Вопрос в аккордеоне FAQ не считается `H3`. Для всех FAQ-блоков сайта вопрос набирается в шкале `body` с Semi Bold/600 и line-height около `1.45-1.5`, чтобы блок оставался собранным и не спорил по масштабу с соседними секциями.

**Final CTA standard:** единственный канонический финальный CTA-компонент сайта — `src/components/sections/FinalCTALight.astro`. Он повторяет эталон главной страницы и используется на всех route-страницах; допускается менять только copy, modal title и якорь секции, но не сам паттерн, сетку и типографическую шкалу.

Пример:

"Навигатор по новостройкам Краснодара **для военнослужащих**" (последние два слова — accent/primary)

**Number markers:** большие номера секций (200-220px) — filled, не outlined. Цвет decoration/marker с opacity 0.05. Позиционируются absolute в углах секций как архитектурные якоря.

---

**4\. Spacing-система**

Базовая единица: 4px

xs                  8  
sm                  16  
md                  24  
lg                  40  
xl                  64  
xxl                 96  
section             120   (вертикальный padding секций на desktop)

gutter              24    (между колонками в grid)  
margin-frame        48    (frame margins)  
grid-pattern        64    (размер клетки decorative grid)

**Mobile adjustments**

На mobile section padding: 64px вертикально, 24px горизонтально.

---

**5\. Радиусы**

radius/sm           6    (inputs, small tags)  
radius/md           10   (buttons)  
radius/lg           12   (cards, форма на светлом)  
radius/xl           16   (крупные формы на тёмном)  
radius/full         999  (circle badges)  
---

**6\. Layout**

**Desktop**

viewport-width      1440  
container-max       1280  
container-padding   48  
section-padding-y   120

Grid: 12 колонок, gutters 24px.

**Mobile**

viewport-width      375  
container-padding   24  
section-padding-y   64

**Принципы**

* **Editorial asymmetry:** заголовки секций выравниваются по левому краю контента, не центрируются. Исключение — финальный CTA на тёмной секции, там центровка оправдана.  
* **Generous whitespace:** между секциями минимум 120px вертикального отступа на desktop.  
* **Max-width для текста:** абзацы не шире 600px для читаемости.

---

**7\. Базовые принципы системы**

**Принцип 1\. No-Line Rule**

Границы между секциями создаются тональным сдвигом фона, а не сплошными 1px-линиями. Переход из bg/primary в bg/secondary сам по себе создаёт границу секции.

**Принцип 2\. Tonal Layering**

Глубина достигается через surface-hierarchy, не через тени. Карточка на фоне секции \= смена surface-токена. Карточка внутри карточки \= ещё более глубокий surface-уровень.

**Принцип 3\. Ghost Borders**

Когда граница всё-таки нужна (обводка карточки, divider), используется outline/variant на opacity 0.15. Никаких сплошных 100% границ.

**Принцип 4\. Flat CTA**

Кнопки плоские, без градиентов. Hover \= смена цвета на accent/hover, возможно микросмещение Y \-1px. Без теней.

**Принцип 5\. Single Font Family**

Manrope на всю систему. Никаких serif, никаких декоративных дополнительных шрифтов.

**Принцип 6\. No Pure Black**

Самый тёмный цвет \#0F1419, не \#000000. Даёт темно-синий подтон вместо "мёртвого" чёрного.

**Принцип 7\. Editorial Asymmetry**

Заголовки секций по левой линии, не центрируются. Создаёт editorial-ощущение.

---

**8\. Premium-слои (обязательны)**

Эти 7 слоёв отличают систему от базового минимализма и делают её "не скучной".

**Слой 1\. Decorative Grid**

pattern:            64 × 64px  
lines:              1px, цвет decoration/grid-light (rgba 15,37,71 / 0.04)  
применение:         только в Hero и финальной тёмной секции

Еле видимая сетка, создающая техно-фактуру. На тёмном фоне используется decoration/grid-dark (rgba 255,255,255 / 0.03).

**Слой 2\. Section Number Markers**

size:               200-220px (desktop), 120px (mobile)  
font:               Manrope Semi Bold  
color:              decoration/marker (filled, opacity 0.05)  
position:           absolute в углах секций  
поведение:          частично выходят за край секции для создания edge-tension

Каждая секция имеет свой номер (01, 02, 03, 04). Работают как архитектурные якоря и навигационные метки.

**Слой 3\. Accent Lines**

size:               2-3px × 24-40px  
color:              accent/secondary (\#2563EB)  
применение:  
  — перед каждым label-mono (slash-separator)  
  — слева от H3 в карточках (divider-accent)  
  — между группами в формах

Тонкие функциональные элементы подчёркивания. Не декорация, а визуальная пунктуация.

**Слой 4\. Atmospheric Gradients**

Hero:  
  тип:              radial gradient  
  начало:           top-left  
  переход:          bg/surface at 30% opacity → transparent  
  radius:           800px

Финальная тёмная секция:  
  тип:              radial gradient  
  начало:           top-center  
  переход:          rgba(37,99,235,0.08) → transparent  
  radius:           1000px

Создают ощущение света и атмосферы без явной декоративности.

**Слой 5\. Typography Mixing**

В ключевых заголовках разные слова имеют разный цвет:

* Основная часть: text/primary (\#0F1419)  
* Акцентные слова: accent/primary (\#0F2547)

Применяется в Hero, в заголовках карточек, в главных CTA-заголовках.

**Слой 6\. Content Patterns**

**Trust-row с разделителями:** вертикальные линии 1×32px в outline/variant между каждой парой элементов. Не просто список цифр, а структурированная таблица метрик.

**Timeline-connector:** в процессных блоках — вертикальная 1px линия слева, соединяющая все шаги. Маркеры шагов сидят на этой линии.

**Quote-блоки с фоновой кавычкой:** большая " шрифтом 120×120px в opacity 0.06, цвет accent/primary. Позиционируется absolute за текстом цитаты.

**Document-style cards:** каждая карточка как формальный документ — тег в левом верхнем углу, большой номер в правом верхнем (48px outline), заголовок с accent line.

**Step-badges с номерами:** круглые 28×28px бейджи с номерами шагов внутри. Фон accent/primary, текст white Semi Bold.

**Checkmark badges:** круглые 24×24px, фон accent/secondary-soft, внутри иконка checkmark цвета accent/secondary.

**Слой 7\. Corner Brackets**

size:               20×20px (desktop), 16×16px (mobile)  
stroke:             1px  
color:              accent/primary с opacity 0.3  
позиция:            в 16px от углов фрейма  
форма:              L-образная (2 линии, горизонтальная 12×1 \+ вертикальная 1×12)

Применяются вокруг портрета Михаила и любых ключевых изображений. Дают "архитектурное" обрамление.

---

**9\. Компоненты**

**Buttons**

**Primary Button:**

bg:                 accent/secondary (\#2563EB)  
text:               \#FFFFFF, Manrope Medium 15-16px  
padding:            14px 28px (desktop), 16px 24px (mobile)  
radius:             radius/md (10px)  
hover:              bg → accent/hover (\#1D4ED8), translate Y \-1px  
без градиента, без тени

**Ghost Button:**

bg:                 transparent  
border:             1px solid outline/variant  
text:               text/primary, Manrope Medium 15-16px  
padding:            14px 24px  
radius:             radius/md (10px)  
hover:              bg → bg/surface, border → outline/variant с opacity 0.25

**Text Link Button:**

bg:                 transparent  
text:               text/primary, Medium  
decoration:         animated underline (appear on hover)

**Inputs**

**Input (на светлом фоне):**

bg:                 transparent  
border:             1px solid rgba(15,37,71,0.2)  
height:             48px  
padding:            14px 16px  
radius:             radius/sm (6px)  
text:               text/primary, body 16px  
placeholder:        text/tertiary

focus state:  
  border:           accent/secondary  
  ring:             2px offset rgba(37,99,235,0.15)

**Input (на тёмном фоне):**

bg:                 transparent  
border:             1px solid outline/on-dark  
text:               text/on-dark  
placeholder:        rgba(241,243,245,0.35)  
остальное:          идентично светлому

**Cards**

**Standard Card:**

bg:                 bg/surface (\#FFFFFF)  
radius:             radius/lg (12px)  
padding:            32px (desktop), 24px (mobile)  
border:             none (используется tonal layering)  
shadow:             0 1px 2px rgba(15,20,25,0.04) — минимальная

hover:              appearance of ghost border (outline/variant)  
                    \+ сдвиг shadow до 0 4px 12px rgba(15,20,25,0.06)

**Nested Card:**

bg:                 bg/surface-lowest (для ритма в списках карточек)  
остальное:          как Standard Card

**Tags / Badges**

**Tag (label):**

bg:                 accent/primary-soft  
text:               accent/primary, label-mono  
padding:            6px 12px  
radius:             4px

**Soft Pill:**

bg:                 accent/secondary-soft  
text:               accent/secondary, small-medium  
padding:            4px 10px  
radius:             radius/full (999px)

**Dividers**

ghost divider:      1px, fill outline/variant  
accent divider:     4px × 2px, fill accent/secondary (перед основными линиями)

**Section Markers**

size:               200-220px (desktop), 120px (mobile)  
font:               Manrope Semi Bold  
color:              decoration/marker  
position:           absolute, в углах секции, частично обрезается краем

**Icons**

Стиль: тонкие линейные иконки, stroke 1.5px. Набор: Lucide или Phosphor Icons. Цвет: text/primary или accent/primary. Размер: 20px (в inline-контексте), 24px (standalone), 32px (featured).

---

**10\. Правила композиции**

**Hero-секция (обязательная структура)**

1\. Background: bg/primary \+ grid pattern \+ radial gradient TL  
2\. Section marker "01" absolute left edge  
3\. Two-column layout (60/40)  
4\. Left column:  
   \- Accent line \+ label-mono (про бренд)  
   \- Display headline with typography mixing  
   \- Body-lg subheadline  
   \- CTA row (primary \+ ghost)  
   \- Divider с accent-prefix  
   \- Trust row (4 items с vertical dividers)  
5\. Right column:  
   \- Portrait 480×640 с corner brackets

**Раздел кейсов (обязательная структура)**

1\. Background: bg/secondary (tonal shift \= section boundary)  
2\. Section marker "02" absolute right edge  
3\. Left-aligned header:  
   \- Accent line \+ label-mono "КЕЙСЫ / 02"  
   \- H2  
   \- Body (описание)  
4\. 3 cards в ряд, gap 24px  
5\. Каждая card:  
   \- Tag badge \+ number marker (top row)  
   \- Accent line \+ H3  
   \- Timeline connector \+ 3 detail blocks  
   \- Ghost divider  
   \- Quote с фоновой кавычкой  
6\. Surface-variation: карта 2 использует bg/surface-lowest для ритма

**Тёмная финальная секция (обязательная структура)**

1\. Background: bg/dark \+ grid pattern \+ radial gradient TC (blue)  
2\. Section marker "04" absolute right  
3\. Centered content, max-width 640  
4\. Label-mono \+ H1 \+ body-lg  
5\. Form card (bg/dark-elevated, radius 16):  
   \- Fields с label-mono сверху  
   \- Primary CTA button  
   \- Alternative messenger row  
6\. Bottom stats strip (3 icon-blocks)  
---

**11\. Mobile-принципы**

**Трансформация layouts**

**Hero:**

* Two-column → vertical stack  
* Portrait идёт первым (после label)  
* Trust row превращается в 2×2 grid  
* CTA кнопки full-width

**Cards:**

* Row (3 в ряд) → vertical stack  
* Каждая card full-width minus padding  
* Внутренняя структура сохраняется

**Forms:**

* Все inputs full-width  
* Button full-width, height 56px  
* Bottom stats — vertical stack вместо horizontal

**Premium-слои на mobile**

* Grid pattern: клетка 48×48px (вместо 64\)  
* Section markers: 120px (вместо 220\)  
* Corner brackets: 16×16 (вместо 20\)  
* Atmospheric gradients: сохраняются, но с меньшим radius

---

**12\. Запреты (антипаттерны)**

**Нельзя:**

* Использовать \#000000 — только \#0F1419  
* Использовать тёплые цвета (бежевый, золото, латунь)  
* Ставить градиенты на кнопки  
* Использовать сплошные 100% opacity границы  
* Ставить тени тёплых оттенков  
* Использовать несколько шрифтов  
* Делать заголовки bold (weight 700\) — только Semi Bold (600)  
* Использовать serif-шрифты  
* Ставить outline на крупные декоративные номера (только filled)  
* Использовать Tertiary/оранжевый цвет как акцент  
* Центрировать заголовки секций (кроме финальной тёмной)  
* Ставить тяжёлые drop-shadows в стиле Material Design  
* Использовать иконки цветной заливкой — только stroke-версии

---

**13\. Чек-лист применения**

Перед финализацией любого экрана проверить:

☐ Фон не чисто белый (\#F1F3F5 или темнее)  
☐ Primary CTA — vivid blue \#2563EB  
☐ Ghost buttons с ghost border  
☐ Typography mixing в ключевых заголовках  
☐ Section marker в каждой секции  
☐ Accent lines перед labels  
☐ Grid pattern в Hero и тёмной секции  
☐ Corner brackets вокруг портрета  
☐ Ghost borders вместо 100% линий  
☐ No tonal shift вместо 1px section dividers  
☐ Timeline connectors в процессах  
☐ Document-style cards с number markers  
☐ Quote blocks с фоновой кавычкой  
☐ Dark final section с blue radial gradient  
☐ Все корнер\-радиусы в диапазоне 6-16px  
☐ Нет warm tones  
☐ Нет \#000000 (только \#0F1419)  
☐ Manrope во всех элементах  
☐ Mobile-версия протестирована  
---

**14\. Конвертация HEX → RGB для Figma API**

Для работы через Figma Plugin API (RGB 0-1):

\#F1F3F5  →  { r: 0.945, g: 0.953, b: 0.961 }  
\#E9ECEF  →  { r: 0.914, g: 0.925, b: 0.937 }  
\#FFFFFF  →  { r: 1, g: 1, b: 1 }  
\#FAFBFC  →  { r: 0.980, g: 0.984, b: 0.988 }  
\#0F1419  →  { r: 0.059, g: 0.078, b: 0.098 }  
\#1A2028  →  { r: 0.102, g: 0.125, b: 0.157 }  
\#4A5568  →  { r: 0.290, g: 0.333, b: 0.408 }  
\#8B95A3  →  { r: 0.545, g: 0.584, b: 0.639 }  
\#0F2547  →  { r: 0.059, g: 0.145, b: 0.278 }  
\#2563EB  →  { r: 0.145, g: 0.388, b: 0.922 }  
\#1D4ED8  →  { r: 0.114, g: 0.306, b: 0.847 }  
\#BA1A1A  →  { r: 0.729, g: 0.102, b: 0.102 }  
---

**15\. Референсы**

Визуальные эталоны для валидации направления:

* Linear — linear.app (холодная строгая база)  
* Vercel — vercel.com (типографика, компоненты)  
* Stripe — stripe.com (финансовая серьёзность)  
* Arc Browser — arc.net (атмосферные детали)  
* Raycast — raycast.com (тёмные секции)  
* Mercury — mercury.com (B2B-финансовая аудитория)  
* Notion Calendar — calendar.notion.so (баланс строгости и тепла)

Русскоязычные ближайшие аналоги:

* Т-Банк — tbank.ru  
* Яндекс Клауд — cloud.yandex.ru

---

**Версионность**

v1.0 Final — апрель 2026  
Основа: комбинация подхода Linear/Vercel \+ авторский слой premium-деталей.  
Контекст: проект Михаила Хряпина, личный бренд риэлтора для военнослужащих.  
Статус: готова к применению в Figma, Pencil, Tilda.  

# SEO_PASSPORT_VOEN_NAVIGATOR

**Проект:** Военный навигатор  
**Домен:** `https://voen-navigator.ru/`  
**Дата актуализации:** 2026-07-03  
**Статус:** канонический SEO-паспорт проекта  
**Горизонт:** 6-12 месяцев  
**Источник правды по SEO:** этот файл

---

## 0. Что это за документ

Этот файл заменяет роль двух разрозненных документов:

- `SEO_STRATEGY_CLUSTER_MAP_VOEN_NAVIGATOR_2026-07-03.md`
- `SEO_CORE_TOP50_VOEN_NAVIGATOR_2026-07-03.md`

Оба root-файла сохраняются как source-слой и история решений от 2026-07-03, но дальше рабочий SEO-канон поддерживается здесь.

Задача этого паспорта:

- быстро объяснить любому ИИ и любому специалисту, что за сайт мы развиваем;
- показать, какие SEO-страницы уже есть;
- зафиксировать Top-50 ядро, по которому идем первые 3-6 месяцев;
- показать, где exact-match запрос уже закрыт, а где страницы еще нет;
- зафиксировать live `title / description / H1`;
- развести commercial layer и journal layer;
- зафиксировать SEO-перелинковку и следующий план развития.

### 0.1. Что теперь является SEO-системой проекта

SEO-система проекта теперь состоит не из одного файла, а из одного канона плюс обязательных supporting-документов.

#### Канонический вход

1. `project-docs/SEO_PASSPORT_VOEN_NAVIGATOR.md`

Это главный SEO-документ. С него нужно начинать любую SEO-задачу.

#### Supporting-документы, которые нельзя считать лишними дублями

1. `project-docs/SEMANTICS.md`
2. `project-docs/SEO_INTERNAL_LINKING_MATRIX_2026-07-03.md`
3. `project-docs/JOURNAL_EDITORIAL_MAP.md`
4. `project-docs/briefs/PAGE_*.md`
5. `project-docs/briefs/journal/ARTICLE_*.md`

Роли документов:

- `SEMANTICS.md` — исходная семантика и Wordstat-слой;
- `SEO_INTERNAL_LINKING_MATRIX_2026-07-03.md` — жёсткая матрица journal -> commercial и commercial -> journal;
- `JOURNAL_EDITORIAL_MAP.md` — master-документ по развитию журнала как SEO-кластера;
- `PAGE_*.md` — смысл и структура конкретной коммерческой страницы;
- `ARTICLE_*.md` — бриф каждой статьи журнала.

### 0.2. Правило входа для любого ИИ или специалиста

Если задача связана с SEO, порядок чтения всегда такой:

1. `project-docs/SEO_PASSPORT_VOEN_NAVIGATOR.md`
2. `project-docs/SEMANTICS.md`, если задача про ядро, кластеры или новые страницы
3. `project-docs/SEO_INTERNAL_LINKING_MATRIX_2026-07-03.md`, если задача про перелинковку
4. `project-docs/JOURNAL_EDITORIAL_MAP.md`, если задача про журнал
5. нужный `project-docs/briefs/PAGE_*.md` или `project-docs/briefs/journal/ARTICLE_*.md`

### 0.3. Что можно и что нельзя удалять

Сейчас не нужно удалять supporting-документы SEO-системы.

Не удаляем:

- `project-docs/SEMANTICS.md`
- `project-docs/SEO_INTERNAL_LINKING_MATRIX_2026-07-03.md`
- `project-docs/JOURNAL_EDITORIAL_MAP.md`
- `project-docs/briefs/PAGE_*.md`
- `project-docs/briefs/journal/ARTICLE_*.md`

Root-файлы:

- `SEO_STRATEGY_CLUSTER_MAP_VOEN_NAVIGATOR_2026-07-03.md`
- `SEO_CORE_TOP50_VOEN_NAVIGATOR_2026-07-03.md`

лучше не удалять, а считать архивными source-файлами.

Если захотим убрать визуальную путаницу, правильнее потом:

1. создать отдельную архивную папку, например `archive/seo/`;
2. перенести туда оба root-файла;
3. оставить в `project-docs/` только действующий канон и supporting-слой.

---

## 1. Профиль сайта

### 1.1. Что это за продукт

`Военный навигатор` — не широкий сайт про всю недвижимость и не портал по всем новостройкам вообще.  
Это узкий сервисный сайт про покупку квартиры и новостройки по военной ипотеке.

Главная продуктовая формула:

`военная ипотека -> расчет и условия -> гео выбора -> объект -> следующий шаг по покупке`

### 1.2. Что нельзя делать стратегически

Нельзя строить SEO-ядро вокруг широкого высококонкурентного запроса `новостройки Краснодара` как вокруг главной money-page.  
Этот слой можно использовать только как supporting wording внутри релевантных страниц и статей.

### 1.3. Главная SEO-формула проекта

Сайт растет не через broad real estate, а через связку:

`военная ипотека + квартиры + гео + сценарий покупки`

Ключевые money-кластеры:

1. `Военная ипотека Краснодар`
2. `Военная ипотека в Крыму`
3. `Калькулятор военной ипотеки`
4. `Условия военной ипотеки`
5. `Семейная военная ипотека`

Следующие gap-кластеры:

1. `/kvartiry-po-voennoy-ipoteke/`
2. `/voennaya-ipoteka-sevastopol/`
3. `/voennaya-ipoteka-simferopol/`

---

## 2. Регионы и мониторинг

### 2.1. Рабочие регионы проекта

- `Краснодар` — Topvisor region `35`
- `Симферополь` — Topvisor region `146`
- `Севастополь` — Topvisor region `959`

### 2.2. Важный вывод по Крыму

В рабочем контуре проекта не подтвержден надежный единый поисковый регион `Крым` как отдельная универсальная сущность для мониторинга.  
Поэтому крымский спрос и дальнейшее SEO-развитие ведем через:

- `Симферополь`
- `Севастополь`

### 2.3. Topvisor

- **Topvisor project ID:** `29600590`
- **Текущая логика мониторинга:** `Краснодар + Симферополь + Севастополь`

---

## 3. Главный стратегический вывод

В ближайшие 6 месяцев сайт нужно усиливать не в ширину, а в глубину.

Это значит:

- удерживаем фокус на военной ипотеке;
- доводим до сильного состояния 5 приоритетных commercial pages;
- создаем 1 новый object-entry;
- дальше раскрываем Крым через city-pages;
- журнал работает не сам по себе, а как supporting-слой вокруг money pages;
- title и H1 на priority money pages держим максимально близко к главному кластерному запросу.

---

## 4. Текущая live SEO-структура

| Тип | URL | Роль | Статус |
| --- | --- | --- | --- |
| Hub / service | `/` | главный сервисный вход, маршрут и trust | есть |
| Trust | `/o-servise/` | entity / доверие / объяснение сервиса | есть |
| Trust / contact | `/contacts/` | контакты и география | есть |
| Geo commercial | `/voennaya-ipoteka-krasnodar/` | главный money-вход по Краснодару | есть |
| Geo commercial | `/voennaya-ipoteka-krym/` | parent-page по Крыму | есть |
| Utility commercial | `/kalkulyator-voennoy-ipoteki/` | калькуляторный кластер | есть |
| Info commercial | `/usloviya-voennoy-ipoteki/` | условия / банки / ставка / сумма | есть |
| Scenario commercial | `/semeynaya-voennaya-ipoteka/` | семейный сценарий | есть |
| Journal hub | `/journal/` | информационный SEO-хаб | есть |
| Category | `/journal/category/voennaya-ipoteka/` | рубрика | есть |
| Category | `/journal/category/raschet-i-summa/` | рубрика | есть |
| Category | `/journal/category/banki-i-usloviya/` | рубрика | есть |
| Category | `/journal/category/krasnodar/` | рубрика | есть |
| Category | `/journal/category/krym/` | рубрика | есть |
| Category | `/journal/category/semeynaya-ipoteka/` | рубрика | есть |
| Category | `/journal/category/sdelka-i-riski/` | рубрика | есть |
| Gap page | `/kvartiry-po-voennoy-ipoteke/` | object-entry | нет, создать |
| Gap page | `/voennaya-ipoteka-sevastopol/` | city-page | нет, создать |
| Gap page | `/voennaya-ipoteka-simferopol/` | city-page | нет, создать |

---

## 5. Live `title / description / H1` по опубликованным страницам

### 5.1. Основные страницы

| URL | Title | Description | H1 |
| --- | --- | --- | --- |
| `/` | `Военный навигатор — сервис по военной ипотеке и новостройкам` | `Военный навигатор помогает выбрать новостройку по военной ипотеке в Краснодаре и Крыму: сначала расчёт вариантов, потом подбор и следующий шаг по сделке.` | `Подбираем новостройки по военной ипотеке бесплатно` |
| `/o-servise/` | `О Военном навигаторе — Михаил Хряпин и сервис по военной ипотеке` | `Кто стоит за Военным навигатором, как устроен сервис и как Михаил Хряпин проводит первичный разбор перед подбором новостройки.` | `Военный навигатор — сервис, который ведёт покупку новостройки по военной ипотеке от разбора до сделки.` |
| `/contacts/` | `Контакты Военного навигатора — Краснодар и Крым` | `Контакты Военного навигатора: офисы в Краснодаре и Бахчисарае, телефон, Telegram и запись на расчёт вариантов по военной ипотеке.` | `Контакты Военного навигатора в Краснодаре и Крыму` |
| `/voennaya-ipoteka-krasnodar/` | `Военная ипотека Краснодар` | `Помогаем выбрать квартиру или новостройку в Краснодаре по военной ипотеке: районы, банки, лимит, ликвидность и подбор ЖК под задачу покупки.` | `Военная ипотека Краснодар` |
| `/voennaya-ipoteka-krym/` | `Военная ипотека в Крыму` | `Разберите покупку квартиры или новостройки в Крыму по военной ипотеке: Севастополь, Симферополь, побережье, дистанционный формат и следующий шаг.` | `Военная ипотека в Крыму` |
| `/kalkulyator-voennoy-ipoteki/` | `Калькулятор военной ипотеки` | `Калькулятор военной ипотеки помогает рассчитать ориентир по сумме, накоплениям и сценарию покупки. Поймите, когда нужен точный расчёт.` | `Калькулятор военной ипотеки` |
| `/usloviya-voennoy-ipoteki/` | `Условия военной ипотеки` | `Условия военной ипотеки в 2026 году: кто подходит, какая сумма, какие банки и документы учитывать перед выбором квартиры или новостройки.` | `Условия военной ипотеки` |
| `/semeynaya-voennaya-ipoteka/` | `Семейная военная ипотека` | `Условия совмещения военной и семейной ипотеки для военнослужащих с детьми. Как увеличить лимит до 6 млн ₽ и снизить ставку. Разбор ситуации.` | `Семейная военная ипотека` |
| `/journal/` | `Журнал Военный навигатор: военная ипотека и новостройки` | `Экспертные разборы о военной ипотеке, сумме, банках, калькуляторе, новостройках Краснодара и Крыма.` | `Журнал Военный навигатор` |

### 5.2. Рубрики журнала

| URL | Title | Description | H1 |
| --- | --- | --- | --- |
| `/journal/category/voennaya-ipoteka/` | `Военная ипотека — статьи журнала Военный навигатор` | `Статьи о военной ипотеке: условия, маршрут покупки, ограничения, документы и первые шаги перед подбором квартиры.` | `Военная ипотека` |
| `/journal/category/raschet-i-summa/` | `Расчёт и сумма — статьи журнала Военный навигатор` | `Расчёт и сумма по военной ипотеке: как понять бюджет, пользоваться калькулятором и не выбирать квартиру вслепую.` | `Расчёт и сумма` |
| `/journal/category/banki-i-usloviya/` | `Банки и условия — статьи журнала Военный навигатор` | `Банки и условия военной ипотеки: ставка, требования к объекту, документы, одобрение и важные ограничения перед сделкой.` | `Банки и условия` |
| `/journal/category/krasnodar/` | `Краснодар — статьи журнала Военный навигатор` | `Военная ипотека и новостройки Краснодара: как выбрать район, застройщика, срок сдачи и квартиру под задачу.` | `Краснодар` |
| `/journal/category/krym/` | `Крым — статьи журнала Военный навигатор` | `Военная ипотека в Крыму: Севастополь, Симферополь, новостройки, дистанционная покупка и выбор города.` | `Крым` |
| `/journal/category/semeynaya-ipoteka/` | `Семейная ипотека — статьи журнала Военный навигатор` | `Семейная и военная ипотека: как сравнить программы, бюджет, ограничения и выбрать рабочий сценарий покупки.` | `Семейная ипотека` |
| `/journal/category/sdelka-i-riski/` | `Сделка и риски — статьи журнала Военный навигатор` | `Сделка и риски по военной ипотеке: документы, развод, продажа квартиры, дистанционный формат и ограничения.` | `Сделка и риски` |

### 5.3. Опубликованные статьи журнала

| URL | Title | Description | H1 |
| --- | --- | --- | --- |
| `/journal/banki-po-voennoy-ipoteke/` | `Какие банки работают с военной ипотекой: что проверить` | `Банк оценивает не только участника программы, но и объект. Поэтому ставку нужно смотреть вместе с требованиями к новостройке и документам.` | `Какие банки работают с военной ипотекой: что проверить` |
| `/journal/kak-kupit-kvartiru-po-voennoy-ipoteke-v-krasnodare/` | `Как купить квартиру в Краснодаре по военной ипотеке: маршрут без хаоса` | `Покупка в Краснодаре начинается не с просмотра новостроек, а с проверки бюджета, цели, банка и реального маршрута сделки.` | `Как купить квартиру в Краснодаре по военной ипотеке: маршрут без хаоса` |
| `/journal/kalkulyator-voennoy-ipoteki-chto-schitat/` | `Калькулятор военной ипотеки: что считать до выбора квартиры` | `Калькулятор нужен не ради одной красивой цифры, а чтобы заранее увидеть бюджет, запас, сценарий покупки и границы подбора.` | `Калькулятор военной ипотеки: что считать до выбора квартиры` |
| `/journal/kvartira-po-voennoy-ipoteke-pri-razvode/` | `Делится ли квартира по военной ипотеке при разводе` | `Вопрос о разделе квартиры зависит от обстоятельств. До сделки стоит понимать риски, документы и необходимость юридической проверки.` | `Делится ли квартира по военной ипотеке при разводе` |
| `/journal/novostroyki-krasnodara-po-voennoy-ipoteke/` | `Какие новостройки Краснодара подходят под военную ипотеку` | `Подходящая новостройка в Краснодаре — это не только цена и район. Важна связка объекта с банком, застройщиком, сроком сдачи и вашей целью.` | `Какие новостройки Краснодара подходят под военную ипотеку` |
| `/journal/semeynaya-i-voennaya-ipoteka/` | `Семейная и военная ипотека: когда сценарии можно сравнивать` | `Семейная ипотека не заменяет автоматом военную. Их нужно сравнивать по семье, бюджету, объекту, банку и долгосрочной цели покупки.` | `Семейная и военная ипотека: когда сценарии можно сравнивать` |
| `/journal/sevastopol-ili-simferopol-po-voennoy-ipoteke/` | `Севастополь или Симферополь: где начинать поиск по военной ипотеке` | `Оба города могут быть интересны, но решают разные задачи. Сравнивать нужно не по привычке, а по цели покупки, логистике и бюджету.` | `Севастополь или Симферополь: где начинать поиск по военной ипотеке` |
| `/journal/summa-voennoy-ipoteki-i-raschet/` | `Сумма по военной ипотеке: как понять реальный бюджет` | `Реальный бюджет — это не только лимит программы. Важно считать накопления, платёж, собственные средства, срок сделки и запас.` | `Сумма по военной ипотеке: как понять реальный бюджет` |
| `/journal/usloviya-voennoy-ipoteki-2026/` | `Условия военной ипотеки в 2026 году: что проверить до подбора` | `Перед выбором квартиры важно проверить не только сумму и ставку, но и требования к участнику, объекту, банку и сценарию сделки.` | `Условия военной ипотеки в 2026 году: что проверить до подбора` |
| `/journal/voennaya-ipoteka-v-krymu/` | `Военная ипотека в Крыму: с чего начать выбор города и новостройки` | `Крым требует отдельного подхода: нужно сравнить город, цель покупки, дистанционный формат, ликвидность и требования к объекту.` | `Военная ипотека в Крыму: с чего начать выбор города и новостройки` |

---

## 6. Top-50 SEO-ядро на первые 3-6 месяцев

### 6.1. Как использовать ядро

Это operational core проекта.

- по нему мы развиваем sitewide meta-слой;
- по нему усиливаем 5 действующих commercial pages;
- по нему принимаем решение о создании новых SEO-страниц;
- по нему же потом заводим позиции и рост в мониторинг.

### 6.2. Приоритет страниц

| Приоритет | Страница | Роль |
| --- | --- | --- |
| `P1` | `/voennaya-ipoteka-krasnodar/` | главный коммерческий вход по Краснодару |
| `P1` | `/kvartiry-po-voennoy-ipoteke/` | новый object-entry по покупке квартиры |
| `P1` | `/kalkulyator-voennoy-ipoteki/` | самостоятельный utility-кластер |
| `P1` | `/usloviya-voennoy-ipoteki/` | условия / банки / сумма |
| `P1` | `/semeynaya-voennaya-ipoteka/` | отдельный сценарный кластер |
| `P1-P2` | `/voennaya-ipoteka-krym/` | parent-page по Крыму |
| `P2` | `/voennaya-ipoteka-sevastopol/` | новая city-page |
| `P3` | `/voennaya-ipoteka-simferopol/` | city-page второй очереди |
| `P2` | `/journal/` + статьи | anti-objection и long-tail |

### 6.3. Полное Top-50 ядро

| # | Запрос | Кластер | Куда вести | Приоритет | Статус |
| ---: | --- | --- | --- | --- | --- |
| 1 | `военная ипотека краснодар` | Geo commercial | `/voennaya-ipoteka-krasnodar/` | `P1` | есть |
| 2 | `краснодар военная ипотека квартиры` | Geo commercial | `/voennaya-ipoteka-krasnodar/` | `P1` | есть |
| 3 | `купить квартиру в краснодаре военная ипотека` | Geo commercial | `/voennaya-ipoteka-krasnodar/` | `P1` | есть |
| 4 | `военная ипотека условия краснодар` | Geo supporting | `/voennaya-ipoteka-krasnodar/` | `P1` | есть |
| 5 | `военная ипотека краснодарский край` | Geo supporting | `/voennaya-ipoteka-krasnodar/` | `P2` | есть |
| 6 | `квартира по военной ипотеке краснодар` | Geo + object | `/voennaya-ipoteka-krasnodar/` | `P1` | есть |
| 7 | `военная ипотека в крыму` | Geo commercial | `/voennaya-ipoteka-krym/` | `P1-P2` | есть |
| 8 | `военная ипотека крым` | Geo commercial | `/voennaya-ipoteka-krym/` | `P1-P2` | есть |
| 9 | `военная ипотека в крыму 2026` | Geo commercial | `/voennaya-ipoteka-krym/` | `P2` | есть |
| 10 | `военная ипотека в крыму условия` | Geo supporting | `/voennaya-ipoteka-krym/` | `P2` | есть |
| 11 | `военная ипотека севастополь` | City commercial | `/voennaya-ipoteka-sevastopol/` | `P2` | создать |
| 12 | `военная ипотека в севастополе условия` | City supporting | `/voennaya-ipoteka-sevastopol/` | `P2` | создать |
| 13 | `военная ипотека симферополь` | City commercial | `/voennaya-ipoteka-simferopol/` | `P3` | создать |
| 14 | `симферополь ипотека военным` | City commercial | `/voennaya-ipoteka-simferopol/` | `P3` | создать |
| 15 | `квартира по военной ипотеке` | Object commercial | `/kvartiry-po-voennoy-ipoteke/` | `P1` | создать |
| 16 | `квартиры по военной ипотеке` | Object commercial | `/kvartiry-po-voennoy-ipoteke/` | `P1` | создать |
| 17 | `купить квартиру по военной ипотеке` | Transactional object | `/kvartiry-po-voennoy-ipoteke/` | `P1` | создать |
| 18 | `покупка квартиры по военной ипотеке` | Transactional object | `/kvartiry-po-voennoy-ipoteke/` | `P1` | создать |
| 19 | `приобрести квартиру по военной ипотеке` | Transactional object | `/kvartiry-po-voennoy-ipoteke/` | `P1` | создать |
| 20 | `квартира по военной ипотеке краснодар` | Geo + object | `/voennaya-ipoteka-krasnodar/` | `P1` | есть |
| 21 | `квартиры по военной ипотеке краснодар` | Geo + object | `/voennaya-ipoteka-krasnodar/` | `P1` | есть |
| 22 | `квартиры по военной ипотеке в крыму` | Geo + object | `/voennaya-ipoteka-krym/` | `P2` | есть |
| 23 | `калькулятор военной ипотеки` | Utility commercial | `/kalkulyator-voennoy-ipoteki/` | `P1` | есть |
| 24 | `калькулятор военной ипотеки 2026` | Utility commercial | `/kalkulyator-voennoy-ipoteki/` | `P1` | есть |
| 25 | `рассчитать военную ипотеку калькулятор` | Utility commercial | `/kalkulyator-voennoy-ipoteki/` | `P1` | есть |
| 26 | `расчет военной ипотеки калькулятор` | Utility commercial | `/kalkulyator-voennoy-ipoteki/` | `P1` | есть |
| 27 | `калькулятор военной ипотеки онлайн` | Utility commercial | `/kalkulyator-voennoy-ipoteki/` | `P1` | есть |
| 28 | `калькулятор накоплений по военной ипотеке` | Utility supporting | `/kalkulyator-voennoy-ipoteki/` | `P2` | есть |
| 29 | `военная ипотека калькулятор накоплений онлайн` | Utility supporting | `/kalkulyator-voennoy-ipoteki/` | `P2` | есть |
| 30 | `военная ипотека условия` | Info commercial | `/usloviya-voennoy-ipoteki/` | `P1` | есть |
| 31 | `военная ипотека 2026 условия` | Info commercial | `/usloviya-voennoy-ipoteki/` | `P1` | есть |
| 32 | `условия военной ипотеки сво` | Info commercial | `/usloviya-voennoy-ipoteki/` | `P1-P2` | есть |
| 33 | `военная ипотека для участников сво условия` | Info commercial | `/usloviya-voennoy-ipoteki/` | `P1-P2` | есть |
| 34 | `военная ипотека условия для военнослужащих` | Info commercial | `/usloviya-voennoy-ipoteki/` | `P1` | есть |
| 35 | `условия получения военной ипотеки` | Info commercial | `/usloviya-voennoy-ipoteki/` | `P1` | есть |
| 36 | `военная ипотека процент` | Banks / rate | `/usloviya-voennoy-ipoteki/` | `P1` | есть |
| 37 | `военная ипотека ставка` | Banks / rate | `/usloviya-voennoy-ipoteki/` | `P1` | есть |
| 38 | `военная ипотека сумма` | Sum / limit | `/usloviya-voennoy-ipoteki/` | `P1` | есть |
| 39 | `военная ипотека сколько` | Sum / limit | `/usloviya-voennoy-ipoteki/` | `P1` | есть |
| 40 | `военная ипотека банки` | Banks | `/usloviya-voennoy-ipoteki/` | `P1` | есть |
| 41 | `военная ипотека какие банки` | Banks | `/usloviya-voennoy-ipoteki/` | `P1-P2` | есть |
| 42 | `банк военная ипотека` | Banks | `/usloviya-voennoy-ipoteki/` | `P1-P2` | есть |
| 43 | `семейная военная ипотека` | Scenario commercial | `/semeynaya-voennaya-ipoteka/` | `P1` | есть |
| 44 | `семейная военная ипотека 2026` | Scenario commercial | `/semeynaya-voennaya-ipoteka/` | `P1-P2` | есть |
| 45 | `семейная военная ипотека условия` | Scenario commercial | `/semeynaya-voennaya-ipoteka/` | `P1` | есть |
| 46 | `банки семейная военная ипотека` | Scenario supporting | `/semeynaya-voennaya-ipoteka/` | `P2` | есть |
| 47 | `совместить семейную и военную ипотеку` | Scenario supporting | `/semeynaya-voennaya-ipoteka/` | `P1-P2` | есть |
| 48 | `квартира по военной ипотеке при разводе` | Journal anti-objection | `/journal/kvartira-po-voennoy-ipoteke-pri-razvode/` | `P2` | есть |
| 49 | `делится ли квартира по военной ипотеке` | Journal anti-objection | `/journal/kvartira-po-voennoy-ipoteke-pri-razvode/` | `P2` | есть |
| 50 | `продать квартиру по военной ипотеке` | Journal anti-objection | `/journal/kvartira-po-voennoy-ipoteke-pri-razvode/` | `P2-P3` | есть |

---

## 7. Сопоставление ядра и текущих `title / H1`

### 7.1. Priority money pages

| Страница | Главный запрос | Текущий title | Текущий H1 | Оценка совпадения | Вывод |
| --- | --- | --- | --- | --- | --- |
| `/voennaya-ipoteka-krasnodar/` | `военная ипотека краснодар` | `Военная ипотека Краснодар` | `Военная ипотека Краснодар` | `9.5/10` | strong exact-match |
| `/voennaya-ipoteka-krym/` | `военная ипотека в крыму` | `Военная ипотека в Крыму` | `Военная ипотека в Крыму` | `9.5/10` | strong exact-match |
| `/kalkulyator-voennoy-ipoteki/` | `калькулятор военной ипотеки` | `Калькулятор военной ипотеки` | `Калькулятор военной ипотеки` | `10/10` | exact-match |
| `/usloviya-voennoy-ipoteki/` | `условия военной ипотеки` | `Условия военной ипотеки` | `Условия военной ипотеки` | `10/10` | exact-match |
| `/semeynaya-voennaya-ipoteka/` | `семейная военная ипотека` | `Семейная военная ипотека` | `Семейная военная ипотека` | `10/10` | exact-match |

### 7.2. Незакрытые money-gap pages

| Будущая страница | Главный запрос | Статус | Оценка |
| --- | --- | --- | --- |
| `/kvartiry-po-voennoy-ipoteke/` | `квартира по военной ипотеке` | страницы нет | `0/10` |
| `/voennaya-ipoteka-sevastopol/` | `военная ипотека севастополь` | страницы нет | `0/10` |
| `/voennaya-ipoteka-simferopol/` | `военная ипотека симферополь` | страницы нет | `0/10` |

### 7.3. Что это значит

- по 5 главным действующим money pages связка `запрос = title = H1` уже настроена правильно;
- следующий рост теперь зависит не от переименования этих страниц, а от усиления контента, перелинковки и закрытия gap pages;
- journal должен оставаться supporting-слоем и не перехватывать exact-match title money pages.

---

## 8. Страницы, которых сейчас не хватает

| URL | Главный запрос | Роль | Приоритет | Комментарий |
| --- | --- | --- | --- | --- |
| `/kvartiry-po-voennoy-ipoteke/` | `квартира по военной ипотеке` | object-entry | `P1` | самая важная недостающая коммерческая страница |
| `/voennaya-ipoteka-sevastopol/` | `военная ипотека севастополь` | city-page | `P2` | усиливает крымский кластер и локальный спрос |
| `/voennaya-ipoteka-simferopol/` | `военная ипотека симферополь` | city-page | `P3` | логичное продолжение крымского parent layer |

### 8.1. Что не нужно делать отдельными core pages прямо сейчас

- `новостройки краснодара`
- `дом по военной ипотеке`
- `вторичка по военной ипотеке`
- слишком широкие обзорные страницы без отдельного подтвержденного money-intent

Эти темы сначала закрываем блоками, supporting-статьями и развитием уже сильных кластеров.

---

## 9. Журнал как самостоятельный SEO-кластер

### 9.1. Роль журнала

Журнал не должен каннибализировать money pages.  
Его задача:

- закрывать process-intent;
- закрывать comparison-intent;
- снимать objections и risks;
- собирать long-tail;
- переводить пользователя в релевантную commercial page.

### 9.2. Маршрутизация article -> money page

| Статья | Primary route | Secondary route | Supporting intent |
| --- | --- | --- | --- |
| `/journal/kak-kupit-kvartiru-po-voennoy-ipoteke-v-krasnodare/` | `/voennaya-ipoteka-krasnodar/` | `/kvartiry-po-voennoy-ipoteke/` | process / how-to |
| `/journal/novostroyki-krasnodara-po-voennoy-ipoteke/` | `/voennaya-ipoteka-krasnodar/` | `/kvartiry-po-voennoy-ipoteke/` | local choice |
| `/journal/voennaya-ipoteka-v-krymu/` | `/voennaya-ipoteka-krym/` | будущие city-pages | geo overview |
| `/journal/sevastopol-ili-simferopol-po-voennoy-ipoteke/` | `/voennaya-ipoteka-krym/` | будущие city-pages | comparison |
| `/journal/kalkulyator-voennoy-ipoteki-chto-schitat/` | `/kalkulyator-voennoy-ipoteki/` | `/usloviya-voennoy-ipoteki/` | process / calculator |
| `/journal/summa-voennoy-ipoteki-i-raschet/` | `/kalkulyator-voennoy-ipoteki/` | `/usloviya-voennoy-ipoteki/` | budget / sum |
| `/journal/usloviya-voennoy-ipoteki-2026/` | `/usloviya-voennoy-ipoteki/` | `/kalkulyator-voennoy-ipoteki/` | info-commercial |
| `/journal/banki-po-voennoy-ipoteke/` | `/usloviya-voennoy-ipoteki/` | `/kalkulyator-voennoy-ipoteki/` | banks / rate |
| `/journal/semeynaya-i-voennaya-ipoteka/` | `/semeynaya-voennaya-ipoteka/` | `/kalkulyator-voennoy-ipoteki/` | scenario comparison |
| `/journal/kvartira-po-voennoy-ipoteke-pri-razvode/` | `/kvartiry-po-voennoy-ipoteke/` | `/usloviya-voennoy-ipoteki/` | risk / objection |

### 9.3. Документы по журналу

Журнальный контур поддерживается в:

- `project-docs/JOURNAL_EDITORIAL_MAP.md`
- `project-docs/briefs/PAGE_JOURNAL.md`
- `project-docs/briefs/journal/ARTICLE_*.md`

---

## 10. Правила SEO-перелинковки

### 10.1. Базовое правило

- `commercial page` забирает главный money-intent;
- `journal article` закрывает supporting-intent;
- каждая сильная commercial page получает supporting-слой из 3-5 материалов;
- каждая supporting-статья ведет на 1 главную money page;
- money page ссылается обратно на релевантные supporting-статьи.

### 10.2. Что обязательно для commercial page

- 1 главный кластерный запрос;
- 1 основной CTA;
- 3-5 supporting links из журнала;
- 1 блок `Полезные материалы` или `Разборы по теме`;
- 1-2 ссылки на соседние commercial pages, если это смежный интент, а не дубль.

### 10.3. Что обязательно для статьи

- 1 основная ссылка на money page;
- 1-2 дополнительные ссылки на смежные статьи;
- финальный CTA ведет не просто в заявку, а в следующий логический SEO-маршрут.

### 10.4. Главные кластеры supporting-layer

| Commercial page | Минимальный supporting-слой |
| --- | --- |
| `/voennaya-ipoteka-krasnodar/` | `как купить квартиру...`, `новостройки Краснодара...`, `сумма и расчет`, `банки`, `условия 2026` |
| `/voennaya-ipoteka-krym/` | `военная ипотека в Крыму`, `Севастополь или Симферополь`, `сумма и расчет`, `условия 2026` |
| `/kalkulyator-voennoy-ipoteki/` | `калькулятор: что считать`, `сумма и расчет`, `условия 2026`, `семейная и военная ипотека` |
| `/usloviya-voennoy-ipoteki/` | `условия 2026`, `банки`, `сумма и расчет`, `развод` |
| `/semeynaya-voennaya-ipoteka/` | `семейная и военная ипотека`, `калькулятор: что считать`, `условия 2026` |
| `/kvartiry-po-voennoy-ipoteke/` | `развод`, `как купить квартиру в Краснодаре`, `военная ипотека в Крыму`, future-статьи про дом и вторичку |

### 10.5. Source of truth

Техническая матрица перелинковки отдельно поддерживается в:

- `project-docs/SEO_INTERNAL_LINKING_MATRIX_2026-07-03.md`

---

## 11. План на 6 месяцев

### Волна 1

- удержать exact-match слой на 5 priority money pages;
- усилить descriptions под CTR;
- довести обратные блоки `Полезные материалы`;
- создать `/kvartiry-po-voennoy-ipoteke/`;
- доупаковать journal archive и category pages как маршрутизаторы.

### Волна 2

- создать `/voennaya-ipoteka-sevastopol/`;
- перераспределить часть крымской перелинковки;
- усилить supporting-статьи под Севастополь и выбор города;
- собрать первые сигналы по видимости и CTR.

### Волна 3

- создать `/voennaya-ipoteka-simferopol/`;
- добавить вторую волну long-tail статей;
- расширить object-layer вокруг квартиры, дома, вторички только по подтвержденному спросу;
- скорректировать titles/descriptions по факту Search Console и мониторинга.

---

## 12. Operational rhythm

### Ежемесячно

- проверять позиции priority cluster pages;
- смотреть CTR по title/description;
- добирать новые long-tail хвосты;
- обновлять этот паспорт по факту внедренных SEO-изменений.

### После каждой новой страницы

- зафиксировать URL в этом документе;
- добавить `title / description / H1`;
- привязать страницу к кластеру и ключевому запросу;
- зафиксировать article-supporting layer;
- обновить `WORKLOG.md`.

### После каждой новой статьи журнала

- назначить primary money page;
- проверить отсутствие exact-match каннибализации;
- добавить статью в supporting-слой соответствующего кластера;
- обновить `JOURNAL_EDITORIAL_MAP.md` и article brief.

---

## 13. Definition of Done

### Commercial page готова, когда

- есть 1 главный запрос и он совпадает с логикой `title / H1`;
- description продающий и усиливает CTR;
- страница встроена в внутреннюю перелинковку;
- у страницы есть минимум 3 supporting-материала;
- запрос закрывается не только метой, но и структурой контента.

### Статья журнала готова, когда

- она не дублирует money-intent;
- у нее есть свой supporting-intent;
- есть primary route в commercial page;
- есть secondary links в релевантные статьи;
- статья включена в editorial map и перелинковку.

---

## 14. Подтверждено vs гипотеза

### Подтверждено

- live-структура сайта;
- live `title / description / H1` по опубликованным страницам;
- exact-match слой на 5 priority money pages;
- рабочие регионы мониторинга: Краснодар, Симферополь, Севастополь;
- Topvisor project ID `29600590`;
- gap pages: `/kvartiry-po-voennoy-ipoteke/`, `/voennaya-ipoteka-sevastopol/`, `/voennaya-ipoteka-simferopol/`;
- роль журнала как отдельного supporting-кластера.

### Требует дальнейшего подтверждения в динамике

- какие descriptions дают лучший CTR;
- когда именно создавать дополнительные object-tail pages;
- как быстро выводить в отдельные страницы темы `дом` и `вторичка`;
- какие локальные city-tail темы в Крыму покажут лучший прирост.

---

## 15. Финальная формула проекта

`военная ипотека -> выбор сценария -> расчет -> условия -> гео -> объект -> следующий шаг`

Если возникает спор, какую страницу, статью, title или кластер делать дальше, решение проверяем через эту формулу.

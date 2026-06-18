import { useEffect, useMemo, useState } from 'react';
import ComplexCard from '../ui/ComplexCard';
import type { Complex, ComplexStatusCategory } from '../../data/krasnodar-complexes';

const INITIAL_VISIBLE_COUNT = 12;

const FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'ready', label: 'Сданные' },
  { id: 'building', label: 'Строятся' },
] as const;

type CatalogFilter = (typeof FILTERS)[number]['id'];

export type ComplexCatalogProps = {
  complexes: Complex[];
  statusMain?: string;
  statusNote?: string;
  requestTitlePrefix?: string;
  requestSubtitle?: string;
};

export default function ComplexCatalogReact({
  complexes,
  statusMain,
  statusNote,
  requestTitlePrefix = 'Цены, планировки и лучшие условия в ЖК',
  requestSubtitle = 'Отправим подборку квартир, рассчитаем военную ипотеку и расскажем про действующие акции и скидки. Бесплатно для покупателя.',
}: ComplexCatalogProps) {
  const [activeFilter, setActiveFilter] = useState<CatalogFilter>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [activeFilter]);

  const filteredComplexes = useMemo(() => {
    if (activeFilter === 'all') return complexes;
    return complexes.filter((complex) => complex.statusCategory === (activeFilter as ComplexStatusCategory));
  }, [activeFilter, complexes]);

  const visibleComplexes = useMemo(() => {
    if (isExpanded || filteredComplexes.length <= INITIAL_VISIBLE_COUNT) {
      return filteredComplexes;
    }

    return filteredComplexes.slice(0, INITIAL_VISIBLE_COUNT);
  }, [filteredComplexes, isExpanded]);

  const hiddenCount = Math.max(filteredComplexes.length - visibleComplexes.length, 0);
  const activeFilterLabel = FILTERS.find((filter) => filter.id === activeFilter)?.label ?? 'Все';

  const computedStatusNote = (() => {
    if (filteredComplexes.length === 0) {
      return 'Под этот фильтр объекты не найдены.';
    }

    if (hiddenCount > 0) {
      if (activeFilter === 'all') {
        return `Показываем 12 основных ЖК. Ещё ${hiddenCount} объектов раскрываются по кнопке ниже.`;
      }

      return `Найдено ${filteredComplexes.length} ЖК. Сейчас показаны первые ${visibleComplexes.length}, остальные раскрываются по кнопке ниже.`;
    }

    return `Найдено ${filteredComplexes.length} ЖК. Показаны все объекты выбранного фильтра.`;
  })();

  const handleRequest = (id: string, name: string) => {
    if (typeof window === 'undefined') return;

    window.dispatchEvent(
      new CustomEvent('open-modal', {
        detail: {
          title: `${requestTitlePrefix} «${name}»`,
          subtitle: requestSubtitle,
          source: `complex_catalog_${id}`,
        },
      }),
    );
  };

  return (
    <div className="vn-complex-catalog">
      <div className="vn-complex-catalog__filters" role="toolbar" aria-label="Фильтры каталога новостроек">
        {FILTERS.map((filter) => {
          const isActive = filter.id === activeFilter;

          return (
            <button
              key={filter.id}
              type="button"
              className={`vn-complex-catalog__filter ${isActive ? 'is-active' : ''}`}
              aria-pressed={isActive}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="vn-complex-catalog__status" aria-label="Статус подборки">
        {statusMain ? (
          <p className="vn-complex-catalog__status-main">{statusMain}</p>
        ) : (
          <p className="vn-complex-catalog__status-main">
            Каталог Краснодара · {activeFilterLabel}
            <span className="vn-complex-catalog__status-count">{filteredComplexes.length}</span>
          </p>
        )}
        <p className="vn-complex-catalog__status-note">{statusNote ?? computedStatusNote}</p>
      </div>

      <div className="vn-complex-catalog__grid">
        {visibleComplexes.map((complex) => (
          <ComplexCard
            key={complex.id}
            id={complex.id}
            name={complex.name}
            developer={complex.developer}
            district={complex.district}
            address={complex.address}
            class={complex.class}
            deadline={complex.deadline}
            hasReady={complex.hasReady}
            rooms={complex.rooms}
            areaMin={complex.areaMin}
            areaMax={complex.areaMax}
            priceMin={complex.priceMin}
            images={complex.images}
            onRequest={handleRequest}
          />
        ))}
      </div>

      {hiddenCount > 0 ? (
        <div className="vn-complex-catalog__more">
          <button type="button" className="vn-complex-catalog__more-button" onClick={() => setIsExpanded(true)}>
            Показать ещё {hiddenCount} ЖК
          </button>
        </div>
      ) : null}
    </div>
  );
}

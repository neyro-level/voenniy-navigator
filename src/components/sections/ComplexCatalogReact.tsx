import ComplexCard from '../ui/ComplexCard';
import type { Complex } from '../../data/krasnodar-complexes';

export type ComplexCatalogProps = {
  complexes: Complex[];
  statusMain?: string;
  statusNote?: string;
  requestTitlePrefix?: string;
  requestSubtitle?: string;
};

export default function ComplexCatalogReact({
  complexes,
  statusMain = 'Актуальная подборка ЖК Краснодара под военную ипотеку',
  statusNote = 'Показаны все объекты текущей подборки',
  requestTitlePrefix = 'Цены, планировки и лучшие условия в ЖК',
  requestSubtitle = 'Отправим подборку квартир, рассчитаем военную ипотеку и расскажем про действующие акции и скидки. Бесплатно для покупателя.',
}: ComplexCatalogProps) {
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
      <div className="vn-complex-catalog__status" aria-label="Статус подборки">
        <p className="vn-complex-catalog__status-main">{statusMain}</p>
        <p className="vn-complex-catalog__status-note">{statusNote}</p>
      </div>

      <div className="vn-complex-catalog__grid">
        {complexes.map((complex) => (
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
    </div>
  );
}

import ComplexCard from '../ui/ComplexCard';
import type { Complex } from '../../data/krasnodar-complexes';

export type ComplexCatalogProps = {
  complexes: Complex[];
};

export default function ComplexCatalogReact({ complexes }: ComplexCatalogProps) {
  const handleRequest = (id: string, name: string) => {
    if (typeof window === 'undefined') return;

    window.dispatchEvent(
      new CustomEvent('open-modal', {
        detail: {
          title: `Цены, планировки и лучшие условия в ЖК «${name}»`,
          subtitle:
            'Отправим подборку квартир, рассчитаем военную ипотеку и расскажем про действующие акции и скидки. Бесплатно для покупателя.',
          source: `complex_catalog_${id}`,
        },
      }),
    );
  };

  return (
    <div className="vn-complex-catalog">
      <div className="vn-complex-catalog__status" aria-label="Статус подборки">
        <p className="vn-complex-catalog__status-main">
          Актуальная подборка ЖК Краснодара под военную ипотеку
        </p>
        <p className="vn-complex-catalog__status-note">Показаны все объекты текущей подборки</p>
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

import { useEffect, useState } from 'react';
import ComplexCatalogReact from '../../components/sections/ComplexCatalogReact';
import KrymDirectionTabs from './KrymDirectionTabs';
import {
  KRYM_DEFAULT_DIRECTION,
  KRYM_DIRECTION_EVENT,
  krymDirectionGroups,
  type DirectionKey,
} from './krymDirections';

declare global {
  interface Window {
    __vnKrymDirection?: DirectionKey;
  }
}

export default function KrymDirectionsCatalog() {
  const [activeDirection, setActiveDirection] = useState<DirectionKey>(() => {
    if (typeof window === 'undefined') {
      return KRYM_DEFAULT_DIRECTION;
    }

    return window.__vnKrymDirection ?? KRYM_DEFAULT_DIRECTION;
  });

  useEffect(() => {
    const handleDirectionChange = (event: Event) => {
      const detail = (event as CustomEvent<{ direction?: DirectionKey }>).detail;
      setActiveDirection(detail?.direction ?? KRYM_DEFAULT_DIRECTION);
    };

    window.addEventListener(KRYM_DIRECTION_EVENT, handleDirectionChange);
    return () => window.removeEventListener(KRYM_DIRECTION_EVENT, handleDirectionChange);
  }, []);

  const activeGroup =
    krymDirectionGroups.find((direction) => direction.id === activeDirection) ?? krymDirectionGroups[0];

  return (
    <div className="vn-krym-catalog-shell">
      <div className="vn-krym-catalog-shell__switcher">
        <KrymDirectionTabs />
      </div>

      <ComplexCatalogReact
        complexes={activeGroup.complexes}
        statusMain={`Подборка объектов по направлению ${activeGroup.label}`}
        statusNote={`Показаны ${activeGroup.complexes.length} объектов текущей временной подборки`}
        requestTitlePrefix="Разбор вариантов по объекту"
        requestSubtitle="Покажем планировки, обсудим сценарий покупки в Крыму и подскажем следующий шаг по военной ипотеке."
      />
    </div>
  );
}

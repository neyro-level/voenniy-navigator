import { useEffect, useState } from 'react';
import ComplexesMapReact from '../../components/ui/ComplexesMapReact';
import {
  KRYM_DEFAULT_DIRECTION,
  KRYM_DIRECTION_EVENT,
  krymDirectionGroups,
  type DirectionKey,
} from './krymDirections';

type KrymDirectionsMapProps = {
  apiKey?: string;
};

declare global {
  interface Window {
    __vnKrymDirection?: DirectionKey;
  }
}

export default function KrymDirectionsMap({ apiKey = '' }: KrymDirectionsMapProps) {
  const [activeDirectionId, setActiveDirectionId] = useState<DirectionKey>(() => {
    if (typeof window === 'undefined') {
      return KRYM_DEFAULT_DIRECTION;
    }

    return window.__vnKrymDirection ?? KRYM_DEFAULT_DIRECTION;
  });

  useEffect(() => {
    const handleDirectionChange = (event: Event) => {
      const detail = (event as CustomEvent<{ direction?: DirectionKey }>).detail;
      setActiveDirectionId(detail?.direction ?? KRYM_DEFAULT_DIRECTION);
    };

    window.addEventListener(KRYM_DIRECTION_EVENT, handleDirectionChange);
    return () => window.removeEventListener(KRYM_DIRECTION_EVENT, handleDirectionChange);
  }, []);

  const activeDirection =
    krymDirectionGroups.find((direction) => direction.id === activeDirectionId) ?? krymDirectionGroups[0];

  if (!activeDirection) {
    return (
      <div className="vn-complexes-map__fallback">
        <p>Направления для карты Крыма ещё не подготовлены.</p>
      </div>
    );
  }

  return (
    <div className="vn-complexes-map-section__map">
      <div className="vn-complexes-map-section__map-badge">{activeDirection.badge}</div>
      <ComplexesMapReact complexes={activeDirection.mapComplexes} apiKey={apiKey} />
    </div>
  );
}

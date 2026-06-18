import { useEffect, useState } from 'react';
import {
  KRYM_DEFAULT_DIRECTION,
  KRYM_DIRECTION_EVENT,
  krymDirectionGroups,
  type DirectionKey,
} from './krymDirections';

type KrymDirectionTabsProps = {
  variant?: 'map' | 'catalog';
};

declare global {
  interface Window {
    __vnKrymDirection?: DirectionKey;
  }
}

function getInitialDirection(): DirectionKey {
  if (typeof window === 'undefined') {
    return KRYM_DEFAULT_DIRECTION;
  }

  return window.__vnKrymDirection ?? KRYM_DEFAULT_DIRECTION;
}

function broadcastDirection(direction: DirectionKey) {
  if (typeof window === 'undefined') return;

  window.__vnKrymDirection = direction;
  window.dispatchEvent(
    new CustomEvent(KRYM_DIRECTION_EVENT, {
      detail: { direction },
    }),
  );
}

export default function KrymDirectionTabs({ variant = 'catalog' }: KrymDirectionTabsProps) {
  const [activeDirection, setActiveDirection] = useState<DirectionKey>(getInitialDirection);

  useEffect(() => {
    const handleDirectionChange = (event: Event) => {
      const detail = (event as CustomEvent<{ direction?: DirectionKey }>).detail;
      setActiveDirection(detail?.direction ?? KRYM_DEFAULT_DIRECTION);
    };

    window.addEventListener(KRYM_DIRECTION_EVENT, handleDirectionChange);
    return () => window.removeEventListener(KRYM_DIRECTION_EVENT, handleDirectionChange);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.__vnKrymDirection) {
      broadcastDirection(activeDirection);
    }
  }, [activeDirection]);

  const activeGroup =
    krymDirectionGroups.find((direction) => direction.id === activeDirection) ?? krymDirectionGroups[0];

  return (
    <div className={`vn-krym-direction-tabs vn-krym-direction-tabs--${variant}`}>
      <div className="vn-krym-direction-tabs__list" role="tablist" aria-label="Направления Крыма">
        {krymDirectionGroups.map((direction) => {
          const isActive = direction.id === activeGroup.id;

          return (
            <button
              key={direction.id}
              type="button"
              className={`vn-krym-direction-tabs__tab${isActive ? ' is-active' : ''}`}
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActiveDirection(direction.id);
                broadcastDirection(direction.id);
              }}
            >
              <span className="vn-krym-direction-tabs__tab-label">{direction.label}</span>
              <span className="vn-krym-direction-tabs__tab-count">{direction.complexes.length}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

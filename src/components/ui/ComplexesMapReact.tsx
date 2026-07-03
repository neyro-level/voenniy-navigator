import { useEffect, useMemo, useRef, useState } from 'react';

export type MapComplex = {
  id: string;
  name: string;
  district: string;
  address: string;
  deadline: string;
  priceMin: number;
  coordinates: [number, number];
};

type ComplexesMapReactProps = {
  apiKey?: string;
  complexes: MapComplex[];
};

type PreparedMapComplex = MapComplex & {
  displayName: string;
};

type StaticMarker = {
  complex: PreparedMapComplex;
  index: number;
  left: number;
  top: number;
};

type YMapInstance = {
  destroy?: () => void;
  geoObjects?: {
    add: (child: unknown) => void;
  };
  setBounds?: (bounds: unknown, options?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    ymaps?: any;
    __vnYmapsPromise?: Promise<any>;
  }
}

const STATIC_MAP_SIZE = {
  width: 650,
  height: 450,
} as const;

function formatComplexName(name: string) {
  return name
    .replace(/^(?:ЖК|Квартал|Клубный квартал)\s+/u, '')
    .replace(/[«»]/gu, '')
    .trim();
}

function formatPrice(value: number) {
  const millions = value / 1_000_000;
  const formatted = millions % 1 === 0 ? String(millions) : millions.toFixed(1).replace('.', ',');
  return `от ${formatted} млн ₽`;
}

function toLatLon([lon, lat]: [number, number]): [number, number] {
  return [lat, lon];
}

function getMapCenter(complexes: MapComplex[]): [number, number] {
  const longitudes = complexes.map((complex) => complex.coordinates[0]);
  const latitudes = complexes.map((complex) => complex.coordinates[1]);

  const lon = (Math.min(...longitudes) + Math.max(...longitudes)) / 2;
  const lat = (Math.min(...latitudes) + Math.max(...latitudes)) / 2;

  return [lon, lat];
}

function getStaticZoom(complexes: MapComplex[]) {
  if (complexes.length <= 1) {
    return 13;
  }

  const longitudes = complexes.map((complex) => complex.coordinates[0]);
  const latitudes = complexes.map((complex) => complex.coordinates[1]);
  const center = getMapCenter(complexes);
  const latFactor = Math.cos((center[1] * Math.PI) / 180);
  const lonSpan = (Math.max(...longitudes) - Math.min(...longitudes)) * Math.max(latFactor, 0.45);
  const latSpan = Math.max(...latitudes) - Math.min(...latitudes);
  const maxSpan = Math.max(lonSpan, latSpan);

  if (maxSpan <= 0.025) return 13;
  if (maxSpan <= 0.05) return 12;
  if (maxSpan <= 0.11) return 11;
  if (maxSpan <= 0.22) return 10;
  if (maxSpan <= 0.45) return 9;
  if (maxSpan <= 0.9) return 8;
  return 7;
}

function buildStaticMapUrl(complexes: MapComplex[]) {
  if (!complexes.length) {
    return '';
  }

  const [lon, lat] = getMapCenter(complexes);
  const zoom = getStaticZoom(complexes);
  const params = new URLSearchParams({
    lang: 'ru_RU',
    ll: `${lon},${lat}`,
    z: String(zoom),
    l: 'map',
    size: `${STATIC_MAP_SIZE.width},${STATIC_MAP_SIZE.height}`,
  });

  return `https://static-maps.yandex.ru/1.x/?${params.toString()}`;
}

function toMercatorY(latitude: number) {
  const clamped = Math.max(-85, Math.min(85, latitude));
  const radians = (clamped * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + radians / 2));
}

function buildStaticMarkers(complexes: PreparedMapComplex[]): StaticMarker[] {
  if (!complexes.length) {
    return [];
  }

  if (complexes.length === 1) {
    return [
      {
        complex: complexes[0],
        index: 0,
        left: 50,
        top: 50,
      },
    ];
  }

  const longitudes = complexes.map((complex) => complex.coordinates[0]);
  const mercatorLatitudes = complexes.map((complex) => toMercatorY(complex.coordinates[1]));

  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);
  const minLat = Math.min(...mercatorLatitudes);
  const maxLat = Math.max(...mercatorLatitudes);
  const lonRange = maxLon - minLon || 0.08;
  const latRange = maxLat - minLat || 0.08;
  const paddingX = 0.12;
  const paddingY = 0.16;

  return complexes.map((complex, index) => {
    const normalizedX = (complex.coordinates[0] - minLon) / lonRange;
    const normalizedY = 1 - (toMercatorY(complex.coordinates[1]) - minLat) / latRange;

    return {
      complex,
      index,
      left: (paddingX + normalizedX * (1 - paddingX * 2)) * 100,
      top: (paddingY + normalizedY * (1 - paddingY * 2)) * 100,
    };
  });
}

function scrollToComplexCard(id: string) {
  const target = document.getElementById(`complex-card-${id}`);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function loadYandexMaps(apiKey: string) {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is not available'));
  }

  if (window.ymaps?.Map) {
    return Promise.resolve(window.ymaps);
  }

  if (window.__vnYmapsPromise) {
    return window.__vnYmapsPromise;
  }

  window.__vnYmapsPromise = new Promise((resolve, reject) => {
    let settled = false;
    const timeoutId = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      window.__vnYmapsPromise = undefined;
      reject(new Error('Yandex Maps API initialization timed out'));
    }, 5000);

    const settle = (callback: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      callback();
    };

    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;
    script.async = true;
    script.onload = () => {
      if (!window.ymaps?.ready) {
        settle(() => {
          window.__vnYmapsPromise = undefined;
          reject(new Error('Не удалось инициализировать Yandex Maps API'));
        });
        return;
      }

      window.ymaps.ready(() =>
        settle(() => {
          resolve(window.ymaps);
        }),
      );
    };
    script.onerror = () =>
      settle(() => {
        window.__vnYmapsPromise = undefined;
        reject(new Error('Не удалось загрузить Yandex Maps API'));
      });
    document.head.appendChild(script);
  });

  return window.__vnYmapsPromise;
}

function StaticComplexesMap({
  complexes,
  notice,
}: {
  complexes: PreparedMapComplex[];
  notice?: string;
}) {
  const staticMapUrl = useMemo(() => buildStaticMapUrl(complexes), [complexes]);
  const staticMarkers = useMemo(() => buildStaticMarkers(complexes), [complexes]);

  if (!complexes.length) {
    return (
      <div className="vn-complexes-map__fallback">
        <p>Для этого раздела пока не подготовлены объекты на карте.</p>
      </div>
    );
  }

  return (
    <div className="vn-complexes-map__frame vn-complexes-map__frame--static">
      <img
        src={staticMapUrl}
        alt="Карта объектов по военной ипотеке"
        className="vn-complexes-map__static-media"
        loading="lazy"
      />

      <div className="vn-complexes-map__static-overlay">
        {staticMarkers.map(({ complex, index, left, top }) => (
          <button
            key={complex.id}
            type="button"
            className="vn-complexes-map__static-marker"
            style={{ left: `${left}%`, top: `${top}%` }}
            title={`${complex.displayName} — ${formatPrice(complex.priceMin)}`}
            onClick={() => scrollToComplexCard(complex.id)}
          >
            <span>{index + 1}</span>
          </button>
        ))}
      </div>

      {notice ? <div className="vn-complexes-map__notice">{notice}</div> : null}
    </div>
  );
}

export default function ComplexesMapReact({ apiKey = '', complexes }: ComplexesMapReactProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<YMapInstance | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback' | 'missing_key'>(
    apiKey ? 'loading' : 'missing_key',
  );

  const preparedComplexes = useMemo(
    () =>
      complexes.map((complex) => ({
        ...complex,
        displayName: formatComplexName(complex.name),
      })),
    [complexes],
  );

  useEffect(() => {
    if (!apiKey) {
      setStatus('missing_key');
      return;
    }

    if (!mapRef.current) return;

    let destroyed = false;
    let markerDisposers: Array<() => void> = [];
    setStatus('loading');

    const initMap = async () => {
      try {
        const ymaps = await loadYandexMaps(apiKey);
        if (destroyed || !mapRef.current) return;

        const center = toLatLon(getMapCenter(preparedComplexes));
        const markerLayout = ymaps.templateLayoutFactory.createClass(
          '<div class="vn-complexes-map__marker"><span>$[properties.index]</span></div>',
        );
        const markerCollection = new ymaps.GeoObjectCollection();

        const map = new ymaps.Map(mapRef.current, {
          center,
          zoom: 10.5,
          controls: ['zoomControl'],
        });

        preparedComplexes.forEach((complex, index) => {
          const clickHandler = () => scrollToComplexCard(complex.id);

          const marker = new ymaps.Placemark(
            toLatLon(complex.coordinates),
            {
              index: index + 1,
              hintContent: `${complex.displayName} — ${formatPrice(complex.priceMin)}`,
              balloonContentHeader: complex.displayName,
              balloonContentBody: `${complex.district}<br />${complex.address}<br />${formatPrice(complex.priceMin)}`,
            },
            {
              iconLayout: markerLayout,
              iconOffset: [-17, -34],
              iconShape: {
                type: 'Circle',
                coordinates: [0, -17],
                radius: 17,
              },
            },
          );

          marker.events.add('click', clickHandler);
          markerDisposers.push(() => marker.events.remove('click', clickHandler));

          markerCollection.add(marker);
        });

        map.geoObjects?.add(markerCollection);

        const bounds = markerCollection.getBounds?.();
        if (bounds && map.setBounds) {
          map.setBounds(bounds, {
            checkZoomRange: true,
            zoomMargin: [56, 56, 56, 56],
          });
        }

        mapInstanceRef.current = map;
        setStatus('ready');
      } catch (error) {
        console.error(error);
        if (!destroyed) {
          setStatus('fallback');
        }
      }
    };

    initMap();

    return () => {
      destroyed = true;
      markerDisposers.forEach((dispose) => dispose());
      markerDisposers = [];
      mapInstanceRef.current?.destroy?.();
      mapInstanceRef.current = null;
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [apiKey, preparedComplexes]);

  if (status !== 'ready') {
    const notice =
      status === 'fallback'
        ? 'Интерактивная карта временно недоступна. Все объекты и переходы к карточкам продолжают работать.'
        : status === 'missing_key'
          ? 'Карта работает в надежном статичном режиме, пока API-ключ Яндекс Карт не обновлен.'
          : undefined;

    return <StaticComplexesMap complexes={preparedComplexes} notice={notice} />;
  }

  return (
    <div className="vn-complexes-map__frame">
      <div ref={mapRef} className="vn-complexes-map__canvas" />
    </div>
  );
}

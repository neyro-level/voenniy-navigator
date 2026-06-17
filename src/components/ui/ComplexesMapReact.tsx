import { useEffect, useMemo, useRef, useState } from 'react';

type MapComplex = {
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

function formatComplexName(name: string) {
  return name.replace(/^(?:ЖК|Квартал|Клубный квартал)\s+/u, '').replace(/[«»]/gu, '').trim();
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
    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;
    script.async = true;
    script.onload = () => {
      if (!window.ymaps?.ready) {
        reject(new Error('Не удалось инициализировать Yandex Maps API'));
        return;
      }

      window.ymaps.ready(() => resolve(window.ymaps));
    };
    script.onerror = () => reject(new Error('Не удалось загрузить Yandex Maps API'));
    document.head.appendChild(script);
  });

  return window.__vnYmapsPromise;
}

export default function ComplexesMapReact({ apiKey = '', complexes }: ComplexesMapReactProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<YMapInstance | null>(null);
  const [status, setStatus] = useState<'idle' | 'ready' | 'error' | 'missing_key'>(
    apiKey ? 'idle' : 'missing_key',
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

    const initMap = async () => {
      try {
        const ymaps = await loadYandexMaps(apiKey);
        if (destroyed || !mapRef.current) return;

        const center = toLatLon(getMapCenter(preparedComplexes));
        const markerLayout = ymaps.templateLayoutFactory.createClass(
          '<div class="vn-complexes-map__marker"><span>$[properties.index]</span></div>',
        );
        const markerCollection = new ymaps.GeoObjectCollection();

        const map = new ymaps.Map(
          mapRef.current,
          {
            center,
            zoom: 10.5,
            controls: ['zoomControl'],
          },
        );

        preparedComplexes.forEach((complex, index) => {
          const clickHandler = () => {
            const target = document.getElementById(`complex-card-${complex.id}`);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          };

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
          setStatus('error');
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

  if (status === 'missing_key') {
    return (
      <div className="vn-complexes-map__fallback">
        <p>Ключ Яндекс.Карт ещё не подключён к окружению сайта.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="vn-complexes-map__fallback">
        <p>Карта временно недоступна. Карточки жилых комплексов ниже работают в обычном режиме.</p>
      </div>
    );
  }

  return (
    <div className="vn-complexes-map__frame">
      <div ref={mapRef} className="vn-complexes-map__canvas" />
    </div>
  );
}

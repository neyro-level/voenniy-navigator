import { useState } from 'react';
import { Building2, Calendar, Home, MapPin, Maximize } from 'lucide-react';
import type { Complex } from '../../data/krasnodar-complexes';

const ROOM_LABELS: Record<string, string> = {
  studio: 'студии',
  '1': '1-к',
  '2': '2-к',
  '3': '3-к',
  '4': '4-к',
};

function formatRooms(rooms: Complex['rooms']) {
  const labels = rooms.map((room) => ROOM_LABELS[room] ?? room);
  if (labels.length <= 2) return labels.join(' и ');
  return `${labels[0]} – ${labels[labels.length - 1]}`;
}

function formatPrice(value: number) {
  const millions = value / 1_000_000;
  const formatted = millions % 1 === 0 ? String(millions) : millions.toFixed(1).replace('.', ',');
  return `от ${formatted} млн ₽`;
}

function formatComplexName(name: string) {
  return name.replace(/^(?:ЖК|Квартал|Клубный квартал)\s+/u, '').replace(/[«»]/gu, '').trim();
}

function getFallbackBackground(index: number) {
  const tones = ['#F1F3F5', '#EAEDF1', '#E4E8EC'];
  return tones[index % tones.length];
}

export type ComplexCardProps = Pick<
  Complex,
  | 'id'
  | 'name'
  | 'developer'
  | 'district'
  | 'address'
  | 'class'
  | 'deadline'
  | 'hasReady'
  | 'rooms'
  | 'areaMin'
  | 'areaMax'
  | 'priceMin'
  | 'images'
> & {
  onRequest: (id: string, name: string) => void;
};

export default function ComplexCard({
  id,
  name,
  developer,
  district,
  address,
  deadline,
  hasReady,
  rooms,
  areaMin,
  areaMax,
  priceMin,
  images,
  onRequest,
}: ComplexCardProps) {
  const [hoverZone, setHoverZone] = useState<'image' | 'body' | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTouchExpanded, setIsTouchExpanded] = useState(false);

  const slides = [images[0] ?? null, images[1] ?? null, images[2] ?? null];
  const statusBadge = hasReady ? 'Есть сданные' : 'Новый этап';
  const displayName = formatComplexName(name);
  const isInfoActive = hoverZone === 'body' || isTouchExpanded;

  const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: none), (pointer: coarse)').matches;

  const setMouseZone = (zone: 'image' | 'body') => {
    if (isTouchDevice()) return;
    setHoverZone(zone);
    setIsTouchExpanded(false);
  };

  const handleVisualMove = (event: React.MouseEvent<HTMLDivElement>) => {
    setMouseZone('image');

    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = event.clientX - bounds.left;
    const zoneWidth = bounds.width / slides.length;
    const nextIndex = Math.max(0, Math.min(slides.length - 1, Math.floor(relativeX / zoneWidth)));
    setActiveIndex(nextIndex);
  };

  const handleVisualAction = () => {
    if (!isTouchDevice()) return;
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handleBodyAction = () => {
    if (isTouchDevice()) {
      setIsTouchExpanded((prev) => !prev);
    }
  };

  return (
    <article
      id={`complex-card-${id}`}
      data-complex-card-id={id}
      className={`vn-complex-card ${isInfoActive ? 'is-info-active' : ''}`}
      onMouseLeave={() => {
        setHoverZone(null);
        setActiveIndex(0);
      }}
    >
      <div
        className="vn-complex-card__visual"
        onMouseOver={() => setMouseZone('image')}
        onMouseMove={handleVisualMove}
        onClick={handleVisualAction}
      >
        <div className="vn-complex-card__slides">
          {slides.map((src, index) => (
            <div
              key={index}
              className={`vn-complex-card__slide ${index === activeIndex ? 'is-active' : ''}`}
              style={{
                backgroundImage: src ? undefined : 'none',
                backgroundColor: src ? undefined : getFallbackBackground(index),
              }}
            >
              {src ? (
                <img src={src} alt={`${displayName} — фото ${index + 1}`} loading="lazy" />
              ) : (
                <div className="vn-complex-card__slide-fallback">
                  <Building2 size={40} strokeWidth={1.2} aria-hidden="true" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="vn-complex-card__badges" aria-hidden="true">
          <span>{statusBadge}</span>
        </div>

        <div className="vn-complex-card__dots" aria-hidden="true">
          {slides.map((_, index) => (
            <span key={index} className={index === activeIndex ? 'is-active' : ''} />
          ))}
        </div>
      </div>

      <div
        className="vn-complex-card__body"
        onMouseOver={() => setMouseZone('body')}
        onMouseMove={() => setMouseZone('body')}
        onClick={handleBodyAction}
      >
        <div className="vn-complex-card__primary">
          <div className="vn-complex-card__main-line">
            <h3 className="vn-complex-card__title">{displayName}</h3>
            <p className="vn-complex-card__price">{formatPrice(priceMin)}</p>
          </div>
          <p className="vn-complex-card__address">{address}</p>
          <div className="vn-complex-card__divider" aria-hidden="true" />
        </div>

        <div className="vn-complex-card__details">
          <p className="vn-complex-card__meta">
            <MapPin size={14} strokeWidth={1.6} aria-hidden="true" />
            {district} · {developer}
          </p>
          <ul className="vn-complex-card__features">
            <li>
              <Home size={16} strokeWidth={1.6} aria-hidden="true" />
              {formatRooms(rooms)}
            </li>
            <li>
              <Maximize size={16} strokeWidth={1.6} aria-hidden="true" />
              {areaMin}–{areaMax} м²
            </li>
            <li>
              <Calendar size={16} strokeWidth={1.6} aria-hidden="true" />
              Срок сдачи: {deadline}
            </li>
          </ul>
          <div className="vn-complex-card__footer">
            <span className="vn-complex-card__footer-note">Актуальные планировки и цены</span>
          </div>
        </div>

        <button
          type="button"
          className="vn-complex-card__quick-cta"
          onClick={(event) => {
            event.stopPropagation();
            onRequest(id, displayName);
          }}
          aria-label={`Подробнее о жилом комплексе ${displayName}`}
        >
          Подробнее
        </button>
      </div>
    </article>
  );
}

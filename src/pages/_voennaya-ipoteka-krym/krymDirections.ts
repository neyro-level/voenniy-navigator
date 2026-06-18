import { krymComplexGroups } from '../../data/krym-complex-groups';
import type { Complex } from '../../data/krasnodar-complexes';
import type { MapComplex } from '../../components/ui/ComplexesMapReact';

export type DirectionKey = 'simferopol' | 'sevastopol' | 'coast';

export type KrymDirectionGroup = {
  id: DirectionKey;
  label: string;
  badge: string;
  complexes: Complex[];
  mapComplexes: MapComplex[];
};

export const KRYM_DIRECTION_EVENT = 'vn:krym-direction-change';
export const KRYM_DEFAULT_DIRECTION: DirectionKey = 'simferopol';

const createMapComplex = (complex: Complex): MapComplex => ({
  id: complex.id,
  name: complex.name,
  district: complex.district,
  address: complex.address,
  deadline: complex.deadline,
  priceMin: complex.priceMin,
  coordinates: complex.coordinates,
});

const directionComplexSets = krymComplexGroups satisfies Record<DirectionKey, Complex[]>;

export const krymDirectionGroups: KrymDirectionGroup[] = [
  {
    id: 'simferopol',
    label: 'Симферополь',
    badge: 'Симферополь',
    complexes: directionComplexSets.simferopol,
    mapComplexes: directionComplexSets.simferopol.map(createMapComplex),
  },
  {
    id: 'sevastopol',
    label: 'Севастополь',
    badge: 'Севастополь',
    complexes: directionComplexSets.sevastopol,
    mapComplexes: directionComplexSets.sevastopol.map(createMapComplex),
  },
  {
    id: 'coast',
    label: 'Побережье',
    badge: 'Побережье',
    complexes: directionComplexSets.coast,
    mapComplexes: directionComplexSets.coast.map(createMapComplex),
  },
];

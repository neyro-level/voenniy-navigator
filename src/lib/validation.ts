/**
 * AMS Validation Schemas.
 *
 * Used for:
 *   - API request/response validation
 *   - Form submissions (leads, filters)
 *   - External feed parsing (YRL, CRM JSON)
 *
 * NOTE: Install `zod` (`pnpm add zod`) to enable runtime validation.
 * Currently exported as TypeScript interfaces only.
 */

// ---------------------------------------------------------------------------
// Lead form types (AMS Leads API)
// ---------------------------------------------------------------------------

export interface LeadFormInput {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source?: string;
  page_url?: string;
  website?: '';
}

// ---------------------------------------------------------------------------
// Catalog filter types
// ---------------------------------------------------------------------------

export interface FilterOptionsInput {
  minPrice?: number;
  maxPrice?: number;
  rooms?: Array<number | 'studio'>;
  minArea?: number;
  maxArea?: number;
  districts?: string[];
}

// ---------------------------------------------------------------------------
// Property / YRL feed types
// ---------------------------------------------------------------------------

export interface PropertyPhotoInput {
  id: string;
  url: string;
  alt: string;
  is_main: boolean;
  sort_order: number;
}

export interface PropertyInput {
  id: string;
  external_id?: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  price_currency: '₽' | 'RUB' | 'RUR';
  area_total: number;
  area_living?: number;
  area_kitchen?: number;
  rooms: number | 'studio';
  floor: number;
  total_floors: number;
  address: string;
  district: string;
  city?: string;
  year: number;
  type: 'квартира' | 'апартаменты' | 'пентхаус' | 'студия';
  transaction_type: 'продажа' | 'аренда';
  status: 'active' | 'sold' | 'reserved';
  building_type?: string;
  complex_id?: string;
  photos: PropertyPhotoInput[];
  agent_name?: string;
  agent_phone?: string;
  agent_org?: string;
  agent_email?: string;
  created_at?: string;
  updated_at?: string;
}

// ---------------------------------------------------------------------------
// Paginated response helper type
// ---------------------------------------------------------------------------

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  lastPage: number;
  total: number;
}

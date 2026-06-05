/**
 * SEO / Schema.org layer
 *
 * LEGACY: раньше здесь были жёстко зашитые schema-объекты.
 * Теперь все Schema.org фабрики живут в `src/lib/geo/schema.ts`.
 * Этот файл реэкспортирует их для обратной совместимости.
 */

export {
  organizationSchema,
  webSiteSchema,
  personSchema,
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
  localBusinessSchema,
} from './geo/schema';

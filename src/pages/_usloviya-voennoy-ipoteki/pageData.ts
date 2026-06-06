import { SITE } from "../../lib/constants";
import { OG_IMAGES } from "../../lib/og";
import { organizationSchema, breadcrumbSchema } from "../../lib/seo";

export const pageMeta = {
  title: "Условия военной ипотеки 2026: ставки, банки, документы",
  description:
    "Условия военной ипотеки в 2026 году: кто может получить, процентная ставка, сроки, документы, банки и ограничения. Разбор от специалиста по военной ипотеке.",
  canonical: `${SITE.url}/usloviya-voennoy-ipoteki/`,
  ogImage: OG_IMAGES.usloviya,
};

export const schemas = [
  organizationSchema(),
  breadcrumbSchema([
    { name: "Главная", url: `${SITE.url}/` },
    {
      name: "Условия военной ипотеки",
      url: `${SITE.url}/usloviya-voennoy-ipoteki/`,
    },
  ]),
];

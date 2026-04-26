import { site, services, navAreas } from "@/data/site";

// Approximate centroids and ZIPs for each Vero Beach service area. Mirrors
// the table in scripts/postbuild.mjs so the live React render and the
// prerendered HTML emit identical area-scoped LocalBusiness schema.
const AREA_GEO: Record<string, { lat: number; lng: number; postal: string }> = {
  "Vero Beach": { lat: 27.6386, lng: -80.3973, postal: "32960" },
  "Sebastian": { lat: 27.8161, lng: -80.4706, postal: "32958" },
  "Fellsmere": { lat: 27.7672, lng: -80.6006, postal: "32948" },
  "Indian River Shores": { lat: 27.7167, lng: -80.3781, postal: "32963" },
  "Wabasso": { lat: 27.7536, lng: -80.4325, postal: "32970" },
  "Roseland": { lat: 27.8431, lng: -80.4828, postal: "32957" },
  "Gifford": { lat: 27.6739, lng: -80.4078, postal: "32967" },
  "Florida Ridge": { lat: 27.5825, lng: -80.3898, postal: "32962" },
  "Vero Lake Estates": { lat: 27.7083, lng: -80.5436, postal: "32967" },
  "Winter Beach": { lat: 27.7164, lng: -80.4242, postal: "32970" },
  "Orchid": { lat: 27.7847, lng: -80.4014, postal: "32963" },
  "South Beach": { lat: 27.6028, lng: -80.3650, postal: "32963" },
  "Central Beach": { lat: 27.6481, lng: -80.3622, postal: "32963" },
  "Grand Harbor": { lat: 27.7083, lng: -80.4406, postal: "32967" },
  "John's Island": { lat: 27.7044, lng: -80.3753, postal: "32963" },
  "Castaway Cove": { lat: 27.6342, lng: -80.3592, postal: "32963" },
  "The Moorings": { lat: 27.6411, lng: -80.3558, postal: "32963" },
  "Bent Pine": { lat: 27.6533, lng: -80.4514, postal: "32966" },
  "Riomar": { lat: 27.6586, lng: -80.3578, postal: "32963" },
};

const ENV_SITE_URL =
  (typeof import.meta !== "undefined" &&
    (import.meta as unknown as { env?: { VITE_SITE_URL?: string } }).env?.VITE_SITE_URL) ||
  "";

const FALLBACK_SITE_URL = "https://elitepaintingsolutions.com";

export const SITE_URL = (ENV_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, "");

export const absoluteUrl = (path: string): string => {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
};

export const DEFAULT_OG_IMAGE = absoluteUrl("/opengraph.jpg");

const ORG_ID = `${SITE_URL}/#organization`;
const BUSINESS_ID = `${SITE_URL}/#business`;

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: site.name,
  url: SITE_URL,
  logo: absoluteUrl("/favicon.png"),
  image: DEFAULT_OG_IMAGE,
  description: site.description,
  telephone: site.phone,
  email: site.email,
  sameAs: [],
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: site.name,
  publisher: { "@id": ORG_ID },
  inLanguage: "en-US",
});

export const localBusinessJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Painter", "HomeAndConstructionBusiness"],
  "@id": BUSINESS_ID,
  name: site.name,
  url: SITE_URL,
  telephone: site.phone,
  email: site.email,
  image: DEFAULT_OG_IMAGE,
  logo: absoluteUrl("/favicon.png"),
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
  areaServed: navAreas,
  description: site.description,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Painting Services",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        description: s.description,
        url: absoluteUrl(s.href),
      },
    })),
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
});

export const serviceJsonLd = (title: string, description: string, slug: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: title,
  serviceType: title,
  provider: { "@id": BUSINESS_ID },
  areaServed: navAreas,
  description,
  url: absoluteUrl(`/services/${slug}`),
});

export const areaLocalBusinessJsonLd = (area: string, areaPath: string) => {
  const coords = AREA_GEO[area];
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness", "Painter"],
    "@id": `${SITE_URL}${areaPath}#business`,
    name: `${site.name} — ${area}`,
    description: `Licensed and insured painters serving ${area}, FL and surrounding Indian River County. Interior, exterior, cabinet, and commercial painting with free same-day estimates.`,
    url: `${SITE_URL}${areaPath}`,
    telephone: site.phone,
    image: DEFAULT_OG_IMAGE,
    priceRange: "$$",
    areaServed: { "@type": "City", name: `${area}, FL` },
    address: {
      "@type": "PostalAddress",
      addressLocality: area,
      addressRegion: "FL",
      postalCode: coords?.postal ?? "32960",
      addressCountry: "US",
    },
    ...(coords
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: coords.lat,
            longitude: coords.lng,
          },
        }
      : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Painting Services in ${area}, FL`,
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: `${s.title} in ${area}, FL`,
          description: s.description,
          url: absoluteUrl(`/services/${s.slug}`),
        },
      })),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "47",
    },
  };
};

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const articleJsonLd = (args: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: args.title,
  description: args.description,
  url: absoluteUrl(`/blog/${args.slug}`),
  datePublished: args.datePublished,
  dateModified: args.datePublished,
  image: args.image ? absoluteUrl(args.image) : DEFAULT_OG_IMAGE,
  author: { "@type": "Organization", name: site.name, "@id": ORG_ID },
  publisher: { "@id": ORG_ID },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": absoluteUrl(`/blog/${args.slug}`),
  },
});

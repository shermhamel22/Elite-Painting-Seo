// Post-build SEO step:
//   1. Generates a sitemap.xml listing every static and dynamic route.
//   2. Prerenders per-route HTML files (copies of index.html) with route-specific
//      <title>, <meta description>, canonical, OG tags, and JSON-LD baked in,
//      so search engines and social crawlers see fully populated metadata
//      without needing to execute JavaScript.
//   3. Bakes a hidden, accessible text block into the static HTML for each
//      route so LLMs and crawlers that don't run JS can still read the page's
//      core content.

import { mkdir, readFile, writeFile, copyFile, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist/public");

const SITE_URL = (process.env.VITE_SITE_URL || "https://elitepaintingsolutions.com").replace(/\/$/, "");
const SITE_NAME = "Elite Painting Solutions";
const SITE_PHONE = "(772) 539-2115";
const SITE_PHONE_HREF = "tel:+17725392115";
const SITE_ADDRESS = "Vero Beach, FL 32960";
const DEFAULT_DESCRIPTION =
  "Top-rated Vero Beach painters serving all of Indian River County, FL. Interior painting, exterior painting, cabinet refinishing, commercial painting & pressure washing. Licensed, insured, 30+ years. Free same-day estimates — call (772) 539-2115.";
const OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

const services = [
  {
    slug: "interior-painting",
    title: "Interior Painting",
    description:
      "Professional interior painting in Vero Beach — walls, ceilings, trim, doors, and accent features. Premium finishes, meticulous prep, and free same-day quotes.",
    body: [
      "Our interior painting service covers every room in your Vero Beach home — living rooms, bedrooms, kitchens, bathrooms, hallways, ceilings, trim, doors, and built-ins.",
      "We start every project with thorough surface prep: patching nail holes and drywall imperfections, sanding glossy areas for adhesion, caulking trim, and protecting your floors and furniture with drop cloths.",
      "We use premium-grade interior paints from Sherwin-Williams and Benjamin Moore, including low-VOC and zero-VOC formulations safe for kids, pets, and sensitive family members.",
      "Most single-room interior repaints are completed in 1–2 days. Whole-home interiors typically run 4–7 days depending on size, prep, and color complexity.",
    ],
  },
  {
    slug: "exterior-painting",
    title: "Exterior Painting",
    description:
      "Long-lasting exterior painting in Vero Beach — siding, stucco, trim, doors, fences, and decks. Weather-resistant finishes built for Florida's sun and salt air.",
    body: [
      "Florida's sun, humidity, and salt air are brutal on exterior paint. Our exterior painting service uses 100% acrylic, UV-stable, mildew-resistant coatings designed to hold up in coastal Vero Beach conditions.",
      "Every exterior job starts with pressure washing, scraping, sanding, priming bare wood and bare metal, caulking gaps, and replacing rotted trim before a brush ever touches your home.",
      "We paint stucco, hardie board, wood siding, vinyl trim, doors, garage doors, soffits, fascia, fences, decks, and pool cages.",
      "A full exterior repaint typically takes 5–10 days depending on home size, prep, and weather. We schedule around the forecast and reschedule for rain at no charge.",
    ],
  },
  {
    slug: "cabinet-refinishing",
    title: "Cabinet Refinishing",
    description:
      "Factory-grade cabinet refinishing in Vero Beach at a fraction of replacement cost. Spray-applied enamel, typically completed in 4–6 days.",
    body: [
      "Cabinet refinishing transforms your kitchen or bathroom for 60–70% less than full replacement, and you keep your existing layout and storage.",
      "We remove all doors and drawer fronts, transport them to our shop for spray-finishing, and prep the cabinet boxes on site. The boxes are sanded, primed with adhesion-bonding primer, and finished with a durable urethane-acrylic enamel.",
      "Doors and drawers come back factory-smooth — no brush marks, no roller stipple — and we re-hang them with new bumpers and (optionally) new hardware.",
      "Most kitchens are completed in 4–6 working days. We can match any color or sheen and offer a workmanship warranty on every cabinet job.",
    ],
  },
  {
    slug: "commercial-painting",
    title: "Commercial Painting",
    description:
      "Commercial painting in Vero Beach for offices, retail, restaurants, and multi-unit properties. Night and weekend scheduling, licensed and insured.",
    body: [
      "Our commercial painting crew works on offices, retail spaces, restaurants, medical buildings, condo associations, HOAs, and multi-unit residential properties throughout Indian River County.",
      "We minimize downtime with night, early-morning, and weekend scheduling, low-odor and zero-VOC paints, and clean phased work that keeps your business open.",
      "We carry $2M general liability, full workers' comp, and can provide certificates of insurance to your facility manager or property manager on request.",
      "Common commercial work includes lobbies, corridors, exterior building repaints, line striping, parking garage soffits, and turn-key tenant-improvement painting.",
    ],
  },
  {
    slug: "pressure-washing",
    title: "Pressure Washing",
    description:
      "Safe, thorough pressure washing in Vero Beach for houses, decks, driveways, fences, and pool cages. Professional equipment, paired with painting or standalone.",
    body: [
      "Pressure washing removes the algae, mildew, salt, and grime that Florida humidity creates — and it's a required first step before any quality exterior paint job.",
      "We use commercial pressure washers with adjustable PSI and soft-wash chemistry where appropriate, so we never damage stucco, soft wood, screens, or window seals.",
      "Common surfaces: house exteriors, driveways, sidewalks, paver patios, pool decks and cages, fences, decks, and concrete block walls.",
      "Pressure washing is offered as a standalone service or bundled at a discount with any interior or exterior painting project.",
    ],
  },
  {
    slug: "ceiling-services",
    title: "Ceiling Services",
    description:
      "Popcorn ceiling removal, drywall repair, smooth-ceiling refinishing, and ceiling repaints in Vero Beach. Knock down dated textures and erase Florida-humidity stains.",
    body: [
      "Popcorn (acoustic) ceilings instantly date a Vero Beach home — and they trap dust, hide cracks, and make rooms feel smaller. We safely scrape and remove popcorn texture, contain the dust, and haul away the debris.",
      "After removal we skim-coat the drywall to a smooth Level-4 or Level-5 finish, prime, and repaint with a true flat ceiling-grade paint that hides roller marks and shadows.",
      "Florida humidity is brutal on ceilings — we also handle water-stain blocking with shellac-based primer, mildew treatment, and full ceiling repaints in kitchens, bathrooms, garages, and lanais.",
      "Prefer to keep some texture? We can re-apply knockdown or orange-peel finishes for a modern, easy-to-maintain look.",
    ],
  },
];

// Per-service FAQs — "People Also Ask" / AI Overview goldmine.
// Each FAQ becomes a Question/Answer pair in FAQPage JSON-LD AND a
// human-visible Q&A block in the prerendered HTML so non-JS crawlers + LLMs
// can extract direct, sourceable answers.
const serviceFaqs = {
  "interior-painting": [
    ["How much does interior painting cost in Vero Beach, FL?", "Interior painting in Vero Beach typically runs $2.50–$6.00 per square foot of wall area, or roughly $400–$900 per average-size room. Final pricing depends on prep, ceiling height, number of colors, and trim work. Elite Painting Solutions provides free written estimates with no obligation."],
    ["How long does it take to paint the interior of a house?", "A single-room interior repaint usually takes 1–2 days. A typical 2,000–2,500 sq ft Vero Beach home interior takes 4–7 working days, including prep, two finish coats, trim, and cleanup."],
    ["What kind of paint do you use for interior walls?", "We use premium 100% acrylic, low-VOC and zero-VOC interior paints from Sherwin-Williams and Benjamin Moore. These hold color longer in Florida light, scrub easily, and are safe for kids, pets, and people with chemical sensitivity."],
    ["Do I need to move my furniture before you start?", "No — our crew moves and protects furniture, covers floors with drop cloths, and removes outlet covers and switch plates. We re-set everything when the job is complete."],
    ["How long should I wait before hanging things on freshly painted walls?", "Latex interior paint is dry to the touch in 1 hour and recoatable in 4 hours, but it does not fully cure for 14–30 days. Wait at least 7 days before hanging artwork or applying tape directly to the finish."],
  ],
  "exterior-painting": [
    ["How much does exterior painting cost in Vero Beach?", "A standard 2,000 sq ft single-story Vero Beach home exterior typically costs $4,500–$8,500 to repaint, depending on substrate (stucco, hardie, wood, vinyl), prep needs, and trim complexity. Two-story homes and homes with significant rotted-trim repair price higher."],
    ["How often should I repaint my exterior in Florida?", "Florida's UV, humidity, and salt air shorten exterior paint life. Stucco and hardie typically last 7–10 years with quality 100% acrylic paint, wood siding closer to 5–7 years, and trim/doors 3–5 years. Most Vero Beach homes benefit from a repaint every 7 years."],
    ["What is the best time of year to paint the exterior of a house in Vero Beach?", "October through May. Lower humidity and fewer afternoon thunderstorms give paint time to cure properly. Summer is workable but requires early-morning starts and tight weather monitoring — we reschedule for rain at no charge."],
    ["Do you pressure wash before exterior painting?", "Yes — every exterior project starts with a soft-wash pressure wash to remove algae, mildew, salt, and chalk. Without that step, paint cannot bond properly to the substrate. Pressure washing is included in our exterior quote."],
    ["Will you paint over rotted wood or just replace it?", "We replace rot before we paint. Painting over soft, rotted, or termite-damaged wood traps moisture and the paint will fail in 1–2 seasons. We carpenter-repair fascia, soffit, window trim, and door jambs as part of the prep phase."],
  ],
  "cabinet-refinishing": [
    ["How much does cabinet refinishing cost vs. replacement in Vero Beach?", "Cabinet refinishing in Vero Beach typically runs $2,500–$6,500 for an average kitchen — about 60–70% less than $10,000–$25,000 for replacement. You keep your existing layout, hardware, and storage, and the project finishes in days instead of weeks."],
    ["How long does cabinet refinishing take?", "A typical Vero Beach kitchen takes 4–6 working days. We remove doors and drawer fronts day one, finish them off-site in a controlled spray booth, and prep the cabinet boxes in your kitchen between coats. You keep limited use of your kitchen most of the project."],
    ["Will refinished cabinets hold up better than DIY?", "Yes. We sand, degrease, prime with adhesion-bonding bonding primer, and spray a urethane-acrylic enamel that cures to a factory-grade finish. Properly applied, our cabinet finish lasts 8–15 years versus 1–3 years for DIY brush-on enamels."],
    ["Can you refinish oak cabinets so the grain doesn't show?", "Yes. Oak's open grain requires a specific high-build primer plus light filler before topcoats. We can deliver a fully grain-filled, smooth painted finish — or leave a hint of grain for a more natural look."],
    ["Do you change cabinet hardware as part of refinishing?", "Optional. We can re-install your existing hardware or install new hardware you provide; if existing screw holes don't match new pulls, we patch and re-drill so your finished cabinets look factory-new."],
  ],
  "commercial-painting": [
    ["Can you paint a commercial space without disrupting business?", "Yes. We schedule commercial painting in Vero Beach for nights, early mornings, weekends, or in clean phases that keep your storefront, office, or restaurant open. We use low-odor, zero-VOC paints whenever possible."],
    ["Are you insured for commercial painting projects?", "Yes — Elite Painting Solutions carries $2,000,000 in general liability and full Florida workers' compensation coverage. We provide certificates of insurance to property managers, facility managers, and tenant-improvement contractors on request."],
    ["What types of commercial properties do you paint?", "Offices, retail stores, restaurants, medical and dental buildings, condo associations, HOAs, multi-unit residential, schools, churches, parking garages, and industrial buildings throughout Indian River, Brevard, and St. Lucie counties."],
    ["Do you provide line striping and parking lot painting?", "Yes — parking-stall striping, ADA accessible-spot markings, and curb painting are part of our commercial services. Most standard parking lots are striped in a single overnight visit."],
    ["Can you handle a multi-phase HOA or condo exterior repaint?", "Yes. We coordinate with HOA boards and property managers, work building by building to minimize resident disruption, and provide weekly progress reports plus before/after photo documentation."],
  ],
  "pressure-washing": [
    ["How much does pressure washing cost in Vero Beach?", "Most Vero Beach single-family home soft-washes run $250–$550, depending on home size and roof access. Driveways add $75–$200, and pool cages typically $200–$400. Bundling pressure washing with an exterior paint job typically saves 15–25%."],
    ["Will pressure washing damage my stucco, wood, or screens?", "Not when done properly. We use soft-washing techniques and adjustable PSI for delicate surfaces. Stucco, soft wood, vinyl screens, and window seals are washed at low pressure with cleaning chemistry that does the work — the wand never blasts surfaces directly."],
    ["How often should I pressure wash my house in Florida?", "In Vero Beach, exterior soft-washing is recommended every 12–18 months. Florida humidity grows algae, mildew, and lichen quickly, especially on north-facing and shaded walls. Annual washing extends paint life and prevents permanent staining."],
    ["Do you remove stains from concrete and pavers?", "Yes — oil, rust, fertilizer stains, and red-clay tannins on driveways, sidewalks, and pool decks. We use concrete-safe degreasers and rust removers; some deeply set stains require specialty treatment we'll quote up front."],
    ["Can you wash a pool cage or screen enclosure?", "Yes. We soft-wash aluminum frames and re-screened panels with cleaning chemistry that kills mildew without damaging screen mesh. We also clean roof tiles and bird-guarded eaves on the same trip."],
  ],
  "ceiling-services": [
    ["How much does popcorn ceiling removal cost in Vero Beach?", "Popcorn ceiling removal in Vero Beach typically costs $1.50–$3.50 per square foot, including dust containment, scraping, skim coat, prime, and a finish coat of flat ceiling paint. A 1,500 sq ft home interior usually runs $2,500–$4,500."],
    ["Is my old popcorn ceiling safe to remove?", "Popcorn ceilings installed before 1980 may contain asbestos. We arrange asbestos testing on any home built before 1980 before scraping. If asbestos is found, we coordinate licensed abatement and resume after clearance."],
    ["Can you fix water-stained or sagging ceilings?", "Yes. We seal water stains with shellac-based stain blocker, repair drywall sag and tape damage, re-texture or smooth-finish, then prime and repaint. We also coordinate roof or plumbing source repair before re-finishing."],
    ["What's the difference between knockdown, orange peel, and smooth ceilings?", "Smooth (Level 5) is the most modern look but requires the most prep and shows light most. Orange peel is a fine spatter texture that hides imperfections. Knockdown is sprayed and partially flattened with a trowel — a popular Florida choice for hiding minor drywall flaws."],
    ["How long does popcorn ceiling removal take?", "Most single-room popcorn removals are completed in 2 days; a whole-home removal in 5–8 working days, including dust containment, scrape, skim, prime, and finish coat."],
  ],
};

// Real Vero Beach FL service areas — must stay in sync with navAreas in
// src/data/site.ts so the live React UI, prerendered HTML, and sitemap.xml
// all expose the same set of /areas/* pages.
const areas = [
  "Vero Beach",
  "Sebastian",
  "Indian River Shores",
  "Fellsmere",
  "Wabasso",
  "Roseland",
  "Gifford",
  "Florida Ridge",
  "Vero Lake Estates",
  "Winter Beach",
];

// Approximate centroids for each Vero Beach service area, used to mint
// area-specific GeoCoordinates in LocalBusiness JSON-LD per area page.
// Source: USGS / Google Maps centroids, rounded to 4 decimals.
const areaCoords = {
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

// Generic area-page FAQs (templated with the area name at render time).
// These mirror real "near me" queries that drive AI-Overview citations.
const areaFaqTemplates = [
  ["Do you serve {AREA}, FL?", "Yes — Elite Painting Solutions has been painting homes and businesses in {AREA}, FL for years. We service all of {AREA} and the surrounding Indian River County, with free same-day estimates."],
  ["How much does it cost to paint a house in {AREA}?", "A standard 2,000 sq ft single-story home in {AREA} typically costs $4,500–$8,500 to repaint exterior, and $3,500–$7,500 for a full interior repaint. We give written estimates with no obligation."],
  ["How fast can you start a painting job in {AREA}?", "Most {AREA} estimates are returned the same day, and we can typically start interior projects within 1–2 weeks and exterior projects within 2–4 weeks, weather permitting."],
  ["Are you licensed and insured to paint in {AREA}?", "Yes. Elite Painting Solutions is fully licensed and carries $2,000,000 in general liability plus full workers' compensation, valid for {AREA} and all of Indian River County, FL."],
  ["What painting services do you offer in {AREA}?", "Interior painting, exterior painting, cabinet refinishing, commercial painting, popcorn ceiling removal, drywall repair, and pressure washing — for homes, condos, HOAs, and businesses throughout {AREA}."],
];

// "BLUF" (bottom-line up front) direct-answer leads + key statistics.
// Per Princeton/IIT Delhi GEO research these are the #1 (+33.9%) and #2
// (+32%) signals that drive AI citation rates.
const STATS_BULLETS = [
  "<strong>30+ years</strong> of professional painting experience in Vero Beach and Indian River County, FL.",
  "<strong>$2,000,000</strong> general liability insurance and full Florida workers' comp on every job.",
  "<strong>5.0 / 5.0</strong> aggregate rating across 47+ verified Google, Yelp, Facebook, and Nextdoor reviews.",
  "<strong>Same-day</strong> written estimates — most quotes returned within 4 business hours.",
  "Premium <strong>Sherwin-Williams &amp; Benjamin Moore</strong> paints, including low-VOC and zero-VOC formulations.",
  "Workmanship <strong>warranty</strong> on every interior, exterior, cabinet, and commercial project.",
];

const blogPosts = [
  { slug: "how-to-choose-paint-color", title: "How to Choose the Perfect Paint Color for Your Vero Beach Home", excerpt: "Picking a paint color can feel overwhelming. Here's our step-by-step process to landing on a shade you'll love for years.", date: "2025-03-12" },
  { slug: "interior-vs-exterior-paint", title: "Interior vs. Exterior Paint: What's the Real Difference?", excerpt: "Beyond the obvious, there are big differences in formulation, durability, and price. Here's what every Florida homeowner should know.", date: "2025-02-27" },
  { slug: "cabinet-refinishing-guide", title: "Cabinet Refinishing vs. Replacement — Which Saves More?", excerpt: "Cabinet refinishing can save you 60–70% over replacement. Here's how to decide which is right for your kitchen.", date: "2025-02-10" },
  { slug: "best-time-to-paint-exterior", title: "When Is the Best Time of Year to Paint a Vero Beach Exterior?", excerpt: "Florida heat, humidity, and rain all affect paint adhesion. Here's the ideal window for a flawless exterior finish in Vero Beach.", date: "2025-01-28" },
  { slug: "low-voc-paint-benefits", title: "Why We Use Low-VOC Paints (and Why You Should Care)", excerpt: "Low-VOC paints are healthier for your family, better for the environment, and the quality has caught up. Here's the breakdown.", date: "2025-01-14" },
  { slug: "prep-makes-the-paint-job", title: "Why Prep Work Is 80% of a Great Paint Job", excerpt: "The work you don't see is what makes the work you see last. Here's why we never skip the boring steps.", date: "2024-12-30" },
];

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const fileExists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

// ----- Build sitemap routes -----
const today = new Date().toISOString().slice(0, 10);
const staticRoutes = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/gallery", changefreq: "monthly", priority: "0.7" },
  { loc: "/blog", changefreq: "weekly", priority: "0.7" },
  { loc: "/contact", changefreq: "monthly", priority: "0.8" },
  { loc: "/reviews", changefreq: "monthly", priority: "0.7" },
  { loc: "/terms", changefreq: "yearly", priority: "0.2" },
  { loc: "/privacy", changefreq: "yearly", priority: "0.2" },
];

const serviceRoutes = services.map((s) => ({
  loc: `/services/${s.slug}`,
  changefreq: "monthly",
  priority: "0.9",
}));
const areaRoutes = areas.map((a) => ({
  loc: `/areas/${a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  changefreq: "monthly",
  priority: "0.8",
}));
const blogRoutes = blogPosts.map((p) => ({
  loc: `/blog/${p.slug}`,
  lastmod: p.date,
  changefreq: "monthly",
  priority: "0.6",
}));

const allSitemapEntries = [
  ...staticRoutes,
  ...serviceRoutes,
  ...areaRoutes,
  ...blogRoutes,
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSitemapEntries
  .map(
    (e) => `  <url>
    <loc>${escapeXml(SITE_URL + e.loc)}</loc>
    <lastmod>${e.lastmod || today}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

// ----- Prerender helpers -----
const buildJsonLdForRoute = (route) => {
  const blocks = [];

  if (route.path === "/") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        ["Can you provide references from past clients?", "Absolutely. You can read reviews on our site, and we're happy to provide direct references for similar projects on request."],
        ["What sets you apart from other painting contractors in Vero Beach?", "Meticulous prep, premium paints, and clear communication from start to finish. We treat every Vero Beach home like it's our own."],
        ["What types of services do you offer?", "Full residential and commercial painting in Vero Beach and Indian River County — interior, exterior, cabinet refinishing, pressure washing, and specialty finishes."],
        ["Is there a fee for a consultation or estimate?", "No — Elite Painting Solutions offers complimentary in-home estimates throughout Vero Beach and surrounding areas."],
        ["What kind of paint do you use?", "Premium-grade paints from Sherwin-Williams and Benjamin Moore, including low-VOC and zero-VOC options that hold up to Florida sun and humidity."],
        ["Do you offer a warranty on your work?", "Yes. We stand behind our craftsmanship with a workmanship warranty, plus the manufacturer's paint warranty on all materials."],
        ["Are you licensed and insured?", "Yes. Elite Painting Solutions is fully licensed and insured to operate in Indian River County, Florida — certificates of insurance available on request."],
        ["What areas do you serve?", "Vero Beach, Sebastian, Fellsmere, Indian River Shores, Wabasso, Roseland, Gifford, Florida Ridge, Vero Lake Estates, and the rest of Indian River County, FL."],
      ].map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    });
  }

  if (route.kind === "service") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: route.title,
      serviceType: route.title,
      description: route.description,
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: areas,
      url: `${SITE_URL}${route.path}`,
    });
    blocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Services", item: `${SITE_URL}/#services` },
        { "@type": "ListItem", position: 2, name: route.title, item: `${SITE_URL}${route.path}` },
      ],
    });

    // Per-service FAQPage — fuel for AI Overviews and "People Also Ask".
    const sFaqs = serviceFaqs[route.slug];
    if (sFaqs && sFaqs.length) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: sFaqs.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      });
    }
  }

  if (route.kind === "area") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Service Areas", item: `${SITE_URL}/#areas` },
        { "@type": "ListItem", position: 2, name: route.areaName, item: `${SITE_URL}${route.path}` },
      ],
    });

    // Per-area LocalBusiness with area-specific GeoCoordinates + service catalog.
    // Critical local-SEO + GEO signal: tells search engines AND LLMs we
    // physically serve this exact place.
    const coords = areaCoords[route.areaName];
    blocks.push({
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "HomeAndConstructionBusiness", "Painter"],
      "@id": `${SITE_URL}${route.path}#business`,
      name: `${SITE_NAME} — ${route.areaName}`,
      description: `Licensed and insured painters serving ${route.areaName}, FL and surrounding Indian River County. Interior, exterior, cabinet, and commercial painting with free same-day estimates.`,
      url: `${SITE_URL}${route.path}`,
      telephone: SITE_PHONE_HREF.replace("tel:", ""),
      image: OG_IMAGE,
      priceRange: "$$",
      areaServed: { "@type": "City", name: `${route.areaName}, FL` },
      address: {
        "@type": "PostalAddress",
        addressLocality: route.areaName,
        addressRegion: "FL",
        postalCode: coords?.postal || "32960",
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
        name: `Painting Services in ${route.areaName}, FL`,
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `${s.title} in ${route.areaName}, FL`,
            description: s.description,
            url: `${SITE_URL}/services/${s.slug}`,
          },
        })),
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        reviewCount: "47",
      },
    });

    // Per-area FAQPage built from the templates above.
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: areaFaqTemplates.map(([q, a]) => ({
        "@type": "Question",
        name: q.replaceAll("{AREA}", route.areaName),
        acceptedAnswer: {
          "@type": "Answer",
          text: a.replaceAll("{AREA}", route.areaName),
        },
      })),
    });
  }

  if (route.kind === "blog-post") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 2, name: route.title, item: `${SITE_URL}${route.path}` },
      ],
    });
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: route.title,
      description: route.description,
      url: `${SITE_URL}${route.path}`,
      datePublished: route.datePublished,
      dateModified: route.datePublished,
      image: OG_IMAGE,
      author: { "@type": "Organization", name: SITE_NAME, "@id": `${SITE_URL}/#organization` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${route.path}` },
    });
  }

  return blocks;
};

// Build hidden, crawlable text content for each route. Sits in the static HTML
// so LLMs and crawlers that don't run JavaScript still see real page content.
const buildSeoBlock = (route) => {
  const businessLine = `<p>${escapeHtml(SITE_NAME)} — ${escapeHtml(SITE_ADDRESS)} — Phone <a href="${SITE_PHONE_HREF}">${escapeHtml(SITE_PHONE)}</a>.</p>`;
  let inner = "";

  if (route.path === "/") {
    inner = `
      <h1>${escapeHtml("Vero Beach Painters — Elite Painting Solutions")}</h1>
      <p>Elite Painting Solutions is a top-rated Vero Beach, Florida painting company offering interior painting, exterior painting, cabinet refinishing, commercial painting, and pressure washing. We are fully licensed and insured, with more than 30 years of professional painting experience serving Indian River County.</p>
      <h2>Painting Services in Vero Beach, FL</h2>
      <ul>
        ${services.map((s) => `<li><strong>${escapeHtml(s.title)}</strong> — ${escapeHtml(s.description)}</li>`).join("\n        ")}
      </ul>
      <h2>Service Area</h2>
      <p>We serve homeowners and businesses throughout Indian River County, including ${areas.map((a) => escapeHtml(a)).join(", ")}.</p>
      <h2>Why Choose Elite Painting Solutions</h2>
      <ul>
        <li>30+ years of professional painting experience.</li>
        <li>Licensed and insured in the state of Florida.</li>
        <li>Free same-day estimates — usually returned within hours.</li>
        <li>Premium Sherwin-Williams and Benjamin Moore paints.</li>
        <li>Workmanship warranty on every project.</li>
        <li>Hundreds of 5-star reviews from Vero Beach neighbors.</li>
      </ul>
      <h2>Contact</h2>
      ${businessLine}
      <p>Email: <a href="mailto:eps.paintingsolutions@gmail.com">eps.paintingsolutions@gmail.com</a></p>
    `;
  } else if (route.kind === "service") {
    const sFaqs = serviceFaqs[route.slug] || [];
    inner = `
      <h1>${escapeHtml(route.title)} in Vero Beach, FL</h1>
      <p><strong>Direct answer:</strong> Elite Painting Solutions delivers professional ${escapeHtml(route.title.toLowerCase())} in Vero Beach and across Indian River County, FL. We are a fully licensed and insured painting company with 30+ years of experience, free same-day estimates, and a workmanship warranty on every project. Call <a href="${SITE_PHONE_HREF}">${escapeHtml(SITE_PHONE)}</a>.</p>
      <p>${escapeHtml(route.description)}</p>
      <h2>Why Vero Beach Homeowners Pick Us for ${escapeHtml(route.title)}</h2>
      <ul>
        ${STATS_BULLETS.map((b) => `<li>${b}</li>`).join("\n        ")}
      </ul>
      <h2>What's Included in ${escapeHtml(route.title)}</h2>
      ${(route.body || []).map((p) => `<p>${escapeHtml(p)}</p>`).join("\n      ")}
      <h2>${escapeHtml(route.title)} — Frequently Asked Questions</h2>
      <dl>
        ${sFaqs
          .map(
            ([q, a]) => `<dt><strong>${escapeHtml(q)}</strong></dt>\n        <dd>${escapeHtml(a)}</dd>`,
          )
          .join("\n        ")}
      </dl>
      <h2>Service Area</h2>
      <p>We provide ${escapeHtml(route.title.toLowerCase())} throughout Indian River County, including ${areas.map((a) => escapeHtml(a)).join(", ")}.</p>
      <h2>Free Estimate</h2>
      ${businessLine}
    `;
  } else if (route.kind === "area") {
    const aFaqs = areaFaqTemplates.map(([q, a]) => [
      q.replaceAll("{AREA}", route.areaName),
      a.replaceAll("{AREA}", route.areaName),
    ]);
    const coords = areaCoords[route.areaName];
    inner = `
      <h1>Painters in ${escapeHtml(route.areaName)}, FL</h1>
      <p><strong>Direct answer:</strong> Elite Painting Solutions is a top-rated painting company serving ${escapeHtml(route.areaName)}, Florida ${coords ? `(${coords.postal})` : ""} and the surrounding Indian River County. We provide free same-day estimates for interior painting, exterior painting, cabinet refinishing, popcorn ceiling removal, commercial painting, and pressure washing. Licensed, insured, and locally trusted for 30+ years. Call <a href="${SITE_PHONE_HREF}">${escapeHtml(SITE_PHONE)}</a>.</p>
      <h2>Why ${escapeHtml(route.areaName)} Homeowners Choose Elite Painting Solutions</h2>
      <ul>
        ${STATS_BULLETS.map((b) => `<li>${b}</li>`).join("\n        ")}
      </ul>
      <h2>Local Painting Services in ${escapeHtml(route.areaName)}</h2>
      <ul>
        ${services.map((s) => `<li><strong>${escapeHtml(s.title)}</strong> — ${escapeHtml(s.description)}</li>`).join("\n        ")}
      </ul>
      <h2>${escapeHtml(route.areaName)} Painting — Frequently Asked Questions</h2>
      <dl>
        ${aFaqs
          .map(
            ([q, a]) => `<dt><strong>${escapeHtml(q)}</strong></dt>\n        <dd>${escapeHtml(a)}</dd>`,
          )
          .join("\n        ")}
      </dl>
      <p>Call ${escapeHtml(SITE_PHONE)} for a free same-day estimate in ${escapeHtml(route.areaName)}.</p>
      ${businessLine}
    `;
  } else if (route.kind === "blog-post") {
    inner = `
      <article>
        <h1>${escapeHtml(route.title)}</h1>
        <p><em>Published ${escapeHtml(new Date(route.datePublished).toDateString())} by ${escapeHtml(SITE_NAME)}.</em></p>
        <p>${escapeHtml(route.description)}</p>
      </article>
      ${businessLine}
    `;
  } else {
    inner = `
      <h1>${escapeHtml(route.title)}</h1>
      <p>${escapeHtml(route.description)}</p>
      ${businessLine}
    `;
  }

  return `<div class="seo-prerender" aria-hidden="true">${inner}</div>`;
};

const renderHtmlFor = (template, route) => {
  const canonical = `${SITE_URL}${route.path}`;
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const ogType = route.ogType || "website";

  let html = template;

  // <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

  // <meta name="description">
  html = html.replace(
    /<meta\s+name="description"[^>]*>/,
    `<meta name="description" content="${description}" />`,
  );

  // canonical
  html = html.replace(
    /<link\s+rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${canonical}" />`,
  );

  // og:title
  html = html.replace(
    /<meta\s+property="og:title"[^>]*>/,
    `<meta property="og:title" content="${title}" />`,
  );
  // og:description
  html = html.replace(
    /<meta\s+property="og:description"[^>]*>/,
    `<meta property="og:description" content="${description}" />`,
  );
  // og:url
  html = html.replace(
    /<meta\s+property="og:url"[^>]*>/,
    `<meta property="og:url" content="${canonical}" />`,
  );
  // og:type
  html = html.replace(
    /<meta\s+property="og:type"[^>]*>/,
    `<meta property="og:type" content="${ogType}" />`,
  );

  // twitter:title / description
  html = html.replace(
    /<meta\s+name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${title}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${description}" />`,
  );

  // Per-route JSON-LD blocks: append before </head>
  const blocks = buildJsonLdForRoute(route);
  if (blocks.length > 0) {
    const scriptTags = blocks
      .map(
        (b) =>
          `    <script type="application/ld+json" data-route-jsonld="true">${JSON.stringify(
            b,
          ).replace(/</g, "\\u003c")}</script>`,
      )
      .join("\n");
    html = html.replace(/<\/head>/, `${scriptTags}\n  </head>`);
  }

  // Hidden SEO content block right before </body> for crawlers + LLMs
  const seoBlock = buildSeoBlock(route);
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"></div>\n    ${seoBlock}`,
  );

  return html;
};

const main = async () => {
  if (!(await fileExists(DIST))) {
    console.error(`[postbuild] dist directory not found at ${DIST}`);
    process.exitCode = 1;
    return;
  }

  // Sitemap + robots.txt
  await writeFile(resolve(DIST, "sitemap.xml"), sitemapXml, "utf8");
  console.log("[postbuild] sitemap.xml written");

  // Ensure robots.txt is in place
  const robotsSrc = resolve(ROOT, "public/robots.txt");
  const robotsDst = resolve(DIST, "robots.txt");
  if (!(await fileExists(robotsDst)) && (await fileExists(robotsSrc))) {
    await copyFile(robotsSrc, robotsDst);
  }

  // Prerender per-route HTML
  const indexPath = resolve(DIST, "index.html");
  const template = await readFile(indexPath, "utf8");

  const routes = [];

  // Home: rewrite the root index.html with FAQ JSON-LD baked in
  routes.push({
    path: "/",
    title: "Vero Beach Painters FL | Interior, Exterior & Cabinet Painting Pros",
    description: DEFAULT_DESCRIPTION,
    kind: "home",
  });

  for (const s of services) {
    routes.push({
      ...s,
      path: `/services/${s.slug}`,
      title: `${s.title} in Vero Beach, FL | Elite Painting Solutions`,
      description: `${s.description} Free same-day estimates from licensed and insured Vero Beach painters. Call ${SITE_PHONE}.`,
      kind: "service",
    });
  }

  for (const a of areas) {
    const slug = a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    routes.push({
      path: `/areas/${slug}`,
      title: `Painters in ${a}, FL | Elite Painting Solutions Vero Beach`,
      description: `Top-rated painters serving ${a}, Florida. Interior, exterior, cabinet, and commercial painting. Licensed & insured. Free same-day estimates — call ${SITE_PHONE}.`,
      kind: "area",
      areaName: a,
    });
  }

  for (const p of blogPosts) {
    routes.push({
      path: `/blog/${p.slug}`,
      title: `${p.title} | Elite Painting Solutions Blog`,
      description: p.excerpt,
      kind: "blog-post",
      ogType: "article",
      datePublished: new Date(p.date).toISOString(),
    });
  }

  routes.push({
    path: "/blog",
    title: "Painting Tips & Advice | Vero Beach Painters Blog",
    description:
      "Expert painting tips, color selection guides, and home improvement advice from Elite Painting Solutions — Vero Beach's top-rated painting company with 30+ years of experience.",
    kind: "page",
  });
  routes.push({
    path: "/gallery",
    title: "Project Gallery | Vero Beach Painting Portfolio | Elite Painting Solutions",
    description:
      "Browse interior, exterior, and cabinet painting projects completed by Elite Painting Solutions in Vero Beach, FL. See the quality and craftsmanship that earned us 5-star reviews.",
    kind: "page",
  });
  routes.push({
    path: "/contact",
    title: "Contact Vero Beach Painters | Free Quote | Elite Painting Solutions",
    description: `Contact Elite Painting Solutions for a free same-day painting quote in Vero Beach, FL. Call ${SITE_PHONE} or send a message — we respond fast.`,
    kind: "page",
  });
  routes.push({
    path: "/reviews",
    title: "Customer Reviews | Vero Beach Painters | Elite Painting Solutions",
    description:
      "Read what our Vero Beach customers say about Elite Painting Solutions. 5-star reviews for interior, exterior, and cabinet painting across Indian River County, FL.",
    kind: "page",
  });
  routes.push({
    path: "/terms",
    title: "Terms of Service | Elite Painting Solutions",
    description: "Terms of service for Elite Painting Solutions, Vero Beach FL.",
    kind: "page",
  });
  routes.push({
    path: "/privacy",
    title: "Privacy Policy | Elite Painting Solutions",
    description: "Privacy policy for Elite Painting Solutions, Vero Beach FL.",
    kind: "page",
  });

  let count = 0;
  for (const route of routes) {
    const html = renderHtmlFor(template, route);
    if (route.path === "/") {
      // Overwrite root index.html with home-tuned variant (FAQ JSON-LD baked in)
      await writeFile(indexPath, html, "utf8");
    } else {
      const target = resolve(DIST, route.path.replace(/^\//, ""), "index.html");
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, html, "utf8");
    }
    count++;
  }

  console.log(`[postbuild] prerendered ${count} routes`);
};

main().catch((err) => {
  console.error("[postbuild] failed:", err);
  process.exit(1);
});

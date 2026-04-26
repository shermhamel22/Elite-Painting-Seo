// Per-service FAQs. Mirrored in scripts/postbuild.mjs so the same Q&A pairs
// power BOTH the visible UI on each /services/* page AND the FAQPage JSON-LD
// baked into the prerendered HTML for AI-Overview/PAA citations.
export const serviceFaqs: Record<string, { q: string; a: string }[]> = {
  "interior-painting": [
    { q: "How much does interior painting cost in Vero Beach, FL?", a: "Interior painting in Vero Beach typically runs $2.50–$6.00 per square foot of wall area, or roughly $400–$900 per average-size room. Final pricing depends on prep, ceiling height, number of colors, and trim work. Elite Painting Solutions provides free written estimates with no obligation." },
    { q: "How long does it take to paint the interior of a house?", a: "A single-room interior repaint usually takes 1–2 days. A typical 2,000–2,500 sq ft Vero Beach home interior takes 4–7 working days, including prep, two finish coats, trim, and cleanup." },
    { q: "What kind of paint do you use for interior walls?", a: "We use premium 100% acrylic, low-VOC and zero-VOC interior paints from Sherwin-Williams and Benjamin Moore. These hold color longer in Florida light, scrub easily, and are safe for kids, pets, and people with chemical sensitivity." },
    { q: "Do I need to move my furniture before you start?", a: "No — our crew moves and protects furniture, covers floors with drop cloths, and removes outlet covers and switch plates. We re-set everything when the job is complete." },
    { q: "How long should I wait before hanging things on freshly painted walls?", a: "Latex interior paint is dry to the touch in 1 hour and recoatable in 4 hours, but it does not fully cure for 14–30 days. Wait at least 7 days before hanging artwork or applying tape directly to the finish." },
  ],
  "exterior-painting": [
    { q: "How much does exterior painting cost in Vero Beach?", a: "A standard 2,000 sq ft single-story Vero Beach home exterior typically costs $4,500–$8,500 to repaint, depending on substrate (stucco, hardie, wood, vinyl), prep needs, and trim complexity. Two-story homes and homes with significant rotted-trim repair price higher." },
    { q: "How often should I repaint my exterior in Florida?", a: "Florida's UV, humidity, and salt air shorten exterior paint life. Stucco and hardie typically last 7–10 years with quality 100% acrylic paint, wood siding closer to 5–7 years, and trim/doors 3–5 years. Most Vero Beach homes benefit from a repaint every 7 years." },
    { q: "What is the best time of year to paint the exterior of a house in Vero Beach?", a: "October through May. Lower humidity and fewer afternoon thunderstorms give paint time to cure properly. Summer is workable but requires early-morning starts and tight weather monitoring — we reschedule for rain at no charge." },
    { q: "Do you pressure wash before exterior painting?", a: "Yes — every exterior project starts with a soft-wash pressure wash to remove algae, mildew, salt, and chalk. Without that step, paint cannot bond properly to the substrate. Pressure washing is included in our exterior quote." },
    { q: "Will you paint over rotted wood or just replace it?", a: "We replace rot before we paint. Painting over soft, rotted, or termite-damaged wood traps moisture and the paint will fail in 1–2 seasons. We carpenter-repair fascia, soffit, window trim, and door jambs as part of the prep phase." },
  ],
  "cabinet-refinishing": [
    { q: "How much does cabinet refinishing cost vs. replacement in Vero Beach?", a: "Cabinet refinishing in Vero Beach typically runs $2,500–$6,500 for an average kitchen — about 60–70% less than $10,000–$25,000 for replacement. You keep your existing layout, hardware, and storage, and the project finishes in days instead of weeks." },
    { q: "How long does cabinet refinishing take?", a: "A typical Vero Beach kitchen takes 4–6 working days. We remove doors and drawer fronts day one, finish them off-site in a controlled spray booth, and prep the cabinet boxes in your kitchen between coats. You keep limited use of your kitchen most of the project." },
    { q: "Will refinished cabinets hold up better than DIY?", a: "Yes. We sand, degrease, prime with adhesion-bonding primer, and spray a urethane-acrylic enamel that cures to a factory-grade finish. Properly applied, our cabinet finish lasts 8–15 years versus 1–3 years for DIY brush-on enamels." },
    { q: "Can you refinish oak cabinets so the grain doesn't show?", a: "Yes. Oak's open grain requires a specific high-build primer plus light filler before topcoats. We can deliver a fully grain-filled, smooth painted finish — or leave a hint of grain for a more natural look." },
    { q: "Do you change cabinet hardware as part of refinishing?", a: "Optional. We can re-install your existing hardware or install new hardware you provide; if existing screw holes don't match new pulls, we patch and re-drill so your finished cabinets look factory-new." },
  ],
  "commercial-painting": [
    { q: "Can you paint a commercial space without disrupting business?", a: "Yes. We schedule commercial painting in Vero Beach for nights, early mornings, weekends, or in clean phases that keep your storefront, office, or restaurant open. We use low-odor, zero-VOC paints whenever possible." },
    { q: "Are you insured for commercial painting projects?", a: "Yes — Elite Painting Solutions carries $2,000,000 in general liability and full Florida workers' compensation coverage. We provide certificates of insurance to property managers, facility managers, and tenant-improvement contractors on request." },
    { q: "What types of commercial properties do you paint?", a: "Offices, retail stores, restaurants, medical and dental buildings, condo associations, HOAs, multi-unit residential, schools, churches, parking garages, and industrial buildings throughout Indian River, Brevard, and St. Lucie counties." },
    { q: "Do you provide line striping and parking lot painting?", a: "Yes — parking-stall striping, ADA accessible-spot markings, and curb painting are part of our commercial services. Most standard parking lots are striped in a single overnight visit." },
    { q: "Can you handle a multi-phase HOA or condo exterior repaint?", a: "Yes. We coordinate with HOA boards and property managers, work building by building to minimize resident disruption, and provide weekly progress reports plus before/after photo documentation." },
  ],
  "pressure-washing": [
    { q: "How much does pressure washing cost in Vero Beach?", a: "Most Vero Beach single-family home soft-washes run $250–$550, depending on home size and roof access. Driveways add $75–$200, and pool cages typically $200–$400. Bundling pressure washing with an exterior paint job typically saves 15–25%." },
    { q: "Will pressure washing damage my stucco, wood, or screens?", a: "Not when done properly. We use soft-washing techniques and adjustable PSI for delicate surfaces. Stucco, soft wood, vinyl screens, and window seals are washed at low pressure with cleaning chemistry that does the work — the wand never blasts surfaces directly." },
    { q: "How often should I pressure wash my house in Florida?", a: "In Vero Beach, exterior soft-washing is recommended every 12–18 months. Florida humidity grows algae, mildew, and lichen quickly, especially on north-facing and shaded walls. Annual washing extends paint life and prevents permanent staining." },
    { q: "Do you remove stains from concrete and pavers?", a: "Yes — oil, rust, fertilizer stains, and red-clay tannins on driveways, sidewalks, and pool decks. We use concrete-safe degreasers and rust removers; some deeply set stains require specialty treatment we'll quote up front." },
    { q: "Can you wash a pool cage or screen enclosure?", a: "Yes. We soft-wash aluminum frames and re-screened panels with cleaning chemistry that kills mildew without damaging screen mesh. We also clean roof tiles and bird-guarded eaves on the same trip." },
  ],
  "ceiling-services": [
    { q: "How much does popcorn ceiling removal cost in Vero Beach?", a: "Popcorn ceiling removal in Vero Beach typically costs $1.50–$3.50 per square foot, including dust containment, scraping, skim coat, prime, and a finish coat of flat ceiling paint. A 1,500 sq ft home interior usually runs $2,500–$4,500." },
    { q: "Is my old popcorn ceiling safe to remove?", a: "Popcorn ceilings installed before 1980 may contain asbestos. We arrange asbestos testing on any home built before 1980 before scraping. If asbestos is found, we coordinate licensed abatement and resume after clearance." },
    { q: "Can you fix water-stained or sagging ceilings?", a: "Yes. We seal water stains with shellac-based stain blocker, repair drywall sag and tape damage, re-texture or smooth-finish, then prime and repaint. We also coordinate roof or plumbing source repair before re-finishing." },
    { q: "What's the difference between knockdown, orange peel, and smooth ceilings?", a: "Smooth (Level 5) is the most modern look but requires the most prep and shows light most. Orange peel is a fine spatter texture that hides imperfections. Knockdown is sprayed and partially flattened with a trowel — a popular Florida choice for hiding minor drywall flaws." },
    { q: "How long does popcorn ceiling removal take?", a: "Most single-room popcorn removals are completed in 2 days; a whole-home removal in 5–8 working days, including dust containment, scrape, skim, prime, and finish coat." },
  ],
};

// Generic per-area FAQs — templated with the area name at render time.
// Mirrored in scripts/postbuild.mjs so the visible UI matches the JSON-LD.
const areaFaqTemplates: { q: string; a: string }[] = [
  { q: "Do you serve {AREA}, FL?", a: "Yes — Elite Painting Solutions has been painting homes and businesses in {AREA}, FL for years. We service all of {AREA} and the surrounding Indian River County, with free same-day estimates." },
  { q: "How much does it cost to paint a house in {AREA}?", a: "A standard 2,000 sq ft single-story home in {AREA} typically costs $4,500–$8,500 to repaint exterior, and $3,500–$7,500 for a full interior repaint. We give written estimates with no obligation." },
  { q: "How fast can you start a painting job in {AREA}?", a: "Most {AREA} estimates are returned the same day, and we can typically start interior projects within 1–2 weeks and exterior projects within 2–4 weeks, weather permitting." },
  { q: "Are you licensed and insured to paint in {AREA}?", a: "Yes. Elite Painting Solutions is fully licensed and carries $2,000,000 in general liability plus full workers' compensation, valid for {AREA} and all of Indian River County, FL." },
  { q: "What painting services do you offer in {AREA}?", a: "Interior painting, exterior painting, cabinet refinishing, commercial painting, popcorn ceiling removal, drywall repair, and pressure washing — for homes, condos, HOAs, and businesses throughout {AREA}." },
];

export const areaFaqsFor = (area: string) =>
  areaFaqTemplates.map((f) => ({
    q: f.q.replaceAll("{AREA}", area),
    a: f.a.replaceAll("{AREA}", area),
  }));

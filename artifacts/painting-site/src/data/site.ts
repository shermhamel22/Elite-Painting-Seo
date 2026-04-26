export const site = {
  name: "Elite Painting Solutions",
  shortName: "Elite Painting",
  phone: "(772) 539-2115",
  phoneHref: "tel:+17725392115",
  email: "eps.paintingsolutions@gmail.com",
  tagline: "Top-Rated Vero Beach Painters",
  description:
    "Elite Painting Solutions is a top-rated Vero Beach, Florida painting company delivering exceptional residential and commercial painting — focused on flawless finishes, lasting durability, and a customer experience that stands out. From a single accent wall to a full exterior repaint, we treat every project like it's our own home.",
  address: "Vero Beach, FL 32960",
  addressFull: "Vero Beach, FL 32960 — Serving Indian River County",
  cityRegion: "Vero Beach, Florida",
  googleReviewsUrl:
    "https://www.google.com/search?q=elite+painting+solutions&rlz=1C1UEAD_enUS1170US1170&oq=elite+painting+solutions&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg8MgYIAhBFGDwyBggDEEUYPNIBCDI0NjhqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8&sei=4WzuafW3EKGyp84P_KbE0Ac#lrd=0x88de5fafe2668299:0x41e3cf669ff15ce1,1,,,,",
};

export const navServices = [
  { label: "Interior Painting", href: "/services/interior-painting", slug: "interior-painting" },
  { label: "Exterior Painting", href: "/services/exterior-painting", slug: "exterior-painting" },
  { label: "Cabinet Refinishing", href: "/services/cabinet-refinishing", slug: "cabinet-refinishing" },
  { label: "Commercial Painting", href: "/services/commercial-painting", slug: "commercial-painting" },
  { label: "Pressure Washing", href: "/services/pressure-washing", slug: "pressure-washing" },
  { label: "Ceiling Services", href: "/services/ceiling-services", slug: "ceiling-services" },
];

export const navAreas = [
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

// Convert an area display name like "Indian River Shores" to its URL slug
// "indian-river-shores". Must stay in sync with the slug logic in
// scripts/postbuild.mjs so sitemap, prerender, and runtime routes all agree.
export const areaSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const services = [
  {
    title: "Interior Painting",
    slug: "interior-painting",
    description:
      "Crisp lines, smooth finishes, and premium paint that transforms rooms — walls, ceilings, trim, and accent features.",
    href: "/services/interior-painting",
    long:
      "Whether you're refreshing a single room or repainting your entire home, our interior painting service combines meticulous prep, premium low-VOC paints, and clean lines that last. We protect your floors and furniture, communicate every step, and leave your space spotless.",
    bullets: [
      "Walls, ceilings, trim, doors, and accent walls",
      "Premium low-VOC and zero-VOC paint options",
      "Detailed surface prep — patching, sanding, priming",
      "Furniture and floor protection on every job",
      "Color consultation and sample boards available",
    ],
  },
  {
    title: "Exterior Painting",
    slug: "exterior-painting",
    description:
      "Long-lasting exterior finishes built to handle every season — siding, trim, doors, fences, and decks.",
    href: "/services/exterior-painting",
    long:
      "Boost curb appeal and protect your investment with weather-resistant exterior coatings. We pressure wash, scrape, sand, prime, and apply two coats of premium paint for a finish that holds its color for years.",
    bullets: [
      "Pressure washing and full surface prep included",
      "Wood, vinyl, stucco, brick, and fiber cement",
      "Weather-resistant premium paints",
      "Trim, fascia, soffits, doors, shutters, fences",
      "Color matching and sample testing on-site",
    ],
  },
  {
    title: "Cabinet Refinishing",
    slug: "cabinet-refinishing",
    description:
      "Give your kitchen a brand-new look at a fraction of the cost with factory-grade cabinet refinishing.",
    href: "/services/cabinet-refinishing",
    long:
      "Save thousands compared to full replacement. We sand, prime, and spray your cabinets with a durable enamel finish that looks and feels factory-fresh — typically completed in under a week.",
    bullets: [
      "Full degrease, sand, and prime on every door",
      "Spray-applied cabinet enamel for a smooth finish",
      "Hardware removal, replacement, and reinstall",
      "Hundreds of color options",
      "Typically completed in 4–6 days",
    ],
  },
  {
    title: "Commercial Painting",
    slug: "commercial-painting",
    description:
      "Professional commercial painting for offices, retail, and multi-unit properties — done on schedule, on budget.",
    href: "/services/commercial-painting",
    long:
      "We work with property managers, business owners, and contractors to deliver high-quality commercial painting with minimal disruption. Flexible scheduling — including nights and weekends — keeps your business running.",
    bullets: [
      "Offices, retail, restaurants, and multi-unit",
      "Night and weekend scheduling available",
      "Licensed and insured for commercial work",
      "Detailed proposals and clear timelines",
      "Clean, uniformed crew",
    ],
  },
  {
    title: "Pressure Washing",
    slug: "pressure-washing",
    description:
      "Restore decks, driveways, siding, and fences with safe, thorough pressure washing — perfect prep before paint.",
    href: "/services/pressure-washing",
    long:
      "Pressure washing isn't just about looks — it's a critical step before exterior painting. We use the right pressure and detergents for every surface to clean without damage.",
    bullets: [
      "Houses, decks, driveways, patios, fences",
      "Soft-wash for delicate siding and roofs",
      "Mildew, algae, and dirt removal",
      "Professional-grade equipment",
      "Standalone service or paired with painting",
    ],
  },
  {
    title: "Ceiling Services",
    slug: "ceiling-services",
    description:
      "Popcorn ceiling removal, ceiling repair, and smooth ceiling repaints — modernize any room from the top down.",
    href: "/services/ceiling-services",
    long:
      "Outdated popcorn (acoustic) ceilings make a room feel old and dingy. We safely scrape and remove popcorn texture, repair drywall imperfections, skim-coat to a smooth finish, and repaint with a flat ceiling-grade paint that hides shadows and roller marks. Florida humidity also stains ceilings — we handle water-stain blocking, mildew treatment, and full ceiling repaints in any room.",
    bullets: [
      "Popcorn / acoustic ceiling removal and disposal",
      "Drywall repair, skim-coat, and smooth refinishing",
      "Water-stain blocking and mildew treatment",
      "Knockdown, orange-peel, or smooth texture finishes",
      "Flat ceiling-grade paint that hides imperfections",
    ],
  },
];

// Real 5-star Google reviews for Elite Painting Solutions, Vero Beach FL.
// Each card on /reviews and the homepage Reviews carousel links to the
// company's Google review profile (site.googleReviewsUrl).
export const reviews = [
  {
    name: "Greg Jammel",
    text: "Had Elite Painting Solutions come to my home to look at a problem I was having with the paint on the exterior of my home. Michael knew exactly what to do to fix the problem once he saw what was happening. I hired him and his guys to correct what had been done by a previous painter & they came out & performed beyond my expectations! Very reasonably priced & extremely professional. Would recommend them to everyone!",
    rating: 5,
  },
  {
    name: "Edward G Slimak Jr",
    text: "Best, local contractor experience. Michael is quick to reply and show up for an estimate. He is knowledgeable and a great communicator detailing the work he will perform. He texted being delayed picking up paint materials. He works hard and efficiently. He did exactly what I requested and more that was needed. When his work is completed you will know why they call him \"Superman.\" I highly recommend his work and him personally.",
    rating: 5,
  },
  {
    name: "Monica Rulo",
    text: "Fantastic service and great results. My house was in pretty rough shape, the T1-11 siding was dry and I have no clue when it was last painted. The previous owners did not seal anything properly so the team spent an entire day caulking and prepping the house for paint. They took their time to seal and prime the house, they painted with both a sprayer and a roller to make sure there was full penetration to protect my home for several years. My house looks new again and I couldn't be happier. I hope my review helps someone choose Elite because they did a phenomenal job.",
    rating: 5,
  },
  {
    name: "Robert Austill",
    text: "I had Michael and his guys with Elite Painting Solutions come by to paint the outside of my home and I was very impressed with how quickly they were able to complete the job and provide the quality that they did.",
    rating: 5,
  },
  {
    name: "Steve R",
    text: "Elite Painting Solutions did an amazing job on staining my fence. They were punctual and finished with the job quickly, while maintaining a high level of quality. They gave a very reasonable estimate, better than my other quotes. They were also so kind and upbeat even though they were getting beat down by the sun. I'm definitely going to use them again and hope anyone reading this gives them a chance. You won't regret it.",
    rating: 5,
  },
  {
    name: "Shawn",
    text: "I contacted Elite Painting Solutions and they were very responsive and provided me with an excellent estimate. We agreed to terms and then they went to work transforming my home. Their ability to work together was amazing to watch and I would highly recommend them to anyone looking to have their home painted.",
    rating: 5,
  },
  {
    name: "Joe St_Eggbenedictus",
    text: "Elite Painting Solutions did an amazing job on the exterior of our home, as well as several jobs on the interior. Michael was fair in his prices, and very honest in helping us save money in places where we needed additional work. There were never any surprises, and he informed us of his intentions every step of the way, especially when there was extra work needed to do repairs for rotten wood around the house. We are more than pleased and impressed.",
    rating: 5,
  },
  {
    name: "Sameet Patel",
    text: "These guys did a great job, making my house look amazing and did it in a timely fashion. They are very knowledgeable and fixed so many things that the previous guy I hired missed and tried to cut corners with. I only wish I chose them to do the job sooner. I don't see myself ever choosing anyone else for painting projects.",
    rating: 5,
  },
  {
    name: "Kathy Bartoszewicz",
    text: "We were looking to have our driveway painted. After getting an outrageous quote from another vendor, my husband contacted Elite Painting Solutions, LLC (Michael Reid). Michael did not hesitate in coming over, quoted the job and got the job done in a matter of forty-eight hours. Even with having trouble at his own home, he still managed to finish the job professionally. I would definitely hire Elite Painting Solutions, LLC for all your painting needs.",
    rating: 5,
  },
  {
    name: "Samuel Payne",
    text: "I had Elite Painting repaint the outside of my home and I must say that I was extremely impressed by their ability to accomplish the job so quickly and the quality of the work. Pricing was great and I highly recommend them!",
    rating: 5,
  },
  {
    name: "Cathy McGrane Coney",
    text: "Elite Painting Solutions is the very best. My house was re-plumbed and I had 7 holes in my walls/closets. They came in and in a day and a half holes were drywalled and painted (matching perfectly). Very efficient, cleaned up perfectly after themselves and even hooked my washer/dryer back up. They did a fabulous job and I highly recommend them — on a scale of 1-10 they are a perfect 10.",
    rating: 5,
  },
  {
    name: "Barbara Jean Taylor",
    text: "Looking for a painter? Look no more — Elite Painting will not disappoint! Mike answered his phone, came out and gave a quote the same day, and rearranged his schedule to accommodate mine. He finished my entire house — 2,000 sq ft of walls, doors, trim and baseboards — in 2 days! He is reasonably priced and fair. He and his crew are knowledgeable, respectful, and worked great together. I was overly impressed, and you will be too. Amazing job done by Mike and his crew!",
    rating: 5,
  },
  {
    name: "John Ross",
    text: "Elite Painting may scare off some people because of their years owning the business, but let me tell you — they have years of experience working for other companies. They do a FANTASTIC job in a timely manner! They show up when they say they will be there! They are EXTREMELY price competitive — in my case, they were almost half the price of a painter who everyone in our community consistently used. Words cannot express how happy I am with the results! Call Michael — you will be glad you did!",
    rating: 5,
  },
  {
    name: "Chris Glading",
    text: "I highly recommend Elite Painting Solutions! Michael and his team are very professional. They arrived promptly and completed the job efficiently. I was impressed by the excellent quality of their work. If you are looking to have painting done well at a reasonable price by a company with character and integrity, call Elite Painting Solutions!",
    rating: 5,
  },
  {
    name: "Bobi",
    text: "Mike has done several painting and fix-it jobs for me recently. In my career flipping homes, I've hired painters many times to do work for me, but none have been at Mike's level. He's on time, a pro, makes great suggestions, and the work is always perfection. An added plus — he's a nice guy who truly cares about his customers. Thank you Mike!",
    rating: 5,
  },
  {
    name: "Sara Hansen",
    text: "Elite Painting Solutions did a wonderful job painting the exterior of my home! Michael was very meticulous with detail. Would highly recommend them to anyone! Plan on using them again as I remodel. Job well done!",
    rating: 5,
  },
  {
    name: "Althea Grier",
    text: "Called Michael and he came to my house with a quote. I thought it was over-priced, so I canceled. Michael texted me with an alternative price. He turned up on time and completed the job to my satisfaction.",
    rating: 5,
  },
  {
    name: "Shari Tessier",
    text: "Elite Painting was recommended to us to paint our new business location. He quoted a fair price and delivered a phenomenal result in LESS time than he quoted! He got the job done right AND fast! I couldn't be happier and I look forward to using Elite again in the near future.",
    rating: 5,
  },
  {
    name: "Heather Puza",
    text: "Michael was very polite, professional, flexible, quick, and neat. He did a great job patching and painting our wall! I definitely recommend him and will call him again if needed.",
    rating: 5,
  },
  {
    name: "Audrey Gajus",
    text: "Michael painted the metal cluster mailboxes for my community. He did a really great job! He was extremely patient dealing with all of our HOA requirements. He was very easy to work with. The paint job itself looks great! Thank you Michael.",
    rating: 5,
  },
  {
    name: "Jay McCurdy",
    text: "About 2 weeks before Easter this year we had Elite Painting Solutions come out and give us a quote on painting a dining room. Mr. Reid was very polite, courteous, and reasonable in his pricing. We had him do the job and he completed it for us before the Easter season. We were very impressed with his work and professionalism on the job that he did. Thank you so much, Mr. Reid — we hope to work with you again in the future. Thanks again!",
    rating: 5,
  },
];

export const faqs = [
  {
    q: "Can you provide references from past clients?",
    a: "Absolutely. You can read reviews from our satisfied customers throughout our site, and we're happy to provide direct references for similar projects on request.",
  },
  {
    q: "What sets you apart from other painting contractors?",
    a: "Meticulous prep, premium paints, and clear communication from start to finish. We treat every home like it's our own and never cut corners on the steps you don't see.",
  },
  {
    q: "What types of services do you offer?",
    a: "Full residential and commercial painting — interior, exterior, cabinet refinishing, pressure washing, and specialty finishes. If it needs paint, we can handle it.",
  },
  {
    q: "Is there a fee for a consultation or estimate?",
    a: "No — Elite Painting Solutions offers complimentary in-home estimates to all prospective clients. Just give us a call or request a quote online.",
  },
  {
    q: "What kind of paint do you use?",
    a: "We use premium-grade paints from trusted brands like Sherwin-Williams and Benjamin Moore, including low-VOC and zero-VOC options for healthier indoor air.",
  },
  {
    q: "Do you offer a warranty on your work?",
    a: "Yes. We stand behind our craftsmanship with a workmanship warranty, plus the manufacturer's paint warranty on all materials.",
  },
];

export const trustBadges = [
  "100% Local",
  "Family Business",
  "30+ Years Experience",
  "Insured",
  "Fully Licensed",
];

export const processSteps = [
  { n: "01", title: "Reach Out", text: "Call or send a message. We listen and gather the details." },
  { n: "02", title: "Free Quote", text: "We provide a clear, no-pressure estimate — no hidden fees." },
  { n: "03", title: "Schedule", text: "Pick a time that works for you. We show up on time, every time." },
  { n: "04", title: "Quality Work", text: "Clean, beautiful finishes backed by our workmanship guarantee." },
];

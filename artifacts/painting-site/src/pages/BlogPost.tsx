import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { SEO } from "@/components/SEO";
import { site } from "@/data/site";
import { breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { posts } from "./Blog";

const toIsoDate = (humanDate: string): string => {
  const d = new Date(humanDate);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

const blogContent: Record<string, string> = {
  "how-to-choose-paint-color": "Choosing the right paint color is one of the most important decisions you'll make in a home improvement project. Start by considering the room's natural light — north-facing rooms benefit from warm tones, while south-facing spaces can handle cooler hues. Next, think about the fixed elements: flooring, cabinetry, and countertops. Your paint should complement these, not compete. Bring home samples and observe them at different times of day. What looks perfect in the showroom may read completely differently on your walls. Finally, don't be afraid of the trim — the right trim color can make the whole room feel polished and intentional.",
  "interior-vs-exterior-paint": "Interior and exterior paints share the same basic chemistry but are formulated very differently. Interior paints prioritize low odor, scrubability, and resistance to staining. Exterior paints are built to handle UV exposure, temperature swings, moisture, and mildew. The resins in exterior paint are softer and more flexible, which helps them expand and contract with temperature changes without cracking. Using interior paint outside will lead to premature failure — typically within a season or two. Using exterior paint inside isn't dangerous but the higher VOC levels and stronger odors make it undesirable. Always use the right paint for the right application.",
  "cabinet-refinishing-guide": "Cabinet replacement is one of the most expensive kitchen renovations you can undertake — often $15,000 to $30,000 or more. Refinishing, by contrast, typically runs $1,500 to $5,000 depending on the size of your kitchen and the finish quality. The key is cabinet condition: if your box structure is solid and the doors aren't warped or delaminating, refinishing is almost always the smarter financial choice. A professional cabinet refinishing job involves complete disassembly, degreasing, sanding, priming, and a spray-applied enamel that produces a factory-smooth finish. Done right, it's indistinguishable from new.",
  "best-time-to-paint-exterior": "The ideal exterior painting window is typically late spring through early fall, when temperatures are consistently between 50°F and 85°F and humidity is below 85%. Paint needs time to cure properly — if it gets rained on too soon or temperatures drop below 35°F overnight, adhesion fails and you'll see peeling within months. Early mornings are ideal: the surface has cooled overnight and dew has evaporated. Avoid painting in direct afternoon sun, which causes the paint to dry too quickly and can create lap marks. A professional crew will monitor weather forecasts and plan around ideal conditions.",
  "low-voc-paint-benefits": "Traditional paints contain volatile organic compounds (VOCs) — solvents that off-gas after application and contribute to indoor air pollution. High-VOC paints can cause headaches, dizziness, and respiratory irritation, particularly in poorly ventilated spaces. Low-VOC and zero-VOC formulations have dramatically improved over the past decade and now match or exceed conventional paints in durability, coverage, and color richness. They're the responsible choice for families with children, pets, or anyone sensitive to chemical exposure. We specify low-VOC products on all our interior projects as a standard practice.",
  "prep-makes-the-paint-job": "A freshly painted wall looks beautiful for about a week — until adhesion failures, bleed-through, or poor surface prep start to show. The truth is that the prep work — which most homeowners never see — determines whether a paint job lasts 3 years or 15. Proper prep involves thorough cleaning, scraping away loose paint, filling cracks and nail holes, sanding rough surfaces smooth, and applying the right primer for the substrate. On exterior projects, pressure washing removes oxidation and biological growth that would otherwise prevent bonding. Skipping or rushing these steps is the #1 reason DIY paint jobs fail prematurely.",
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const content = blogContent[slug!] ?? "Full article content coming soon.";

  return (
    <PageLayout>
      <SEO
        title={`${post.title} | Elite Painting Solutions Blog`}
        description={post.excerpt}
        canonicalPath={`/blog/${post.slug}`}
        ogType="article"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          articleJsonLd({
            title: post.title,
            description: post.excerpt,
            slug: post.slug,
            datePublished: toIsoDate(post.date),
          }),
        ]}
      />

      <PageHero
        eyebrow={post.category}
        title={post.title}
        subtitle={post.excerpt}
        breadcrumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
        variant="blog"
      />

      <section className="bg-background py-16 lg:py-24">
        <div className="container-tight max-w-3xl">
          <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {post.date}
            </span>
            <span className="rounded-full bg-[#111] px-3 py-1 font-black text-xs tracking-wide text-white">
              {post.category}
            </span>
          </div>

          <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-card mb-10 bg-secondary">
            <img
              src={post.image}
              alt={post.imageAlt}
              width={1280}
              height={720}
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-lg leading-relaxed text-muted-foreground">{content}</p>
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-card p-8 shadow-card">
            <h3 className="heading-display text-2xl text-secondary">Ready for a Free Quote?</h3>
            <p className="mt-2 text-muted-foreground">
              Let our team bring this expertise to your home. Contact us today.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-display font-black tracking-wide text-primary-foreground shadow-card transition-smooth hover:scale-[1.02]"
              >
                Get a Free Quote
              </Link>
              <a
                href={site.phoneHref}
                className="inline-flex items-center justify-center rounded-md border-2 border-[#111] px-6 py-3 font-display font-black tracking-wide text-[#111] hover:bg-[#111] hover:text-white transition-smooth"
              >
                Call {site.phone}
              </a>
            </div>
          </div>

          <Link
            to="/blog"
            className="mt-8 inline-flex items-center gap-2 font-display text-sm font-black tracking-wide text-[#111] hover:text-primary transition-smooth"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default BlogPost;

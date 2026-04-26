import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { SEO } from "@/components/SEO";
import { site } from "@/data/site";
import { breadcrumbJsonLd } from "@/lib/seo";

const posts = [
  {
    slug: "how-to-choose-paint-color",
    title: "How to Choose the Perfect Paint Color for Your Home",
    excerpt: "Picking a paint color can feel overwhelming. Here's our step-by-step process to landing on a shade you'll love for years.",
    date: "March 12, 2025",
    category: "Color Tips",
    image: "/gallery/softening-color.webp",
    imageAlt: "Soft, modern paint color on a freshly finished interior wall",
  },
  {
    slug: "interior-vs-exterior-paint",
    title: "Interior vs. Exterior Paint: What's the Real Difference?",
    excerpt: "Beyond the obvious, there are big differences in formulation, durability, and price. Here's what every homeowner should know.",
    date: "February 27, 2025",
    category: "Paint 101",
    image: "/gallery/ready-to-spray.webp",
    imageAlt: "Sprayer setup ready for an interior paint job",
  },
  {
    slug: "cabinet-refinishing-guide",
    title: "Cabinet Refinishing vs. Replacement — Which Saves More?",
    excerpt: "Cabinet refinishing can save you 60–70% over replacement. Here's how to decide which is right for your kitchen.",
    date: "February 10, 2025",
    category: "Cabinets",
    image: "/gallery/cabinet-kitchen.png",
    imageAlt: "Freshly refinished kitchen cabinets with a smooth enamel finish",
  },
  {
    slug: "best-time-to-paint-exterior",
    title: "When Is the Best Time of Year to Paint Your Home's Exterior?",
    excerpt: "Temperature, humidity, and rain all affect paint adhesion. Here's the ideal window for a flawless exterior finish.",
    date: "January 28, 2025",
    category: "Exterior",
    image: "/gallery/storefront.webp",
    imageAlt: "Beautifully painted Vero Beach home exterior",
  },
  {
    slug: "low-voc-paint-benefits",
    title: "Why We Use Low-VOC Paints (and Why You Should Care)",
    excerpt: "Low-VOC paints are healthier for your family, better for the environment, and the quality has caught up. Here's the breakdown.",
    date: "January 14, 2025",
    category: "Paint 101",
    image: "/gallery/beautiful-new-look.webp",
    imageAlt: "Bright interior room with a fresh low-VOC paint finish",
  },
  {
    slug: "prep-makes-the-paint-job",
    title: "Why Prep Work Is 80% of a Great Paint Job",
    excerpt: "The work you don't see is what makes the work you see last. Here's why we never skip the boring steps.",
    date: "December 30, 2024",
    category: "Process",
    image: "/gallery/how-we-do-it.webp",
    imageAlt: "Professional surface prep work in progress before painting",
  },
];

export { posts };

const Blog = () => {
  return (
    <PageLayout>
      <SEO
        title="Painting Tips & Advice | Elite Painting Solutions Blog"
        description="Expert painting tips, color selection guides, and home improvement advice from Elite Painting Solutions. Learn from professional painters with 30+ years of experience."
        canonicalPath="/blog"
        jsonLd={breadcrumbJsonLd([{ name: "Blog", path: "/blog" }])}
      />

      <PageHero
        eyebrow="Resources"
        title="Painting Tips & Advice"
        subtitle="Color guides, process deep-dives, and homeowner advice from a team of professional painters."
        breadcrumbs={[{ label: "Blog" }]}
        variant="blog"
      />

      <section className="bg-background py-16 lg:py-24">
        <div className="container-tight grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-smooth hover:-translate-y-1 hover:shadow-elegant"
            >
              <Link to={`/blog/${p.slug}`} className="block aspect-[4/3] w-full overflow-hidden bg-secondary">
                <img
                  src={p.image}
                  alt={p.imageAlt}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-3 text-xs">
                  <span className="rounded-full bg-[#111] px-2.5 py-1 font-black tracking-wide text-white">
                    {p.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {p.date}
                  </span>
                </div>
                <h2 className="heading-display text-xl text-secondary group-hover:text-[#111]">
                  {p.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {p.excerpt}
                </p>
                <Link
                  to={`/blog/${p.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-black tracking-wide text-primary"
                >
                  Read Article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default Blog;

import { useParams, Link, Navigate } from "react-router-dom";
import { MapPin, Phone, ArrowRight, Check } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import { SEO } from "@/components/SEO";
import { navAreas, services, site } from "@/data/site";
import { breadcrumbJsonLd } from "@/lib/seo";

const AreaPage = () => {
  const { slug } = useParams();
  const area = navAreas.find((a) => a.toLowerCase() === slug?.toLowerCase());

  if (!area) return <Navigate to="/404" replace />;

  return (
    <PageLayout>
      <SEO
        title={`Professional Painters in ${area} | Elite Painting Solutions`}
        description={`Elite Painting Solutions provides expert interior, exterior, cabinet, and commercial painting in ${area}. Fully licensed & insured. Free estimates. Call today for a quote.`}
        canonicalPath={`/areas/${area.toLowerCase()}`}
        jsonLd={breadcrumbJsonLd([
          { name: "Service Areas", path: "/#areas" },
          { name: area, path: `/areas/${area.toLowerCase()}` },
        ])}
      />

      <PageHero
        eyebrow="Service Area"
        title={`Painters in ${area}`}
        subtitle={`Trusted painting professionals serving ${area} and surrounding neighborhoods. From a single accent wall to a full exterior repaint, we deliver quality finishes that last.`}
        breadcrumbs={[{ label: "Service Areas", href: "/#areas" }, { label: area }]}
        variant="area"
      >
        <div className="flex flex-wrap gap-3">
          <a
            href="#quote"
            className="inline-flex items-center justify-center rounded-md bg-primary px-7 py-3.5 font-display font-black tracking-wide text-primary-foreground shadow-glow transition-smooth hover:scale-105"
          >
            Get a Free Quote
          </a>
          <a
            href={site.phoneHref}
            className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-7 py-3.5 font-display font-black tracking-wide text-white transition-smooth hover:bg-white hover:text-secondary"
          >
            <Phone className="h-5 w-5" /> {site.phone}
          </a>
        </div>
      </PageHero>

      <section className="bg-background py-16 lg:py-24">
        <div className="container-tight grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <span className="text-overline">Local Painting Professionals</span>
            <h2 className="heading-display mt-3 text-3xl text-secondary sm:text-4xl">
              Why {area} Homeowners Choose Elite Painting Solutions
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              We've been painting homes and businesses in {area} for years. Our crews know the local
              architectural styles, the climate challenges, and what it takes to deliver a finish
              that holds up beautifully season after season.
            </p>

            <ul className="mt-7 space-y-3">
              {[
                "Free in-home estimates within 24 hours",
                "Premium paints with manufacturer warranty",
                "Workmanship warranty on every project",
                "Fully licensed and insured",
                "Clean, uniformed, background-checked crews",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#111] text-white">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <span className="text-base text-foreground">{b}</span>
                </li>
              ))}
            </ul>

            <h3 className="heading-display mt-12 text-2xl text-secondary">Our Painting Services in {area}</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  to={s.href}
                  className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-smooth hover:border-[#111] hover:shadow-card"
                >
                  <span className="font-display font-black text-secondary group-hover:text-[#111]">
                    {s.title}
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>

            <h3 className="heading-display mt-12 text-2xl text-secondary">Nearby Service Areas</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {navAreas.filter((a) => a !== area).slice(0, 8).map((a) => (
                <Link
                  key={a}
                  to={`/areas/${a.toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-secondary transition-smooth hover:border-[#111] hover:bg-[#111] hover:text-white"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {a}
                </Link>
              ))}
            </div>
          </div>

          <aside id="quote" className="lg:sticky lg:top-28 lg:self-start">
            <QuoteForm heading={`Free Quote in ${area}`} />
          </aside>
        </div>
      </section>
    </PageLayout>
  );
};

export default AreaPage;

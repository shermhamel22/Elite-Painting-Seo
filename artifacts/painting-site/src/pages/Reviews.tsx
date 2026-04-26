import { Star } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { SEO } from "@/components/SEO";
import { site, reviews } from "@/data/site";
import { breadcrumbJsonLd } from "@/lib/seo";
import { Link } from "react-router-dom";

const ReviewsPage = () => {
  return (
    <PageLayout>
      <SEO
        title="Customer Reviews | Elite Painting Solutions — 5-Star Rated Painters"
        description="See what homeowners say about Elite Painting Solutions. Hundreds of 5-star reviews for interior, exterior, and cabinet painting. See why we're the most trusted painters in the area."
        canonicalPath="/reviews"
        jsonLd={breadcrumbJsonLd([{ name: "Reviews", path: "/reviews" }])}
      />

      <PageHero
        eyebrow="5-Star Rated"
        title="What Our Customers Say"
        subtitle="Real reviews from real homeowners. We earn our reputation one job at a time."
        breadcrumbs={[{ label: "Reviews" }]}
        variant="reviews"
      />

      <section className="bg-surface-warm py-16 lg:py-24">
        <div className="container-tight">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, i) => (
              <article
                key={i}
                className="flex flex-col rounded-2xl bg-card p-7 shadow-card animate-fade-in"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
              >
                <div className="mb-3 flex gap-0.5 text-primary">
                  {Array.from({ length: r.rating }).map((_, idx) => (
                    <Star key={idx} className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="flex-1 leading-relaxed text-muted-foreground">"{r.text}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111] font-display font-black text-white">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-display font-black text-secondary">{r.name}</div>
                    <div className="text-xs text-muted-foreground">Verified Customer</div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-border bg-card p-10 text-center shadow-card">
            <h2 className="heading-display text-3xl text-secondary">Loved Our Work?</h2>
            <p className="mt-3 text-muted-foreground">Leave us a review and help other homeowners find a painter they can trust.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="#review"
                className="inline-flex items-center justify-center rounded-md bg-[#111] px-7 py-3.5 font-display font-black tracking-wide text-white shadow-card transition-smooth hover:bg-primary"
              >
                Leave Us a Review
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-md border-2 border-[#111] px-7 py-3.5 font-display font-black tracking-wide text-[#111] transition-smooth hover:bg-[#111] hover:text-white"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ReviewsPage;

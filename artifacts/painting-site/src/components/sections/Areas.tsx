import { MapPin } from "lucide-react";
import { navAreas } from "@/data/site";
import { Link } from "react-router-dom";

export const Areas = () => {
  return (
    <section id="areas" className="py-20 text-white lg:py-28" style={{ background: "#0d0d0d" }}>
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-overline text-primary">Coverage</span>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            PROUDLY SERVING THESE AREAS
          </h2>
        </div>

        <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {navAreas.map((area) => (
            <li key={area}>
              <Link
                to={`/areas/${area.toLowerCase()}`}
                className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-medium transition-smooth hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
              >
                <MapPin className="h-4 w-4 shrink-0 text-primary transition-smooth group-hover:scale-110" />
                {area}
              </Link>
            </li>
          ))}
        </ul>

        {/* Google Maps */}
        <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-2xl border border-white/10">
          <iframe
            title="Service Area Map"
            src="https://maps.google.com/maps?q=painting+contractors&t=&z=11&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="420"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

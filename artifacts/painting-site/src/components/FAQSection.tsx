import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSectionProps {
  title?: string;
  eyebrow?: string;
  intro?: string;
  faqs: FAQItem[];
}

export const FAQSection = ({
  title = "Frequently Asked Questions",
  eyebrow = "FAQ",
  intro,
  faqs,
}: FAQSectionProps) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="bg-muted/40 py-16 lg:py-24">
      <div className="container-tight max-w-4xl">
        <div className="text-center">
          <span className="text-overline text-primary">{eyebrow}</span>
          <h2 className="heading-display mt-3 text-3xl text-secondary sm:text-4xl">
            {title}
          </h2>
          {intro ? (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {intro}
            </p>
          ) : null}
        </div>

        <Accordion
          type="single"
          collapsible
          className="mt-10 divide-y divide-border rounded-2xl border border-border bg-background shadow-card"
        >
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`faq-${i}`}
              className="border-0 px-6 last:rounded-b-2xl first:rounded-t-2xl"
            >
              <AccordionTrigger className="py-5 text-left font-display text-base font-black text-secondary hover:no-underline sm:text-lg">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

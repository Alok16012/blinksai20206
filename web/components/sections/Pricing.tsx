/* Server component — see the note in Proof.tsx. */
import clsx from "clsx";
import { pricing } from "@/lib/content";
import { Button, Reveal, SectionHead } from "@/components/ui";

/** §7.10 — self-qualify. Bands, not a price list: hiding price entirely loses more leads. */
export default function Pricing() {
  return (
    <section id="pricing" className="relative scroll-mt-24 py-24 lg:py-36">
      <div className="container-site">
        <SectionHead
          eyebrow="Engagement models"
          title={[
            "Three ways to work with us —",
            <span key="p" className="text-accent">
              all of them priced.
            </span>,
          ]}
          lead="Exact numbers depend on scope, but you should be able to tell in ten seconds whether we're in your range. Never discounted — the scope moves instead."
        />

        {/* Three square columns divided by hairlines, not three floating cards. The featured
            model is marked by fill and the amber badge, never by a shadow or a radius. */}
        <ul className="mt-16 grid border-l border-t border-line lg:grid-cols-3">
          {pricing.map((p, i) => (
            <Reveal
              as="li"
              key={p.model}
              delay={i * 80}
              className={clsx("relative border-b border-r border-line", p.featured && "bg-deck")}
            >
              {p.featured && (
                <span className="label absolute right-0 top-0 bg-signal px-3 py-2 text-carbon">
                  Recurring
                </span>
              )}

              <div className="flex h-full flex-col p-7 lg:p-9">
                <p className="label text-mute">{p.tier}</p>
                <h3 className="mt-4 text-d3">{p.model}</h3>
                <p className="mt-3 text-small text-mute">{p.who}</p>

                <p
                  className={clsx(
                    "mt-10 font-display text-d4 font-bold",
                    p.featured ? "text-accent" : "text-paper",
                  )}
                >
                  {p.band}
                </p>

                <ul className="mt-8 space-y-3 border-t border-line pt-8">
                  {p.shape.map((s) => (
                    <li key={s} className="flex items-start gap-3 text-small">
                      <span
                        className={clsx(
                          "mt-2 size-1.5 shrink-0 rounded-full",
                          p.featured ? "bg-signal" : "bg-mute",
                        )}
                      />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-10">
                  <Button
                    variant={p.featured ? "primary" : "ghost"}
                    drawer="details"
                    context={p.model.toLowerCase()}
                    className="w-full"
                  >
                    Get a fixed quote
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        <p className="mt-8 font-mono text-[0.6875rem] text-mute">
          Annual prepay = 2 months free · milestone billing on builds · growth retainers run a
          3-month initial term, then monthly
        </p>
      </div>
    </section>
  );
}

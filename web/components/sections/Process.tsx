/* Server component — see the note in Proof.tsx. */
import { process } from "@/lib/content";
import { Reveal, SectionHead } from "@/components/ui";

/** §7.9 — kill the "the developer will disappear" fear with visible structure. */
export default function Process() {
  return (
    <section className="relative py-24 lg:py-36">
      <div className="container-site">
        <SectionHead
          eyebrow="How we work"
          title={[
            "Five steps.",
            <span key="d" className="text-accent">
              Dates, not vibes.
            </span>,
          ]}
          lead="The most common thing that goes wrong with software vendors is silence. So the schedule is published, and there is a demo every week."
        />

        {/* A hard timeline: one full-width rule per step, the elapsed-time label pinned in a
            fixed-width mono column so the dates stack into a readable left edge. */}
        <ol className="mt-16 border-t border-line lg:mt-20">
          {process.map((step, i) => (
            <Reveal as="li" key={step.t} delay={i * 70} className="border-b border-line">
              <div className="grid gap-4 py-8 sm:grid-cols-[8rem_1fr] sm:gap-8 lg:grid-cols-[10rem_24rem_1fr] lg:gap-10 lg:py-10">
                <span className="label whitespace-nowrap pt-1 text-accent">{step.t}</span>
                <h3 className="text-d3">{step.title}</h3>
                <p className="text-lead text-mute sm:col-start-2 lg:col-start-3 lg:pt-1">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

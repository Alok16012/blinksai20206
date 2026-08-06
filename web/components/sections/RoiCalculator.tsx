"use client";

import { useMemo, useState } from "react";
import { Button, Reveal, SectionHead } from "@/components/ui";

/**
 * §7.11 — "How much is your manual follow-up costing you?"
 *
 * The model is deliberately simple and its assumptions are printed on screen. A
 * calculator that hides its maths is a sales trick; one that shows them is a tool,
 * and tools get shared. The gate is on the PDF, never on the calculation.
 */

const CLOSE_RATE = 0.1; // deals closed per contacted, responsively-handled enquiry

/** Slower replies convert worse. 0 min → 1.0, ~90 min → 0.53, a day later → 0.25. */
const responseFactor = (minutes: number) => 0.25 + 0.75 * Math.exp(-minutes / 90);

const inr = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

const RESPONSE_STEPS = [2, 15, 60, 240, 720, 1440];
const responseLabel = (m: number) =>
  m < 60 ? `${m} min` : m < 1440 ? `${m / 60} hr` : "next day";

export default function RoiCalculator() {
  const [enquiries, setEnquiries] = useState(120);
  const [value, setValue] = useState(35000);
  const [coverage, setCoverage] = useState(55);
  const [responseIdx, setResponseIdx] = useState(3);

  const minutes = RESPONSE_STEPS[responseIdx];

  const result = useMemo(() => {
    const rf = responseFactor(minutes);
    const now = enquiries * (coverage / 100) * rf * CLOSE_RATE;
    const automated = enquiries * 0.98 * responseFactor(0.1) * CLOSE_RATE;
    const gap = Math.max(0, automated - now);
    return {
      nowDeals: now,
      autoDeals: automated,
      leakMonth: gap * value,
      leakYear: gap * value * 12,
      nowRevenue: now * value,
      autoRevenue: automated * value,
      rf,
    };
  }, [enquiries, value, coverage, minutes]);

  const pct = Math.min(100, (result.nowRevenue / Math.max(1, result.autoRevenue)) * 100);

  return (
    <section id="calculator" className="relative scroll-mt-24 py-24 lg:py-36">
      <div className="container-site">
        <SectionHead
          eyebrow="Free tool"
          accent="mint"
          title={[
            "How much is manual follow-up",
            <span key="l1">
              <span className="text-accent">costing you every month?</span>
            </span>,
          ]}
          lead="Four inputs. The maths is printed below the result — change any assumption you disagree with and the number moves."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          {/* Inputs */}
          <Reveal className="lg:col-span-7">
            <div className="panel h-full p-6 sm:p-10">
              <Slider
                label="Enquiries per month"
                value={enquiries}
                min={10}
                max={1000}
                step={10}
                display={`${enquiries}`}
                onChange={setEnquiries}
              />
              <Slider
                label="Average deal value"
                value={value}
                min={5000}
                max={1000000}
                step={5000}
                display={inr(value)}
                onChange={setValue}
              />
              <Slider
                label="Enquiries you actually follow up today"
                value={coverage}
                min={5}
                max={100}
                step={5}
                display={`${coverage}%`}
                onChange={setCoverage}
              />
              <Slider
                label="Typical time to first reply"
                value={responseIdx}
                min={0}
                max={RESPONSE_STEPS.length - 1}
                step={1}
                display={responseLabel(minutes)}
                onChange={setResponseIdx}
                last
              />
            </div>
          </Reveal>

          {/* Result */}
          <Reveal delay={80} className="lg:col-span-5">
            <div className="panel noise relative flex h-full flex-col p-6 sm:p-10">
              <p className="label relative text-mute">Leaking every month</p>
              <p className="relative mt-4 font-display text-stat font-bold text-accent">
                {inr(result.leakMonth)}
              </p>
              <p className="relative mt-4 text-small text-mute">
                {inr(result.leakYear)} a year · about{" "}
                {(result.autoDeals - result.nowDeals).toFixed(1)} deals a month you never got to.
              </p>

              <div className="relative mt-10 space-y-4">
                <Bar label="Today" pct={pct} value={inr(result.nowRevenue)} tone="mute" />
                <Bar label="With automation" pct={100} value={inr(result.autoRevenue)} tone="signal" />
              </div>

              <div className="relative mt-auto border-t border-line pt-8">
                <Button
                  drawer="details"
                  context="the ROI calculator result"
                  className="w-full"
                >
                  Send me this as a PDF
                </Button>
                <p className="mt-3 font-mono text-[0.625rem] leading-relaxed text-mute">
                  The number above is free. The PDF breakdown comes on WhatsApp.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <details className="mt-4 border border-line p-6 sm:p-8">
          <summary className="label cursor-pointer text-mute">How this is calculated</summary>
          <div className="mt-5 space-y-2.5 text-small text-mute">
            <p>
              Deals ≈ enquiries × follow-up coverage × response factor × a {CLOSE_RATE * 100}% close
              rate on properly handled enquiries.
            </p>
            <p>
              Response factor decays from 1.0 at an instant reply to 0.25 by the next day — currently{" "}
              <span className="font-mono text-paper">{result.rf.toFixed(2)}</span> at{" "}
              {responseLabel(minutes)}.
            </p>
            <p>
              The automated column assumes 98% coverage and a reply in seconds, which is what the
              WhatsApp + IVR layer actually does. It does not assume a better sales team.
            </p>
            <p className="text-mute/70">
              An estimate for sizing the problem, not a forecast. Swap in your own close rate during
              the discovery call and we&apos;ll rerun it.
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}

/**
 * Square track, square thumb. The thumb is a tall narrow slab rather than a knob —
 * a fader, not a dial, which is the register the rest of the page is in.
 */
function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
  last,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-8 border-b border-line pb-8"}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={label} className="label text-mute">
          {label}
        </label>
        <span className="font-display text-d3 font-bold text-paper">{display}</span>
      </div>
      <input
        id={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-5 h-1.5 w-full cursor-pointer appearance-none bg-deck-2 accent-[color:var(--color-signal)] [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-signal [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-signal"
      />
    </div>
  );
}

function Bar({
  label,
  pct,
  value,
  tone,
}: {
  label: string;
  pct: number;
  value: string;
  tone: "mute" | "signal";
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="label text-mute">{label}</span>
        <span
          className={
            tone === "signal" ? "font-mono text-small text-accent" : "font-mono text-small text-paper"
          }
        >
          {value}
        </span>
      </div>
      <div className="mt-2.5 h-2.5 bg-deck-2">
        <div
          className={`h-full transition-[width] duration-500 ${
            tone === "signal" ? "bg-signal" : "bg-mute/60"
          }`}
          style={{ width: `${Math.max(3, pct)}%` }}
        />
      </div>
    </div>
  );
}

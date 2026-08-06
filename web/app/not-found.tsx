import Link from "next/link";
import { Button, Reveal } from "@/components/ui";

/**
 * Root 404 — also serves every unmatched URL (Next.js file convention).
 * Control-room read: the route is missing, the system is not.
 */
export default function NotFound() {
  return (
    <section className="relative py-20 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor" />

      <div className="container-site relative">
        <div className="max-w-2xl">
          <Reveal>
            <p className="label flex items-center gap-2.5 text-mute">
              <span className="size-1.5 rounded-full bg-signal blink" />
              <span className="text-paper/80">404</span>
              <span className="text-mute/40">·</span>
              <span>route not found</span>
            </p>
          </Reveal>

          <Reveal delay={70}>
            <h1 className="mt-5 text-[clamp(2rem,5.2vw,3.25rem)] leading-[1.02] tracking-[-0.025em]">
              This route isn&rsquo;t on the board.
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-5 text-lead text-mute">
              The page you asked for doesn&rsquo;t exist — moved, mistyped, or never shipped.
              Everything else is still running.
            </p>
          </Reveal>

          <Reveal delay={210}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button drawer="whatsapp" context="404 page" className="w-full sm:w-auto">
                Talk to us
              </Button>
              <Button variant="ghost" href="/platforms" className="w-full sm:w-auto">
                See the 8 platforms
              </Button>
              <Button variant="ghost" href="/work" className="w-full sm:w-auto">
                See our work
              </Button>
            </div>
          </Reveal>

          <Reveal delay={280}>
            <p className="mt-10 hairline pt-6 font-mono text-[0.6875rem] text-mute">
              Or start again from the{" "}
              <Link href="/" className="text-accent underline-offset-4 hover:underline">
                homepage
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

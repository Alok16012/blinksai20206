import Image from "next/image";
import Link from "next/link";
import { industries, megaMenu, platforms, site } from "@/lib/content";

const CITIES = ["Nashik", "Pune", "Mumbai", "Nagpur", "Aurangabad", "Thane", "Kolhapur", "Ahmedabad"];

export default function Footer() {
  return (
    <footer className="band-dark relative overflow-hidden border-t border-line pb-28 pt-20 sm:pb-16 lg:pt-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-50" />

      <div className="container-site relative">
        {/* Oversized wordmark — the reference signs off loud */}
        <Image
          src="/blinksai-wordmark.png"
          alt="BlinksAI"
          width={340}
          height={152}
          sizes="(min-width: 1024px) 420px, 60vw"
          className="h-16 w-auto lg:h-24"
        />
        <p className="mt-6 max-w-md text-lead text-mute">
          A growth engineering company. We build the system, automate it, and fill it with
          customers.
        </p>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <FooterCol
            title="Platforms"
            links={platforms.slice(0, 6).map((p) => ({
              label: p.product,
              href: `/platforms/${p.slug}`,
            }))}
          />
          {megaMenu.map((c) => (
            <FooterCol
              key={c.pillar}
              title={c.pillar}
              links={c.links.map((l) => ({ label: l.label, href: l.href }))}
            />
          ))}
        </div>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 lg:grid-cols-3">
          <div>
            <p className="label text-mute">Contact</p>
            <p className="mt-4 text-lead">
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-accent">
                {site.email}
              </a>
            </p>
            <p className="text-lead">
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-accent"
              >
                {site.phone}
              </a>
            </p>
            <p className="mt-3 text-small text-mute">{site.city}</p>
          </div>

          {/* Service × city block — programmatic SEO surface (PRD §12) */}
          <div>
            <p className="label text-mute">WhatsApp automation in</p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {CITIES.map((c) => (
                <li key={c}>
                  <Link
                    href={`/whatsapp-automation-in-${c.toLowerCase()}`}
                    className="text-small text-mute transition-colors hover:text-paper"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label text-mute">Industries</p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {industries.map((i) => (
                <li key={i.slug}>
                  <Link
                    href={`/industries/${i.slug}`}
                    className="text-small text-mute transition-colors hover:text-paper"
                  >
                    {i.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.6875rem] text-mute">
            © {new Date().getFullYear()} BlinksAI · Founded by {site.founder} · GST / CIN on
            request · Privacy · Terms
          </p>
          <p className="flex items-center gap-2 font-mono text-[0.6875rem] text-mute">
            <span className="size-1.5 rounded-full bg-mint" />
            Last deployment: {site.lastDeploy}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="label text-paper">{title}</h3>
      <ul className="mt-5">
        {links.map((l) => (
          <li key={l.label + l.href}>
            <Link
              href={l.href}
              className="block border-t border-line py-2.5 text-small text-mute transition-colors hover:text-accent"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

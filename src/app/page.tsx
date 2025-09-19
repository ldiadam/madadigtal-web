import Image from "next/image";

import { ContactForm } from "@/components/contact-form";
import { getLandingContent } from "@/lib/landing-content";

export default async function Home() {
  const content = await getLandingContent();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-[family-name:var(--font-geist-sans)]">
      <header className="border-b border-white/10 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6 sm:px-10">
          <div className="flex flex-col text-sm">
            <span className="text-lg font-semibold tracking-tight">Mada Digital</span>
            <span className="text-xs text-white/60">PT. Mada Digital Creative</span>
          </div>
          <a
            href="mailto:hello@madadigital.id"
            className="hidden rounded-full border border-white/20 px-4 py-2 text-sm font-medium transition hover:border-white hover:bg-white hover:text-slate-950 sm:inline-flex"
          >
            Book a discovery call
          </a>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
            <div className="space-y-6 text-balance">
              <span className="inline-flex rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
                Software house & digital product studio
              </span>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Build memorable products that launch fast and scale with confidence.
              </h1>
              <p className="max-w-xl text-base text-white/70 sm:text-lg">
                Mada Digital helps visionary teams architect, design, and deliver cloud-native software with measurable impact. From idea validation to multi-region deployment, we define the path and build alongside you.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:hello@madadigital.id"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
                >
                  Schedule a strategy session
                </a>
                <a
                  href="#case-studies"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:border-white"
                >
                  View recent work
                </a>
              </div>
            </div>
            <div className="relative h-80 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg shadow-slate-950/50 sm:h-96">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                alt="Developers collaborating in a modern workspace"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                priority
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-slate-950/70 px-4 py-3 text-sm backdrop-blur">
                <p className="font-medium">Trusted by founders and product leaders across fintech, retail, and media.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-slate-950/60">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">What we deliver</h2>
            <p className="mt-3 max-w-2xl text-sm text-white/70 sm:text-base">
              A multidisciplinary team from PT. Mada Digital Creative plugs into your roadmap, focusing on the outcomes that matter most to your customers.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {content.services.map((service) => (
                <div
                  key={service.title}
                  className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-md shadow-slate-950/40"
                >
                  <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                  <p className="mt-3 text-sm text-white/70">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10" id="case-studies">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white sm:text-3xl">Recent engagements</h2>
                <p className="mt-2 max-w-xl text-sm text-white/70 sm:text-base">
                  We tailor squads around each partner, pairing discovery, visual design, and full-stack engineering to ship production-ready releases.
                </p>
              </div>
              <a
                href="mailto:projects@madadigital.id"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white"
              >
                Request full case study deck
              </a>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {content.caseStudies.map((item) => (
                <article
                  key={item.name}
                  className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/70 p-6 transition hover:border-white/30 hover:bg-slate-900"
                >
                  <header>
                    <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                    <p className="mt-2 text-sm uppercase tracking-wide text-emerald-300/80">{item.metric}</p>
                  </header>
                  <p className="mt-4 text-sm text-white/70">{item.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                    Mada Digital delivery snapshot
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-slate-900/70">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">Why teams choose Mada Digital</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {content.highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-3xl border border-white/10 bg-slate-950/70 p-6"
                >
                  <h3 className="text-lg font-semibold text-white">{highlight.title}</h3>
                  <p className="mt-3 text-sm text-white/70">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10" id="contact">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
              <div className="space-y-6 text-pretty">
                <span className="text-sm uppercase tracking-[0.3em] text-white/60">Let&apos;s build</span>
                <h2 className="text-3xl font-semibold sm:text-4xl">
                  Ready to craft the next standout experience? Partner with PT. Mada Digital Creative and ship with momentum.
                </h2>
                <p className="max-w-2xl text-sm text-white/70 sm:text-base">
                  Share your product vision, and we&apos;ll respond within one business day with suggested approaches, timelines, and a curated team. Prefer live conversations? Pick a slot that suits you and meet the squad.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href="mailto:hello@madadigital.id"
                    className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                  >
                    Start a project inquiry
                  </a>
                  <a
                    href="https://cal.com/placeholder/madadigital"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
                  >
                    Explore collaboration call
                  </a>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p>© {new Date().getFullYear()} PT. Mada Digital Creative — Mada Digital.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="mailto:hello@madadigital.id" className="transition hover:text-white">
              hello@madadigital.id
            </a>
            <a href="https://www.linkedin.com" className="transition hover:text-white">
              LinkedIn
            </a>
            <a href="https://www.instagram.com" className="transition hover:text-white">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

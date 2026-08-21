import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/landing/Logo";
import { HeroDemo } from "@/components/landing/HeroDemo";
import { Reveal } from "@/components/landing/Reveal";
import { SeedPacketCard } from "@/components/landing/SeedPacketCard";
import { MobileNav } from "@/components/landing/MobileNav";

const AGE_VARIANTS = [
  {
    band: "8–11",
    text: "Turn the lug nuts a little bit to the left with the wrench, but don't take them all the way off yet.",
  },
  {
    band: "12–15",
    text: "Using the lug wrench, turn each lug nut counterclockwise about a quarter turn to loosen it. Don't remove them fully yet — the tire is still on the ground.",
  },
  {
    band: "16–18",
    text: "With the tire still on the ground for resistance, use the lug wrench to break each lug nut loose by turning counterclockwise about a quarter turn.",
  },
];

const RACK: Array<{
  href: string;
  color: "vehicle" | "home" | "tools" | "kitchen" | "money" | "personal";
  category: string;
  title: string;
  image?: { src: string; alt: string };
  steps: number;
  needsAdult: boolean;
}> = [
  {
    href: "/tutorials/checking-engine-oil",
    color: "vehicle",
    category: "Vehicle Maintenance",
    title: "Checking engine oil",
    image: {
      src: "/landing/checking-engine-oil.jpg",
      alt: "Person checking a car's engine oil level with a dipstick, hood open",
    },
    steps: 4,
    needsAdult: true,
  },
  {
    href: "/tutorials/unblocking-a-toilet",
    color: "home",
    category: "Home Repairs",
    title: "Unblocking a toilet",
    image: {
      src: "/tutorials/cmt07liqq0029l6euazy1y9d7/cmt07liqq002al6euqi8vrle5.png",
      alt: "Toilet plunger beside a toilet",
    },
    steps: 4,
    needsAdult: true,
  },
  {
    href: "/tutorials/using-a-cordless-drill",
    color: "tools",
    category: "Tool Use",
    title: "Using a cordless drill",
    image: {
      src: "/tutorials/cmt07lggu001zl6euntdtl3oy/cmt07lggu0020l6eufkjfl39h.png",
      alt: "Cordless drill driving a screw into wood",
    },
    steps: 4,
    needsAdult: true,
  },
  {
    href: "/tutorials/cooking-rice-perfectly",
    color: "kitchen",
    category: "Kitchen Skills",
    title: "Cooking rice perfectly",
    image: {
      src: "/tutorials/cmt07lo5p002yl6eubpanquy1/cmt07lo5q002zl6euc4qt5w2c.png",
      alt: "Bowl of rice with a spoon",
    },
    steps: 4,
    needsAdult: true,
  },
  {
    href: "/tutorials/making-a-budget-spreadsheet",
    color: "money",
    category: "Money & Admin",
    title: "Making a budget spreadsheet",
    image: {
      src: "/landing/making-a-budget-spreadsheet.jpg",
      alt: "Person at a laptop filling in a monthly budget spreadsheet, with a calculator and coffee mug nearby",
    },
    steps: 5,
    needsAdult: false,
  },
  {
    href: "/tutorials/ironing-a-shirt",
    color: "personal",
    category: "Personal Care",
    title: "Ironing a shirt",
    image: {
      src: "/tutorials/cmt07lfd0001ul6euedwcusk9/cmt07lfd0001vl6euxh3hu2hm.png",
      alt: "Ironing a shirt on an ironing board",
    },
    steps: 4,
    needsAdult: true,
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header — galvanized steel structural bar */}
      <header className="sticky top-0 z-[var(--z-sticky)] bg-surface-structural">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3.5">
          <Logo onDark />
          <nav className="hidden items-center gap-6 text-sm text-steel-300 sm:flex">
            <Link
              href="/tutorials"
              className="rounded-sm transition-colors hover:text-surface-structural-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Tutorials
            </Link>
            <a
              href="#how-it-works"
              className="rounded-sm transition-colors hover:text-surface-structural-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              How it works
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/signin"
              className="rounded-sm px-3 py-1.5 text-sm font-medium text-steel-300 transition-colors hover:text-surface-structural-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Sign in
            </Link>
            <Link href="/signup">
              <Button size="sm">Start learning</Button>
            </Link>
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero — the rack's lead packet, opened */}
        <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-14 sm:pt-20">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-8">
            <div className="flex flex-1 flex-col items-center gap-5 text-center lg:items-start lg:text-left">
              <Reveal>
                <h1 className="max-w-md font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
                  Real skills, taught step by step.
                </h1>
              </Reveal>
              <Reveal delay={90}>
                <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
                  Changing a tire, wiring a plug, and more, guided by a mentor tuned to your age.
                </p>
              </Reveal>
              <Reveal delay={180} className="flex flex-col gap-3 sm:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start learning
                  </Button>
                </Link>
                <Link href="/tutorials">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Browse tutorials
                  </Button>
                </Link>
              </Reveal>
              <Reveal delay={260}>
                <p className="font-mono text-xs tabular-nums text-muted-foreground">
                  22 tutorials · 6 categories · free to start
                </p>
              </Reveal>
            </div>

            <div className="flex flex-1 justify-center lg:justify-end">
              <HeroDemo />
            </div>
          </div>
        </section>

        {/* The Rack — browse by category */}
        <section className="border-y border-border-structural/20 bg-muted py-14 sm:py-16">
          <div className="mx-auto w-full max-w-6xl px-6">
            <Reveal className="mb-6 flex items-end justify-between gap-4">
              <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Pick one off the rack
              </h2>
              <Link
                href="/tutorials"
                className="hidden shrink-0 rounded-sm text-sm font-medium text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:block"
              >
                See all 22 →
              </Link>
            </Reveal>
            <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:snap-none sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6">
              {RACK.map((item, i) => (
                <Reveal key={item.href} delay={i * 60} className="w-40 shrink-0 snap-start sm:w-auto">
                  <SeedPacketCard
                    href={item.href}
                    color={item.color}
                    category={item.category}
                    title={item.title}
                    image={item.image}
                    steps={item.steps}
                    needsAdult={item.needsAdult}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Feature row 1 — age-adapted content, almanac table */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-5 lg:items-center lg:gap-14">
            <Reveal className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Tutorials that grow up with you
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The same step, written three different ways. An 8-year-old and a 17-year-old need
                different words. Every tutorial gets both.
              </p>
            </Reveal>
            <div className="overflow-hidden rounded-md border border-border bg-card lg:col-span-3">
              {AGE_VARIANTS.map((variant, i) => (
                <Reveal key={variant.band} delay={i * 90}>
                  <div
                    className={`flex items-start gap-4 p-4 ${
                      i !== 0 ? "border-t border-border" : ""
                    }`}
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-xs tabular-nums text-primary">
                      AGE {variant.band}
                    </span>
                    <p className="text-sm leading-relaxed text-card-foreground">{variant.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Feature row 2 — mentor, another packet back */}
        <section className="border-y border-border-structural/20 bg-muted py-20 sm:py-28">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-2 lg:items-center lg:gap-14">
            <Reveal className="order-2 lg:order-1">
              <div className="overflow-hidden rounded-md border border-border bg-card shadow-soft">
                <div className="flex items-center justify-between bg-packet-home px-4 py-2.5 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-label">
                    Wiring a Plug
                  </span>
                  <span className="font-mono text-xs tabular-nums">Step 4 / 5</span>
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <p className="max-w-[85%] self-end rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">
                    Which wire goes where again?
                  </p>
                  <p className="max-w-[85%] self-start rounded-md bg-muted px-3 py-2 text-sm text-foreground">
                    Brown to live (L), blue to neutral (N), and green-and-yellow to earth. Want a
                    tip for remembering the order?
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100} className="order-1 lg:order-2">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                A mentor that actually helps
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Stuck on a step? Ask right there. The AI mentor knows exactly which tutorial and
                step you&rsquo;re on, and answers in language built for your age band.
              </p>
              <p className="mt-4 flex items-start gap-2 text-sm text-foreground">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-primary"
                >
                  <path
                    d="M8 1.5 2 3.75v3.5c0 4 2.5 6.25 6 7.25 3.5-1 6-3.25 6-7.25v-3.5L8 1.5Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                  <path d="M5.5 8.25 7.25 10 10.5 6.25" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>
                  Hands-on tasks flag exactly when to grab an adult — wiring a plug and 17 other
                  tutorials carry a built-in safety check.
                </span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* How it works — instruction-sheet steps */}
        <section id="how-it-works" className="mx-auto w-full max-w-4xl px-6 py-20 sm:py-28">
          <Reveal className="mb-10">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              How it works
            </h2>
          </Reveal>
          <div className="overflow-hidden rounded-md border border-border bg-card">
            {[
              {
                n: "1",
                title: "Pick a skill",
                body: "Browse 22 tutorials across six categories, from car care to the kitchen.",
              },
              {
                n: "2",
                title: "Follow along",
                body: "Every step is written three ways, matched to your age band automatically.",
              },
              {
                n: "3",
                title: "Ask if you're stuck",
                body: "Your AI mentor answers questions about the exact step you're on.",
              },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 110}>
                <div
                  className={`flex items-start gap-4 p-5 ${i !== 0 ? "border-t border-border" : ""}`}
                >
                  <span className="font-mono text-lg font-bold tabular-nums text-primary">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border bg-card py-20 sm:py-28">
          <Reveal className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 px-6 text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Ready to learn something real?
            </h2>
            <p className="text-sm text-muted-foreground">
              Start your first tutorial free. No credit card, just a mentor who&rsquo;s ready when you
              are.
            </p>
            <Link href="/signup">
              <Button size="lg">Start learning</Button>
            </Link>
          </Reveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-structural py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
          <Logo onDark />
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-steel-300">
            <Link
              href="/tutorials"
              className="rounded-sm transition-colors hover:text-surface-structural-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Tutorials
            </Link>
            <Link
              href="/signin"
              className="rounded-sm transition-colors hover:text-surface-structural-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-sm transition-colors hover:text-surface-structural-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Start learning
            </Link>
          </nav>
          <p className="font-mono text-xs text-steel-300">
            &copy; {new Date().getFullYear()} Skill&nbsp;Up.
          </p>
        </div>
      </footer>
    </div>
  );
}

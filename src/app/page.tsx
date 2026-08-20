import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/landing/Logo";
import { HeroDemo } from "@/components/landing/HeroDemo";
import { Reveal } from "@/components/landing/Reveal";
import { TUTORIAL_CATEGORIES } from "@/lib/tutorials/categories";

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

const MOSAIC = [
  { src: "/tutorials/cmt07lggu001zl6euntdtl3oy/cmt07lggu0020l6eufkjfl39h.png", alt: "Cordless drill driving a screw into wood", big: true },
  { src: "/tutorials/cmt07l8en000yl6eur7kwhvfl/cmt07l8eo000zl6eu7l0uobjg.png", alt: "Hands washing at a sink", big: false },
  { src: "/tutorials/cmt07liqq0029l6euazy1y9d7/cmt07liqq002al6euqi8vrle5.png", alt: "Toilet plunger beside a toilet", big: false },
  { src: "/tutorials/cmt07lo5p002yl6eubpanquy1/cmt07lo5q002zl6euc4qt5w2c.png", alt: "Bowl of rice with a spoon", big: false },
  { src: "/tutorials/cmt07l3zg000dl6euhfvgy714/cmt07l3zg000el6euhd00w9mi.png", alt: "Light switch on a wall", big: true },
  { src: "/tutorials/cmt07lfd0001ul6euedwcusk9/cmt07lfd0001vl6euxh3hu2hm.png", alt: "Ironing a shirt on an ironing board", big: false },
];

const STEPS = [
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
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <Link href="/tutorials" className="hover:text-foreground">
              Tutorials
            </Link>
            <a href="#how-it-works" className="hover:text-foreground">
              How it works
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/signin">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero — product-dominant */}
        <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-14 sm:pt-24">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-8">
            <div className="flex flex-1 flex-col items-center gap-5 text-center lg:items-start lg:text-left">
              <Reveal>
                <h1 className="max-w-sm text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:max-w-md sm:text-[2.75rem]">
                  Real skills, taught step by step.
                </h1>
              </Reveal>
              <Reveal delay={90}>
                <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
                  Changing a tire, wiring a plug, and more — with a mentor tuned to your age.
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
                <p className="text-xs text-muted-foreground">
                  22 tutorials across 6 categories — free to start.
                </p>
              </Reveal>
            </div>

            <div className="flex flex-1 justify-center lg:justify-end">
              <HeroDemo />
            </div>
          </div>
        </section>

        {/* Proof strip */}
        <section className="border-y border-border bg-card py-8">
          <Reveal className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">22 step-by-step tutorials</span> across
              six categories, each written for three age bands.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {TUTORIAL_CATEGORIES.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  {category}
                </span>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Feature row 1 — age-adapted content compare */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-5 lg:items-center lg:gap-14">
            <Reveal className="lg:col-span-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Tutorials that grow up with you
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The same step, written three different ways. An 8-year-old and a 17-year-old need
                different words — every tutorial gets both.
              </p>
            </Reveal>
            <div className="flex flex-col gap-3 lg:col-span-3">
              {AGE_VARIANTS.map((variant, i) => (
                <Reveal key={variant.band} delay={i * 90}>
                  <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <span className="mt-0.5 shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      Age {variant.band}
                    </span>
                    <p className="text-sm leading-relaxed text-card-foreground">{variant.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Feature row 2 — mentor */}
        <section className="border-y border-border bg-card py-20 sm:py-28">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-2 lg:items-center lg:gap-14">
            <Reveal className="order-2 lg:order-1">
              <div className="flex flex-col gap-2 rounded-lg border border-border bg-background p-4 shadow-soft">
                <p className="text-xs font-medium text-muted-foreground">
                  Wiring a Plug — Connect the wires to the right terminals
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <p className="max-w-[85%] self-end rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
                    Which wire goes where again?
                  </p>
                  <p className="max-w-[85%] self-start rounded-lg bg-muted px-3 py-2 text-sm text-foreground">
                    Brown to live (L), blue to neutral (N), and green-and-yellow to earth. Want a
                    tip for remembering the order?
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100} className="order-1 lg:order-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                A mentor that actually helps
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Stuck on a step? Ask right there. The AI mentor knows exactly which tutorial and
                step you&rsquo;re on, and answers in language built for your age band.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Feature row 3 — mosaic */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <Reveal className="mb-8 max-w-lg">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Skills for actual life
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              From jump-starting a car to sewing a button back on — the things you&rsquo;ll actually
              need, not textbook filler.
            </p>
          </Reveal>
          <div className="grid grid-cols-3 grid-rows-2 gap-3 sm:gap-4">
            {MOSAIC.map((tile, i) => (
              <Reveal
                key={tile.src}
                delay={i * 60}
                className={tile.big ? "col-span-2 row-span-1" : "col-span-1 row-span-1"}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-white">
                  <Image
                    src={tile.src}
                    alt={tile.alt}
                    fill
                    sizes="(min-width: 640px) 33vw, 45vw"
                    className="object-cover scale-150 transition-transform duration-300 hover:scale-[1.65]"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-y border-border bg-card py-20 sm:py-28">
          <div className="mx-auto w-full max-w-4xl px-6">
            <Reveal className="mb-12 text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                How it works
              </h2>
            </Reveal>
            <div className="relative grid gap-10 sm:grid-cols-3 sm:gap-6">
              <div
                aria-hidden="true"
                className="absolute left-0 right-0 top-6 hidden border-t border-dashed border-border sm:block"
              />
              {STEPS.map((step, i) => (
                <Reveal key={step.n} delay={i * 110} className="relative flex flex-col items-center text-center">
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-base font-semibold text-primary">
                    {step.n}
                  </span>
                  <h3 className="mt-4 text-sm font-medium text-foreground">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{step.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-primary/5 py-20 sm:py-28">
          <Reveal className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 px-6 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Ready to learn something real?
            </h2>
            <p className="text-sm text-muted-foreground">
              Start your first tutorial free — no credit card, just a mentor who&rsquo;s ready when you
              are.
            </p>
            <Link href="/signup">
              <Button size="lg">Start learning</Button>
            </Link>
          </Reveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/tutorials" className="hover:text-foreground">
              Tutorials
            </Link>
            <Link href="/signin" className="hover:text-foreground">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-foreground">
              Get started
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Skill Up.
          </p>
        </div>
      </footer>
    </div>
  );
}

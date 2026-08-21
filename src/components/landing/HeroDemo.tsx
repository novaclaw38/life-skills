import Image from "next/image";
import { ProgressRing } from "@/components/ProgressRing";
import { Reveal } from "@/components/landing/Reveal";

export function HeroDemo() {
  return (
    <div className="relative w-full max-w-md sm:max-w-lg">
      {/* The packet front, peeking out from behind the opened instructional back */}
      <div
        aria-hidden="true"
        className="absolute -right-3 top-6 hidden h-40 w-28 -rotate-6 overflow-hidden rounded-md border border-border bg-card shadow-soft sm:block"
      >
        <div className="flex h-8 items-center bg-packet-vehicle px-2 text-[10px] font-bold uppercase tracking-label text-white">
          Vehicle
        </div>
        <div className="relative h-full w-full">
          <Image
            src="/tutorials/cmt07lbvw001fl6eu95e0hnra/cmt07lbvw001gl6eu1b89iw86.png"
            alt=""
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
      </div>

      {/* The instructional back, flipped open */}
      <Reveal variant="pop" delay={120} className="relative">
        <div className="flip-in relative overflow-hidden rounded-[var(--radius-panel)] border border-border bg-card shadow-float">
          <div className="flex items-center justify-between border-b border-border bg-packet-vehicle px-4 py-2.5 text-white">
            <span className="text-[11px] font-bold uppercase tracking-label">
              Jump-Starting a Car
            </span>
            <span className="font-mono text-xs tabular-nums">Step 3 / 6</span>
          </div>

          <div className="relative aspect-[16/10] w-full bg-kraft-0">
            <Image
              src="/tutorials/cmt07lbvw001fl6eu95e0hnra/cmt07lbvw001gl6eu1b89iw86.png"
              alt="Illustration of jumper cables connecting two car batteries"
              fill
              sizes="(min-width: 640px) 32rem, 90vw"
              className="object-contain p-3"
              priority
            />
          </div>

          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-sm font-bold text-card-foreground">
                  Connect the cables in order
                </h3>
                <p className="text-xs text-muted-foreground">Ask your mentor if you get stuck</p>
              </div>
              <ProgressRing percent={50} />
            </div>

            <div className="flex flex-col gap-2 rounded-md border border-border bg-background p-2.5">
              <p className="max-w-[85%] self-end rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">
                Which cable goes on first?
              </p>
              <p className="max-w-[85%] self-start rounded-md bg-muted px-3 py-2 text-sm text-foreground">
                Red to the dead battery&rsquo;s positive terminal first. Ready for the next cable?
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal
        variant="pop"
        delay={520}
        className="absolute -left-4 top-36 z-[var(--z-raised)] hidden sm:-left-10 sm:block"
      >
        <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 shadow-float">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2.5 6.5L4.8 8.8L9.5 3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="leading-tight">
            <p className="text-xs font-medium text-foreground">Step complete</p>
            <p className="text-[11px] text-muted-foreground">3 steps to go</p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

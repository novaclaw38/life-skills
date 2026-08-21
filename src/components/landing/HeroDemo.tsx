import Image from "next/image";
import { ProgressRing } from "@/components/ProgressRing";
import { Reveal } from "@/components/landing/Reveal";

export function HeroDemo() {
  return (
    <div className="relative w-full max-w-md sm:max-w-lg">
      <Reveal variant="pop" delay={120}>
        <div className="relative overflow-hidden rounded-[var(--radius-panel)] border border-border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              Vehicle Maintenance
            </span>
            <span className="text-xs tabular-nums text-muted-foreground">Step 3 of 6</span>
          </div>

          <div className="relative aspect-[16/10] w-full bg-white">
            <Image
              src="/tutorials/cmt07lbvw001fl6eu95e0hnra/cmt07lbvw001gl6eu1b89iw86.png"
              alt="Illustration of jumper cables connecting two car batteries"
              fill
              sizes="(min-width: 640px) 32rem, 90vw"
              className="object-contain p-2"
              priority
            />
          </div>

          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-card-foreground">
                  Jump-starting a car
                </h3>
                <p className="text-xs text-muted-foreground">Connect the cables in order</p>
              </div>
              <ProgressRing percent={50} />
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2">
              <span className="text-sm">🔧</span>
              <p className="text-xs leading-relaxed text-foreground">
                Nice work — red to the dead battery first. Ready for the next cable?
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal
        variant="pop"
        delay={520}
        className="absolute -left-4 -top-5 z-[var(--z-raised)] hidden sm:-left-8 sm:block"
      >
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 shadow-float">
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

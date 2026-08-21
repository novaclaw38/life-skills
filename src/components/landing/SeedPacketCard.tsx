import Image from "next/image";
import Link from "next/link";

type PacketColor =
  | "vehicle"
  | "home"
  | "tools"
  | "kitchen"
  | "money"
  | "personal";

const BAND_CLASSES: Record<PacketColor, string> = {
  vehicle: "bg-packet-vehicle text-white",
  home: "bg-packet-home text-white",
  tools: "bg-packet-tools text-kraft-ink-900",
  kitchen: "bg-packet-kitchen text-white",
  money: "bg-packet-money text-white",
  personal: "bg-packet-personal text-white",
};

export function SeedPacketCard({
  href,
  color,
  category,
  title,
  image,
  steps,
  needsAdult,
}: {
  href: string;
  color: PacketColor;
  category: string;
  title: string;
  image?: { src: string; alt: string };
  /** Real step count for this tutorial — shown on hover/focus as the packet's "back". */
  steps?: number;
  /** Whether any step in this tutorial carries a safety warning. */
  needsAdult?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex w-full shrink-0 flex-col overflow-hidden rounded-md border border-border bg-card shadow-soft transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div
        className={`flex items-center px-3 py-2 text-[11px] font-bold uppercase tracking-label ${BAND_CLASSES[color]}`}
      >
        {category}
      </div>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-kraft-0">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 640px) 240px, 60vw"
            className="object-cover transition-opacity duration-200 ease-out motion-reduce:transition-none group-hover:opacity-0 group-focus-visible:opacity-0"
          />
        ) : (
          <div
            className="h-full w-full bg-muted bg-[repeating-linear-gradient(135deg,var(--border)_0,var(--border)_1px,transparent_1px,transparent_10px)] transition-opacity duration-200 ease-out motion-reduce:transition-none group-hover:opacity-0 group-focus-visible:opacity-0"
            aria-hidden="true"
          />
        )}

        {/* The packet's back: revealed on hover/focus, never gating the click-through itself */}
        {(steps ?? 0) > 0 && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-muted bg-[repeating-linear-gradient(135deg,var(--border)_0,var(--border)_1px,transparent_1px,transparent_10px)] opacity-0 transition-opacity duration-200 ease-out motion-reduce:transition-none group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <span className="font-mono text-lg font-bold tabular-nums text-foreground">
              {steps} {steps === 1 ? "STEP" : "STEPS"}
            </span>
            {needsAdult ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-hazard-ink">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1.5 2 3.75v3.5c0 4 2.5 6.25 6 7.25 3.5-1 6-3.25 6-7.25v-3.5L8 1.5Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                  <path d="M5.5 8.25 7.25 10 10.5 6.25" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Adult check included
              </span>
            ) : (
              <span className="text-[11px] font-medium text-muted-foreground">No safety flags</span>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-3">
        <h3 className="font-display text-sm font-bold leading-snug text-card-foreground">
          {title}
        </h3>
      </div>
    </Link>
  );
}

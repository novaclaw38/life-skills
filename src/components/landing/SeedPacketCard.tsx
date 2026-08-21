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
}: {
  href: string;
  color: PacketColor;
  category: string;
  title: string;
  image?: { src: string; alt: string };
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
      <div className="relative aspect-[4/3] w-full bg-kraft-0">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 640px) 240px, 60vw"
            className="object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-muted bg-[repeating-linear-gradient(135deg,var(--border)_0,var(--border)_1px,transparent_1px,transparent_10px)]"
            aria-hidden="true"
          />
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

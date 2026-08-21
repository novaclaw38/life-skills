"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  return (
    <div ref={panelRef} className="relative sm:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-sm text-steel-300 transition-colors hover:text-surface-structural-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          {open ? (
            <path
              d="M5 5l10 10M15 5 5 15"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M3 6h14M3 10h14M3 14h14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="absolute right-0 top-full mt-2 flex w-48 flex-col gap-1 rounded-md border border-border-structural bg-surface-structural p-2 shadow-float"
        >
          <Link
            href="/tutorials"
            onClick={() => setOpen(false)}
            className="rounded-sm px-3 py-2 text-sm text-steel-300 transition-colors hover:bg-white/5 hover:text-surface-structural-foreground"
          >
            Tutorials
          </Link>
          <a
            href="/#how-it-works"
            onClick={() => setOpen(false)}
            className="rounded-sm px-3 py-2 text-sm text-steel-300 transition-colors hover:bg-white/5 hover:text-surface-structural-foreground"
          >
            How it works
          </a>
        </div>
      )}
    </div>
  );
}

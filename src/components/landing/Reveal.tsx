"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "pop";
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Content renders fully visible (no "reveal" class) until JS has mounted
  // and an observer is watching it — this way a failed/slow hydration never
  // leaves content permanently invisible; it only degrades to "no animation".
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    setArmed(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={cn(
        armed && !visible && "reveal",
        visible && (variant === "pop" ? "pop-in" : "reveal-in"),
        className
      )}
    >
      {children}
    </div>
  );
}

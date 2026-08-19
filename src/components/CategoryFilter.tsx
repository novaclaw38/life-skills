"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { TUTORIAL_CATEGORIES, type TutorialCategory } from "@/lib/tutorials/categories";

export function CategoryFilter({
  selectedCategory,
  selectedAgeBand,
}: {
  selectedCategory?: TutorialCategory | "all";
  selectedAgeBand?: "AGE_8_11" | "AGE_12_15" | "AGE_16_18" | "all";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = selectedCategory ?? (searchParams.get("category") as TutorialCategory | "all") ?? "all";
  const currentAgeBand = selectedAgeBand ?? (searchParams.get("ageBand") as string | null) ?? "all";

  function navigate(category: TutorialCategory | "all", ageBand: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    if (ageBand && ageBand !== "all") {
      params.set("ageBand", ageBand);
    } else {
      params.delete("ageBand");
    }
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate("all", currentAgeBand)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            currentCategory === "all"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-transparent text-foreground hover:bg-muted"
          )}
        >
          All
        </button>
        {TUTORIAL_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => navigate(category, currentAgeBand)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              currentCategory === category
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-transparent text-foreground hover:bg-muted"
            )}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {(["all", "AGE_8_11", "AGE_12_15", "AGE_16_18"] as const).map((band) => (
          <button
            key={band}
            type="button"
            onClick={() => navigate(currentCategory, band)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              currentAgeBand === band
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-transparent text-foreground hover:bg-muted"
            )}
          >
            {band === "all" ? "All ages" : band.replace("AGE_", "").replace("_", "–")}
          </button>
        ))}
      </div>
    </div>
  );
}

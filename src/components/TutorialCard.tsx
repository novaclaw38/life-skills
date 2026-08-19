"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { TutorialSearchResult } from "@/lib/tutorials/search";
import { ProgressRing } from "@/components/ProgressRing";

export function TutorialCard({
  tutorial,
  completedStepIds,
}: {
  tutorial: TutorialSearchResult;
  completedStepIds: string[];
}) {
  const progress =
    tutorial.stepCount === 0
      ? 0
      : Math.round((completedStepIds.length / tutorial.stepCount) * 100);

  return (
    <Link
      href={`/tutorials/${tutorial.slug}`}
      className={cn(
        "flex flex-col gap-2 rounded-lg border bg-card p-4 transition-colors",
        "hover:border-primary"
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-card-foreground">{tutorial.title}</h3>
        {progress > 0 ? (
          <span className="text-xs text-muted-foreground">{progress}%</span>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {tutorial.summary}
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{tutorial.category}</span>
        {progress > 0 ? <ProgressRing percent={progress} /> : null}
      </div>
    </Link>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { ChatPanel } from "@/components/ChatPanel";
import { cn } from "@/lib/utils";

type AgeBand = "AGE_8_11" | "AGE_12_15" | "AGE_16_18";

interface Step {
  id: string;
  order: number;
  title: string;
  contentSimple: string;
  contentStandard: string;
  contentDetailed: string;
  imageUrl: string | null;
  safetyWarning: string | null;
}

function contentForAgeBand(step: Step, ageBand: AgeBand): string {
  if (ageBand === "AGE_8_11") return step.contentSimple;
  if (ageBand === "AGE_12_15") return step.contentStandard;
  return step.contentDetailed;
}

export function TutorialSteps({
  tutorialId,
  tutorialTitle,
  steps,
  ageBand,
  completedStepIds,
}: {
  tutorialId: string;
  tutorialTitle: string;
  steps: Step[];
  ageBand: AgeBand;
  completedStepIds: string[];
}) {
  const [completed, setCompleted] = useState(new Set(completedStepIds));
  const [activeStepId, setActiveStepId] = useState(steps[0]?.id ?? null);

  async function toggleComplete(stepId: string) {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tutorialId, stepId }),
    });
    if (!res.ok) return;
    setCompleted((prev) => new Set(prev).add(stepId));
  }

  const activeStep = steps.find((s) => s.id === activeStepId) ?? steps[0];
  const percentComplete = steps.length
    ? Math.round((completed.size / steps.length) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-medium text-foreground">
            Step {(activeStep?.order ?? 1)} of {steps.length}
          </span>
          <span className="text-muted-foreground">{percentComplete}% complete</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={percentComplete}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Tutorial progress: ${percentComplete}% complete`}
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-3">
          {steps.map((step) => {
            const isActive = activeStepId === step.id;
            const isCompleted = completed.has(step.id);
            return (
              <section
                key={step.id}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "rounded-lg border bg-card transition-colors",
                  isActive ? "border-primary" : "border-border"
                )}
              >
                <div
                  role="button"
                  aria-expanded={isActive}
                  tabIndex={0}
                  className="flex cursor-pointer items-center justify-between gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onClick={() => setActiveStepId(step.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveStepId(step.id);
                    }
                  }}
                >
                  <h2 className="font-medium text-card-foreground">
                    {step.order}. {step.title}
                  </h2>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(step.id);
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                      isCompleted
                        ? "bg-green-100 text-green-800"
                        : "border border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {isCompleted ? "Completed" : "Mark complete"}
                  </button>
                </div>

                <div
                  className={cn(
                    "flex-col gap-3 px-4 pb-4",
                    isActive ? "flex" : "hidden md:flex"
                  )}
                >
                  {step.safetyWarning && (
                    <p className="flex items-start gap-2 rounded-md border-l-4 border-amber-500 bg-amber-50 p-3 text-sm font-medium text-amber-900">
                      <span aria-hidden="true">⚠</span>
                      <span>{step.safetyWarning}</span>
                    </p>
                  )}
                  {step.imageUrl && (
                    <Image
                      src={step.imageUrl}
                      alt={`Illustration for step ${step.order}: ${step.title} (${tutorialTitle})`}
                      width={480}
                      height={270}
                      className="rounded-md"
                    />
                  )}
                  <p className="text-sm text-foreground">{contentForAgeBand(step, ageBand)}</p>
                </div>
              </section>
            );
          })}
        </div>
        {activeStep && (
          <ChatPanel
            tutorialId={tutorialId}
            tutorialTitle={tutorialTitle}
            stepId={activeStep.id}
            stepTitle={activeStep.title}
          />
        )}
      </div>
    </div>
  );
}

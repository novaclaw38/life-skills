"use client";

import { useState } from "react";
import Image from "next/image";
import { ChatPanel } from "@/components/ChatPanel";

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

  return (
    <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-4">
        {steps.map((step) => (
          <section
            key={step.id}
            className={`rounded border p-4 ${activeStepId === step.id ? "border-black" : ""}`}
            onClick={() => setActiveStepId(step.id)}
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-medium">
                {step.order}. {step.title}
              </h2>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComplete(step.id);
                }}
                className={`rounded px-2 py-1 text-xs ${
                  completed.has(step.id) ? "bg-green-100 text-green-800" : "border"
                }`}
              >
                {completed.has(step.id) ? "Completed" : "Mark complete"}
              </button>
            </div>
            {step.imageUrl && (
              <Image
                src={step.imageUrl}
                alt={step.title}
                width={480}
                height={270}
                className="mb-2 rounded"
              />
            )}
            <p className="text-sm">{contentForAgeBand(step, ageBand)}</p>
            {step.safetyWarning && (
              <p className="mt-2 rounded bg-amber-50 p-2 text-xs text-amber-800">
                ⚠ {step.safetyWarning}
              </p>
            )}
          </section>
        ))}
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
  );
}

"use client";

export function ProgressRing({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = 18;
  const stroke = 4;
  const center = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <span className="relative inline-flex h-[44px] w-[44px] items-center justify-center">
      <svg width={44} height={44} aria-hidden="true" className="block">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium tabular-nums text-foreground">
        {clamped}%
      </span>
    </span>
  );
}

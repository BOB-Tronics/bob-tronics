import type { TimelineStep } from "@/types";
import { CheckIcon } from "@/components/ui/Icons";

export default function OrderTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="space-y-6">
      {steps.map((step) => {
        const isDone = step.state === "done";
        const isCurrent = step.state === "current";
        return (
          <li key={step.title} className="flex gap-4">
            <span
              aria-hidden="true"
              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isDone || isCurrent ? "bg-primary text-white" : "border border-line bg-surface text-muted"
              }`}
            >
              {isDone ? (
                <CheckIcon size={18} />
              ) : (
                <span className={`h-2.5 w-2.5 rounded-full ${isCurrent ? "bg-white" : "border border-current"}`} />
              )}
            </span>
            <div>
              <p className={`font-semibold ${isDone || isCurrent ? "text-ink" : "text-muted"}`}>
                {step.title}
                {isCurrent && " · Current status"}
              </p>
              <p className="mt-0.5 text-sm text-muted">{step.time}</p>
              <p className="text-sm text-muted">{step.note}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

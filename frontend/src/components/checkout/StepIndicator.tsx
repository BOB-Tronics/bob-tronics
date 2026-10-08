export const checkoutSteps = ["Customer Details", "Delivery", "Payment", "Confirmation"];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
      {checkoutSteps.map((label, index) => {
        const isActive = index === current;
        const isDone = index < current;
        return (
          <li
            key={label}
            aria-current={isActive ? "step" : undefined}
            className={`h-11 shrink-0 rounded-lg border px-4 text-sm font-semibold leading-[2.6rem] ${
              isActive
                ? "border-primary bg-accent text-primary"
                : isDone
                  ? "border-line bg-white text-ink"
                  : "border-line bg-white text-muted"
            }`}
          >
            {index + 1} {label}
          </li>
        );
      })}
    </ol>
  );
}

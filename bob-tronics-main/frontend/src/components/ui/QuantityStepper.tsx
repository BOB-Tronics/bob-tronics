import { MinusIcon, PlusIcon } from "./Icons";

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex h-11 items-center rounded-lg border border-line bg-white">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex h-full w-11 items-center justify-center text-ink disabled:opacity-40"
      >
        <MinusIcon size={16} />
      </button>
      <span className="min-w-6 text-center font-semibold text-ink" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-full w-11 items-center justify-center text-ink disabled:opacity-40"
      >
        <PlusIcon size={16} />
      </button>
    </div>
  );
}

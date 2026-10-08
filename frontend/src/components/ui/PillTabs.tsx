"use client";

// Row of rounded tab buttons (e.g. "All orders (3)", "Overview", "Specifications").
// Scrolls horizontally on small screens so every tab stays reachable.
export default function PillTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab)}
            className={`h-11 shrink-0 rounded-lg border px-4 text-sm font-semibold transition-colors ${
              isActive
                ? "border-primary bg-accent text-primary"
                : "border-line bg-white text-muted hover:text-ink"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

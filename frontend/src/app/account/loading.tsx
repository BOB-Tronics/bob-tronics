// Lightweight skeleton shown while account data loads.
export default function AccountLoading() {
  return (
    <div className="page-container animate-pulse pb-12">
      <div className="space-y-3 py-10">
        <div className="h-3 w-32 rounded bg-line" />
        <div className="h-9 w-64 rounded bg-line" />
        <div className="h-4 w-80 max-w-full rounded bg-line" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="h-64 rounded-2xl bg-white" />
        <div className="h-96 rounded-2xl bg-white" />
      </div>
    </div>
  );
}

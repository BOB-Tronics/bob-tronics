export default function ShopLoading() {
  return (
    <div className="page-container animate-pulse pb-12">
      <div className="space-y-3 py-10">
        <div className="h-3 w-24 rounded bg-line" />
        <div className="h-9 w-80 max-w-full rounded bg-line" />
        <div className="h-4 w-64 rounded bg-line" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-96 rounded-2xl bg-white" />
        ))}
      </div>
    </div>
  );
}

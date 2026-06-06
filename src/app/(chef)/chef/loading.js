// app/orders/loading.js
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-pulse">
      
      {/* Header & Tabs Skeleton */}
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-9 w-56 rounded-xl bg-gray-200" />
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-200" />
            <div className="h-9 w-32 rounded-xl bg-gray-200" />
          </div>
        </div>
        <div className="flex gap-6 border-b border-gray-100 pb-2">
          <div className="h-5 w-24 rounded bg-gray-200" />
          <div className="h-5 w-24 rounded bg-gray-200" />
          <div className="h-5 w-24 rounded bg-gray-200" />
        </div>
      </header>

      {/* Orders Grid Skeleton */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((card) => (
          <div key={card} className="rounded-2xl border border-gray-100 bg-white p-5 space-y-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-5 w-20 rounded-md bg-gray-200" />
                <div className="h-6 w-28 rounded-lg bg-gray-300" />
              </div>
              <div className="space-y-2 text-right">
                <div className="h-6 w-24 rounded-lg bg-gray-300" />
                <div className="h-4 w-16 rounded bg-gray-200 ml-auto" />
              </div>
            </div>
            <div className="flex gap-3 items-center pt-2">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-28 rounded bg-gray-300" />
                <div className="h-3 w-full rounded bg-gray-200" />
              </div>
            </div>
            <div className="space-y-2 pt-1">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-100" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-11 rounded-xl bg-gray-200" />
              <div className="h-11 rounded-xl bg-gray-200" />
            </div>
          </div>
        ))}
      </section>

      {/* Bottom Metrics Skeleton */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-gray-200 h-40" />
        <div className="rounded-2xl bg-gray-200 h-40" />
        <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4 h-40 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="h-4 w-28 rounded bg-gray-200" />
            <div className="h-6 w-6 rounded bg-gray-200" />
          </div>
          <div className="h-9 w-36 rounded-xl bg-gray-300" />
          <div className="h-4 w-44 rounded bg-gray-200" />
        </div>
      </section>

    </div>
  );
}
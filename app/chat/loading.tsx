export default function ChatLoading() {
  return (
    <div className="max-w-lg mx-auto mt-20 bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100 min-h-[500px]">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="h-5 w-16 bg-slate-200 rounded animate-pulse" />
      </div>
      <div className="divide-y divide-slate-100">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-3 w-40 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
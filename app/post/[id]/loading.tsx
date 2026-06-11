export default function PostDetailLoading() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-7xl pt-20 mx-auto min-h-screen bg-slate-50/50">
      <div className="w-full lg:w-2/3">
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden animate-pulse">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-slate-200" />
            <div className="space-y-2">
              <div className="h-3 w-24 bg-slate-200 rounded" />
              <div className="h-2 w-32 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="px-5 pb-3 space-y-2">
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-3/4" />
          </div>
          <div className="h-64 bg-slate-100 mx-5 mb-3 rounded-xl" />
          <div className="px-4 py-3 border-t border-slate-100 flex gap-6">
            <div className="h-5 w-12 bg-slate-200 rounded" />
            <div className="h-5 w-12 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/3 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5 animate-pulse">
        <div className="h-5 w-24 bg-slate-200 rounded mb-5" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-slate-200 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-16 bg-slate-200 rounded" />
              <div className="h-3 w-full bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
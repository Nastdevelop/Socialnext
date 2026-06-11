export default function RootLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 pb-12 flex justify-center px-4">
      <div className="w-full max-w-[580px] space-y-5 pt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm overflow-hidden animate-pulse">
            <div className="flex items-center gap-3 px-5 pt-4 pb-2">
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-2 w-32 bg-slate-100 dark:bg-slate-700/50 rounded" />
              </div>
            </div>
            <div className="px-5 pb-4 space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            </div>
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700/50 flex gap-2">
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
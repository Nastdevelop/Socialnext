export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 pb-12 flex justify-center px-4">
      <div className="w-full max-w-[580px] space-y-5 pt-6">
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm p-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-48 bg-slate-100 dark:bg-slate-700/50 rounded" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <div className="h-10 flex-1 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div className="h-10 flex-1 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm overflow-hidden animate-pulse">
            <div className="px-5 pt-4 pb-3 space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
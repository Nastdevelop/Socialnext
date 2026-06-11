"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Send } from "lucide-react"

type Props = {
    userId: number
    postId: number
}

export default function Comment({postId, userId}: Props) {
    const router = useRouter()
    const [komentar, setKomentar] = useState("")
    const [loading, setLoading] = useState(false)

    const handleKomen = async () => {
        if (!komentar.trim()) return
        setLoading(true)
        try {
            await fetch("/api/comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, postId, komentar })
            })
            setKomentar("")
            router.refresh()
        } catch { /* ignore */ }
        setLoading(false)
    }

    return (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
          <div className="relative flex items-center">
            <input
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !loading) handleKomen() }}
              type="text"
              placeholder="Tulis komentar..."
              className="w-full pl-4 pr-12 py-2.5 text-xs bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <button
              onClick={handleKomen}
              disabled={loading || !komentar.trim()}
              className="absolute right-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 transition-colors p-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
    )
}
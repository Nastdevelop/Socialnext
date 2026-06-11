"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Ban, ShieldOff } from "lucide-react"

type Props = {
  targetUserId: number
  isBlocked?: boolean
}

export default function BlockButton({ targetUserId, isBlocked: initialBlocked }: Props) {
  const [isBlocked, setIsBlocked] = useState(!!initialBlocked)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleBlock = async () => {
    if (!confirm(isBlocked ? "Buka blokir pengguna ini?" : "Blokir pengguna ini?")) return
    setLoading(true)
    const res = await fetch("/api/block", {
      method: isBlocked ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockedId: targetUserId })
    })
    if (res.ok) {
      setIsBlocked(!isBlocked)
      router.refresh()
    }
    setLoading(false)
  }

  if (isBlocked) {
    return (
      <button onClick={handleBlock} disabled={loading}
        className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldOff className="w-4 h-4" />}
        Buka Blokir
      </button>
    )
  }

  return (
    <button onClick={handleBlock} disabled={loading}
      className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
      Blokir
    </button>
  )
}
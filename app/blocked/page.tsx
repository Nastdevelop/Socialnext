"use client"

import { useEffect, useState } from "react"
import { useNav } from "@/component/NavigationProvider"
import { Loader2, Shield, ShieldOff, ArrowLeft, UserX } from "lucide-react"

type BlockedUser = {
  id: number
  username: string
  email: string
  image: string | null
}

export default function BlockedPage() {
  const { navigate } = useNav()
  const [users, setUsers] = useState<BlockedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [unblocking, setUnblocking] = useState<number | null>(null)

  const fetchBlocked = async () => {
    setLoading(true)
    const res = await fetch("/api/block")
    if (res.ok) {
      const data = await res.json()
      setUsers(data)
    }
    setLoading(false)
  }

  useEffect(() => { fetchBlocked() }, [])

  const handleUnblock = async (blockedId: number) => {
    setUnblocking(blockedId)
    const res = await fetch("/api/block", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockedId })
    })
    if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== blockedId))
    setUnblocking(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-28 md:pb-12 flex justify-center px-4">
      <div className="w-full max-w-md pt-4 space-y-5">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/setelan")} className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Pengguna Diblokir</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">Kelola daftar blokir akun</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500 animate-fade-in">
            <Shield className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-sm font-medium">Tidak ada pengguna diblokir</p>
            <p className="text-xs mt-1">Blokir pengguna dari menu postingan</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {users.map((user, i) => (
              <div key={user.id} className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 flex items-center justify-between shadow-sm animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-red-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                    {user.username?.substring(0, 2).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user.username}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button onClick={() => handleUnblock(user.id)} disabled={unblocking === user.id}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1.5">
                  {unblocking === user.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldOff className="w-3.5 h-3.5" />}
                  Buka Blokir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
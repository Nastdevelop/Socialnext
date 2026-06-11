"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Trash2, Pencil, Flag, Ban, Loader2 } from "lucide-react"

type Props = {
  postId: number
  authorId: number
  currentUserId?: number
}

export default function PostMenu({ postId, authorId, currentUserId }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDelete = async () => {
    if (!confirm("Hapus postingan ini?")) return
    setLoading(true)
    const res = await fetch("/api/post/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId })
    })
    if (res.ok) { setOpen(false); router.refresh() }
    setLoading(false)
  }

  const handleReport = async () => {
    setLoading(true)
    setMessage("")
    const res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, reason: "" })
    })
    const data = await res.json()
    if (res.ok) {
      setMessage(data.autoDeleted ? "Postingan telah dihapus karena laporan" : "Postingan dilaporkan")
    } else {
      setMessage(data.error || "Gagal melaporkan")
    }
    setLoading(false)
    setTimeout(() => { setOpen(false); setMessage("") }, 2000)
  }

  const handleBlock = async () => {
    if (!confirm("Blokir pengguna ini?")) return
    setLoading(true)
    const res = await fetch("/api/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockedId: authorId })
    })
    const data = await res.json()
    if (res.ok) {
      setMessage("Pengguna diblokir")
      setTimeout(() => router.refresh(), 1000)
    } else {
      setMessage(data.error || "Gagal memblokir")
    }
    setLoading(false)
    setTimeout(() => { setOpen(false); setMessage("") }, 2000)
  }

  const isOwner = currentUserId === authorId

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-slate-900/50 z-50 overflow-hidden animate-slide-up">
          {message ? (
            <div className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{message}</div>
          ) : (
            <>
              {isOwner ? (
                <>
                  <button onClick={() => { setOpen(false); router.push(`/createpost?edit=${postId}`) }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={handleDelete} disabled={loading}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Hapus
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleReport} disabled={loading}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flag className="w-4 h-4" />}
                    Laporkan
                  </button>
                  <button onClick={handleBlock} disabled={loading}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                    <Ban className="w-4 h-4" /> Blokir
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
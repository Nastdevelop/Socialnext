"use client"

import { useState } from "react"
import { Loader2, UserPlus, UserCheck, UserX, Clock } from "lucide-react"

type Props = {
  targetUserId: number
  relation: "none" | "pending_sent" | "pending_received" | "friends"
}

export default function FriendButton({ targetUserId, relation: initialRelation }: Props) {
  const [relation, setRelation] = useState(initialRelation)
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    setLoading(true)
    const res = await fetch("/api/friend/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ penerimaId: targetUserId })
    })
    if (res.ok) setRelation("pending_sent")
    setLoading(false)
  }

  const handleAccept = async () => {
    setLoading(true)
    const res = await fetch("/api/friend/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pemintaId: targetUserId })
    })
    if (res.ok) setRelation("friends")
    setLoading(false)
  }

  const handleUnfriend = async () => {
    setLoading(true)
    const res = await fetch("/api/friend/request", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ penerimaId: targetUserId })
    })
    if (res.ok) setRelation("none")
    setLoading(false)
  }

  if (loading) {
    return (
      <button disabled className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
      </button>
    )
  }

  if (relation === "friends") {
    return (
      <button onClick={handleUnfriend}
        className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
        <UserX className="w-4 h-4" /> Berhenti Berteman
      </button>
    )
  }

  if (relation === "pending_sent") {
    return (
      <button disabled
        className="w-full py-2.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
        <Clock className="w-4 h-4" /> Menunggu Diterima
      </button>
    )
  }

  if (relation === "pending_received") {
    return (
      <button onClick={handleAccept}
        className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
        <UserCheck className="w-4 h-4" /> Terima Permintaan
      </button>
    )
  }

  return (
    <button onClick={handleAdd}
      className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2">
      <UserPlus className="w-4 h-4" /> Tambah Teman
    </button>
  )
}
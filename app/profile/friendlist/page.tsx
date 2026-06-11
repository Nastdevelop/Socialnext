"use client"

import { useEffect, useState } from "react"
import { Users, User } from "lucide-react"

type Friend = { id: number; username: string }

export default function Friendlist() {
    const [friend, setFriend] = useState<Friend[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/friend/listrelation")
                const data = await res.json()
                setFriend(data || [])
            } catch { /* ignore */ }
            setLoading(false)
        }
        fetchData()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-28 md:pb-12 px-4">
            <div className="max-w-lg mx-auto pt-4">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                        <Users className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Teman</h1>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{loading ? "" : `${friend.length} teman`}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 animate-pulse flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                            </div>
                        ))}
                    </div>
                ) : friend.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
                        <User className="w-12 h-12 mb-3 opacity-40" />
                        <p className="text-sm font-medium">Belum punya teman</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {friend.map((f) => (
                            <div key={f.id} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl shadow-sm hover:shadow-md dark:shadow-slate-900/20 transition-all duration-200 animate-slide-up">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm">
                                    {f.username?.substring(0, 2).toUpperCase() || "U"}
                                </div>
                                <div className="min-w-0">
                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate block">@{f.username}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
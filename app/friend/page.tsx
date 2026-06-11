"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useNav } from "@/component/NavigationProvider"
import { Loader2, UserPlus, UserCheck, Users, Search, X } from "lucide-react"

type User = { id: number; email: string; username: string }

export default function UsersPage() {
  const { navigate } = useNav()
  const [users, setUsers] = useState<User[]>([])
  const [requests, setRequests] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [search, setSearch] = useState("")
  const sentinelRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const PAGE_SIZE = 10

  const fetchUsers = useCallback(async (pageNum: number, searchQuery?: string) => {
    const q = searchQuery !== undefined ? searchQuery : search
    if (pageNum === 1) setLoading(true)
    else setLoadingMore(true)

    const params = new URLSearchParams({ page: String(pageNum), take: String(PAGE_SIZE) })
    if (q) params.set("search", q)

    const [userRes, reqRes] = await Promise.all([
      fetch(`/api/friend?${params}`),
      pageNum === 1 ? fetch("/api/friend/pending") : Promise.resolve(null)
    ])

    const usersData = await userRes.json()
    if (pageNum === 1) {
      setUsers(usersData.users || [])
      if (reqRes) {
        const reqData = await reqRes.json()
        setRequests(reqData || [])
      }
    } else {
      setUsers((prev) => [...prev, ...(usersData.users || [])])
    }
    setHasMore(usersData.hasMore !== false)
    setLoading(false)
    setLoadingMore(false)
  }, [search])

  useEffect(() => { fetchUsers(1) }, [fetchUsers])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore || loading) return
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasMore && !loadingMore) { setPage((p) => p + 1); fetchUsers(page + 1) } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, loading, loadingMore, fetchUsers, page])

  const handleSearch = (value: string) => {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(1)
      fetchUsers(1, value)
    }, 300)
  }

  const addFriend = async (penerimaId: number) => {
    setActionLoading(penerimaId); setError("")
    const res = await fetch("/api/friend/request", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ penerimaId })
    })
    const data = await res.json()
    if (!res.ok) setError(data.error)
    setActionLoading(null)
    setUsers((prev) => prev.filter((u) => u.id !== penerimaId))
  }

  const acceptFriend = async (pemintaId: number) => {
    setActionLoading(pemintaId); setError("")
    const res = await fetch("/api/friend/accept", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pemintaId })
    })
    const data = await res.json()
    if (!res.ok) setError(data.error)
    setActionLoading(null)
    setRequests((prev) => prev.filter((u) => u.id !== pemintaId))
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 pb-28 md:pb-12 flex justify-center px-4">
      <div className="w-full max-w-md space-y-5 pt-6">

        {error && (
          <div className="p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-2xl font-medium animate-slide-up flex items-center gap-2">
            <X className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {requests.length > 0 && (
          <div className="animate-slide-up">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Permintaan Pertemanan
            </h2>
            <div className="space-y-2.5">
              {requests.map((user) => (
                <div key={user.id} className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                      {user.username?.substring(0, 2).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user.username}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">Ingin berteman</p>
                    </div>
                  </div>
                  <button onClick={() => acceptFriend(user.id)} disabled={actionLoading === user.id}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1.5 shadow-sm">
                    {actionLoading === user.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
                    Terima
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Temukan Teman</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">Terhubung dengan pengguna lain</p>
          </div>
        </div>

        <div className="relative animate-slide-up">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari berdasarkan username atau email..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {search && (
            <button onClick={() => handleSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-36 bg-slate-100 dark:bg-slate-700/50 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500 animate-fade-in">
            <Search className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-sm font-medium">{search ? `Tidak ditemukan untuk "${search}"` : "Tidak ada pengguna baru"}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
              {users.map((user, i) => (
              <div key={user.id} className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 flex items-center justify-between shadow-sm animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                <button onClick={() => navigate(`/user/${user.id}`)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0">
                    {user.username?.substring(0, 2).toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{user.username}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
                  </div>
                </button>
                <button onClick={() => addFriend(user.id)} disabled={actionLoading === user.id}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm ${
                    actionLoading === user.id
                      ? "bg-slate-100 dark:bg-slate-700 text-slate-400"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/20"
                  }`}>
                  {actionLoading === user.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                  Tambah
                </button>
              </div>
            ))}
          </div>
        )}

        <div ref={sentinelRef} className="h-4" />

        {loadingMore && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          </div>
        )}

        {!hasMore && users.length > 0 && (
          <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-600 font-medium">
            — Semua pengguna sudah ditampilkan —
          </div>
        )}

      </div>
    </div>
  )
}
"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { useNav } from "@/component/NavigationProvider"
import { ShieldCheck, Loader2 } from "lucide-react"

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const { navigate } = useNav()
  const email = searchParams.get("email")

  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    setLoading(true)
    setError("")
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, code })
    })
    const data = await res.json()
    if (!res.ok) {
      setLoading(false)
      return setError(data.error)
    }
    navigate("/login")
  }

  const handleResend = async () => {
    await fetch("/api/resend", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email })
    })
    setError("")
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950 px-4">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl shadow-xl dark:shadow-slate-900/40 border border-slate-100 dark:border-slate-700/60 p-8 flex flex-col items-center">

          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Verifikasi OTP</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center mt-1 mb-6">
            Masukkan kode yang dikirim ke <strong className="text-slate-600 dark:text-slate-300">{email}</strong>
          </p>

          {error && (
            <div className="w-full mb-4 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-2xl text-center font-medium">
              {error}
            </div>
          )}

          <div className="w-full mb-6">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-center text-2xl font-bold tracking-[0.5em] text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={handleVerify}
              disabled={loading || code.length < 4}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Memverifikasi..." : "Verifikasi"}
            </button>

            <button
              onClick={handleResend}
              className="w-full py-3 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              Kirim Ulang Kode
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
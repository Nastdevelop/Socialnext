"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Loader2, Camera, Save, ArrowLeft } from "lucide-react"
import { useNav } from "@/component/NavigationProvider"

export default function UpdateProfile() {
  const { data: session, update } = useSession()
  const { navigate } = useNav()
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile/me")
        if (res.ok) {
          const data = await res.json()
          setUsername(data.username || "")
          setBio(data.bio || "")
          setCurrentImage(data.image || null)
        }
      } catch { /* ignore */ }
      setFetching(false)
    }
    fetchProfile()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    setFile(f)
    if (f) {
      const r = new FileReader()
      r.onload = () => setPreview(r.result as string)
      r.readAsDataURL(f)
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const fd = new FormData()
    fd.append("username", username)
    fd.append("bio", bio)
    if (file) fd.append("image", file)

    const res = await fetch("/api/profile", { method: "PUT", body: fd })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) return setError(data.error || "Gagal update")

    setSuccess("Profil berhasil diperbarui!")
    await update()
    setTimeout(() => navigate("/profile"), 1500)
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  const displayImage = preview || currentImage

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-12 flex justify-center px-4">
      <div className="w-full max-w-md pt-4">
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm p-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate("/profile")} className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Update Profile</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Perbarui informasi akun Anda</p>
            </div>
          </div>

          {error && <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-2xl font-medium">{error}</div>}
          {success && <div className="mb-4 p-3.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-2xl font-medium">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col items-center gap-3">
              <div className="group relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-indigo-50 dark:ring-indigo-500/20 transition-all hover:ring-indigo-100 dark:hover:ring-indigo-500/30">
                {displayImage ? (
                  <img src={displayImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                    <Camera className="w-8 h-8" />
                  </div>
                )}
                <label htmlFor="avatar" className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Camera className="w-6 h-6 text-white" />
                </label>
              </div>
              <input id="avatar" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
              <span className="text-xs text-slate-400 dark:text-slate-500">Klik foto untuk mengganti</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                placeholder="Tulis bio singkat..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan Perubahan
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
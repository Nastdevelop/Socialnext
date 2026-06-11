"use client"

import { useEffect, useState } from "react"
import { ImagePlus, Loader2, X, SendHorizonal } from "lucide-react"
import { useNav } from "@/component/NavigationProvider"
import { useSearchParams } from "next/navigation"

export default function CreatePost() {
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [existingImage, setExistingImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState("")
  const { navigate } = useNav()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const isEdit = !!editId

  useEffect(() => {
    if (!editId) return
    const fetchPost = async () => {
      setFetching(true)
      const res = await fetch(`/api/post/list?take=1&cursor=${editId}`)
      if (res.ok) {
        const data = await res.json()
        const post = data.posts?.find((p: any) => String(p.id) === editId)
        if (post) {
          setContent(post.content)
          setExistingImage(post.dokumentasi || null)
        }
      }
      setFetching(false)
    }
    fetchPost()
  }, [editId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    setFile(f)
    if (f) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(f)
    } else { setPreview(null) }
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setError("")
    if (content.trim() === "") return setError("Postingan tidak boleh kosong")
    setLoading(true)

    try {
      let dokumentasi = existingImage || ""
      if (file) {
        const fd = new FormData(); fd.append("file", file)
        const up = await (await fetch("/api/upload", { method: "POST", body: fd })).json()
        dokumentasi = up.secure_url
      }

      if (isEdit) {
        const res = await fetch("/api/post/edit", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: Number(editId), content, dokumentasi })
        })
        if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Gagal mengedit") }
      } else {
        const res = await fetch("/api/post/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, dokumentasi })
        })
        if (!res.ok) throw new Error()
      }
      navigate("/")
    } catch (e: any) { setError(e.message || "Gagal membuat postingan") }
    finally { setLoading(false) }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  const displayPreview = preview || (isEdit && existingImage ? existingImage : null)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-12 flex justify-center px-4">
      <div className="w-full max-w-lg mt-4">
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm p-6 animate-slide-up">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5">
            {isEdit ? "Edit Postingan" : "Buat Postingan"}
          </h2>

          {error && (
            <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-2xl font-medium">
              {error}
            </div>
          )}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Apa yang kamu pikirkan?"
            maxLength={1000}
            rows={5}
            className="w-full resize-none outline-none text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />

          <div className="flex items-center justify-end mt-1.5 mb-3">
            <span className="text-xs text-slate-400 dark:text-slate-500">{content.length}/1000</span>
          </div>

          {displayPreview && (
            <div className="relative mb-4 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <img src={displayPreview} alt="" className="w-full max-h-64 object-contain" />
              {(!isEdit || file) && (
                <button onClick={() => { setFile(null); setPreview(null); setExistingImage(null) }}
                  className="absolute top-2 right-2 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full p-1.5 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/60">
            <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
              <ImagePlus className="w-5 h-5" />
              <span className="font-medium">Gambar</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            <button onClick={handleSubmit} disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizonal className="w-4 h-4" />}
              {loading ? "Menyimpan..." : isEdit ? "Simpan" : "Posting"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
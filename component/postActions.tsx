"use client"

import { useState } from "react"
import LikeButton from "./likeButton"
import { Bookmark, BookmarkCheck, Share2, MessageCircle, Check } from "lucide-react"
import Link from "next/link"

type Props = {
  postId: number
  userId: number
  likesCount: number
  liked?: boolean
  commentCount: number
  isSaved: boolean
}

export default function PostActions({ postId, userId, likesCount, liked, commentCount, isSaved }: Props) {
  const [saved, setSaved] = useState(isSaved)
  const [toast, setToast] = useState("")

  const handleSave = async () => {
    const nextSaved = !saved
    setSaved(nextSaved)
    const res = await fetch("/api/save", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId })
    })
    if (!res.ok) setSaved(!nextSaved)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${postId}`
    try {
      await navigator.clipboard.writeText(url)
      setToast("Link disalin!")
      setTimeout(() => setToast(""), 2000)
    } catch {
      setToast("Gagal menyalin")
      setTimeout(() => setToast(""), 2000)
    }
  }

  return (
    <>
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900 dark:bg-slate-700 text-white px-5 py-2.5 rounded-2xl text-sm font-medium shadow-2xl animate-slide-up flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}
      <div className="px-5 py-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-1">
          <LikeButton postId={postId} userId={userId} countpost={likesCount} liked={liked} />
          <Link href={`/post/${postId}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{commentCount}</span>
          </Link>
          <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <button onClick={handleSave} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all">
          {saved ? <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>
    </>
  )
}
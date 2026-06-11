"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"
import PostMenu from "./postmenu"
import PostActions from "./postActions"
import { Loader2, FileText } from "lucide-react"

type Post = {
  id: number
  content: string
  dokumentasi: string | null
  edited: boolean
  createdAt: string
  authorId: number
  author: { id: number; username: string; email: string; image: string | null }
  _count: { likes: number; comment: number }
  liked: boolean
  saved: boolean
}

export default function PostFeed({ initialPosts, initialCursor, userId }: { initialPosts: Post[]; initialCursor: number | null; userId: number }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [cursor, setCursor] = useState<number | null>(initialCursor)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(!initialCursor)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (loading || done || cursor === null) return
    setLoading(true)
    try {
      const res = await fetch(`/api/post/list?cursor=${cursor}&take=10`)
      const data = await res.json()
      setPosts((prev) => [...prev, ...data.posts])
      setCursor(data.nextCursor)
      if (!data.nextCursor) setDone(true)
    } catch { /* ignore */ }
    setLoading(false)
  }, [cursor, loading, done])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [loadMore])

  return (
    <div className="w-full max-w-[580px] mx-auto space-y-5 px-4 pb-24 md:pb-12">
      {posts.map((post, i) => {
        const authorInitials = post.author?.username?.substring(0, 2).toUpperCase() || "UN"
        const postDate = new Date(post.createdAt).toLocaleDateString("id-ID", {
          day: "numeric", month: "short", year: "numeric"
        })

        return (
          <div
            key={post.id}
            className="group bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm hover:shadow-md dark:shadow-slate-900/20 transition-all duration-300 overflow-hidden animate-slide-up"
            style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="flex items-center gap-3">
                {post.author?.image ? (
                  <Image src={post.author.image} alt="" width={36} height={36} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
                    {authorInitials}
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                    {post.author?.username || "anonymous"}
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {postDate}
                    {post.edited && <span className="ml-1.5 text-[10px] text-slate-400 dark:text-slate-500 italic">(diedit)</span>}
                  </p>
                </div>
              </div>
              <PostMenu postId={post.id} authorId={post.authorId} currentUserId={userId} />
            </div>

            <p className="text-[15px] px-5 py-1 leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {post.content}
            </p>

            {post.dokumentasi && (
              <div className="mt-2 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30">
                <Image
                  src={post.dokumentasi}
                  alt=""
                  width={580}
                  height={400}
                  className="w-full max-h-[500px] object-contain bg-slate-50 dark:bg-slate-900"
                />
              </div>
            )}

            <PostActions
              postId={post.id}
              userId={userId}
              likesCount={post._count.likes}
              liked={post.liked}
              commentCount={post._count.comment}
              isSaved={post.saved}
            />
          </div>
        )
      })}

      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 animate-fade-in">
          <FileText className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-sm font-medium">Belum ada postingan</p>
          <p className="text-xs mt-1">Jadilah yang pertama membuat postingan</p>
        </div>
      )}

      <div ref={sentinelRef} className="h-4" />

      {loading && (
        <div className="flex justify-center py-6">
          <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Memuat postingan...
          </div>
        </div>
      )}

      {done && posts.length > 0 && (
        <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-600 font-medium">
          — Kamu sudah melihat semua postingan —
        </div>
      )}
    </div>
  )
}
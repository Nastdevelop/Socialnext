"use client"
import { Heart } from "lucide-react"
import { useRef, useState } from "react"

type Props = {
    postId: number
    userId: number
    countpost: number
    liked?: boolean
}

export default function LikeButton({postId, countpost, userId, liked: initialLiked = false}: Props) { 
    const [count, setCount] = useState(countpost)
    const [liked, setLiked] = useState(initialLiked)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleLike = () => {
      const nextLiked = !liked
      setLiked(nextLiked)
      setCount((prev) => nextLiked ? prev + 1 : prev - 1)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(async () => {
        try { await fetch("/api/like", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ postId, liked }) }) }
        catch { /* ignore */ }
      }, 1000)
    }

    return (
      <button onClick={handleLike} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-sm hover:bg-red-50 dark:hover:bg-red-500/10 group">
        <Heart className={`w-5 h-5 transition-all group-hover:scale-110 ${
          liked ? "fill-red-500 text-red-500" : "text-slate-400 dark:text-slate-500 group-hover:text-red-400"
        }`} />
        <span className={`text-sm font-medium transition-colors ${
          liked ? "text-red-500" : "text-slate-500 dark:text-slate-400 group-hover:text-red-400"
        }`}>{count}</span>
      </button>
    )
}
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import PostFeed from "@/component/PostFeed"
import { Sparkles } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function Home() {
  const session = await getServerSession(authOptions)
  const userId = Number(session?.user?.id)

  const posts = await prisma.post.findMany({
    take: 11,
    orderBy: { id: "desc" },
    include: {
      author: { select: { id: true, username: true, email: true, image: true } },
      _count: { select: { likes: true, comment: true } },
    },
  })

  let nextCursor: number | null = null
  if (posts.length > 10) {
    const last = posts.pop()
    nextCursor = last!.id
  }

  let likedPostIds: number[] = []
  let savedPostIds: number[] = []

  if (userId && posts.length > 0) {
    const [likes, saves] = await Promise.all([
      prisma.like.findMany({
        where: { userId, postId: { in: posts.map((p) => p.id) } },
        select: { postId: true }
      }),
      prisma.savedPost.findMany({
        where: { userId, postId: { in: posts.map((p) => p.id) } },
        select: { postId: true }
      })
    ])
    likedPostIds = likes.map((l) => l.postId)
    savedPostIds = saves.map((s) => s.postId)
  }

  const initialPosts = posts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    liked: likedPostIds.includes(p.id),
    saved: savedPostIds.includes(p.id),
  }))

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="max-w-[580px] mx-auto px-4 pt-6 pb-2">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
            <Sparkles className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Beranda</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">Lihat postingan terbaru dari pengguna</p>
          </div>
        </div>
      </div>
      <PostFeed initialPosts={initialPosts} initialCursor={nextCursor} userId={userId} />
    </div>
  )
}
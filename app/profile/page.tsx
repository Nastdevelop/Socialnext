import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import ProfileClient from "./ProfileClient"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return <div className="min-h-screen pt-20 flex items-center justify-center text-slate-400">Unauthorized</div>
  }

  const userId = Number(session.user.id)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        take: 11,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { likes: true, comment: true } } }
      }
    }
  })

  if (!user) {
    return <div className="min-h-screen pt-20 flex items-center justify-center text-slate-400">User tidak ditemukan</div>
  }

  const [friendCount, likedData, savedPosts] = await Promise.all([
    prisma.friend.count({ where: { status: "ACCEPTED", OR: [{ idpeminta: userId }, { idpenerima: userId }] } }),
    prisma.like.findMany({ where: { userId, postId: { in: user.posts.map((p) => p.id) } }, select: { postId: true } }),
    prisma.savedPost.findMany({ where: { userId }, select: { postId: true } })
  ])

  const likedSet = new Set(likedData.map((l) => l.postId))
  const savedIds = new Set(savedPosts.map((s) => s.postId))

  const posts = user.posts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    liked: likedSet.has(p.id),
    saved: savedIds.has(p.id),
  }))

  return <ProfileClient user={user} posts={posts} friendCount={friendCount} userId={userId} />
}
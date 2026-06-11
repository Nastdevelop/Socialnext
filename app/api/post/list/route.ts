import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = Number(session?.user?.id)

  const url = new URL(req.url)
  const cursor = url.searchParams.get("cursor")
  const take = Math.min(Number(url.searchParams.get("take")) || 10, 30)

  const blockedIds: number[] = []
  if (userId) {
    const blocks = await prisma.block.findMany({
      where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
      select: { blockerId: true, blockedId: true }
    })
    for (const b of blocks) {
      blockedIds.push(b.blockerId === userId ? b.blockedId : b.blockerId)
    }
  }

  const posts = await prisma.post.findMany({
    take: take + 1,
    ...(cursor ? { cursor: { id: Number(cursor) }, skip: 1 } : {}),
    orderBy: { id: "desc" },
    where: blockedIds.length > 0 ? { authorId: { notIn: blockedIds } } : undefined,
    include: {
      author: { select: { id: true, username: true, email: true, image: true } },
      _count: { select: { likes: true, comment: true } },
    },
  })

  let nextCursor: number | null = null
  if (posts.length > take) {
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

  return NextResponse.json({
    posts: posts.map((p) => ({
      ...p,
      liked: likedPostIds.includes(p.id),
      saved: savedPostIds.includes(p.id),
    })),
    nextCursor,
  })
}
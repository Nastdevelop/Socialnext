import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = Number(session?.user?.id)
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { postId } = await req.json()

  const existing = await prisma.savedPost.findUnique({
    where: { userId_postId: { userId, postId } }
  })

  if (existing) {
    await prisma.savedPost.delete({
      where: { id: existing.id }
    })
    return NextResponse.json({ saved: false })
  }

  await prisma.savedPost.create({
    data: { userId, postId }
  })
  return NextResponse.json({ saved: true })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = Number(session?.user?.id)
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const saved = await prisma.savedPost.findMany({
    where: { userId },
    include: {
      post: {
        include: {
          author: true,
          likes: true,
          comment: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  const posts = saved.map((s) => s.post)
  return NextResponse.json(posts)
}
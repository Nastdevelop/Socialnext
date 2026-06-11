import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = Number(session?.user?.id)
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const { postId, content, dokumentasi } = await req.json()
  if (!postId || !content?.trim()) {
    return NextResponse.json({ error: "postId dan content diperlukan" }, { status: 400 })
  }

  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) return NextResponse.json({ error: "postingan tidak ditemukan" }, { status: 404 })
  if (post.authorId !== userId) return NextResponse.json({ error: "forbidden" }, { status: 403 })

  const updated = await prisma.post.update({
    where: { id: postId },
    data: { content, dokumentasi: dokumentasi || null, edited: true }
  })

  return NextResponse.json({ message: "postingan berhasil diedit", post: updated })
}
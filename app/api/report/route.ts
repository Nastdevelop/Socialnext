import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = Number(session?.user?.id)
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const { postId, reason } = await req.json()
  if (!postId) return NextResponse.json({ error: "postId diperlukan" }, { status: 400 })

  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) return NextResponse.json({ error: "postingan tidak ditemukan" }, { status: 404 })

  if (post.authorId === userId) {
    return NextResponse.json({ error: "tidak bisa melaporkan postingan sendiri" }, { status: 400 })
  }

  const existing = await prisma.report.findUnique({
    where: { userId_postId: { userId, postId } }
  })
  if (existing) return NextResponse.json({ error: "kamu sudah melaporkan postingan ini" }, { status: 400 })

  await prisma.report.create({
    data: { userId, postId, reason: reason || null }
  })

  const count = await prisma.report.count({ where: { postId } })

  if (count >= 10) {
    await prisma.report.deleteMany({ where: { postId } })
    await prisma.savedPost.deleteMany({ where: { postId } })
    await prisma.comment.deleteMany({ where: { postId } })
    await prisma.like.deleteMany({ where: { postId } })
    await prisma.post.delete({ where: { id: postId } })
    return NextResponse.json({ message: "postingan dihapus karena mencapai 10 laporan", autoDeleted: true })
  }

  return NextResponse.json({ message: "postingan berhasil dilaporkan" })
}
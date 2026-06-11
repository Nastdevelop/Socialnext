import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = Number(session?.user?.id)
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { postId } = await req.json()

  const post = await prisma.post.findUnique({
    where: { id: postId }
  })

  if (!post) {
    return NextResponse.json({ error: "post not found" }, { status: 404 })
  }

  if (post.authorId !== userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  await prisma.comment.deleteMany({ where: { postId } })
  await prisma.like.deleteMany({ where: { postId } })
  await prisma.savedPost.deleteMany({ where: { postId } })
  await prisma.post.delete({ where: { id: postId } })

  return NextResponse.json({ message: "post deleted" })
}
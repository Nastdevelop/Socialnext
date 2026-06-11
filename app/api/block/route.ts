import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const blockerId = Number(session?.user?.id)
  if (!blockerId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const { blockedId } = await req.json()
  if (!blockedId || blockedId === blockerId) {
    return NextResponse.json({ error: "invalid user" }, { status: 400 })
  }

  const existing = await prisma.block.findUnique({
    where: { blockerId_blockedId: { blockerId, blockedId } }
  })
  if (existing) return NextResponse.json({ error: "sudah diblokir" }, { status: 400 })

  await prisma.block.create({ data: { blockerId, blockedId } })

  await prisma.friend.deleteMany({
    where: {
      OR: [
        { idpeminta: blockerId, idpenerima: blockedId },
        { idpeminta: blockedId, idpenerima: blockerId }
      ]
    }
  })

  return NextResponse.json({ message: "berhasil memblokir pengguna" })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const blockerId = Number(session?.user?.id)
  if (!blockerId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const { blockedId } = await req.json()
  await prisma.block.deleteMany({
    where: { blockerId, blockedId }
  })

  return NextResponse.json({ message: "berhasil membuka blokir" })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  const blockerId = Number(session?.user?.id)
  if (!blockerId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const blocks = await prisma.block.findMany({
    where: { blockerId },
    include: {
      blocked: { select: { id: true, username: true, email: true, image: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json(blocks.map((b) => b.blocked))
}
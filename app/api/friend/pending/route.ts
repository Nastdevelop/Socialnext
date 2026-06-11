import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = Number(session?.user?.id)

  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const blockedIds: number[] = []
  const blocks = await prisma.block.findMany({
    where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
    select: { blockerId: true, blockedId: true }
  })
  for (const b of blocks) {
    blockedIds.push(b.blockerId === userId ? b.blockedId : b.blockerId)
  }

  const requests = await prisma.friend.findMany({
    where: {
      idpenerima: userId,
      status: "PENDING",
      idpeminta: { notIn: blockedIds }
    },
    include: {
      peminta: {
        select: { id: true, email: true, username: true }
      }
    }
  })

  const formatted = requests.map((req) => req.peminta)

  return NextResponse.json(formatted)
}
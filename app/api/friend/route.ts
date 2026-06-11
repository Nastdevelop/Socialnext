import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = Number(session?.user?.id)

  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const url = new URL(req.url)
  const page = Math.max(Number(url.searchParams.get("page")) || 1, 1)
  const take = Math.min(Number(url.searchParams.get("take")) || 10, 30)
  const search = url.searchParams.get("search") || ""
  const skip = (page - 1) * take

  const blockedIds: number[] = []
  const blocks = await prisma.block.findMany({
    where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
    select: { blockerId: true, blockedId: true }
  })
  for (const b of blocks) {
    blockedIds.push(b.blockerId === userId ? b.blockedId : b.blockerId)
  }

  const where: any = {
    id: { notIn: [userId, ...blockedIds] },
    status: "ACTIVE",
    NOT: {
      OR: [
        { receivedFriends: { some: { status: "ACCEPTED" } } },
        { sentFriends: { some: { status: "ACCEPTED" } } },
        { receivedFriends: { some: { status: "PENDING", idpeminta: userId } } },
        { sentFriends: { some: { status: "PENDING", idpenerima: userId } } },
      ]
    }
  }

  if (search) {
    where.OR = [
      { username: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }

  const users = await prisma.user.findMany({
    where,
    select: { id: true, email: true, username: true },
    skip,
    take: take + 1,
  })

  let hasMore = false
  if (users.length > take) {
    users.pop()
    hasMore = true
  }

  return NextResponse.json({ users, hasMore })
}
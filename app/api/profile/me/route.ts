import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = Number(session?.user?.id)
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true, bio: true, image: true }
  })

  if (!user) {
    return NextResponse.json({ error: "not found" }, { status: 404 })
  }

  return NextResponse.json(user)
}
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = Number(session?.user?.id)

  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { pemintaId } = await req.json()

  // 🔍 cari request yang masuk ke kita
  const friendRequest = await prisma.friend.findFirst({
    where: {
      idpeminta: pemintaId,
      idpenerima: userId,
      status: "PENDING"
    }
  })

  if (!friendRequest) {
    return NextResponse.json(
      { error: "request tidak ditemukan" },
      { status: 404 }
    )
  }

  // ✅ update jadi ACCEPTED
  await prisma.friend.update({
    where: {
      id: friendRequest.id
    },
    data: {
      status: "ACCEPTED"
    }
  })

  return NextResponse.json({
    message: "berhasil menerima pertemanan"
  })
}
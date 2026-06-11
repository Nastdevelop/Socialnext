import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, code } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email },
    include: { otp: true }
  })

  if (!user || !user.otp) {
    return NextResponse.json({ error: "data tidak ditemukan" }, { status: 404 })
  }

  if (user.otp.code !== code) {
    return NextResponse.json({ error: "OTP salah" }, { status: 400 })
  }

  if (user.otp.expiredAt < new Date()) {
    return NextResponse.json({ error: "OTP expired" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { status: "ACTIVE" }
  })

  await prisma.otp.delete({
    where: { userId: user.id }
  })

  return NextResponse.json({ message: "akun aktif" })
}
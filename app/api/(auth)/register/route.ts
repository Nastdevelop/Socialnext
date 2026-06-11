import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import { sendOtp } from "@/lib/mail"

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
  const { email, password, username } = await req.json()

  if (!email || !password || !username) {
    return NextResponse.json({ error: "semua input harus diisi" }, { status: 400 })
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username }
  })
  if (existingUsername) {
    return NextResponse.json({ error: "username sudah digunakan" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    include: { otp: true }
  })

  if (existing && existing.status === "ACTIVE") {
    return NextResponse.json({ error: "email sudah terdaftar" }, { status: 400 })
  }

  if (existing && existing.status === "PENDING") {
    const now = new Date()

    if (existing.otp && existing.otp.expiredAt > now) {
      const code = generateOTP()

      await prisma.otp.update({
        where: { userId: existing.id },
        data: {
          code,
          expiredAt: new Date(Date.now() + 5 * 60 * 1000)
        }
      })

      await sendOtp(email, code)

      return NextResponse.json({ message: "OTP dikirim ulang", email })
    }

    await prisma.user.delete({
      where: { id: existing.id }
    })
  }

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashed
    }
  })

  const code = generateOTP()

  await prisma.otp.create({
    data: {
      code,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000),
      userId: user.id
    }
  })

  await sendOtp(email, code)

  return NextResponse.json({ message: "OTP dikirim", email })
}
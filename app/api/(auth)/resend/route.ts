import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { sendOtp } from "@/lib/mail"

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
  const { email } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email },
    include: { otp: true }
  })

  if (!user || user.status === "ACTIVE") {
    return NextResponse.json({ error: "tidak valid" }, { status: 400 })
  }

  const code = generateOTP()

  await prisma.otp.update({
    where: { userId: user.id },
    data: {
      code,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000)
    }
  })

  await sendOtp(email, code)

  return NextResponse.json({ message: "OTP dikirim ulang" })
}
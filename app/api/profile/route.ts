import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = Number(session?.user?.id)
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const username = formData.get("username") as string
  const bio = formData.get("bio") as string
  const file = formData.get("image") as File | null

  if (username) {
    const existing = await prisma.user.findFirst({
      where: { username, NOT: { id: userId } }
    })
    if (existing) {
      return NextResponse.json({ error: "username sudah digunakan" }, { status: 400 })
    }
  }

  let imageUrl: string | undefined

  if (file && file.size > 0) {
    const { v2: cloudinary } = await import("cloudinary")
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_nAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "avatars" }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }).end(buffer)
    })
    imageUrl = result.secure_url
  }

  const data: any = {}
  if (username) data.username = username
  if (bio !== undefined) data.bio = bio
  if (imageUrl) data.image = imageUrl

  await prisma.user.update({
    where: { id: userId },
    data
  })

  return NextResponse.json({ message: "profile updated" })
}
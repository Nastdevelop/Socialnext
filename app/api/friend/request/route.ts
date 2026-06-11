import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    const userId = Number(session?.user?.id)
    const {penerimaId} = await req.json()

    if(!userId) return NextResponse.json({error: "unauthorized"}, {status: 401})
    if(!penerimaId) return NextResponse.json({error: "id penerima diperlukan"}, {status: 400})

    const existing = await prisma.friend.findFirst({
        where: {
            OR: [
                { idpeminta: userId, idpenerima: penerimaId },
                { idpeminta: penerimaId, idpenerima: userId }
            ]
        }
    })

    if (existing) {
        return NextResponse.json({ error: "sudah ada permintaan pertemanan" }, { status: 400 })
    }

    const res = await prisma.friend.create({
        data: { idpeminta: userId, idpenerima: penerimaId }
    })

    if(!res) return NextResponse.json({error: "gagal mengirim permintaan"}, {status: 500})

    return NextResponse.json({message: "berhasil mengirim permintaan"})
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions)
    const userId = Number(session?.user?.id)
    const { penerimaId } = await req.json()

    if(!userId) return NextResponse.json({error: "unauthorized"}, {status: 401})

    await prisma.friend.deleteMany({
        where: {
            OR: [
                { idpeminta: userId, idpenerima: penerimaId },
                { idpeminta: penerimaId, idpenerima: userId }
            ]
        }
    })

    return NextResponse.json({message: "berhasil menghapus pertemanan"})
}
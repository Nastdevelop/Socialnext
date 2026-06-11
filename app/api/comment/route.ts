import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const {userId, postId, komentar} = await req.json()
    if(!userId || !postId || !komentar){
        return NextResponse.json({error: "semua harus diinput"}, {status: 400})
    }

    const createcomment = await prisma.comment.create({
        data:{userId, postId, komentar}
    })

    if(!createcomment) {
        return NextResponse.json({error: "gagal membuat post pada backend"}, {status: 500})
    }

    return NextResponse.json(createcomment)
}
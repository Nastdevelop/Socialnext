import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const {userId, postId} = await req.json()

    const res = await prisma.like.findUnique({
        where: {
            userId_postId: {userId, postId}
        }
    })

    return NextResponse.json({
        liked: !!res,
      })
}
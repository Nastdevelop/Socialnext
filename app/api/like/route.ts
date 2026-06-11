import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if(!session?.user?.id){
        return NextResponse.json({error: "unauthorized"}, {status: 404})
    }
    const userId = Number(session.user.id)

    const {postId} = await req.json()

    const testLike = await prisma.like.findUnique({
        where: {
            userId_postId: {
                userId,
                postId
            }
        }
    })

    if(testLike) {
        await prisma.like.delete({
            where: {
                id: testLike.id
            }
        })
        return NextResponse.json({ liked: false })
    }

    await prisma.like.create({
        data: {
            postId,
            userId
        }
    })
    return NextResponse.json({ liked: true })
} 
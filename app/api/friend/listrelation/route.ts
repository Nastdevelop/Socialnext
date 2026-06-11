import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET() {
    const session = await getServerSession(authOptions)
    const userId = Number(session?.user?.id)

    if(!userId){
        return NextResponse.json({error: "unauthorize"}, {status: 404})
    }

    const friendlist = await prisma.friend.findMany({
        where: {
            status: "ACCEPTED",
            OR: [
                {idpeminta: userId},
                {idpenerima: userId}
            ]
        },
        include: {
            peminta: {
                select: {
                    id: true,
                    username: true
                }
            },
            penerima:{
                select: {
                    id: true,
                    username: true
                }
            }
        }
    })

    const formater = friendlist.map((f) => {
        if(f.idpeminta === userId){
            return f.penerima
        }else {
            return f.peminta
        }
    })

    return NextResponse.json(formater)
}
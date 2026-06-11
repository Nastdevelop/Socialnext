import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 500 });
  }

  const { content, dokumentasi} = await req.json();
  if (!content) {
    return NextResponse.json({ error: "konten harus diisi" }, { status: 401 });
  }
 
  const postingan = await prisma.post.create({
    data: {
      content,
      authorId: Number(session?.user?.id),
      dokumentasi
    },
  });
  if (!postingan) {
    return NextResponse.json(
      { error: "gagal buat postingan" },
      { status: 401 }
    );
  }

  return NextResponse.json({ message: "berhasil membuat post" });
}

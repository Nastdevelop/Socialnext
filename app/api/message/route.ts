import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { senderId, receiverId, content } =
    await req.json();

  if (!content?.trim()) {
    return NextResponse.json(
      { error: "Pesan kosong" },
      { status: 400 }
    );
  }

  const message = await prisma.message.create({
    data: {
      senderId,
      receiverId,
      content,
    },
  });

  const room = [senderId, receiverId]
    .sort((a, b) => a - b)
    .join("-");

  await pusherServer.trigger(
    `chat-${room}`,
    "new-message",
    message
  );

  await pusherServer.trigger(
    `user-${senderId}`,
    "new-message",
    message
  );

  await pusherServer.trigger(
    `user-${receiverId}`,
    "new-message",
    message
  );

  return NextResponse.json(message);
}
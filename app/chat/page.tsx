import prisma from "@/lib/prisma";
import ChatListClient from "@/component/chatList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ChatList() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  const friends = await prisma.friend.findMany({
    where: {
      status: "ACCEPTED",
      OR: [
        { idpeminta: userId },
        { idpenerima: userId },
      ],
    },
    include: {
      peminta: true,
      penerima: true,
    },
  });

  const friendList = await Promise.all(
    friends.map(async (f) => {
      const friend =
        f.idpeminta === userId
          ? f.penerima
          : f.peminta;

      const lastMessage =
        await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: friend.id },
              { senderId: friend.id, receiverId: userId },
            ],
          },
          orderBy: { createdAt: "desc" },
        });

      return {
        id: friend.id,
        username: friend.username,
        image: friend.image,
        lastMessage: lastMessage?.content || "",
        lastTime: lastMessage?.createdAt || null,
      };
    })
  );

  friendList.sort((a, b) => {
    if (!a.lastTime) return 1
    if (!b.lastTime) return -1
    return new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
  })

  return <ChatListClient data={friendList} userId={userId} />;
}
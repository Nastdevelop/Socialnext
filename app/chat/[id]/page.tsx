import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ChatBox from "@/component/ChatBox";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user.id);
  const friendId = Number((await params).id);

  const friend = await prisma.user.findUnique({
    where: { id: friendId },
    select: { username: true }
  })

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <ChatBox
      initialMessages={messages}
      userId={userId}
      friendId={friendId}
      friendName={friend?.username}
    />
  );
}
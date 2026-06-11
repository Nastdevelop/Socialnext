"use client"

import { useEffect, useState } from "react"
import { pusherClient } from "@/lib/pusher-client"
import { MessageSquare } from "lucide-react"
import { useNav } from "@/component/NavigationProvider"

type ChatData = {
  id: number
  username: string
  image?: string | null
  lastMessage: string
  lastTime: Date | null
}

type Props = {
  data: ChatData[]
  userId: number
}

export default function ChatListClient({ data, userId }: Props) {
  const [chats, setChats] = useState(data)
  const { navigate } = useNav()

  useEffect(() => { setChats(data) }, [data])

  useEffect(() => {
    const channel = pusherClient.subscribe(`user-${userId}`)
    channel.bind("new-message", (message: { senderId: number; receiverId: number; content: string; createdAt: string }) => {
      setChats((prev) => {
        const partnerId = message.senderId === userId ? message.receiverId : message.senderId
        const existing = prev.find((c) => c.id === partnerId)
        if (existing) {
          return prev.map((c) =>
            c.id === partnerId ? { ...c, lastMessage: message.content, lastTime: new Date(message.createdAt) } : c
          ).sort((a, b) => {
            if (!a.lastTime) return 1; if (!b.lastTime) return -1
            return new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
          })
        }
        return prev
      })
    })
    return () => { channel.unbind_all(); pusherClient.unsubscribe(`user-${userId}`) }
  }, [userId])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 pb-28 md:pb-12">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/60">
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              Pesan
            </h1>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {chats.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 animate-fade-in">
                <MessageSquare className="w-12 h-12 mb-3 opacity-40" />
                <p className="text-sm font-medium">Belum ada percakapan</p>
              </div>
            )}
            {chats.map((chat, i) => (
              <div key={chat.id} onClick={() => navigate(`/chat/${chat.id}`)}
                className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all duration-200 cursor-pointer active:scale-[0.99] animate-slide-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                    {chat.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{chat.username}</h2>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 flex-shrink-0 ml-2">
                      {chat.lastTime ? new Date(chat.lastTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : ""}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate leading-relaxed">
                    {chat.lastMessage || "Mulai percakapan baru"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
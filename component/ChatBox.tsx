"use client"

import { useEffect, useState, useRef } from "react"
import { pusherClient } from "@/lib/pusher-client"
import { ArrowLeft, Send } from "lucide-react"
import { useNav } from "@/component/NavigationProvider"

type Message = { id: number; senderId: number; receiverId: number; content: string; createdAt: Date }
type Props = { initialMessages: Message[]; userId: number; friendId: number; friendName?: string }

export default function ChatBox({ initialMessages, userId, friendId, friendName }: Props) {
  const [messages, setMessages] = useState(initialMessages)
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const { navigate } = useNav()

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  useEffect(() => { scrollToBottom() }, [messages])

  useEffect(() => {
    const room = [userId, friendId].sort((a, b) => a - b).join("-")
    const channel = pusherClient.subscribe(`chat-${room}`)
    channel.bind("new-message", (message: Message) => setMessages((prev) => [...prev, message]))
    return () => { channel.unbind_all(); pusherClient.unsubscribe(`chat-${room}`) }
  }, [userId, friendId])

  const sendMessage = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    try {
      await fetch("/api/message", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: userId, receiverId: friendId, content: text })
      })
      setText("")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 pb-28 md:pb-12 flex justify-center px-4">
      <div className="w-full max-w-2xl pt-4">
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm flex flex-col h-[600px] overflow-hidden animate-slide-up">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
            <button onClick={() => navigate("/chat")} className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {friendName?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{friendName || "Chat"}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30 dark:bg-slate-900/30 scrollbar-thin">
            {messages.map((msg) => {
              const isMe = msg.senderId === userId
              return (
                <div key={msg.id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"} animate-slide-up`}>
                  <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm break-words ${
                    isMe
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm"
                      : "bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-bl-sm"
                  }`}>
                    {msg.content}
                    <p className={`text-[10px] mt-1.5 ${isMe ? "text-indigo-200" : "text-slate-400 dark:text-slate-500"}`}>
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : ""}
                    </p>
                  </div>
                </div>
              )
            })}
            {messages.length === 0 && (
              <div className="text-center text-slate-400 dark:text-slate-500 text-sm py-16">Belum ada pesan. Kirim pesan pertama!</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800/80">
            <div className="flex gap-2 items-center bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-xl p-1.5 transition-all">
              <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !sending) sendMessage() }}
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none" placeholder="Tulis pesan..." />
              <button onClick={sendMessage} disabled={!text.trim() || sending}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm px-5 py-2 rounded-lg flex items-center gap-1.5 transition disabled:opacity-50 shadow-sm">
                <Send className="w-4 h-4" /> Kirim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
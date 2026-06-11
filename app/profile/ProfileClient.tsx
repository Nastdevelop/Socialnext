"use client"

import Image from "next/image"
import Link from "next/link"
import PostActions from "@/component/postActions"
import { User, Calendar, Edit3, Users, FileText } from "lucide-react"

type UserData = {
  id: number
  username: string
  email: string
  bio: string | null
  image: string | null
  createdAt: Date
}

type PostData = {
  id: number
  content: string
  dokumentasi: string | null
  createdAt: string
  authorId: number
  _count: { likes: number; comment: number }
  liked: boolean
  saved: boolean
}

export default function ProfileClient({ user, posts, friendCount, userId }: { user: UserData; posts: PostData[]; friendCount: number; userId: number }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 pb-28 md:pb-12">
      <div className="max-w-[580px] mx-auto px-4 space-y-5 pt-6">

        <div className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm p-6 animate-slide-up">
          <div className="flex items-center gap-4">
            {user.image ? (
              <Image src={user.image} alt="" width={52} height={52} className="w-13 h-13 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700" />
            ) : (
              <div className="w-13 h-13 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center shadow-sm">
                <span className="text-lg font-bold text-white">{user.username?.substring(0, 2).toUpperCase()}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 truncate">{user.username}</h1>
              <p className="text-sm text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
            </div>
          </div>

          {user.bio && (
            <p className="mt-3.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{user.bio}</p>
          )}

          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-200">{posts.length}</span>{" "}
              <span className="text-slate-400 dark:text-slate-500">Postingan</span>
            </div>
            <Link href="/profile/friendlist" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <span className="font-bold text-slate-800 dark:text-slate-200">{friendCount}</span>{" "}
              <span className="text-slate-400 dark:text-slate-500">Teman</span>
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 ml-auto">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <Link href="/updateProfile" className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all">
              <Edit3 className="w-4 h-4" />
              Edit Profil
            </Link>
            <Link href="/profile/friendlist" className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl text-sm font-semibold transition-all">
              <Users className="w-4 h-4" />
              Teman
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500 animate-fade-in">
              <FileText className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm font-medium">Belum ada postingan</p>
            </div>
          ) : (
            posts.map((post, i) => (
              <div key={post.id} className="group bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm hover:shadow-md dark:shadow-slate-900/20 transition-all duration-300 overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <p className="text-[15px] px-5 pt-4 pb-2 leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {post.content}
                </p>
                {post.dokumentasi && (
                  <div className="mt-2 border-t border-slate-100 dark:border-slate-700/50">
                    <Image src={post.dokumentasi} alt="" width={580} height={400} className="w-full max-h-[500px] object-contain" />
                  </div>
                )}
                <PostActions postId={post.id} userId={userId} likesCount={post._count.likes} liked={post.liked} commentCount={post._count.comment} isSaved={post.saved} />
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
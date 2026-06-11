import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import Image from "next/image"
import { Calendar, FileText, User as UserIcon, Ban } from "lucide-react"
import PostActions from "@/component/postActions"
import FriendButton from "./FriendButton"
import BlockButton from "./BlockButton"

export default async function UserDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const currentUserId = Number(session?.user?.id)
  const userId = Number((await params).id)

  if (!currentUserId) {
    return <div className="min-h-screen pt-20 flex items-center justify-center text-slate-400">Unauthorized</div>
  }

  if (currentUserId === userId) {
    return <div className="min-h-screen pt-20 flex items-center justify-center text-slate-400">Ini adalah akun Anda. <a href="/profile" className="text-indigo-600 ml-1">Lihat profil</a></div>
  }

  const [blockedByMe, iAmBlocked] = await Promise.all([
    prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId: currentUserId, blockedId: userId } }
    }),
    prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId: userId, blockedId: currentUserId } }
    })
  ])
  const isBlocked = !!blockedByMe

  if (iAmBlocked) {
    return <div className="min-h-screen pt-20 flex items-center justify-center text-slate-400">Tidak dapat mengakses halaman ini</div>
  }

  const user = await prisma.user.findUnique({
    where: { id: userId, status: "ACTIVE" },
    include: {
      posts: {
        take: 20,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { likes: true, comment: true } } }
      }
    }
  })

  if (!user) {
    return <div className="min-h-screen pt-20 flex items-center justify-center text-slate-400">Pengguna tidak ditemukan</div>
  }

  const [friendStatus, likedData, savedPosts] = await Promise.all([
    prisma.friend.findFirst({
      where: {
        OR: [
          { idpeminta: currentUserId, idpenerima: userId },
          { idpeminta: userId, idpenerima: currentUserId }
        ]
      }
    }),
    prisma.like.findMany({
      where: { userId: currentUserId, postId: { in: user.posts.map((p) => p.id) } },
      select: { postId: true }
    }),
    prisma.savedPost.findMany({
      where: { userId: currentUserId },
      select: { postId: true }
    })
  ])

  const likedSet = new Set(likedData.map((l) => l.postId))
  const savedIds = new Set(savedPosts.map((s) => s.postId))

  let relation: "none" | "pending_sent" | "pending_received" | "friends" = "none"
  if (friendStatus) {
    if (friendStatus.status === "ACCEPTED") relation = "friends"
    else if (friendStatus.idpeminta === currentUserId) relation = "pending_sent"
    else relation = "pending_received"
  }

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
              <span className="font-bold text-slate-800 dark:text-slate-200">{user.posts.length}</span>{" "}
              <span className="text-slate-400 dark:text-slate-500">Postingan</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 ml-auto">
              <Calendar className="w-3.5 h-3.5" />
              Bergabung {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
            {!isBlocked && <FriendButton targetUserId={userId} relation={relation} />}
            <BlockButton targetUserId={userId} isBlocked={isBlocked} />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 px-1">Postingan</h2>

          {isBlocked ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500 animate-fade-in">
              <Ban className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm font-medium">Pengguna diblokir</p>
              <p className="text-xs mt-1">Buka blokir untuk melihat postingan</p>
            </div>
          ) : user.posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500 animate-fade-in">
              <FileText className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm font-medium">Belum ada postingan</p>
            </div>
          ) : (
            user.posts.map((post, i) => (
              <div key={post.id} className="group bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm hover:shadow-md dark:shadow-slate-900/20 transition-all duration-300 overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-center gap-3 px-5 pt-4 pb-2">
                  {user.image ? (
                    <Image src={user.image} alt="" width={28} height={28} className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                      {user.username?.substring(0, 2).toUpperCase() || "UN"}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user.username}</span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-auto">
                    {new Date(post.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </span>
                </div>

                <p className="text-[15px] px-5 pb-2 leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{post.content}</p>

                {post.dokumentasi && (
                  <div className="border-t border-slate-100 dark:border-slate-700/50">
                    <Image src={post.dokumentasi} alt="" width={580} height={400} className="w-full max-h-[500px] object-contain" />
                  </div>
                )}

                <PostActions
                  postId={post.id}
                  userId={currentUserId}
                  likesCount={post._count.likes}
                  liked={likedSet.has(post.id)}
                  commentCount={post._count.comment}
                  isSaved={savedIds.has(post.id)}
                />
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
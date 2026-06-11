import prisma from "@/lib/prisma"
import Image from "next/image"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import PostActions from "@/component/postActions"
import Comment from "@/component/comment"
import { MessageCircle } from "lucide-react"

export default async function PostDetail({params}: {params: Promise<{id: string}>}) {
  const session = await getServerSession(authOptions)
  const userId = Number(session?.user?.id)
  const {id} = await params

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      author: { select: { id: true, username: true, email: true, image: true } },
      _count: { select: { likes: true, comment: true } },
      comment: {
        take: 50,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, username: true, image: true } } }
      }
    }
  })

  if (!post) {
    return <div className="min-h-screen pt-20 flex items-center justify-center text-slate-400">Postingan tidak ditemukan</div>
  }

  const liked = userId ? !!(await prisma.like.findUnique({ where: { userId_postId: { userId, postId: post.id } } })) : false
  const isSaved = userId ? !!(await prisma.savedPost.findUnique({ where: { userId_postId: { userId, postId: post.id } } })) : false

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 pb-12">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          <div className="w-full lg:w-[60%]">
            <div className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm overflow-hidden animate-slide-up">
              <div className="flex items-center gap-3 px-5 pt-4 pb-2">
                {post.author?.image ? (
                  <Image src={post.author.image} alt="" width={36} height={36} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
                    {post.author?.username?.substring(0, 2).toUpperCase() || "UN"}
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{post.author?.username}</h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {new Date(post.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    {post.edited && <span className="ml-1.5 text-[10px] text-slate-400 dark:text-slate-500 italic">(diedit)</span>}
                  </p>
                </div>
              </div>

              <p className="text-[15px] px-5 py-3 leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{post.content}</p>

              {post.dokumentasi && (
                <div className="border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30">
                  <Image src={post.dokumentasi} alt="" width={1000} height={600} className="w-full max-h-[600px] object-contain" />
                </div>
              )}

              <PostActions postId={post.id} userId={userId} likesCount={post._count.likes} liked={liked} commentCount={post._count.comment} isSaved={isSaved} />
            </div>
          </div>

          <div className="w-full lg:w-[40%] lg:sticky lg:top-20">
            <div className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm p-5 flex flex-col max-h-[70vh]">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-700/60">
                <MessageCircle className="w-4.5 h-4.5 text-indigo-500" />
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Komentar</h2>
                <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold ml-auto">{post._count.comment}</span>
              </div>

              <div className="space-y-3 overflow-y-auto flex-1 pr-1 scrollbar-thin">
                {post.comment.map((komen) => (
                  <div key={komen.id} className="flex gap-3 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700/40">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 shadow-sm">
                      {komen.user.username?.substring(0, 2).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200 truncate">{komen.user.username}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0">
                          {new Date(komen.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{komen.komentar}</p>
                    </div>
                  </div>
                ))}
                {post.comment.length === 0 && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-8">Belum ada komentar</p>
                )}
              </div>

              <Comment postId={post.id} userId={userId} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
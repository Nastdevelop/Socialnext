"use client"

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2, Sparkles } from "lucide-react"

type NavContext = {
  isLoading: boolean
  navigate: (href: string) => void
}

const NavCtx = createContext<NavContext>({
  isLoading: false,
  navigate: () => {}
})

export const useNav = () => useContext(NavCtx)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const pendingRef = useRef(false)

  useEffect(() => {
    if (pendingRef.current) {
      pendingRef.current = false
      setIsLoading(false)
    }
  }, [pathname])

  const navigate = useCallback((href: string) => {
    if (href === pathname) return
    pendingRef.current = true
    setIsLoading(true)
    router.push(href)
  }, [router, pathname])

  return (
    <NavCtx.Provider value={{ isLoading, navigate }}>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl px-12 py-10 shadow-2xl dark:shadow-slate-900/50 flex flex-col items-center gap-5 animate-bounce-scale border border-slate-100 dark:border-slate-700">
            <div className="relative">
              <div className="w-14 h-14 border-[3px] border-primary-200 dark:border-slate-600 rounded-full" />
              <div className="absolute inset-0 w-14 h-14 border-[3px] border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Memuat</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Mohon tunggu sebentar</p>
            </div>
          </div>
        </div>
      )}
      {children}
    </NavCtx.Provider>
  )
}
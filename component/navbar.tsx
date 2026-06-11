"use client"
import { usePathname } from "next/navigation"
import { useNav } from "./NavigationProvider"
import { useTheme } from "@/lib/theme"
import { Home, Users, PenSquare, MessageSquare, Settings, User, Moon, Sun } from "lucide-react"
import React from "react"

const navItems = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/friend", label: "Teman", icon: Users },
  { href: "/createpost", label: "Posting", icon: PenSquare },
  { href: "/chat", label: "Pesan", icon: MessageSquare },
  { href: "/profile", label: "Profil", icon: User },
  { href: "/setelan", label: "Setelan", icon: Settings },
]

export default function Navbar() {
    const pathname = usePathname()
    const { navigate } = useNav()
    const { theme, toggle } = useTheme()

    if (pathname === "/login" || pathname === "/register" || pathname.startsWith("/register/")) {
        return null
    }

    return(
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-8 h-14">
        
          <div 
            onClick={() => navigate("/")} 
            className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent cursor-pointer select-none"
          >
            socialnext
          </div>

          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <item.icon className="w-4.5 h-4.5" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Mobile nav trigger */}
            <MobileNav pathname={pathname} navigate={navigate} navItems={navItems} />
          </div>

        </div>
      </header>
    )
}

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> }

function MobileNav({ pathname, navigate, navItems }: { pathname: string; navigate: (h: string) => void; navItems: NavItem[] }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200/50 dark:border-slate-700/50 md:hidden">
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
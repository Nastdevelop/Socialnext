"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type Theme = "light" | "dark"

type ThemeContext = {
  theme: Theme
  toggle: () => void
  setTheme: (t: Theme) => void
}

const Ctx = createContext<ThemeContext>({
  theme: "light",
  toggle: () => {},
  setTheme: () => {},
})

export const useTheme = () => useContext(Ctx)

const STORAGE_KEY = "socialnext-theme"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored === "dark" || stored === "light") {
      setThemeState(stored)
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeState("dark")
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme, mounted])

  const toggle = () => setThemeState((t) => (t === "dark" ? "light" : "dark"))
  const setTheme = (t: Theme) => setThemeState(t)

  if (!mounted) {
    return <>{children}</>
  }

  return <Ctx.Provider value={{ theme, toggle, setTheme }}>{children}</Ctx.Provider>
}
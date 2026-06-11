"use client"

import { signOut } from "next-auth/react";
import { useNav } from "@/component/NavigationProvider";
import { useTheme } from "@/lib/theme";
import { User, Lock, Shield, LogOut, ChevronRight, Moon, Sun, Palette } from "lucide-react";

export default function Settings() {
    const { navigate } = useNav();
    const { theme, setTheme } = useTheme();

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-28 md:pb-12 flex justify-center px-4">
        <div className="w-full max-w-md">
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Setelan</h1>
            <p className="text-sm text-slate-400 dark:text-slate-500">Kelola akun dan preferensi Anda</p>
          </div>

          {/* TEMA */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm mb-4 overflow-hidden">
            <div className="px-5 pt-4 pb-2">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tampilan</span>
            </div>
            <div className="px-5 pb-5">
              <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Palette className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Mode Tampilan</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Pilih tema gelap atau terang</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-0.5 gap-0.5">
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-2 rounded-lg transition-all ${theme === "light" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
                  >
                    <Sun className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-2 rounded-lg transition-all ${theme === "dark" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
                  >
                    <Moon className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AKUN & KEAMANAN */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm mb-4 overflow-hidden">
            <div className="px-5 pt-4 pb-2">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Akun & Keamanan</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              <button onClick={() => navigate("/updateProfile")} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors text-left group">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Edit Profil</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Ubah nama, bio, dan foto profil</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button onClick={() => navigate("/ubah-password")} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors text-left group">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ubah Password</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Ganti kata sandi Anda</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* PRIVASI */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm mb-6 overflow-hidden">
            <div className="px-5 pt-4 pb-2">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Privasi</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              <button onClick={() => navigate("/blocked")} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors text-left group">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Pengguna Diblokir</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Kelola daftar blokir</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <button
            onClick={() => signOut({callbackUrl: "/login"})}
            className="w-full bg-white dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700/60 hover:border-rose-200 dark:hover:border-rose-500/30 py-3.5 rounded-2xl font-semibold shadow-sm flex items-center justify-center gap-2.5 active:scale-[0.99] transition-all"
          >
            <LogOut className="w-5 h-5" />
            Keluar dari Akun
          </button>

        </div>
      </div>
    );
  }
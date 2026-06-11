import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/component/navbar";
import SessionProvider from "@/component/SessionProvider";
import { NavigationProvider } from "@/component/NavigationProvider";
import { ThemeProvider } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"] 
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Socialnext",
  description: "Social Media App",
  icons: [{ rel: "icon", url: "/nextlogo.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <SessionProvider>
            <NavigationProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
            </NavigationProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
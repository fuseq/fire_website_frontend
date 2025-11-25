import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AdminProvider } from "@/lib/admin-context"
import { UserProvider } from "@/lib/user-context"
import { CartProvider } from "@/lib/cart-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Şirket İsmi - Yangın Güvenliği Ürünleri",
  description: "Profesyonel yangın söndürme ve güvenlik ürünleri",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`font-sans antialiased`}>
        <CartProvider>
          <UserProvider>
            <AdminProvider>{children}</AdminProvider>
          </UserProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}

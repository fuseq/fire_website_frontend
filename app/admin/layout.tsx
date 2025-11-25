"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAdmin } from "@/lib/admin-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAdminLoggedIn } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Login sayfası hariç tüm admin sayfalarını koru
    if (!isAdminLoggedIn && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [isAdminLoggedIn, pathname, router])

  // Login sayfasında koruma yok
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Diğer sayfalarda admin kontrolü
  if (!isAdminLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Yönlendiriliyor...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

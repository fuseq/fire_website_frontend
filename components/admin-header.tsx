"use client"

import { useRouter } from "next/navigation"
import { Home, User } from "lucide-react"

export function AdminHeader() {
  const router = useRouter()

  const handleGoToSite = () => {
    router.push("/")
  }

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-end">
        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoToSite}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium"
          >
            <Home className="w-5 h-5" />
            <span className="hidden md:inline">Siteye Dön</span>
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-300"></div>

          {/* Admin Profile */}
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">Yönetici</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

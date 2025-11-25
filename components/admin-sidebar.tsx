"use client"

import { useAdmin } from "@/lib/admin-context"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Package, LogOut, ShoppingCart, Users } from "lucide-react"

export function AdminSidebar() {
  const { logoutAdmin, getStats } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()
  const stats = getStats()

  const handleLogout = () => {
    logoutAdmin()
    router.push("/admin/login")
  }

  const navItems = [
    { href: "/admin/dashboard", icon: BarChart3, label: "İstatistikler", badge: null },
    { href: "/admin/products", icon: Package, label: "Ürün Yönetimi", badge: stats.totalProducts },
    { href: "/admin/orders", icon: ShoppingCart, label: "Siparişler", badge: stats.totalOrders },
    { href: "/admin/users", icon: Users, label: "Kullanıcılar", badge: null },
  ]

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col h-screen shadow-xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">🔥</span>
          </div>
          <div>
            <h2 className="text-lg font-bold">Ülküm Yangın Sistemleri </h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all font-medium group ${
                isActive
                  ? "bg-red-600 text-white shadow-lg"
                  : "hover:bg-gray-700/50 text-gray-300 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-700 text-gray-300 group-hover:bg-gray-600"
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-700 space-y-3">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Toplam Gelir</p>
          <p className="text-lg font-bold text-green-400">₺{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600/20 transition font-medium text-red-400 hover:text-red-300"
        >
          <LogOut className="w-5 h-5" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}

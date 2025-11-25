"use client"

import { useAdmin } from "@/lib/admin-context"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { useRouter } from "next/navigation"
import { BarChart3, Package, TrendingUp, ShoppingCart, ArrowUp, ArrowDown, DollarSign, Users, Activity } from "lucide-react"
import { useEffect, useState } from "react"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function AdminDashboard() {
  const { isAdminLoggedIn, getStats, orders } = useAdmin()
  const router = useRouter()
  const [stats, setStats] = useState(getStats())

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push("/admin/login")
    } else {
      setStats(getStats())
    }
  }, [isAdminLoggedIn, router])

  if (!isAdminLoggedIn) return null

  // Prepare chart data
  const categoryData = [
    { name: 'Söndürücüler', value: 2, color: '#ef4444' },
    { name: 'Alarm Sistemleri', value: 1, color: '#3b82f6' },
    { name: 'Aydınlatma', value: 1, color: '#f59e0b' },
    { name: 'Hortumlar', value: 1, color: '#10b981' },
    { name: 'Dolap/Aksesuar', value: 1, color: '#8b5cf6' },
  ]

  const monthlyRevenue = [
    { month: 'Ocak', gelir: 1200, siparis: 8 },
    { month: 'Şubat', gelir: 1800, siparis: 12 },
    { month: 'Mart', gelir: 2400, siparis: 15 },
    { month: 'Nisan', gelir: 1950, siparis: 11 },
    { month: 'Mayıs', gelir: 2800, siparis: 18 },
    { month: 'Haziran', gelir: 3200, siparis: 22 },
  ]

  const dailyOrders = [
    { day: 'Pzt', siparisler: 5 },
    { day: 'Sal', siparisler: 8 },
    { day: 'Çar', siparisler: 6 },
    { day: 'Per', siparisler: 12 },
    { day: 'Cum', siparisler: 15 },
    { day: 'Cmt', siparisler: 3 },
    { day: 'Paz', siparisler: 2 },
  ]

  const completedOrders = orders.filter(o => o.status === 'completed').length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 via-white to-gray-50">

        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">İşletme istatistiklerini ve özet bilgileri görüntüleyin</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Products */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Package className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
                  <ArrowUp className="w-4 h-4" />
                  <span>12%</span>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-1">Toplam Ürün</p>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </div>

            {/* Total Orders */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
                  <ArrowUp className="w-4 h-4" />
                  <span>8%</span>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-1">Toplam Sipariş</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>

            {/* Total Revenue */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
                  <ArrowUp className="w-4 h-4" />
                  <span>23%</span>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-1">Toplam Gelir</p>
              <p className="text-3xl font-bold">₺{stats.totalRevenue.toLocaleString()}</p>
            </div>

            {/* Average Order */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
                  <ArrowUp className="w-4 h-4" />
                  <span>5%</span>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-1">Ortalama Sipariş</p>
              <p className="text-3xl font-bold">₺{Math.round(stats.totalRevenue / stats.totalOrders)}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Revenue Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Aylık Gelir Trendi</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="colorGelir" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value) => `₺${value}`}
                  />
                  <Area type="monotone" dataKey="gelir" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorGelir)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Kategori Dağılımı</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders and Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Daily Orders Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Haftalık Sipariş Trendi</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyOrders}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Bar dataKey="siparisler" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Order Status Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sipariş Durumları</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tamamlandı</p>
                      <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold">{Math.round((completedOrders / stats.totalOrders) * 100)}%</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Beklemede</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                    </div>
                  </div>
                  <div className="text-yellow-600 font-semibold">{Math.round((pendingOrders / stats.totalOrders) * 100)}%</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">İptal Edildi</p>
                      <p className="text-2xl font-bold text-gray-900">{cancelledOrders}</p>
                    </div>
                  </div>
                  <div className="text-red-600 font-semibold">{Math.round((cancelledOrders / stats.totalOrders) * 100)}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Son Siparişler</h2>
                <p className="text-sm text-gray-500 mt-1">En son {stats.recentOrders.length} sipariş</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition">
                Tümünü Görüntüle
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sipariş No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Müşteri</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ürün</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Toplam</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tarih</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono font-semibold text-gray-900">{order.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-red-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                            <p className="text-xs text-gray-500">{order.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{order.items} ürün</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">₺{order.total.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status === "completed"
                            ? "✓ Tamamlandı"
                            : order.status === "pending"
                              ? "⏳ Beklemede"
                              : "✕ İptal"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

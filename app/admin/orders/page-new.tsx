"use client"

import { useAdmin } from "@/lib/admin-context"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ordersAPI } from "@/lib/api"
import { TrendingUp, Calendar, Users, Eye, X, MapPin, Phone, Mail, Package, Loader2 } from "lucide-react"

interface OrderItem {
  id: number
  product_id: number
  product_name: string
  quantity: number
  unit_price: string
  total_price: string
}

interface Order {
  id: number
  order_number: string
  user_name: string
  user_email: string
  total_amount: string
  status: string
  created_at: string
  street?: string
  city?: string
  zip_code?: string
  phone?: string
  items?: OrderItem[]
  items_count: number
}

export default function AdminOrdersPage() {
  const { isAdminLoggedIn } = useAdmin()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false)

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push("/admin/login")
      return
    }
    fetchOrders()
  }, [isAdminLoggedIn, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await ordersAPI.getAll()
      if (response.success) {
        setOrders(response.data)
      }
    } catch (error) {
      console.error("Siparişler yüklenemedi:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadOrderDetails = async (orderId: number) => {
    try {
      setLoadingOrderDetail(true)
      const response = await ordersAPI.getById(orderId)
      if (response.success) {
        setSelectedOrder(response.data)
      }
    } catch (error) {
      console.error("Sipariş detayı yüklenemedi:", error)
    } finally {
      setLoadingOrderDetail(false)
    }
  }

  if (!isAdminLoggedIn) return null

  const completedOrders = orders.filter((o) => o.status === "completed").length
  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const totalValue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0)

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Siparişler</h1>
            <p className="text-gray-600 mt-2">Tüm müşteri siparişlerini ve satış bilgilerini izleyin</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Tamamlanan Siparişler</p>
                  <p className="text-3xl font-bold text-gray-900">{completedOrders}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Beklemede olan Siparişler</p>
                  <p className="text-3xl font-bold text-gray-900">{pendingOrders}</p>
                </div>
                <Calendar className="w-10 h-10 text-yellow-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Toplam Sipariş Değeri</p>
                  <p className="text-3xl font-bold text-gray-900">₺{totalValue.toFixed(2)}</p>
                </div>
                <Users className="w-10 h-10 text-blue-600 opacity-20" />
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Tüm Siparişler</h2>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Siparişler yükleniyor...</p>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Henüz sipariş yok</p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Sipariş No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Müşteri Adı</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">E-Mail</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ürün Sayısı</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Toplam Tutar</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tarih</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono font-semibold text-gray-900">{order.order_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.user_name || 'Bilinmiyor'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.user_email || 'Bilinmiyor'}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.items_count}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">₺{parseFloat(order.total_amount).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status === "completed"
                            ? "Tamamlandı"
                            : order.status === "pending"
                              ? "Beklemede"
                              : "İptal"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString('tr-TR')}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => loadOrderDetails(order.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                        >
                          <Eye className="w-4 h-4" />
                          Detay
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Order Detail Modal */}
      {(selectedOrder || loadingOrderDetail) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {loadingOrderDetail ? (
            <div className="bg-white rounded-lg shadow-lg p-12">
              <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto" />
              <p className="text-gray-600 mt-4 text-center">Yükleniyor...</p>
            </div>
          ) : selectedOrder && (
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Sipariş Detayı</h2>
                <p className="text-gray-600 text-sm mt-1">{selectedOrder.order_number}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Sipariş Durumu</p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedOrder.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : selectedOrder.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedOrder.status === "completed" && "Tamamlandı"}
                    {selectedOrder.status === "pending" && "Beklemede"}
                    {selectedOrder.status === "cancelled" && "İptal Edildi"}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Sipariş Tarihi</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {new Date(selectedOrder.created_at).toLocaleDateString('tr-TR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Müşteri Bilgileri
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-gray-900 font-medium">{selectedOrder.user_name || 'Bilinmiyor'}</p>
                  <p className="flex items-center gap-2 text-gray-600 text-sm">
                    <Mail className="w-4 h-4" />
                    {selectedOrder.user_email || 'Bilinmiyor'}
                  </p>
                  {selectedOrder.phone && (
                    <p className="flex items-center gap-2 text-gray-600 text-sm">
                      <Phone className="w-4 h-4" />
                      {selectedOrder.phone}
                    </p>
                  )}
                  {(selectedOrder.street || selectedOrder.city) && (
                    <p className="flex items-start gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      {selectedOrder.street}, {selectedOrder.city} {selectedOrder.zip_code}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Sipariş Ürünleri
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ürün</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Miktar</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Birim Fiyat</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Toplam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item) => (
                          <tr key={item.id} className="border-t border-gray-200">
                            <td className="px-4 py-3 text-sm text-gray-900">{item.product_name || 'Ürün'}</td>
                            <td className="px-4 py-3 text-sm text-center text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">₺{parseFloat(item.unit_price).toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                              ₺{parseFloat(item.total_price).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                            Ürün bilgisi bulunamadı
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900">
                          Genel Toplam:
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-red-600 text-lg">
                          ₺{parseFloat(selectedOrder.total_amount).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  )
}

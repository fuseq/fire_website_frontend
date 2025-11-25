"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser, type UserOrder } from "@/lib/user-context"
import { Header } from "@/components/header"
import { WhatsappButton } from "@/components/whatsapp-button"
import { LogOut, Plus, Edit2, Trash2, MapPin, Phone, Eye, X, Package, Calendar } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoggedIn, logoutUser, addAddress, updateAddress, deleteAddress } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get("tab") as "profile" | "addresses" | "orders" | null
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "orders">(tabFromUrl || "profile")
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    zipCode: "",
  })

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  if (!isLoggedIn || !user) return null

  const handleAddAddress = () => {
    setEditingAddressId(null)
    setFormData({ name: "", phone: "", street: "", city: "", zipCode: "" })
    setIsAddressModalOpen(true)
  }

  const handleEditAddress = (addressId: number) => {
    const address = user.addresses.find((a) => a.id === addressId)
    if (address) {
      setEditingAddressId(addressId)
      setFormData({
        name: address.name,
        phone: address.phone,
        street: address.street,
        city: address.city,
        zipCode: address.zipCode,
      })
      setIsAddressModalOpen(true)
    }
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAddressId) {
      updateAddress(editingAddressId, formData)
    } else {
      addAddress({ ...formData, isDefault: user.addresses.length === 0 })
    }
    setIsAddressModalOpen(false)
  }

  const handleLogout = () => {
    logoutUser()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-red-100 mt-1">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition font-medium"
            >
              <LogOut className="w-5 h-5" />
              Çıkış Yap
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 bg-white rounded-xl shadow-md p-4">
          {(["profile", "addresses", "orders"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition ${
                activeTab === tab ? "text-red-600 border-b-2 border-red-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "profile" && "Profil"}
              {tab === "addresses" && "Adreslerim"}
              {tab === "orders" && "Siparişlerim"}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profil Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                <p className="text-lg text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                <p className="text-lg text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                <p className="text-lg text-gray-900">{user.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === "addresses" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Adreslerim</h2>
              <button
                onClick={handleAddAddress}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Plus className="w-5 h-5" />
                Yeni Adres
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.addresses.map((address) => (
                <div key={address.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{address.name}</h3>
                    {address.isDefault && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-medium">Varsayılan</span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {address.street}
                    </p>
                    <p>
                      {address.city} {address.zipCode}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {address.phone}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAddress(address.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      Düzenle
                    </button>
                    <button
                      onClick={() => deleteAddress(address.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Siparişlerim</h2>
            <div className="space-y-4">
              {user.orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">₺{order.total}</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status === "completed" && "Tamamlandı"}
                          {order.status === "pending" && "Beklemede"}
                          {order.status === "cancelled" && "İptal Edildi"}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        Detay
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <ul className="space-y-1 text-sm text-gray-600">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <li key={idx}>
                          {item.quantity}x {item.productName} - ₺{item.price * item.quantity}
                        </li>
                      ))}
                      {order.items.length > 2 && (
                        <li className="text-gray-500 italic">+{order.items.length - 2} daha fazla ürün</li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Sipariş Detayı</h2>
                  <p className="text-gray-600 text-sm mt-1">{selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Sipariş Tarihi
                    </p>
                    <p className="font-semibold text-gray-900">{selectedOrder.date}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Durum</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
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
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Teslimat Adresi
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedOrder.address}</p>
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
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index} className="border-t border-gray-200">
                            <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                            <td className="px-4 py-3 text-sm text-center text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">₺{item.price}</td>
                            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                              ₺{item.quantity * item.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900">
                            Genel Toplam:
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-red-600 text-lg">
                            ₺{selectedOrder.total}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Address Modal */}
        {isAddressModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingAddressId ? "Adresi Düzenle" : "Yeni Adres Ekle"}
              </h3>
              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adres Adı</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ev, İş, vb."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sokak</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu</label>
                    <input
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <WhatsappButton />
    </div>
  )
}

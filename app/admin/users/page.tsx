"use client"

import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { usersAPI } from "@/lib/api"
import { Shield, ShieldOff, Trash2, Eye, Mail, Calendar, Loader2 } from "lucide-react"

interface User {
  id: number
  email: string
  name: string
  phone: string | null
  is_admin: boolean
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    loadUsers()
    loadStats()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await usersAPI.getAll()
      if (response.success) {
        setUsers(response.data)
      }
    } catch (error) {
      console.error("Kullanıcılar yüklenemedi:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await usersAPI.getStats()
      if (response.success) {
        setStats(response.data)
      }
    } catch (error) {
      console.error("İstatistikler yüklenemedi:", error)
    }
  }

  const handleToggleAdmin = async (userId: number, currentStatus: boolean) => {
    if (confirm(`Bu kullanıcının admin yetkisini ${currentStatus ? "kaldırmak" : "vermek"} istediğinizden emin misiniz?`)) {
      try {
        const response = await usersAPI.toggleAdmin(userId, !currentStatus)
        if (response.success) {
          loadUsers()
        }
      } catch (error: any) {
        alert(error.message || "Yetki güncellenirken hata oluştu")
      }
    }
  }

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (confirm(`${userName} kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!`)) {
      try {
        const response = await usersAPI.delete(userId)
        if (response.success) {
          loadUsers()
          loadStats()
        }
      } catch (error: any) {
        alert(error.message || "Kullanıcı silinirken hata oluştu")
      }
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
              <p className="text-gray-600 mt-2">Tüm kullanıcıları görüntüleyin ve yönetin</p>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Toplam Kullanıcı</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Admin Sayısı</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.adminCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <ShieldOff className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Normal Kullanıcı</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers - stats.adminCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Kullanıcılar yükleniyor...</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kullanıcı</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Telefon</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Yetki</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kayıt Tarihi</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">#{user.id}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {user.phone || <span className="text-gray-400">-</span>}
                          </td>
                          <td className="px-6 py-4">
                            {user.is_admin ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                <Shield className="w-3 h-3" />
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                <Eye className="w-3 h-3" />
                                Kullanıcı
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(user.created_at).toLocaleDateString('tr-TR')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                                className={`flex items-center gap-1 px-3 py-1 rounded-lg transition text-xs font-medium ${
                                  user.is_admin
                                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                }`}
                                title={user.is_admin ? "Admin yetkisini kaldır" : "Admin yap"}
                              >
                                {user.is_admin ? (
                                  <>
                                    <ShieldOff className="w-4 h-4" />
                                    Kaldır
                                  </>
                                ) : (
                                  <>
                                    <Shield className="w-4 h-4" />
                                    Admin Yap
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-xs font-medium"
                                title="Kullanıcıyı sil"
                              >
                                <Trash2 className="w-4 h-4" />
                                Sil
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && users.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">Henüz kullanıcı yok</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

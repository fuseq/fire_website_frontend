"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/lib/admin-context"
import { AlertCircle, LogIn } from "lucide-react"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { loginAdmin, isAdminLoggedIn } = useAdmin()

  useEffect(() => {
    if (isAdminLoggedIn) {
      router.push("/admin/dashboard")
    }
  }, [isAdminLoggedIn, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    try {
      const success = await loginAdmin(password)
      if (success) {
        router.push("/admin/dashboard")
      } else {
        setError("Şifre yanlış. Lütfen tekrar deneyin.")
        setPassword("")
      }
    } catch (error) {
      setError("Giriş yapılırken bir hata oluştu")
      setPassword("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
            <p className="text-gray-600 text-sm mt-2">Yönetim paneline erişim için şifre girin</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin şifresini girin"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">Demo şifre: admin123</p>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

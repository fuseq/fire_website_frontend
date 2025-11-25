"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser } from "@/lib/user-context"
import Link from "next/link"
import { Mail, Lock, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { loginUser } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/profile"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await loginUser(email, password)
      if (success) {
        router.push(redirect)
      } else {
        setError("E-posta veya şifre hatalı")
      }
    } catch (error) {
      setError("Giriş yapılırken bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔥</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Şirket İsmi </h1>
          <p className="text-gray-600 mt-2">Hesabınıza Giriş Yapın</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresi</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Şifre</label>
              <Link href="/forgot-password" className="text-sm text-red-600 hover:text-red-700 font-medium">
                Şifremi Unuttum?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
          >
            {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 font-medium mb-2">💡 Test Hesabı:</p>
          <p className="text-sm text-blue-600">Yeni hesap oluşturun veya admin panelden kullanıcı ekleyin</p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Hesabınız yok mu?{" "}
            <Link href="/register" className="text-red-600 font-semibold hover:underline">
              Kaydol
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link href="/" className="block text-center text-gray-600 hover:text-red-600 transition font-medium">
            Alışverişe Dön
          </Link>
        </div>
      </div>
    </div>
  )
}

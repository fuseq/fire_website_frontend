"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Lock, CheckCircle2, Loader2, AlertCircle } from "lucide-react"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Token'ı doğrula
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Geçersiz token")
        setValidating(false)
        return
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        const response = await fetch(`${apiUrl}/api/password-reset/validate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (data.success) {
          setTokenValid(true)
        } else {
          setError(data.message || "Geçersiz veya süresi dolmuş token")
        }
      } catch (error) {
        console.error("Token validation error:", error)
        setError("Token doğrulanamadı")
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (newPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Şifreler eşleşmiyor")
      return
    }

    setLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(`${apiUrl}/api/password-reset/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError(data.message || "Şifre sıfırlanamadı")
      }
    } catch (error) {
      console.error("Reset password error:", error)
      setError("Bağlantı hatası. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Token doğrulanıyor...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Geçersiz Token
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/forgot-password"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Yeni Talep Oluştur
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4">
        <div className="w-full max-w-md">
          {!success ? (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                  <Lock className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Yeni Şifre Belirle
                </h1>
                <p className="text-gray-600">
                  Hesabınız için yeni bir şifre oluşturun
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Yeni Şifre
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Şifre Tekrar
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Şifrenizi tekrar girin"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Şifreyi Sıfırla
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              {/* Success State */}
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-600 animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Şifre Başarıyla Değiştirildi!
              </h2>
              <p className="text-gray-600 mb-6">
                Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Yönlendiriliyor...</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}

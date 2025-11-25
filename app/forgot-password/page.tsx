"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(`${apiUrl}/api/password-reset/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.message || "Bir hata oluştu")
      }
    } catch (error) {
      console.error("Forgot password error:", error)
      setError("Bağlantı hatası. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
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
                  <Mail className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Şifremi Unuttum
                </h1>
                <p className="text-gray-600">
                  Email adresinizi girin, size şifre sıfırlama linki gönderelim
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Adresi
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
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
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Sıfırlama Linki Gönder
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Giriş Sayfasına Dön
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              {/* Success State */}
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Email Gönderildi!
              </h2>
              <p className="text-gray-600 mb-6">
                Eğer <strong>{email}</strong> adresi sistemimizde kayıtlıysa, 
                şifre sıfırlama linki gönderildi.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Not:</strong> Email gelmedi mi? Spam/Gereksiz klasörünüzü kontrol edin.
                  Link 1 saat boyunca geçerlidir.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Giriş Sayfasına Dön
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

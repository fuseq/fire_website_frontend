"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsappButton } from "@/components/whatsapp-button"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">İletişim Bilgileri</h1>
            <p className="text-xl text-red-100">
              Herhangi bir sorunuz için bize ulaşın. Size yardımcı olmaktan mutlu olacağız.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="inline-block mb-4 p-4 bg-gradient-to-br from-red-100 to-red-50 rounded-full">
                <Phone className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Telefon</h3>
              <p className="text-gray-600 mb-4">+90 (531) 667-95-31</p>
              <p className="text-gray-600 mb-4">+90 (505) 523-84-95</p>
           
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="inline-block mb-4 p-4 bg-gradient-to-br from-red-100 to-red-50 rounded-full">
                <Mail className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">E-mail</h3>
              <p className="text-gray-600 mb-4">ulkumyangin@gmail.com</p>
              <p className="text-sm text-gray-500">Hızlı cevap için e-mail gönderin</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="inline-block mb-4 p-4 bg-gradient-to-br from-red-100 to-red-50 rounded-full">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Adres</h3>
              <p className="text-gray-600 mb-4">Alaylar iki mah. 152349 sok. A blok no:2D Seydişehir/Konya</p>
          
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-gray-50 border-y border-gray-200 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Bize Mesaj Gönderin</h2>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-semibold text-gray-900 mb-2">Adınız</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Adınız"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-900 mb-2">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="E-mail adresiniz"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-semibold text-gray-900 mb-2">Telefon</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Telefon numaranız"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-900 mb-2">Konu</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Konu"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-semibold text-gray-900 mb-2">Mesajınız</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                />
              </div>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                  Mesajınız başarıyla gönderildi. En kısa zamanda sizinle iletişime geçeceğiz.
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Mesaj Gönder
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsappButton />
    </div>
  )
}

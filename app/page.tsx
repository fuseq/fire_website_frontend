"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsappButton } from "@/components/whatsapp-button"
import { useCart } from "@/lib/cart-context"
import { productsAPI } from "@/lib/api"
import { ChevronRight, Shield, Truck, Award, Loader2 } from "lucide-react"

interface Product {
  id: number
  name: string
  category: string
  price: number
  image: string
  images: string[]
  description: string
  specs: string[]
  inStock: boolean
}

export default function Home() {
  const { addToCart } = useCart()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Öne çıkan ürünleri yükle (ilk 3 ürün)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getAll()
        if (response.success) {
          const products = response.data.slice(0, 3).map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: parseFloat(p.price),
            image: p.image || "/placeholder.svg",
            images: p.images || [],
            description: p.description || "",
            specs: p.specs || [],
            inStock: p.in_stock,
          }))
          setFeaturedProducts(products)
        }
      } catch (error) {
        console.error("Ürünler yüklenemedi:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Yangın Güvenliği İçin Her Şey Burada
                </h1>
                <p className="text-xl text-red-100 mb-8">
                  Profesyonel yangın söndürme ve güvenlik ürünleriyle işletmenizi ve evinizi koruyun.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/products"
                    className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center justify-center gap-2"
                  >
                    Ürünleri İncele
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/contact"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition inline-flex items-center justify-center"
                  >
                    Bizimle İletişime Geçin
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <img src="/main_image_2.png" alt="Yangın Güvenliği" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="bg-gray-50 py-12 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">CE Sertifikalı Ürünler</h3>
                  <p className="text-sm text-gray-600">Uluslararası güvenlik standartlarına uygun</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Hızlı Teslimat</h3>
                  <p className="text-sm text-gray-600">Türkiye'nin her yerine 2-3 gün içinde</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">15+ Yıl Tecrübe</h3>
                  <p className="text-sm text-gray-600">Güvenlik endüstrisinde uzman hizmet</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Öne Çıkan Ürünler</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En popüler ve güvenilir yangın güvenliği ürünlerimizi keşfedin
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Ürünler yükleniyor...</p>
              </div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition group"
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="relative h-64 bg-gray-100 overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {product.category}
                        </div>
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link href={`/product/${product.id}`} className="block hover:text-red-600 transition">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-red-600">₺{product.price}</span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                        >
                          Sepete Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Tüm Ürünleri Görüntüle
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Henüz ürün eklenmemiş.</p>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 text-red-600 hover:underline"
              >
                Admin panelden ürün ekleyin
              </Link>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 text-white py-16 mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Kurumsal Müşteriler İçin Özel Çözümler</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Işletmenizin tüm yangın güvenliği ihtiyaçları için bize başvurun
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Teklif İsteyin
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsappButton />
    </div>
  )
}

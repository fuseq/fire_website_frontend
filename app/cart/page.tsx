"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsappButton } from "@/components/whatsapp-button"
import { useCart } from "@/lib/cart-context"
import { productsAPI } from "@/lib/api"
import { Trash2, ArrowLeft, ShoppingBag, Loader2 } from "lucide-react"

interface CartItem {
  productId: number
  quantity: number
}

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity } = useCart()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Ürünleri API'den yükle
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getAll()
        if (response.success) {
          const mappedProducts = response.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: parseFloat(p.price),
            image: p.image || "/placeholder.svg",
            description: p.description || "",
            specs: p.specs || [],
            inStock: p.in_stock,
          }))
          setProducts(mappedProducts)
        }
      } catch (error) {
        console.error("Ürünler yüklenemedi:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Convert flat array to grouped items with quantity
  const groupedCart = useMemo(() => {
    const items: Record<number, CartItem> = {}
    cart.forEach((productId) => {
      if (items[productId]) {
        items[productId].quantity++
      } else {
        items[productId] = { productId, quantity: 1 }
      }
    })
    return Object.values(items)
  }, [cart])

  const cartDetails = groupedCart.map((item) => {
    const product = products.find((p) => p.id === item.productId)
    return {
      ...item,
      product,
      subtotal: product ? product.price * item.quantity : 0,
    }
  })

  const subtotal = cartDetails.reduce((sum, item) => sum + item.subtotal, 0)
  const shipping = subtotal > 500 ? 0 : 50
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + tax

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gray-50 border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="w-8 h-8 text-red-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Alışveriş Sepeti</h1>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Sepet yükleniyor...</p>
              </div>
            </div>
          ) : cartDetails.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200 px-8">
              <div className="inline-block p-6 bg-red-50 rounded-full mb-6">
                <ShoppingBag className="w-16 h-16 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h2>
              <p className="text-gray-600 mb-8 text-lg">Başlamak için harika ürünlerimizi keşfedin</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                Ürünleri İncele
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartDetails.map((item) => (
                    <div key={item.productId} className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 p-6 flex gap-4 transition-all duration-300">
                      <img
                        src={item.product?.image || "/placeholder.svg"}
                        alt={item.product?.name}
                        className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                      />

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.productId}`}
                          className="font-semibold text-gray-900 hover:text-red-600 transition block mb-2"
                        >
                          {item.product?.name}
                        </Link>
                        <p className="text-gray-600 text-sm mb-4">{item.product?.category}</p>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-600 hover:text-red-700 transition ml-auto"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-600">₺{item.subtotal}</p>
                        <p className="text-sm text-gray-600">₺{item.product?.price} / adet</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 mt-8 text-red-600 hover:text-red-700 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Alışverişe Devam Et
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-20 space-y-4">
                  <h2 className="font-bold text-lg text-gray-900">Sipariş Özeti</h2>

                  <div className="space-y-3 border-b border-gray-200 pb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ara Toplam</span>
                      <span className="font-semibold">₺{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kargo</span>
                      <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                        {shipping === 0 ? "Ücretsiz" : `₺${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">KDV (%18)</span>
                      <span className="font-semibold">₺{tax}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Toplam</span>
                    <span className="text-red-600">₺{total}</span>
                  </div>

                  {shipping === 0 && (
                    <p className="text-sm text-green-600 bg-green-50 rounded p-2 text-center">
                      Kargo Bedava! (₺500+ sipariş)
                    </p>
                  )}

                  <button 
                    onClick={() => router.push("/checkout")}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg"
                  >
                    Ödemeye Geç
                  </button>

                  <button className="w-full border-2 border-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                    Devam Et
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsappButton />
    </div>
  )
}

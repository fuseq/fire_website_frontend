"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsappButton } from "@/components/whatsapp-button"
import { useCart } from "@/lib/cart-context"
import { productsAPI } from "@/lib/api"
import { ChevronLeft, ShoppingCart, Check, Star, MessageSquare, Loader2 } from "lucide-react"
import { useParams } from "next/navigation"

export default function ProductPage() {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({ userName: "", rating: 5, comment: "" })
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [productData, setProductData] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const productId = Number.parseInt(params.id as string)

  // Ürünü yükle
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const response = await productsAPI.getById(productId)
        if (response.success) {
          const product = {
            id: response.data.id,
            name: response.data.name,
            category: response.data.category,
            price: parseFloat(response.data.price),
            image: response.data.image || "/placeholder.svg",
            images: response.data.images || [],
            description: response.data.description || "",
            specs: response.data.specs || [],
            inStock: response.data.in_stock,
            reviews: response.data.reviews || [],
          }
          setProductData(product)

          // Benzer ürünleri yükle
          const allProductsResponse = await productsAPI.getAll({ category: product.category })
          if (allProductsResponse.success) {
            const related = allProductsResponse.data
              .filter((p: any) => p.id !== productId)
              .slice(0, 3)
              .map((p: any) => ({
                id: p.id,
                name: p.name,
                category: p.category,
                price: parseFloat(p.price),
                image: p.image || "/placeholder.svg",
              }))
            setRelatedProducts(related)
          }
        }
      } catch (error) {
        console.error("Ürün yüklenemedi:", error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const product = productData

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Ürün yükleniyor...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-20">
            <p className="text-gray-600 mb-4">Ürün bulunamadı</p>
            <Link href="/products" className="text-red-600 hover:underline">
              Ürünlere dön
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product.id)
    }
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (product && newReview.userName && newReview.comment) {
      const review = {
        id: (product.reviews?.length || 0) + 1,
        userName: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0]
      }
      const updatedProduct = {
        ...product,
        reviews: [...(product.reviews || []), review]
      }
      setProductData(updatedProduct)
      setNewReview({ userName: "", rating: 5, comment: "" })
      setShowReviewForm(false)
    }
  }

  const averageRating = product?.reviews && product.reviews.length > 0
    ? (product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : 0

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200">
          <Link href="/products" className="flex items-center gap-2 text-red-600 hover:text-red-700 transition">
            <ChevronLeft className="w-4 h-4" />
            Ürünlere Dön
          </Link>
        </div>

        {/* Product Detail */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Images Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg h-96 md:h-[500px] overflow-hidden border border-gray-200">
                <img
                  src={product.images?.[selectedImageIndex] || product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              </div>
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 justify-center overflow-x-auto">
                  {product.images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                        selectedImageIndex === index
                          ? "border-red-600"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="mb-6">
                <span className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  {product.category}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-gray-600 text-lg mb-6">{product.description}</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold text-red-600">₺{product.price}</span>
                  <p className="text-gray-600 mt-2">
                    {product.inStock ? (
                      <span className="text-green-600 font-semibold">Stokta Var</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Stokta Yok</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Specifications */}
              <div className="mb-8 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-md">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Özellikler</h3>
                <ul className="space-y-2">
                  {product.specs.map((spec: string, index: number) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700">
                      <Check className="w-5 h-5 text-red-600 flex-shrink-0" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-semibold text-gray-900">Miktar:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2 ${
                    product.inStock
                      ? addedToCart
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Sepete Eklendi!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Sepete Ekle
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6" />
                    Müşteri Yorumları
                  </h2>
                  {product.reviews && product.reviews.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Number(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600">
                        {averageRating} / 5 ({product.reviews.length} yorum)
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  Yorum Yaz
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="mb-8 bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border border-red-200 shadow-md">
                  <h3 className="font-bold text-lg mb-4">Yorumunuzu Paylaşın</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adınız
                      </label>
                      <input
                        type="text"
                        required
                        value={newReview.userName}
                        onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="Örn: Ahmet Y."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Değerlendirme
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 transition ${
                                star <= newReview.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300 hover:text-yellow-400"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yorumunuz
                      </label>
                      <textarea
                        required
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                      >
                        Gönder
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review: any) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{review.userName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Henüz yorum yapılmamış. İlk yorumu siz yapın!
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-gray-50 py-16 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Benzer Ürünler</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/product/${prod.id}`}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                  >
                    <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      <img
                        src={prod.image || "/placeholder.svg"}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{prod.name}</h3>
                      <span className="text-xl font-bold text-red-600">₺{prod.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <WhatsappButton />
    </div>
  )
}

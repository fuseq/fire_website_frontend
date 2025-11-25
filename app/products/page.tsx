"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsappButton } from "@/components/whatsapp-button"
import { useCart } from "@/lib/cart-context"
import { productsAPI } from "@/lib/api"
import { ChevronDown, Search, Filter, Grid, List, ShoppingCart, Star, TrendingUp, Loader2 } from "lucide-react"

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
  reviews: any[]
}

export default function ProductsPage() {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(["Tüm Ürünler"])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("Tüm Ürünler")
  const [sortBy, setSortBy] = useState("newest")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Kategorileri yükle
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productsAPI.getCategories()
        if (response.success) {
          setCategories(response.data)
        }
      } catch (error) {
        console.error("Kategoriler yüklenemedi:", error)
      }
    }
    fetchCategories()
  }, [])

  // Ürünleri yükle
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params: any = {}
        
        if (selectedCategory !== "Tüm Ürünler") {
          params.category = selectedCategory
        }
        
        if (searchQuery) {
          params.search = searchQuery
        }

        // Sıralama
        if (sortBy === "price-low") {
          params.sortBy = "price"
          params.order = "ASC"
        } else if (sortBy === "price-high") {
          params.sortBy = "price"
          params.order = "DESC"
        } else if (sortBy === "name") {
          params.sortBy = "name"
          params.order = "ASC"
        }

        const response = await productsAPI.getAll(params)
        
        if (response.success) {
          setProducts(
            response.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              category: p.category,
              price: parseFloat(p.price),
              image: p.image || "/placeholder.svg",
              images: p.images || [],
              description: p.description || "",
              specs: p.specs || [],
              inStock: p.in_stock,
              reviews: [],
            }))
          )
        }
      } catch (error) {
        console.error("Ürünler yüklenemedi:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, searchQuery, sortBy])

  const filteredProducts = products

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">Ürünlerimiz</h1>
                <p className="text-red-100 text-lg">
                  {filteredProducts.length} ürün bulundu
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <TrendingUp className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden lg:sticky lg:top-24">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
                  <div className="flex items-center gap-3">
                    <Filter className="w-6 h-6" />
                    <h2 className="font-bold text-lg">Kategoriler</h2>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {categories.map((cat) => {
                    const productCount = cat === "Tüm Ürünler" 
                      ? products.length 
                      : products.filter(p => p.category === cat).length
                    
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                          selectedCategory === cat
                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-105"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{cat}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            selectedCategory === cat
                              ? "bg-white/20 text-white"
                              : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                          }`}>
                            {productCount}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="lg:col-span-4">
              {/* Toolbar */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Ürün, kategori veya özellik ara..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* View Mode & Sort */}
                  <div className="flex gap-2">
                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition ${
                          viewMode === "grid"
                            ? "bg-white shadow-sm text-red-600"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        <Grid className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition ${
                          viewMode === "list"
                            ? "bg-white shadow-sm text-red-600"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Sort */}
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-gray-100 border-0 rounded-xl px-4 py-2 pr-10 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition cursor-pointer"
                      >
                        <option value="newest">En Yeni</option>
                        <option value="price-low">Fiyat ↓</option>
                        <option value="price-high">Fiyat ↑</option>
                        <option value="name">Ad (A-Z)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Ürünler yükleniyor...</p>
                  </div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className={viewMode === "grid" 
                  ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" 
                  : "space-y-4"
                }>
                  {filteredProducts.map((product) => (
                    viewMode === "grid" ? (
                      // Grid View
                      <div
                        key={product.id}
                        className="group bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2"
                      >
                        <Link href={`/product/${product.id}`}>
                          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Category Badge */}
                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-red-600 shadow-lg">
                              {product.category}
                            </div>
                            {/* Stock Badge */}
                            {product.inStock && (
                              <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                Stokta
                              </div>
                            )}
                          </div>
                        </Link>

                        <div className="p-5">
                          <Link href={`/product/${product.id}`}>
                            <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 hover:text-red-600 transition min-h-[3rem]">
                              {product.name}
                            </h3>
                          </Link>
                          
                          {/* Reviews */}
                          <div className="h-6 mb-2">
                            {product.reviews && product.reviews.length > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.round(product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">({product.reviews.length})</span>
                              </div>
                          )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-red-600">₺{product.price}</span>
                            </div>
                            <button
                              onClick={() => addToCart(product.id)}
                              className="bg-gradient-to-r from-red-600 to-red-700 text-white p-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg group"
                            >
                              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // List View
                      <div
                        key={product.id}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <Link href={`/product/${product.id}`} className="sm:w-64 flex-shrink-0">
                            <div className="relative aspect-square sm:h-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          </Link>
                          
                          <div className="flex-1 p-6 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between mb-3">
                                <Link href={`/product/${product.id}`}>
                                  <h3 className="font-bold text-xl text-gray-900 hover:text-red-600 transition">
                                    {product.name}
                                  </h3>
                                </Link>
                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                                  {product.category}
                                </span>
                              </div>
                              
                              <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                              
                              {/* Reviews */}
                              {product.reviews && product.reviews.length > 0 && (
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < Math.round(product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">({product.reviews.length} yorum)</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-red-600">₺{product.price}</span>
                                {product.inStock && (
                                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                                    Stokta
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => addToCart(product.id)}
                                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                              >
                                <ShoppingCart className="w-5 h-5" />
                                <span className="font-semibold">Sepete Ekle</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-16 text-center">
                  <div className="inline-block p-6 bg-red-50 rounded-full mb-6">
                    <Search className="w-16 h-16 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
                  <p className="text-gray-600 mb-6">Bu kategoride veya arama teriminize uygun ürün bulunamadı.</p>
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("Tüm Ürünler")
                    }}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsappButton />
    </div>
  )
}

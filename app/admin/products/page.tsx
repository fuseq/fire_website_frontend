"use client"

import type React from "react"

import { useAdmin, type Product } from "@/lib/admin-context"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, X, Upload } from "lucide-react"

export default function AdminProductsPage() {
  const { isAdminLoggedIn, products, addProduct, updateProduct, deleteProduct } = useAdmin()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    specs: "",
    inStock: true,
    image: "",
    images: [] as string[],
  })

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push("/admin/login")
    }
  }, [isAdminLoggedIn, router])

  if (!isAdminLoggedIn) return null

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id)
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        description: product.description,
        specs: product.specs.join(", "),
        inStock: product.inStock,
        image: product.image,
        images: product.images || [product.image],
      })
      setPreviews(product.images || [product.image])
    } else {
      setEditingId(null)
      setFormData({
        name: "",
        category: "",
        price: "",
        description: "",
        specs: "",
        inStock: true,
        image: "",
        images: [],
      })
      setPreviews([])
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setPreviews([])
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newImages: string[] = []
      const readFiles = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
      })

      Promise.all(readFiles).then((results) => {
        const updatedImages = [...formData.images, ...results]
        setPreviews(updatedImages)
        setFormData({ 
          ...formData, 
          images: updatedImages,
          image: updatedImages[0] || formData.image
        })
      })
    }
  }

  const handleRemoveImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index)
    setPreviews(updatedImages)
    setFormData({
      ...formData,
      images: updatedImages,
      image: updatedImages[0] || ""
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const specsArray = formData.specs
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s)

    try {
      if (editingId) {
        await updateProduct(editingId, {
          name: formData.name,
          category: formData.category,
          price: Number.parseInt(formData.price),
          description: formData.description,
          specs: specsArray,
          inStock: formData.inStock,
          image: formData.image,
          images: formData.images,
        })
      } else {
        await addProduct({
          name: formData.name,
          category: formData.category,
          price: Number.parseInt(formData.price),
          description: formData.description,
          specs: specsArray,
          inStock: formData.inStock,
          image: formData.image,
          images: formData.images,
          reviews: [],
        })
      }
      handleCloseModal()
    } catch (error) {
      console.error("Ürün işlemi hatası:", error)
      alert("Ürün işlemi sırasında bir hata oluştu")
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
              <p className="text-gray-600 mt-2">Tüm ürünleri yönetin, düzenleyin ve silin</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              <Plus className="w-5 h-5" />
              Yeni Ürün
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Görsel</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ürün Adı</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Fiyat</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stok</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">₺{product.price}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.inStock ? "Stokta" : "Tükendi"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                          Düzenle
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm("Ürünü silmek istediğinizden emin misiniz?")) {
                              try {
                                await deleteProduct(product.id)
                              } catch (error) {
                                alert("Ürün silinirken bir hata oluştu")
                              }
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                  <h2 className="text-2xl font-bold text-gray-900">{editingId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h2>
                  <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Görselleri</label>
                    {/* Image Previews */}
                    {previews.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {previews.map((preview, index) => (
                          <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 group">
                            <img
                              src={preview || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute inset-0 bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Upload Button */}
                    <label className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 hover:bg-red-50 transition">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">Görsel Yükle</p>
                        <p className="text-xs text-gray-500">Birden fazla görsel seçebilirsiniz</p>
                      </div>
                      <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat (₺)</label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Özellikler (virgülle ayrılmış)
                    </label>
                    <textarea
                      required
                      value={formData.specs}
                      onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                      rows={2}
                      placeholder="Örnek: 1kg kapasite, ABC tipi, Kolay kullanım"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="inStock"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                    />
                    <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
                      Stokta Mevcut
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                      {editingId ? "Güncelle" : "Ekle"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

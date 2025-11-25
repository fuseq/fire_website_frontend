"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"

interface ProductCardProps {
  id: number
  name: string
  price: number
  image: string
  category: string
  onAddToCart: () => void
}

export function ProductCard({ id, name, price, image, category, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
      <Link href={`/product/${id}`}>
        <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            {category}
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/product/${id}`} className="block hover:text-red-600 transition">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{name}</h3>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-red-600">₺{price}</span>
          </div>
          <button
            onClick={onAddToCart}
            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
            aria-label="Sepete Ekle"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

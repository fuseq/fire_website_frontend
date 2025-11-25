"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authAPI, productsAPI, ordersAPI, getToken } from "./api"

export interface Review {
  id: number
  userName: string
  rating: number
  comment: string
  date: string
}

export interface Product {
  id: number
  name: string
  category: string
  price: number
  image: string
  images: string[]
  description: string
  specs: string[]
  inStock: boolean
  reviews: Review[]
}

export interface OrderItem {
  productId: number
  productName: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customerName: string
  email: string
  phone: string
  address: string
  total: number
  items: number
  orderItems: OrderItem[]
  status: "pending" | "completed" | "cancelled"
  date: string
}

interface AdminContextType {
  products: Product[]
  orders: Order[]
  isAdminLoggedIn: boolean
  loginAdmin: (password: string) => Promise<boolean>
  logoutAdmin: () => void
  addProduct: (product: Omit<Product, "id">) => Promise<void>
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
  getStats: () => {
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    recentOrders: Order[]
  }
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  // Admin login durumunu kontrol et ve verileri yükle
  useEffect(() => {
    const checkAdmin = async () => {
      const token = getToken()
      if (token) {
        try {
          const profileResponse = await authAPI.getProfile()
          if (profileResponse.success && profileResponse.data.isAdmin) {
            setIsAdminLoggedIn(true)
            await loadAdminData()
          }
        } catch (error) {
          console.error("Admin kontrol hatası:", error)
        }
      }
      setLoading(false)
    }
    checkAdmin()
  }, [])

  // Admin verilerini yükle
  const loadAdminData = async () => {
    try {
      // Ürünleri yükle
      const productsResponse = await productsAPI.getAll()
      if (productsResponse.success) {
        setProducts(
          productsResponse.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: parseFloat(p.price),
            image: p.image || "/placeholder.svg",
            images: p.images || [],
            description: p.description || "",
            specs: p.specs || [],
            inStock: p.in_stock,
            reviews: [], // Reviews ayrı yüklenecek
          }))
        )
      }

      // Siparişleri yükle
      const ordersResponse = await ordersAPI.getAll()
      if (ordersResponse.success) {
        setOrders(
          ordersResponse.data.map((o: any) => ({
            id: o.order_number,
            customerName: o.user_name || "Misafir",
            email: o.user_email || "",
            phone: o.user_phone || "",
            address: "Adres bilgisi", // Detay endpoint'inden gelecek
            total: parseFloat(o.total_amount),
            items: o.items_count || 0,
            orderItems: [], // Detay endpoint'inden gelecek
            status: o.status,
            date: new Date(o.created_at).toISOString().split('T')[0],
          }))
        )
      }
    } catch (error) {
      console.error("Admin verileri yüklenemedi:", error)
    }
  }

  const loginAdmin = async (password: string) => {
    try {
      // Admin email kullan - bu şifre basit demo için
      const response = await authAPI.login({
        email: "admin@yanginguvenlik.com",
        password: password,
      })
      
      if (response.success && response.data.user.isAdmin) {
        setIsAdminLoggedIn(true)
        await loadAdminData()
        return true
      }
      return false
    } catch (error) {
      console.error("Admin login hatası:", error)
      return false
    }
  }

  const logoutAdmin = () => {
    authAPI.logout()
    setIsAdminLoggedIn(false)
    setProducts([])
    setOrders([])
  }

  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const response = await productsAPI.create({
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        images: product.images,
        description: product.description,
        specs: product.specs,
        inStock: product.inStock,
      })
      
      if (response.success) {
        const newProduct = {
          id: response.data.id,
          name: response.data.name,
          category: response.data.category,
          price: parseFloat(response.data.price),
          image: response.data.image || "/placeholder.svg",
          images: response.data.images || [],
          description: response.data.description || "",
          specs: response.data.specs || [],
          inStock: response.data.in_stock,
          reviews: [],
        }
        setProducts([...products, newProduct])
      }
    } catch (error) {
      console.error("Ürün ekleme hatası:", error)
      throw error
    }
  }

  const updateProduct = async (id: number, productData: Partial<Product>) => {
    try {
      const response = await productsAPI.update(id, {
        name: productData.name,
        category: productData.category,
        price: productData.price,
        image: productData.image,
        images: productData.images,
        description: productData.description,
        specs: productData.specs,
        inStock: productData.inStock,
      })
      
      if (response.success) {
        setProducts(
          products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...productData,
                  price: productData.price ? parseFloat(String(productData.price)) : p.price,
                }
              : p
          )
        )
      }
    } catch (error) {
      console.error("Ürün güncelleme hatası:", error)
      throw error
    }
  }

  const deleteProduct = async (id: number) => {
    try {
      const response = await productsAPI.delete(id)
      if (response.success) {
        setProducts(products.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error("Ürün silme hatası:", error)
      throw error
    }
  }

  const getStats = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      recentOrders: orders.slice(-3).reverse(),
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        getStats,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider")
  }
  return context
}

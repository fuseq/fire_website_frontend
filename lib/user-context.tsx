"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authAPI, addressesAPI, ordersAPI, getToken } from "./api"

export interface UserAddress {
  id: number
  name: string
  phone: string
  street: string
  city: string
  zipCode: string
  isDefault: boolean
}

export interface UserOrderItem {
  productId: number
  productName: string
  quantity: number
  price: number
}

export interface UserOrder {
  id: string
  date: string
  total: number
  status: "pending" | "completed" | "cancelled"
  address: string
  items: UserOrderItem[]
}

export interface User {
  id: number
  name: string
  email: string
  phone: string
  isAdmin: boolean
  addresses: UserAddress[]
  orders: UserOrder[]
}

interface UserContextType {
  user: User | null
  isLoggedIn: boolean
  loginUser: (email: string, password: string) => Promise<boolean>
  logoutUser: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  addAddress: (address: Omit<UserAddress, "id">) => Promise<void>
  updateAddress: (id: number, address: Partial<UserAddress>) => Promise<void>
  deleteAddress: (id: number) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const mockUsers: Record<string, User> = {
  "user@example.com": {
    id: 1,
    name: "Mehmet Yılmaz",
    email: "user@example.com",
    phone: "+90 532 123 4567",
    isAdmin: false,
    addresses: [
      {
        id: 1,
        name: "Ev",
        phone: "+90 532 123 4567",
        street: "Atatürk Caddesi No: 45",
        city: "İstanbul",
        zipCode: "34380",
        isDefault: true,
      },
      {
        id: 2,
        name: "İş",
        phone: "+90 532 987 6543",
        street: "Levent Plaza Kat 5",
        city: "İstanbul",
        zipCode: "34330",
        isDefault: false,
      },
    ],
    orders: [
      {
        id: "USR-ORD-001",
        date: "2024-11-15",
        total: 450,
        status: "completed",
        address: "Atatürk Caddesi No: 45, İstanbul 34380",
        items: [
          { productId: 1, productName: "Yangın Söndürücü 1kg ABC", quantity: 2, price: 150 },
          { productId: 3, productName: "Acil Çıkış Işığı LED", quantity: 1, price: 95 },
        ],
      },
      {
        id: "USR-ORD-002",
        date: "2024-11-10",
        total: 280,
        status: "completed",
        address: "Atatürk Caddesi No: 45, İstanbul 34380",
        items: [{ productId: 2, productName: "Duman Detektörü Akıllı", quantity: 1, price: 280 }],
      },
      {
        id: "USR-ORD-003",
        date: "2024-11-05",
        total: 640,
        status: "pending",
        address: "Levent Plaza Kat 5, İstanbul 34330",
        items: [
          { productId: 4, productName: "Yangın Hortumu 20m", quantity: 2, price: 320 },
        ],
      },
    ],
  },
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Sayfa yüklendiğinde token varsa profil bilgilerini al
  useEffect(() => {
    const loadUser = async () => {
      const token = getToken()
      if (token) {
        try {
          const response = await authAPI.getProfile()
          if (response.success) {
            // Adresleri yükle
            const addressesResponse = await addressesAPI.getAll()
            // Siparişleri yükle
            const ordersResponse = await ordersAPI.getMyOrders()
            
                      setUser({
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone || "",
            isAdmin: response.data.isAdmin || false,
            addresses: addressesResponse.data.map((addr: any) => ({
                id: addr.id,
                name: addr.name,
                phone: addr.phone,
                street: addr.street,
                city: addr.city,
                zipCode: addr.zip_code,
                isDefault: addr.is_default,
              })),
              orders: ordersResponse.data.map((order: any) => ({
                id: order.order_number,
                date: new Date(order.created_at).toISOString().split('T')[0],
                total: parseFloat(order.total_amount),
                status: order.status,
                address: `${order.street || ''}, ${order.city || ''} ${order.zip_code || ''}`,
                items: order.items ? order.items.map((item: any) => ({
                  productId: item.product_id,
                  productName: item.product_name || 'Ürün',
                  quantity: item.quantity,
                  price: parseFloat(item.unit_price),
                })) : [],
              })),
            })
          }
        } catch (error) {
          console.error("Kullanıcı profili yüklenemedi:", error)
          authAPI.logout()
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password })
      if (response.success) {
        // Adresleri yükle
        const addressesResponse = await addressesAPI.getAll()
        // Siparişleri yükle
        const ordersResponse = await ordersAPI.getMyOrders()
        
        setUser({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone || "",
          isAdmin: response.data.user.isAdmin || false,
          addresses: addressesResponse.data.map((addr: any) => ({
            id: addr.id,
            name: addr.name,
            phone: addr.phone,
            street: addr.street,
            city: addr.city,
            zipCode: addr.zip_code,
            isDefault: addr.is_default,
          })),
          orders: ordersResponse.data.map((order: any) => ({
            id: order.order_number,
            date: new Date(order.created_at).toISOString().split('T')[0],
            total: parseFloat(order.total_amount),
            status: order.status,
            address: `${order.street || ''}, ${order.city || ''} ${order.zip_code || ''}`,
            items: order.items ? order.items.map((item: any) => ({
              productId: item.product_id,
              productName: item.product_name || 'Ürün',
              quantity: item.quantity,
              price: parseFloat(item.unit_price),
            })) : [],
          })),
        })
        return true
      }
      return false
    } catch (error) {
      console.error("Login hatası:", error)
      return false
    }
  }

  const logoutUser = () => {
    authAPI.logout()
    setUser(null)
  }

  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      try {
        const response = await authAPI.updateProfile({
          name: data.name,
          phone: data.phone,
        })
        if (response.success) {
          setUser({ ...user, ...data })
        }
      } catch (error) {
        console.error("Profil güncelleme hatası:", error)
      }
    }
  }

  const addAddress = async (address: Omit<UserAddress, "id">) => {
    if (user) {
      try {
        const response = await addressesAPI.create({
          name: address.name,
          street: address.street,
          city: address.city,
          zipCode: address.zipCode,
          phone: address.phone,
          isDefault: address.isDefault,
        })
        if (response.success) {
          const newAddress = {
            id: response.data.id,
            name: response.data.name,
            phone: response.data.phone,
            street: response.data.street,
            city: response.data.city,
            zipCode: response.data.zip_code,
            isDefault: response.data.is_default,
          }
          setUser({
            ...user,
            addresses: [...user.addresses, newAddress],
          })
        }
      } catch (error) {
        console.error("Adres ekleme hatası:", error)
      }
    }
  }

  const updateAddress = async (id: number, addressData: Partial<UserAddress>) => {
    if (user) {
      try {
        const response = await addressesAPI.update(id, {
          name: addressData.name,
          street: addressData.street,
          city: addressData.city,
          zipCode: addressData.zipCode,
          phone: addressData.phone,
          isDefault: addressData.isDefault,
        })
        if (response.success) {
          const newAddresses = user.addresses.map((a) =>
            a.id === id ? { ...a, ...addressData } : a
          )
          setUser({ ...user, addresses: newAddresses })
        }
      } catch (error) {
        console.error("Adres güncelleme hatası:", error)
      }
    }
  }

  const deleteAddress = async (id: number) => {
    if (user) {
      try {
        const response = await addressesAPI.delete(id)
        if (response.success) {
          setUser({
            ...user,
            addresses: user.addresses.filter((a) => a.id !== id),
          })
        }
      } catch (error) {
        console.error("Adres silme hatası:", error)
      }
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn: user !== null,
        loginUser,
        logoutUser,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}

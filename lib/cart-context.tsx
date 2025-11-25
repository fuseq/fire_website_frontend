"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface CartContextType {
  cart: number[]
  addToCart: (productId: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<number[]>(() => {
    // localStorage'dan yükle (server-side render'da boş döner)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  // Cart değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart])

  const addToCart = (productId: number) => {
    setCart((prev) => [...prev, productId])
  }

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((id) => id !== productId))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    const currentCount = cart.filter((id) => id === productId).length
    const diff = newQuantity - currentCount

    if (diff > 0) {
      setCart((prev) => [...prev, ...Array(diff).fill(productId)])
    } else {
      let removed = 0
      setCart((prev) =>
        prev.filter((id) => {
          if (id === productId && removed < -diff) {
            removed++
            return false
          }
          return true
        })
      )
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartCount = () => {
    return cart.length
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}

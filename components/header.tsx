"use client"

import Link from "next/link"
import { useState } from "react"
import { ShoppingCart, Menu, X, Settings, User, LogOut, MapPin } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { useCart } from "@/lib/cart-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const { isLoggedIn, user, logoutUser } = useUser()
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  const handleUserLogout = () => {
    logoutUser()
    setIsUserDropdownOpen(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex items-center w-1/4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🔥</span>
              </div>
              <span className="text-xl font-bold text-gray-900 whitespace-nowrap">Şirket İsmi </span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center justify-center gap-8 flex-1">
            <Link href="/" className="text-gray-600 hover:text-red-600 transition font-medium whitespace-nowrap">
              Ana Sayfa
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-red-600 transition font-medium whitespace-nowrap">
              Ürünler
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-red-600 transition font-medium whitespace-nowrap">
              Hakkımızda
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-red-600 transition font-medium whitespace-nowrap">
              İletişim
            </Link>
          </nav>

          {/* Right Section - Right */}
          <div className="flex items-center justify-end gap-3 w-1/4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative flex">
              <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-red-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                  title={user.name}
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="hidden sm:inline text-sm font-medium text-gray-900">{user.name}</span>
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition text-gray-700"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profil Bilgileri
                    </Link>
                    <Link
                      href="/profile?tab=addresses"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition text-gray-700"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <MapPin className="w-4 h-4" />
                      Adreslerim
                    </Link>
                    <Link
                      href="/profile?tab=orders"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition text-gray-700"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Siparişlerim
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleUserLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition text-red-600 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center justify-center px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition font-medium"
              >
                Giriş Yap
              </Link>
            )}

            {/* Admin Panel Button - Sadece admin kullanıcılar görür */}
            {isLoggedIn && user?.isAdmin && (
              <Link
                href="/admin/dashboard"
                title="Admin Paneli"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition"
              >
                <Settings className="w-5 h-5 text-gray-600 hover:text-red-600" />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-200">
            <div className="flex flex-col gap-4 pt-4">
              <Link href="/" className="text-gray-600 hover:text-red-600 transition">
                Ana Sayfa
              </Link>
              <Link href="/products" className="text-gray-600 hover:text-red-600 transition">
                Ürünler
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-red-600 transition">
                Hakkımızda
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-red-600 transition">
                İletişim
              </Link>
              <Link href="/cart" className="text-gray-600 hover:text-red-600 transition flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Sepetim {cartCount > 0 && `(${cartCount})`}
              </Link>
              {isLoggedIn ? (
                <>
                  <Link href="/profile" className="text-gray-600 hover:text-red-600 transition flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profilim
                  </Link>
                  <button onClick={handleUserLogout} className="text-red-600 font-medium flex items-center gap-2">
                    <LogOut className="w-5 h-5" />
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-gray-600 hover:text-red-600 transition flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Giriş Yap
                </Link>
              )}
              {/* Admin Panel - Sadece admin kullanıcılar görür (Mobile) */}
              {isLoggedIn && user?.isAdmin && (
                <Link href="/admin/dashboard" className="text-gray-600 hover:text-red-600 transition flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Admin Paneli
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

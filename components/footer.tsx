import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🔥</span>
              </div>
              <span className="text-2xl font-bold">Şirket İsmi </span>
            </div>
            <p className="text-gray-400 text-sm">
              Yangın güvenliği için en güvenilir ve profesyonel çözümler sunuyoruz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Hızlı Linkler</h3>
            <div className="flex flex-col gap-2 text-gray-400">
              <Link href="/products" className="hover:text-red-400 transition">
                Ürünler
              </Link>
              <Link href="/about" className="hover:text-red-400 transition">
                Hakkımızda
              </Link>
              <Link href="/contact" className="hover:text-red-400 transition">
                İletişim
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold mb-4">İletişim</h3>
            <div className="flex flex-col gap-3 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+90 (212) 555-0100</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@sirketismi.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold mb-4">Sosyal Ağlar</h3>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; 2025 Şirket İsmi . Tüm hakları saklıdır.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-red-400 transition">
              Gizlilik Politikası
            </Link>
            <Link href="#" className="hover:text-red-400 transition">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
